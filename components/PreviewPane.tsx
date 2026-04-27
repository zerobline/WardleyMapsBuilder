"use client";

import { Monitor, Layout } from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { VibePage, VibeComponent } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PreviewPane() {
  const project = useProjectStore((s) => s.project);
  const selectedPageId = useProjectStore((s) => s.selectedPageId);
  const setSelectedPage = useProjectStore((s) => s.setSelectedPage);

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-slate-400 text-center space-y-2">
          <Monitor className="w-12 h-12 mx-auto opacity-30" />
          <p>No project loaded</p>
        </div>
      </div>
    );
  }

  const selectedPage = project.pages.find((p) => p.id === selectedPageId) ?? project.pages[0];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-w-0">
      <div className="bg-white border-b px-4 flex items-center gap-1 overflow-x-auto">
        {project.pages.map((page) => (
          <button
            key={page.id}
            onClick={() => setSelectedPage(page.id)}
            className={cn(
              "px-3 py-3 text-sm whitespace-nowrap border-b-2 transition-colors",
              (selectedPage?.id === page.id)
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            {page.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {selectedPage ? (
          <PagePreview page={selectedPage} />
        ) : (
          <EmptyPreview />
        )}
      </div>
    </div>
  );
}

function PagePreview({ page }: { page: VibePage }) {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
        <Layout className="w-3.5 h-3.5" />
        <span>{page.route}</span>
        <span>•</span>
        <span>{page.components.length} component{page.components.length !== 1 ? "s" : ""}</span>
      </div>
      {page.components.map((component) => (
        <ComponentPreview key={component.id} component={component} />
      ))}
    </div>
  );
}

function ComponentPreview({ component }: { component: VibeComponent }) {
  switch (component.type) {
    case "nav":
      return <NavPreview props={component.props} />;
    case "hero":
      return <HeroPreview props={component.props} />;
    case "table":
      return <TablePreview props={component.props} />;
    case "form":
      return <FormPreview props={component.props} />;
    case "stats":
    case "dashboardCards":
      return <StatsPreview props={component.props} />;
    case "list":
      return <ListPreview props={component.props} />;
    case "button":
      return <ButtonPreview props={component.props} />;
    default:
      return (
        <div className="border border-dashed border-slate-200 rounded-lg p-4 text-sm text-slate-400 text-center">
          Unknown component: {component.type}
        </div>
      );
  }
}

function NavPreview({ props }: { props: Record<string, unknown> }) {
  const links = (props.links as string[]) ?? [];
  return (
    <div className="bg-white border rounded-lg px-4 py-3 flex items-center justify-between shadow-sm">
      <span className="font-semibold text-slate-800 text-sm">{String(props.brand ?? "App")}</span>
      <div className="flex gap-4">
        {links.map((link) => (
          <span key={link} className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer">{link}</span>
        ))}
      </div>
    </div>
  );
}

function HeroPreview({ props }: { props: Record<string, unknown> }) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-8 text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{String(props.title ?? "Page Title")}</h2>
      {props.subtitle != null && <p className="text-slate-500">{String(props.subtitle)}</p>}
    </div>
  );
}

function TablePreview({ props }: { props: Record<string, unknown> }) {
  const columns = (props.columns as string[]) ?? ["Column 1", "Column 2", "Column 3"];
  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b bg-slate-50">
        <span className="font-medium text-sm text-slate-700">{String(props.title ?? "Table")}</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50">
            {columns.map((col) => (
              <th key={col} className="text-left px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2].map((i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
              {columns.map((col) => (
                <td key={col} className="px-4 py-3 text-slate-400 text-xs">
                  <div className="h-3 bg-slate-100 rounded w-3/4 animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-2 border-t bg-slate-50 text-xs text-slate-400">Sample data preview</div>
    </div>
  );
}

function FormPreview({ props }: { props: Record<string, unknown> }) {
  const fields = (props.fields as string[]) ?? [];
  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <h3 className="font-medium text-slate-800 mb-4">{String(props.title ?? "Form")}</h3>
      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field}>
            <label className="block text-xs font-medium text-slate-600 mb-1">{field}</label>
            <div className="h-9 bg-slate-50 border border-slate-200 rounded-md" />
          </div>
        ))}
        <div className="pt-2">
          <div className="h-9 bg-blue-100 rounded-md w-28" />
        </div>
      </div>
    </div>
  );
}

function StatsPreview({ props }: { props: Record<string, unknown> }) {
  type StatCard = { label: string; value: string; title?: string; price?: string; features?: string[] };
  const cards = (props.cards as StatCard[]) ?? [];
  return (
    <div className={cn("grid gap-4", cards.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
      {cards.map((card, i) => (
        <div key={i} className="bg-white border rounded-lg p-4 shadow-sm">
          {card.label ? (
            <>
              <div className="text-xs text-slate-500 mb-1">{card.label}</div>
              <div className="text-2xl font-bold text-slate-800">{card.value}</div>
            </>
          ) : (
            <>
              <div className="font-semibold text-slate-800 mb-1">{card.title}</div>
              <div className="text-blue-600 font-bold mb-2">{card.price}</div>
              {card.features && (
                <ul className="text-xs text-slate-500 space-y-0.5">
                  {card.features.map((f) => <li key={f}>✓ {f}</li>)}
                </ul>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function ListPreview({ props }: { props: Record<string, unknown> }) {
  const items = (props.items as string[]) ?? [];
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <h3 className="font-medium text-slate-800 mb-3">{String(props.title ?? "List")}</h3>
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs flex items-center justify-center font-medium">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-slate-400">No items yet</div>
      )}
    </div>
  );
}

function ButtonPreview({ props }: { props: Record<string, unknown> }) {
  return (
    <div className="flex">
      <div
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium",
          props.variant === "primary" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
        )}
      >
        {String(props.label ?? "Button")}
      </div>
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-slate-400 text-center space-y-2">
        <Monitor className="w-12 h-12 mx-auto opacity-30" />
        <p>Select a page to preview</p>
      </div>
    </div>
  );
}
