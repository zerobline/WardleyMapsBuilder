"use client";

import { AlertCircle, AlertTriangle, Info, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/project-store";
import { SanityCheckResult } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ChecksPanel() {
  const project = useProjectStore((s) => s.project);
  const runChecks = useProjectStore((s) => s.runChecks);

  if (!project) return null;

  const errors = project.checks.filter((c) => c.severity === "error");
  const warnings = project.checks.filter((c) => c.severity === "warning");
  const infos = project.checks.filter((c) => c.severity === "info");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-700">Sanity Checks</div>
        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={runChecks}>
          <RefreshCw className="w-3 h-3 mr-1" />
          Re-run
        </Button>
      </div>

      {project.checks.length === 0 ? (
        <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg p-3">
          <CheckCircle className="w-4 h-4" />
          All checks passed
        </div>
      ) : (
        <div className="space-y-1.5">
          {errors.map((check) => <CheckItem key={check.id} check={check} />)}
          {warnings.map((check) => <CheckItem key={check.id} check={check} />)}
          {infos.map((check) => <CheckItem key={check.id} check={check} />)}
        </div>
      )}

      {project.checks.length > 0 && (
        <div className="flex gap-2 text-xs text-slate-500 pt-1">
          {errors.length > 0 && <span className="text-red-600 font-medium">{errors.length} error{errors.length > 1 ? "s" : ""}</span>}
          {warnings.length > 0 && <span className="text-yellow-600 font-medium">{warnings.length} warning{warnings.length > 1 ? "s" : ""}</span>}
          {infos.length > 0 && <span className="text-blue-600">{infos.length} info</span>}
        </div>
      )}
    </div>
  );
}

function CheckItem({ check }: { check: SanityCheckResult }) {
  const config = {
    error: {
      icon: <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />,
      bg: "bg-red-50 border-red-100",
      text: "text-red-700",
      sub: "text-red-500",
    },
    warning: {
      icon: <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />,
      bg: "bg-yellow-50 border-yellow-100",
      text: "text-yellow-700",
      sub: "text-yellow-500",
    },
    info: {
      icon: <Info className="w-3.5 h-3.5 flex-shrink-0" />,
      bg: "bg-blue-50 border-blue-100",
      text: "text-blue-700",
      sub: "text-blue-500",
    },
  }[check.severity];

  return (
    <div className={cn("border rounded-lg p-2.5 space-y-0.5", config.bg)}>
      <div className={cn("flex items-start gap-1.5 text-xs font-medium", config.text)}>
        {config.icon}
        {check.title}
      </div>
      <p className={cn("text-xs pl-5 leading-relaxed", config.sub)}>{check.description}</p>
      {check.affectedPath && (
        <p className={cn("text-[10px] pl-5 font-mono", config.sub)}>{check.affectedPath}</p>
      )}
    </div>
  );
}
