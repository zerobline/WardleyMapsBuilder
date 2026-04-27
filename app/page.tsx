"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight, Sparkles } from "lucide-react";
import { generateProjectFromPrompt } from "@/lib/mock-ai";
import { useProjectStore } from "@/store/project-store";

const EXAMPLE_PROMPTS = [
  "Build a habit tracker for fitness coaches",
  "Build a booking app for tutors",
  "Build a lightweight CRM for freelancers",
];

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const setProject = useProjectStore((s) => s.setProject);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 600));
    const project = generateProjectFromPrompt(prompt);
    setProject(project);
    router.push("/builder");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">VibePress</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Build your app idea,
            <br />
            <span className="text-blue-600">not just the code</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-md mx-auto">
            Describe what you want to build. VibePress generates a structured app with pages, database, and API routes — ready to extend with plugins.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            What do you want to build?
          </label>
          <textarea
            className="w-full min-h-[100px] resize-none border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Describe your app idea..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
            }}
          />

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Try:</span>
            {EXAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-md transition-colors truncate max-w-[200px]"
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating app...
              </>
            ) : (
              <>
                Generate App
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-sm text-slate-500">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-800">5</div>
            <div>Plugins available</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-800">100%</div>
            <div>Structured output</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-slate-800">0</div>
            <div>Random code</div>
          </div>
        </div>
      </div>
    </div>
  );
}
