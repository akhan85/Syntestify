import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] dark:from-[#18181b] dark:to-[#1e293b]">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center py-24 px-6 sm:px-0 text-center relative overflow-hidden">
        {/* Top-right buttons */}
        <div className="absolute right-8 top-8 flex gap-4 z-20">
          
          <a href="mailto:support@syntestify.com" className="px-5 py-2 rounded-full bg-[#2563eb] text-white font-semibold border border-[#2563eb] shadow hover:bg-[#1e40af] transition-colors focus:outline-none focus:ring-2 focus:ring-[#818cf8] focus:ring-offset-2">
            Contact
          </a>
        </div>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="w-full h-full bg-gradient-to-r from-[#7dd3fc]/30 via-[#818cf8]/20 to-[#f472b6]/10 blur-2xl opacity-60" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#2563eb] via-[#818cf8] to-[#f472b6] text-transparent bg-clip-text mb-4">Syntestify</h1>
          <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-200 max-w-2xl mb-6">AI-powered test case generation from requirements. Accelerate your software quality with one click.</p>
          <Link href="/auth/signup" className="inline-block mt-2 px-8 py-3 rounded-full bg-[#2563eb] text-white font-semibold text-lg shadow-lg hover:bg-[#1e40af] transition-colors focus:outline-none focus:ring-2 focus:ring-[#818cf8] focus:ring-offset-2">Get Started</Link>
        </div>
      </header>

      {/* Value Proposition */}
      <section className="flex flex-col items-center py-12 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">Transform requirements into robust test cases with AI</h2>
        <p className="max-w-xl text-center text-gray-600 dark:text-gray-300 text-lg">Syntestify helps teams and developers instantly generate high-quality, actionable test cases from plain English requirements. Save time, reduce errors, and boost your QA process.</p>
      </section>

      {/* Features */}
      <section className="flex flex-col items-center py-12 px-4 bg-white/60 dark:bg-[#23272f]/60">
        <h3 className="text-xl font-semibold mb-8 text-gray-800 dark:text-gray-100">Why Syntestify?</h3>
        <div className="flex flex-col sm:flex-row gap-8 w-full max-w-4xl justify-center">
          <div className="flex-1 flex flex-col items-center p-6 rounded-xl shadow bg-white dark:bg-[#18181b]">
            <div className="text-4xl mb-2">⚡️</div>
            <h4 className="font-bold mb-1">Instant Test Generation</h4>
            <p className="text-gray-500 dark:text-gray-300 text-center">Generate comprehensive test cases from requirements in seconds using advanced AI.</p>
          </div>
          <div className="flex-1 flex flex-col items-center p-6 rounded-xl shadow bg-white dark:bg-[#18181b]">
            <div className="text-4xl mb-2">📝</div>
            <h4 className="font-bold mb-1">Natural Language Input</h4>
            <p className="text-gray-500 dark:text-gray-300 text-center">Just describe your requirement. No templates, no strict formats—just plain English.</p>
          </div>
          <div className="flex-1 flex flex-col items-center p-6 rounded-xl shadow bg-white dark:bg-[#18181b]">
            <div className="text-4xl mb-2">🔒</div>
            <h4 className="font-bold mb-1">Secure & Private</h4>
            <p className="text-gray-500 dark:text-gray-300 text-center">Your data stays safe. We never share your requirements or test cases.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="flex flex-col items-center py-16 px-4">
        <h3 className="text-xl font-semibold mb-8 text-gray-800 dark:text-gray-100">How it works</h3>
        <div className="flex flex-col sm:flex-row gap-8 max-w-4xl w-full justify-center">
          <div className="flex-1 flex flex-col items-center">
            <div className="text-3xl mb-2">1️⃣</div>
            <h4 className="font-bold mb-1">Enter your requirement</h4>
            <p className="text-gray-500 dark:text-gray-300 text-center">Describe a feature, user story, or acceptance criteria.</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="text-3xl mb-2">2️⃣</div>
            <h4 className="font-bold mb-1">Click 'Generate'</h4>
            <p className="text-gray-500 dark:text-gray-300 text-center">Let our AI analyze your requirement and create relevant test cases.</p>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div className="text-3xl mb-2">3️⃣</div>
            <h4 className="font-bold mb-1">Review & use</h4>
            <p className="text-gray-500 dark:text-gray-300 text-center">Copy, export, or use your new test cases in your workflow.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center justify-center py-8 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-[#18181b]/80 mt-auto">
        <p className="text-gray-500 dark:text-gray-400 text-sm">© {new Date().getFullYear()} Syntestify. All rights reserved.</p>
      </footer>
    </div>
  );
}
