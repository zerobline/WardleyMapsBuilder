"use client";

import { useState } from "react";
import { Download, FileJson, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/project-store";
import { exportProjectJSON } from "@/lib/export";

export function ExportButton() {
  const project = useProjectStore((s) => s.project);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    if (!project) return;
    exportProjectJSON(project);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  if (!project) return null;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-slate-700">Export</div>
      <Button
        variant="outline"
        className="w-full h-9 text-sm"
        onClick={handleExport}
      >
        {exported ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            Exported!
          </>
        ) : (
          <>
            <FileJson className="w-4 h-4 mr-2" />
            Export Project JSON
          </>
        )}
      </Button>
      <p className="text-xs text-slate-400 leading-relaxed">
        Downloads a full project JSON with pages, routes, schema, and plugins.
      </p>
    </div>
  );
}
