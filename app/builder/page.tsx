"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, ArrowLeft, RotateCcw } from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { ProjectSidebar } from "@/components/ProjectSidebar";
import { PreviewPane } from "@/components/PreviewPane";
import { AICommandPanel } from "@/components/AICommandPanel";
import { PluginCard } from "@/components/PluginCard";
import { ChecksPanel } from "@/components/ChecksPanel";
import { ExportButton } from "@/components/ExportButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PLUGIN_REGISTRY } from "@/lib/plugins";
import { Button } from "@/components/ui/button";

type SidebarSection = "pages" | "routes" | "db" | "plugins" | "checks";

export default function BuilderPage() {
  const router = useRouter();
  const project = useProjectStore((s) => s.project);
  const clearProject = useProjectStore((s) => s.clearProject);
  const [activeSection, setActiveSection] = useState<SidebarSection>("pages");
  const [rightTab, setRightTab] = useState<"ai" | "plugins" | "checks">("ai");

  useEffect(() => {
    if (!project) {
      router.replace("/");
    }
  }, [project, router]);

  if (!project) return null;

  const errorCount = project.checks.filter((c) => c.severity === "error").length;
  const warnCount = project.checks.filter((c) => c.severity === "warning").length;

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Topbar */}
      <header className="h-12 bg-white border-b flex items-center px-4 gap-3 flex-shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-slate-800 text-sm">VibePress</span>
        </div>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <div className="flex items-center gap-1 text-sm text-slate-500">
          <span className="font-medium text-slate-800">{project.name}</span>
          <span>·</span>
          <span>{project.pages.length} pages</span>
          <span>·</span>
          <span>{project.routes.length} routes</span>
          <span>·</span>
          <span>{project.dbSchema.tables.length} tables</span>
        </div>

        {(errorCount > 0 || warnCount > 0) && (
          <div className="flex items-center gap-1 ml-2">
            {errorCount > 0 && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                {errorCount} error{errorCount > 1 ? "s" : ""}
              </span>
            )}
            {warnCount > 0 && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                {warnCount} warning{warnCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-slate-500"
            onClick={() => {
              clearProject();
              router.push("/");
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            New project
          </Button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left sidebar */}
        <ProjectSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Center: preview */}
        <PreviewPane />

        {/* Right panel */}
        <aside className="w-72 border-l bg-white flex flex-col flex-shrink-0">
          {/* Right panel tabs */}
          <div className="flex border-b">
            {(["ai", "plugins", "checks"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                className={`flex-1 py-2.5 text-xs font-medium transition-colors relative ${
                  rightTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab === "ai" && "AI Edit"}
                {tab === "plugins" && (
                  <span className="flex items-center justify-center gap-1">
                    Plugins
                    {project.plugins.length > 0 && (
                      <span className="w-4 h-4 bg-blue-100 text-blue-700 rounded-full text-[10px] flex items-center justify-center">
                        {project.plugins.length}
                      </span>
                    )}
                  </span>
                )}
                {tab === "checks" && (
                  <span className="flex items-center justify-center gap-1">
                    Checks
                    {errorCount > 0 && (
                      <span className="w-4 h-4 bg-red-100 text-red-700 rounded-full text-[10px] flex items-center justify-center">
                        {errorCount}
                      </span>
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              {rightTab === "ai" && (
                <AICommandPanel />
              )}

              {rightTab === "plugins" && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-slate-700">Plugin Registry</div>
                  <p className="text-xs text-slate-400">
                    Extend your app with structured, reusable plugins.
                  </p>
                  <div className="space-y-2">
                    {PLUGIN_REGISTRY.map((plugin) => (
                      <PluginCard key={plugin.id} plugin={plugin} />
                    ))}
                  </div>
                </div>
              )}

              {rightTab === "checks" && (
                <ChecksPanel />
              )}
            </div>
          </ScrollArea>

          {/* Export at bottom */}
          <div className="border-t p-4">
            <ExportButton />
          </div>
        </aside>
      </div>
    </div>
  );
}
