"use client";

import { useState } from "react";
import { Send, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/project-store";
import { applyAIEdit } from "@/lib/mock-ai";

const SUGGESTIONS = [
  "Add leaderboard",
  "Add admin page",
  "Add notes",
  "Add dashboard",
  "Add login",
  "Add analytics",
  "Make it paid",
];

interface AICommandPanelProps {
  onEdit?: () => void;
}

export function AICommandPanel({ onEdit }: AICommandPanelProps) {
  const [command, setCommand] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const updateProject = useProjectStore((s) => s.updateProject);
  const project = useProjectStore((s) => s.project);

  const handleApply = async () => {
    if (!command.trim() || !project) return;
    setIsApplying(true);
    const cmd = command.trim();
    await new Promise((r) => setTimeout(r, 400));
    updateProject((p) => applyAIEdit(p, cmd));
    setHistory((h) => [cmd, ...h.slice(0, 4)]);
    setCommand("");
    setIsApplying(false);
    onEdit?.();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <Sparkles className="w-4 h-4 text-blue-500" />
        AI Edit
      </div>

      <div className="space-y-2">
        <textarea
          className="w-full min-h-[72px] resize-none border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="What do you want to change? e.g. &quot;Add leaderboard&quot;"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleApply();
          }}
        />
        <Button
          className="w-full h-8 text-xs"
          onClick={handleApply}
          disabled={!command.trim() || isApplying}
        >
          {isApplying ? (
            <>
              <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-1.5" />
              Applying...
            </>
          ) : (
            <>
              <Send className="w-3 h-3 mr-1.5" />
              Apply Edit
            </>
          )}
        </Button>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Lightbulb className="w-3 h-3" />
          Quick commands
        </div>
        <div className="flex flex-wrap gap-1">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setCommand(s)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-slate-400">Recent edits</div>
          {history.map((h, i) => (
            <div key={i} className="text-xs text-slate-500 bg-slate-50 rounded px-2 py-1 truncate">
              "{h}"
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
