'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Modal Component
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#23272f] rounded-xl shadow-2xl p-6 relative min-w-[300px]">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

interface TestCase {
  id: string;
  content: string;
}

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const [project, setProject] = useState<{ title: string; description: string } | null>(null);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reqLoading, setReqLoading] = useState(true);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<{ id: string, title: string, description: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  // Add/Edit/Delete Requirement form states
  const [addTitle, setAddTitle] = useState('');
  const [addDescription, setAddDescription] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Test case state
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [testCases, setTestCases] = useState<{ [reqId: string]: TestCase[] }>({});

  // State for deleting a test case
  const [testCaseToDelete, setTestCaseToDelete] = useState<{ reqId: string; testCaseId: string } | null>(null);
  const [testCaseDeleteLoading, setTestCaseDeleteLoading] = useState(false);
  const [testCaseDeleteError, setTestCaseDeleteError] = useState<string | null>(null);

  const router = useRouter();

  // Fetch project info
  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      const { data } = await supabase
        .from("projects")
        .select("title, description")
        .eq("id", id)
        .single();
      setProject(data);
      setLoading(false);
    }
    fetchProject();
  }, [id]);

  // Fetch requirements and their test cases
  async function fetchRequirementsAndTestCases() {
    setReqLoading(true);
    const { data } = await supabase
      .from("requirements")
      .select("*")
      .eq("project_id", id)
      .order("created_at", { ascending: true });
    setRequirements(data || []);
    setReqLoading(false);

    // Fetch test cases for all requirements
    if (data) {
      const testCasesObj: { [reqId: string]: TestCase[] } = {};
      for (const req of data) {
        const { data: tcData } = await supabase
          .from('test_cases')
          .select('id, content')
          .eq('requirement_id', req.id)
          .order('created_at', { ascending: true });
        testCasesObj[req.id] = tcData || [];
      }
      setTestCases(testCasesObj);
    }
  }

  useEffect(() => {
    fetchRequirementsAndTestCases();
    // eslint-disable-next-line
  }, [id]);

  // Add Requirement
  async function handleAddRequirement(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    const { error } = await supabase.from("requirements").insert({
      project_id: id,
      title: addTitle,
      description: addDescription,
    });
    if (error) {
      setAddError(error.message);
    } else {
      setShowAddModal(false);
      setAddTitle('');
      setAddDescription('');
      fetchRequirementsAndTestCases();
    }
    setAddLoading(false);
  }

  // Edit Requirement
  async function handleEditRequirement(e: React.FormEvent) {
    e.preventDefault();
    if (!showEditModal) return;
    setEditLoading(true);
    setEditError(null);
    const { error } = await supabase.from("requirements")
      .update({ title: editTitle, description: editDescription })
      .eq("id", showEditModal.id);
    if (error) {
      setEditError(error.message);
    } else {
      setShowEditModal(null);
      fetchRequirementsAndTestCases();
    }
    setEditLoading(false);
  }

  // Delete Requirement
  async function handleDeleteRequirement() {
    if (!showDeleteModal) return;
    setDeleteLoading(true);
    setDeleteError(null);
    const { error } = await supabase.from("requirements")
      .delete()
      .eq("id", showDeleteModal);
    if (error) {
      setDeleteError(error.message);
    } else {
      setShowDeleteModal(null);
      fetchRequirementsAndTestCases();
    }
    setDeleteLoading(false);
  }

  // Generate Test Cases and persist to DB
  async function handleGenerateTestCases(req: { id: string; title: string; description: string }) {
    setGeneratingId(req.id);
    setGenerateError(null);
    try {
      const res = await fetch('/api/generate-test-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: req.title,
          description: req.description,
          requirementId: req.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // After successful generation, fetch test cases from DB
        await fetchRequirementsAndTestCases();
      } else {
        setGenerateError(data.error || "Failed to generate test cases.");
      }
    } catch (err) {
      setGenerateError("Network error.");
    }
    setGeneratingId(null);
  }

  // Delete a test case
  async function handleDeleteTestCase(reqId: string, testCaseId: string) {
    setTestCaseDeleteLoading(true);
    setTestCaseDeleteError(null);
    try {
      const res = await fetch('/api/generate-test-cases', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: testCaseId }),
      });
      if (res.ok) {
        await fetchRequirementsAndTestCases();
        setTestCaseToDelete(null);
      } else {
        const data = await res.json();
        setTestCaseDeleteError(data.error || "Failed to delete test case.");
      }
    } catch (err) {
      setTestCaseDeleteError("Network error.");
    }
    setTestCaseDeleteLoading(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading…</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">Project not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-2 py-8">
      {/* Project Info Block */}
      <div className="w-full max-w-xl bg-white dark:bg-[#23272f] rounded-2xl shadow-xl p-8 mb-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{project.title}</h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">{project.description}</p>
        <button
          className="px-6 py-2 rounded bg-[#2563eb] text-white font-semibold hover:bg-[#1e40af] transition-colors"
          onClick={() => router.back()}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Requirements Block */}
      <div className="w-full max-w-xl">
        {reqLoading ? (
          <div className="text-gray-500 dark:text-gray-400">Loading requirements…</div>
        ) : requirements.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400">No requirements found for this project.</div>
        ) : (
          <ul className="space-y-8">
            {requirements.map((req) => (
              <li
                key={req.id}
                className="bg-white dark:bg-[#1e293b] rounded-2xl border border-blue-200 dark:border-blue-800 shadow p-6"
              >
                <div className="flex items-start justify-between pb-3 border-b border-blue-100 dark:border-blue-900 mb-4">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-lg">{req.title}</div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm">{req.description}</div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      className="px-3 py-1 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                      onClick={() => handleGenerateTestCases(req)}
                      disabled={generatingId === req.id}
                    >
                      {generatingId === req.id ? "Generating…" : "Generate Test Cases"}
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 font-medium hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                      onClick={() => {
                        setShowEditModal({ id: req.id, title: req.title, description: req.description });
                        setEditTitle(req.title);
                        setEditDescription(req.description);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      onClick={() => setShowDeleteModal(req.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {/* Show all test cases from DB */}
                {testCases[req.id] && testCases[req.id].length > 0 && (
                  <div className="mt-4 space-y-4">
                    {testCases[req.id].map((tc) => {
                      // Extract title: everything up to the first period or 40 chars
                      let title = "Test Case";
                      let rest = tc.content;
                      const match = tc.content.match(/^\*\*(.+?)\*\*\n([\s\S]*)$/);
                      if (match) {
                        title = `Test Case: ${match[1].replace(/^Test Case:? ?\d*:? ?/i, '').trim()}`;
                        rest = match[2].trim();
}
                      return (
                        <div
                          key={tc.id}
                          className="relative flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-l-4 border-blue-500 dark:border-blue-400 rounded-xl shadow p-4"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-blue-900 dark:text-blue-200 mb-1">{title}</div>
                            <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{rest}</div>
                          </div>
                          <button
                            className="ml-4 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 h-fit self-start"
                            onClick={() => setTestCaseToDelete({ reqId: req.id, testCaseId: tc.id })}
                          >
                            Delete
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* Show error if any */}
                {generateError && generatingId === req.id && (
                  <div className="text-red-500 text-sm mt-1">{generateError}</div>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center justify-end mt-6">
          <button
            className="px-4 py-1 rounded bg-[#2563eb] text-white font-semibold hover:bg-[#1e40af] transition-colors"
            onClick={() => setShowAddModal(true)}
          >
            + Add Requirement
          </button>
        </div>
      </div>

      {/* Add Requirement Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAddRequirement} className="flex flex-col gap-3 w-80">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Add Requirement</h3>
            <input
              type="text"
              placeholder="Title"
              value={addTitle}
              onChange={e => setAddTitle(e.target.value)}
              required
              minLength={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
            <textarea
              placeholder="Description"
              value={addDescription}
              onChange={e => setAddDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
            <button
              type="submit"
              disabled={addLoading}
              className="w-full bg-[#2563eb] text-white font-semibold py-2 rounded-lg shadow hover:bg-[#1e40af] transition-colors disabled:opacity-60"
            >
              {addLoading ? 'Adding…' : 'Add Requirement'}
            </button>
            {addError && <p className="text-red-500 text-sm">{addError}</p>}
          </form>
        </Modal>
      )}

      {/* Edit Requirement Modal */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(null)}>
          <form onSubmit={handleEditRequirement} className="flex flex-col gap-3 w-80">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Edit Requirement</h3>
            <input
              type="text"
              placeholder="Title"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              required
              minLength={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
            <textarea
              placeholder="Description"
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
            <button
              type="submit"
              disabled={editLoading}
              className="w-full bg-[#2563eb] text-white font-semibold py-2 rounded-lg shadow hover:bg-[#1e40af] transition-colors disabled:opacity-60"
            >
              {editLoading ? 'Saving…' : 'Save Changes'}
            </button>
            {editError && <p className="text-red-500 text-sm">{editError}</p>}
          </form>
        </Modal>
      )}

      {/* Delete Requirement Modal */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(null)}>
          <div className="flex flex-col gap-4 w-80">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Delete Requirement</h3>
            <p className="text-gray-700 dark:text-gray-300">Are you sure you want to delete this requirement? This action cannot be undone.</p>
            {deleteError && <p className="text-red-500 text-sm">{deleteError}</p>}
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-red-700 transition-colors"
                onClick={handleDeleteRequirement}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
              <button
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setShowDeleteModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Test Case Modal */}
      {testCaseToDelete && (
        <Modal onClose={() => setTestCaseToDelete(null)}>
          <div className="flex flex-col gap-4 w-80">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Delete Test Case</h3>
            <p className="text-gray-700 dark:text-gray-300">Are you sure you want to delete this test case? This action cannot be undone.</p>
            {testCaseDeleteError && <p className="text-red-500 text-sm">{testCaseDeleteError}</p>}
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-red-700 transition-colors"
                onClick={() => handleDeleteTestCase(testCaseToDelete.reqId, testCaseToDelete.testCaseId)}
                disabled={testCaseDeleteLoading}
              >
                {testCaseDeleteLoading ? 'Deleting…' : 'Delete'}
              </button>
              <button
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setTestCaseToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}