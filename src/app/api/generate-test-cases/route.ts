import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing test case id" }, { status: 400 });
    }
    const { error } = await supabase.from('test_cases').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, requirementId } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });
    }
    const prompt = `
Given the following software requirement, generate a list of 3-5 clear, actionable test cases in Markdown format. 
Each test case should have a bolded title describing the scenario (DO NOT include numbers in the title), and a step-by-step description.
Only the steps should be numbered. 
Example:

- **Valid Complaint Code Generation**
  1. Enter valid complaint details into the tool.
  2. Click on the evaluate button.
  3. Verify that the tool generates a valid complaint code.

- **Invalid Complaint Code Generation**
  1. Enter invalid complaint details into the tool.
  2. Click on the evaluate button.
  3. Verify that the tool does not generate a complaint code.

Requirement Title: ${title}
Requirement Description: ${description}

Format:
- **[Test Case Title]**
  1. Step one
  2. Step two

Test Cases:
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 512,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: "Failed to call OpenAI API", details: errorText }, { status: 500 });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return NextResponse.json({ error: "No test cases generated" }, { status: 500 });
    }

    // Parse test cases
    const cases = text
      .split(/\n-\s+\*\*/)
      .filter(Boolean)
      .map((block: string) => {
        const match = block.match(/^(.*?)\*\*\n([\s\S]*)$/);
        if (!match) return null;
        let title = match[1].trim();
        // Remove any leading "Test Case", "Test Case X", etc.
        title = title.replace(/^Test Case\s*:?\s*/i, '').replace(/^\*\*Test Case \d+\*\*\s*/i, '').replace(/^\*\*/, '').trim();
        const steps = match[2].trim();
        return `**${title}**\n${steps}`;
      })
      .filter((tc: string): tc is string => !!tc);

    // Fetch existing test cases for this requirement
    const { data: existing, error: fetchError } = await supabase
      .from('test_cases')
      .select('content')
      .eq('requirement_id', requirementId);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const existingContents = new Set(
      ((existing || []) as { content: string }[]).map((tc: { content: string }) => tc.content.trim())
    );
    const uniqueCases = cases.filter((tc: string) => !existingContents.has(tc.trim()));

    if (uniqueCases.length === 0) {
      return NextResponse.json({ testCases: [], message: "No new unique test cases generated." });
    }

    // Persist only unique test cases to Supabase
    const inserts = uniqueCases.map((content: string) => ({
      requirement_id: requirementId,
      content,
      type: "generated",
    }));

    const { error: insertError } = await supabase.from('test_cases').insert(inserts);
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ testCases: uniqueCases });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Unknown error' }, { status: 500 });
  }
}