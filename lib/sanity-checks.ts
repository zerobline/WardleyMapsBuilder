import { VibeProject, SanityCheckResult } from "./types";
import { hasPlugin, hasTable, hasPage } from "./project-utils";
import { PLUGIN_REGISTRY } from "./plugins";

export function checkProject(project: VibeProject): SanityCheckResult[] {
  const results: SanityCheckResult[] = [];

  if (hasPlugin(project, "payments") && !hasPlugin(project, "auth")) {
    results.push({
      id: "check-payments-requires-auth",
      severity: "error",
      title: "Payments requires Auth",
      description: "The Payments plugin requires the Auth plugin to be installed first.",
    });
  }

  for (const route of project.routes) {
    if (route.method !== "GET" && !route.protected) {
      results.push({
        id: `check-unprotected-mutating-route-${route.path}-${route.method}`,
        severity: "warning",
        title: "Mutating route is public",
        description: `${route.method} ${route.path} modifies data but is not protected by authentication.`,
        affectedPath: route.path,
      });
    }
  }

  for (const page of project.pages) {
    for (const component of page.components) {
      if (component.type === "table" && component.props.title) {
        const tableName = (component.props.title as string).toLowerCase().replace(/\s+/g, "_");
        const singular = tableName.endsWith("s") ? tableName.slice(0, -1) : tableName;
        const referencedTables = [tableName, singular, `${tableName}s`, `${singular}s`];
        const found = referencedTables.some((t) => hasTable(project, t));
        if (!found && project.dbSchema.tables.length > 0) {
          results.push({
            id: `check-missing-table-${page.route}-${tableName}`,
            severity: "error",
            title: "Missing DB table",
            description: `Page "${page.name}" references table "${component.props.title}" which may not exist in the schema.`,
            affectedPath: page.route,
          });
        }
      }
    }
  }

  if (hasPlugin(project, "auth") && !hasPage(project, "/login")) {
    results.push({
      id: "check-auth-missing-login",
      severity: "error",
      title: "Auth plugin incomplete",
      description: "Auth plugin is installed but no login page was found.",
      affectedPath: "/login",
    });
  }

  if (project.dbSchema.tables.length === 0) {
    results.push({
      id: "check-no-tables",
      severity: "info",
      title: "No persistent data model",
      description: "This app has no database tables. Consider adding tables to persist data.",
    });
  }

  if (project.routes.length > 5 && !hasPlugin(project, "analytics")) {
    results.push({
      id: "check-no-analytics",
      severity: "warning",
      title: "Consider adding Analytics",
      description: `This app has ${project.routes.length} routes but no analytics. Install the Analytics plugin to track usage.`,
    });
  }

  for (const plugin of project.plugins) {
    const registry = PLUGIN_REGISTRY.find((p) => p.id === plugin.id);
    if (registry?.checks) {
      results.push(...registry.checks(project));
    }
  }

  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
}
