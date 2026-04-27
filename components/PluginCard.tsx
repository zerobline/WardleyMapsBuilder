"use client";

import { Shield, CreditCard, BarChart2, Bell, Database, CheckCircle, Plus, Minus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VibePlugin } from "@/lib/types";
import { useProjectStore } from "@/store/project-store";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  BarChart: <BarChart2 className="w-4 h-4" />,
  Bell: <Bell className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
};

const COLOR_MAP: Record<string, string> = {
  auth: "bg-violet-50 text-violet-600 border-violet-100",
  payments: "bg-green-50 text-green-600 border-green-100",
  analytics: "bg-blue-50 text-blue-600 border-blue-100",
  notifications: "bg-orange-50 text-orange-600 border-orange-100",
  "db-helpers": "bg-slate-50 text-slate-600 border-slate-200",
};

interface PluginCardProps {
  plugin: VibePlugin;
}

export function PluginCard({ plugin }: PluginCardProps) {
  const project = useProjectStore((s) => s.project);
  const updateProject = useProjectStore((s) => s.updateProject);

  if (!project) return null;

  const isInstalled = project.plugins.some((p) => p.id === plugin.id);
  const depsMissing = plugin.dependencies?.filter(
    (dep) => !project.plugins.some((p) => p.id === dep)
  ) ?? [];

  const handleInstall = () => {
    if (isInstalled) {
      if (plugin.uninstall) {
        updateProject((p) => plugin.uninstall!(p));
      }
    } else {
      updateProject((p) => plugin.install(p));
    }
  };

  const colorClass = COLOR_MAP[plugin.id] ?? "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-all",
        isInstalled ? "border-green-200 bg-green-50/50" : "border-slate-200 bg-white hover:border-slate-300"
      )}
    >
      <div className="flex items-start gap-2">
        <div className={cn("w-8 h-8 rounded-md flex items-center justify-center border flex-shrink-0", colorClass)}>
          {ICON_MAP[plugin.icon] ?? <Database className="w-4 h-4" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-medium text-sm text-slate-800">{plugin.name}</span>
            {isInstalled && (
              <Badge variant="success" className="text-[10px] px-1.5 py-0">
                <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                Installed
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">{plugin.description}</p>

          {depsMissing.length > 0 && !isInstalled && (
            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-amber-600">
              <AlertCircle className="w-3 h-3" />
              Requires: {depsMissing.join(", ")}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex justify-end">
        <Button
          size="sm"
          variant={isInstalled ? "outline" : "default"}
          className="h-7 text-xs"
          onClick={handleInstall}
        >
          {isInstalled ? (
            <>
              <Minus className="w-3 h-3 mr-1" />
              Uninstall
            </>
          ) : (
            <>
              <Plus className="w-3 h-3 mr-1" />
              Install
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
