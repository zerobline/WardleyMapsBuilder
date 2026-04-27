"use client";

import { LayoutDashboard, Globe, Database, Plug, AlertTriangle, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProjectStore } from "@/store/project-store";
import { cn } from "@/lib/utils";

type SidebarSection = "pages" | "routes" | "db" | "plugins" | "checks";

interface ProjectSidebarProps {
  activeSection: SidebarSection;
  onSectionChange: (section: SidebarSection) => void;
}

export function ProjectSidebar({ activeSection, onSectionChange }: ProjectSidebarProps) {
  const project = useProjectStore((s) => s.project);
  const selectedPageId = useProjectStore((s) => s.selectedPageId);
  const setSelectedPage = useProjectStore((s) => s.setSelectedPage);

  if (!project) return null;

  const errorCount = project.checks.filter((c) => c.severity === "error").length;
  const warnCount = project.checks.filter((c) => c.severity === "warning").length;

  return (
    <aside className="w-60 border-r bg-white flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="font-semibold text-slate-900 truncate">{project.name}</div>
        <div className="text-xs text-slate-400 mt-0.5 truncate">{project.description || "No description"}</div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          <SidebarSection
            icon={<LayoutDashboard className="w-4 h-4" />}
            label="Pages"
            count={project.pages.length}
            active={activeSection === "pages"}
            onClick={() => onSectionChange("pages")}
          />

          {activeSection === "pages" && project.pages.length > 0 && (
            <div className="ml-4 space-y-0.5">
              {project.pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    onSectionChange("pages");
                    setSelectedPage(page.id);
                  }}
                  className={cn(
                    "w-full text-left text-xs px-2 py-1.5 rounded-md transition-colors truncate",
                    selectedPageId === page.id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                  )}
                >
                  {page.name}
                  <span className="ml-1 text-slate-400">{page.route}</span>
                </button>
              ))}
            </div>
          )}

          <Separator className="my-1" />

          <SidebarSection
            icon={<Globe className="w-4 h-4" />}
            label="API Routes"
            count={project.routes.length}
            active={activeSection === "routes"}
            onClick={() => onSectionChange("routes")}
          />

          {activeSection === "routes" && (
            <div className="ml-4 space-y-0.5">
              {project.routes.map((route, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2 py-1">
                  <span className={cn(
                    "text-[10px] font-mono font-bold",
                    route.method === "GET" && "text-green-600",
                    route.method === "POST" && "text-blue-600",
                    route.method === "PUT" && "text-yellow-600",
                    route.method === "DELETE" && "text-red-600",
                  )}>
                    {route.method}
                  </span>
                  <span className="text-xs text-slate-500 truncate">{route.path}</span>
                  {route.protected && (
                    <span className="text-[10px] text-slate-400 ml-auto">🔒</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <Separator className="my-1" />

          <SidebarSection
            icon={<Database className="w-4 h-4" />}
            label="Database"
            count={project.dbSchema.tables.length}
            active={activeSection === "db"}
            onClick={() => onSectionChange("db")}
          />

          {activeSection === "db" && (
            <div className="ml-4 space-y-0.5">
              {project.dbSchema.tables.map((table) => (
                <div key={table.name} className="px-2 py-1">
                  <div className="text-xs font-medium text-slate-600">{table.name}</div>
                  <div className="text-[10px] text-slate-400">{table.fields.length} fields</div>
                </div>
              ))}
            </div>
          )}

          <Separator className="my-1" />

          <SidebarSection
            icon={<Plug className="w-4 h-4" />}
            label="Plugins"
            count={project.plugins.length}
            active={activeSection === "plugins"}
            onClick={() => onSectionChange("plugins")}
          />

          {activeSection === "plugins" && (
            <div className="ml-4 space-y-0.5">
              {project.plugins.map((plugin) => (
                <div key={plugin.id} className="text-xs text-slate-600 px-2 py-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {plugin.name}
                </div>
              ))}
              {project.plugins.length === 0 && (
                <div className="text-xs text-slate-400 px-2 py-1">No plugins installed</div>
              )}
            </div>
          )}

          <Separator className="my-1" />

          <SidebarSection
            icon={<AlertTriangle className="w-4 h-4" />}
            label="Checks"
            active={activeSection === "checks"}
            onClick={() => onSectionChange("checks")}
            badge={
              errorCount > 0 ? (
                <Badge variant="error">{errorCount} error{errorCount > 1 ? "s" : ""}</Badge>
              ) : warnCount > 0 ? (
                <Badge variant="warning">{warnCount}</Badge>
              ) : project.checks.length > 0 ? (
                <Badge variant="info">{project.checks.length}</Badge>
              ) : null
            }
          />
        </div>
      </ScrollArea>
    </aside>
  );
}

function SidebarSection({
  icon,
  label,
  count,
  active,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  badge?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
        active ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-600 hover:bg-slate-50"
      )}
    >
      <span className={active ? "text-blue-600" : "text-slate-400"}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge ?? (count !== undefined && (
        <span className="text-xs text-slate-400">{count}</span>
      ))}
      <ChevronRight className={cn("w-3 h-3 text-slate-300 transition-transform", active && "rotate-90")} />
    </button>
  );
}
