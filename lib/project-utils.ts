import { VibeProject, VibePage, BackendRoute, DBTable } from "./types";

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function hasPlugin(project: VibeProject, pluginId: string): boolean {
  return project.plugins.some((p) => p.id === pluginId);
}

export function hasTable(project: VibeProject, tableName: string): boolean {
  return project.dbSchema.tables.some((t) => t.name === tableName);
}

export function hasPage(project: VibeProject, pageRoute: string): boolean {
  return project.pages.some((p) => p.route === pageRoute);
}

export function hasRoute(project: VibeProject, routePath: string): boolean {
  return project.routes.some((r) => r.path === routePath);
}

export function addPage(project: VibeProject, page: VibePage): VibeProject {
  if (hasPage(project, page.route)) return project;
  return { ...project, pages: [...project.pages, page] };
}

export function addRoute(project: VibeProject, route: BackendRoute): VibeProject {
  if (hasRoute(project, route.path)) return project;
  return { ...project, routes: [...project.routes, route] };
}

export function addTable(project: VibeProject, table: DBTable): VibeProject {
  if (hasTable(project, table.name)) return project;
  return {
    ...project,
    dbSchema: { tables: [...project.dbSchema.tables, table] },
  };
}

export function createEmptyProject(): VibeProject {
  return {
    id: generateId(),
    name: "New Project",
    description: "",
    files: [],
    pages: [],
    plugins: [],
    dbSchema: { tables: [] },
    routes: [],
    checks: [],
  };
}
