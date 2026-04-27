export type VibeProject = {
  id: string;
  name: string;
  description: string;
  files: VibeFile[];
  pages: VibePage[];
  plugins: InstalledPlugin[];
  dbSchema: DBSchema;
  routes: BackendRoute[];
  checks: SanityCheckResult[];
};

export type VibeFile = {
  path: string;
  type: "frontend" | "backend" | "db" | "config";
  content: string;
};

export type VibePage = {
  id: string;
  name: string;
  route: string;
  components: VibeComponent[];
};

export type VibeComponent = {
  id: string;
  type: "hero" | "table" | "form" | "dashboardCards" | "list" | "nav" | "button" | "stats";
  props: Record<string, unknown>;
};

export type BackendRoute = {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  protected: boolean;
  description: string;
};

export type DBSchema = {
  tables: DBTable[];
};

export type DBTable = {
  name: string;
  fields: DBField[];
};

export type DBField = {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "relation";
  required: boolean;
};

export type InstalledPlugin = {
  id: string;
  name: string;
  config: Record<string, unknown>;
};

export type SanityCheckResult = {
  id: string;
  severity: "error" | "warning" | "info";
  title: string;
  description: string;
  affectedPath?: string;
};

export type VibePlugin = {
  id: string;
  name: string;
  description: string;
  icon: string;
  dependencies?: string[];
  install: (project: VibeProject) => VibeProject;
  uninstall?: (project: VibeProject) => VibeProject;
  checks?: (project: VibeProject) => SanityCheckResult[];
};
