import { VibeProject, VibePlugin, SanityCheckResult } from "./types";
import { generateId, addPage, addRoute, addTable, hasPlugin, hasPage } from "./project-utils";

const authPlugin: VibePlugin = {
  id: "auth",
  name: "Auth",
  description: "Adds user authentication with login, signup, and protected routes.",
  icon: "Shield",
  install(project: VibeProject): VibeProject {
    if (hasPlugin(project, "auth")) return project;

    project = addPage(project, {
      id: generateId(),
      name: "Login",
      route: "/login",
      components: [
        { id: generateId(), type: "hero", props: { title: "Sign In", subtitle: "Welcome back." } },
        { id: generateId(), type: "form", props: { title: "Login", fields: ["Email", "Password"] } },
        { id: generateId(), type: "button", props: { label: "Sign In", variant: "primary" } },
      ],
    });

    project = addPage(project, {
      id: generateId(),
      name: "Signup",
      route: "/signup",
      components: [
        { id: generateId(), type: "hero", props: { title: "Create Account", subtitle: "Get started for free." } },
        { id: generateId(), type: "form", props: { title: "Sign Up", fields: ["Name", "Email", "Password", "Confirm Password"] } },
        { id: generateId(), type: "button", props: { label: "Create Account", variant: "primary" } },
      ],
    });

    project = addTable(project, {
      name: "users",
      fields: [
        { name: "id", type: "string", required: true },
        { name: "email", type: "string", required: true },
        { name: "name", type: "string", required: true },
        { name: "passwordHash", type: "string", required: true },
        { name: "createdAt", type: "date", required: true },
      ],
    });

    project = addRoute(project, { path: "/api/auth/login", method: "POST", protected: false, description: "Authenticate user" });
    project = addRoute(project, { path: "/api/auth/signup", method: "POST", protected: false, description: "Register new user" });
    project = addRoute(project, { path: "/api/auth/logout", method: "POST", protected: true, description: "Logout user" });
    project = addRoute(project, { path: "/api/auth/me", method: "GET", protected: true, description: "Get current user" });

    const updatedRoutes = project.routes.map((r) =>
      r.method !== "GET" ? { ...r, protected: true } : r
    );

    return {
      ...project,
      routes: updatedRoutes,
      plugins: [...project.plugins, { id: "auth", name: "Auth", config: {} }],
    };
  },
  uninstall(project: VibeProject): VibeProject {
    return {
      ...project,
      pages: project.pages.filter((p) => p.route !== "/login" && p.route !== "/signup"),
      routes: project.routes.filter((r) => !r.path.startsWith("/api/auth")),
      plugins: project.plugins.filter((p) => p.id !== "auth"),
    };
  },
  checks(project: VibeProject): SanityCheckResult[] {
    const results: SanityCheckResult[] = [];
    if (!hasPage(project, "/login")) {
      results.push({
        id: "auth-missing-login",
        severity: "error",
        title: "Auth plugin incomplete",
        description: "Auth plugin is installed but no login page was found.",
        affectedPath: "/login",
      });
    }
    return results;
  },
};

const paymentsPlugin: VibePlugin = {
  id: "payments",
  name: "Payments",
  description: "Adds pricing page, checkout flow, and subscription management. Requires Auth.",
  icon: "CreditCard",
  dependencies: ["auth"],
  install(project: VibeProject): VibeProject {
    if (hasPlugin(project, "payments")) return project;

    project = addPage(project, {
      id: generateId(),
      name: "Pricing",
      route: "/pricing",
      components: [
        { id: generateId(), type: "hero", props: { title: "Simple Pricing", subtitle: "Start free, upgrade when you need." } },
        {
          id: generateId(),
          type: "dashboardCards",
          props: {
            cards: [
              { title: "Free", price: "$0/mo", features: ["5 projects", "Basic support"] },
              { title: "Pro", price: "$29/mo", features: ["Unlimited projects", "Priority support", "Analytics"] },
              { title: "Enterprise", price: "Custom", features: ["Custom limits", "Dedicated support", "SLA"] },
            ],
          },
        },
      ],
    });

    project = addTable(project, {
      name: "subscriptions",
      fields: [
        { name: "id", type: "string", required: true },
        { name: "userId", type: "relation", required: true },
        { name: "plan", type: "string", required: true },
        { name: "status", type: "string", required: true },
        { name: "currentPeriodEnd", type: "date", required: true },
      ],
    });

    project = addRoute(project, { path: "/api/payments/checkout", method: "POST", protected: true, description: "Create checkout session" });
    project = addRoute(project, { path: "/api/payments/webhook", method: "POST", protected: false, description: "Payment webhook" });
    project = addRoute(project, { path: "/api/subscriptions", method: "GET", protected: true, description: "Get current subscription" });

    return {
      ...project,
      plugins: [...project.plugins, { id: "payments", name: "Payments", config: {} }],
    };
  },
  uninstall(project: VibeProject): VibeProject {
    return {
      ...project,
      pages: project.pages.filter((p) => p.route !== "/pricing"),
      routes: project.routes.filter((r) => !r.path.startsWith("/api/payments") && !r.path.startsWith("/api/subscriptions")),
      plugins: project.plugins.filter((p) => p.id !== "payments"),
    };
  },
  checks(project: VibeProject): SanityCheckResult[] {
    const results: SanityCheckResult[] = [];
    if (!hasPlugin(project, "auth")) {
      results.push({
        id: "payments-requires-auth",
        severity: "error",
        title: "Payments requires Auth",
        description: "The Payments plugin requires the Auth plugin to be installed first.",
      });
    }
    return results;
  },
};

const analyticsPlugin: VibePlugin = {
  id: "analytics",
  name: "Analytics",
  description: "Adds event tracking, an analytics dashboard, and usage insights.",
  icon: "BarChart",
  install(project: VibeProject): VibeProject {
    if (hasPlugin(project, "analytics")) return project;

    project = addPage(project, {
      id: generateId(),
      name: "Analytics",
      route: "/analytics",
      components: [
        { id: generateId(), type: "nav", props: { brand: project.name, links: ["Dashboard", "Analytics"] } },
        { id: generateId(), type: "stats", props: { cards: [{ label: "Page Views", value: "—" }, { label: "Unique Visitors", value: "—" }, { label: "Events Tracked", value: "—" }] } },
        { id: generateId(), type: "table", props: { title: "Recent Events", columns: ["Event", "User", "Page", "Timestamp"] } },
      ],
    });

    project = addTable(project, {
      name: "events",
      fields: [
        { name: "id", type: "string", required: true },
        { name: "name", type: "string", required: true },
        { name: "userId", type: "string", required: false },
        { name: "page", type: "string", required: false },
        { name: "metadata", type: "string", required: false },
        { name: "createdAt", type: "date", required: true },
      ],
    });

    project = addRoute(project, { path: "/api/analytics/track", method: "POST", protected: false, description: "Track an event" });
    project = addRoute(project, { path: "/api/analytics/events", method: "GET", protected: true, description: "List tracked events" });
    project = addRoute(project, { path: "/api/analytics/summary", method: "GET", protected: true, description: "Get analytics summary" });

    return {
      ...project,
      plugins: [...project.plugins, { id: "analytics", name: "Analytics", config: {} }],
    };
  },
  uninstall(project: VibeProject): VibeProject {
    return {
      ...project,
      pages: project.pages.filter((p) => p.route !== "/analytics"),
      routes: project.routes.filter((r) => !r.path.startsWith("/api/analytics")),
      plugins: project.plugins.filter((p) => p.id !== "analytics"),
    };
  },
};

const notificationsPlugin: VibePlugin = {
  id: "notifications",
  name: "Notifications",
  description: "Adds notification preferences, email notification routes, and settings page.",
  icon: "Bell",
  install(project: VibeProject): VibeProject {
    if (hasPlugin(project, "notifications")) return project;

    project = addPage(project, {
      id: generateId(),
      name: "Notification Settings",
      route: "/settings/notifications",
      components: [
        { id: generateId(), type: "nav", props: { brand: project.name, links: ["Dashboard", "Settings"] } },
        { id: generateId(), type: "hero", props: { title: "Notification Settings", subtitle: "Choose how you want to be notified." } },
        { id: generateId(), type: "form", props: { title: "Email Preferences", fields: ["Weekly Digest", "Product Updates", "Security Alerts"] } },
      ],
    });

    project = addTable(project, {
      name: "notification_preferences",
      fields: [
        { name: "id", type: "string", required: true },
        { name: "userId", type: "relation", required: true },
        { name: "emailDigest", type: "boolean", required: true },
        { name: "productUpdates", type: "boolean", required: true },
        { name: "securityAlerts", type: "boolean", required: true },
      ],
    });

    project = addRoute(project, { path: "/api/notifications/preferences", method: "GET", protected: true, description: "Get notification preferences" });
    project = addRoute(project, { path: "/api/notifications/preferences", method: "PUT", protected: true, description: "Update notification preferences" });
    project = addRoute(project, { path: "/api/notifications/send", method: "POST", protected: true, description: "Send notification email" });

    return {
      ...project,
      plugins: [...project.plugins, { id: "notifications", name: "Notifications", config: {} }],
    };
  },
  uninstall(project: VibeProject): VibeProject {
    return {
      ...project,
      pages: project.pages.filter((p) => p.route !== "/settings/notifications"),
      routes: project.routes.filter((r) => !r.path.startsWith("/api/notifications")),
      plugins: project.plugins.filter((p) => p.id !== "notifications"),
    };
  },
};

const dbHelpersPlugin: VibePlugin = {
  id: "db-helpers",
  name: "Database Helpers",
  description: "Adds a table viewer page and auto-generates CRUD routes for all tables.",
  icon: "Database",
  install(project: VibeProject): VibeProject {
    if (hasPlugin(project, "db-helpers")) return project;

    project = addPage(project, {
      id: generateId(),
      name: "Table Viewer",
      route: "/admin/tables",
      components: [
        { id: generateId(), type: "nav", props: { brand: project.name, links: ["Dashboard", "Admin"] } },
        { id: generateId(), type: "hero", props: { title: "Database Tables", subtitle: "Browse and manage your data." } },
        {
          id: generateId(),
          type: "list",
          props: {
            title: "Tables",
            items: project.dbSchema.tables.map((t) => t.name),
          },
        },
      ],
    });

    const crudRoutes = project.dbSchema.tables.flatMap((table) => [
      { path: `/api/db/${table.name}`, method: "GET" as const, protected: false, description: `List all ${table.name}` },
      { path: `/api/db/${table.name}`, method: "POST" as const, protected: false, description: `Create ${table.name} record` },
      { path: `/api/db/${table.name}/:id`, method: "PUT" as const, protected: false, description: `Update ${table.name} record` },
      { path: `/api/db/${table.name}/:id`, method: "DELETE" as const, protected: false, description: `Delete ${table.name} record` },
    ]);

    for (const route of crudRoutes) {
      project = addRoute(project, route);
    }

    return {
      ...project,
      plugins: [...project.plugins, { id: "db-helpers", name: "Database Helpers", config: {} }],
    };
  },
  uninstall(project: VibeProject): VibeProject {
    return {
      ...project,
      pages: project.pages.filter((p) => p.route !== "/admin/tables"),
      routes: project.routes.filter((r) => !r.path.startsWith("/api/db")),
      plugins: project.plugins.filter((p) => p.id !== "db-helpers"),
    };
  },
};

export const PLUGIN_REGISTRY: VibePlugin[] = [
  authPlugin,
  paymentsPlugin,
  analyticsPlugin,
  notificationsPlugin,
  dbHelpersPlugin,
];
