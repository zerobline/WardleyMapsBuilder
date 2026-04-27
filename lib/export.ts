import { VibeProject } from "./types";

export function exportProjectJSON(project: VibeProject): void {
  const exportData = {
    manifest: {
      id: project.id,
      name: project.name,
      description: project.description,
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
    },
    pages: project.pages,
    plugins: project.plugins,
    routes: project.routes,
    dbSchema: project.dbSchema,
    files: project.files,
    checks: project.checks,
  };

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${project.name.toLowerCase().replace(/\s+/g, "-")}-vibepress.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateProjectSummary(project: VibeProject): string {
  return `
# ${project.name}

${project.description}

## Pages (${project.pages.length})
${project.pages.map((p) => `- ${p.name} (${p.route})`).join("\n")}

## API Routes (${project.routes.length})
${project.routes.map((r) => `- ${r.method} ${r.path}${r.protected ? " [protected]" : ""} — ${r.description}`).join("\n")}

## Database (${project.dbSchema.tables.length} tables)
${project.dbSchema.tables.map((t) => `- ${t.name} (${t.fields.length} fields)`).join("\n")}

## Plugins (${project.plugins.length})
${project.plugins.map((p) => `- ${p.name}`).join("\n")}
`.trim();
}
