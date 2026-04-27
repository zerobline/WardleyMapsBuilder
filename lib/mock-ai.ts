import { VibeProject, VibePage, BackendRoute, DBTable } from "./types";
import { generateId, addPage, addRoute, addTable, createEmptyProject } from "./project-utils";

function makeDashboardPage(): VibePage {
  return {
    id: generateId(),
    name: "Dashboard",
    route: "/dashboard",
    components: [
      {
        id: generateId(),
        type: "nav",
        props: { brand: "App", links: ["Dashboard", "Settings"] },
      },
      {
        id: generateId(),
        type: "stats",
        props: {
          cards: [
            { label: "Total Users", value: "—" },
            { label: "Active Sessions", value: "—" },
            { label: "Revenue", value: "—" },
          ],
        },
      },
    ],
  };
}

function makeHabitProject(prompt: string): VibeProject {
  let project = createEmptyProject();
  project.name = "Habit Tracker";
  project.description = prompt;

  project = addPage(project, {
    id: generateId(),
    name: "Dashboard",
    route: "/dashboard",
    components: [
      { id: generateId(), type: "nav", props: { brand: "HabitTrack", links: ["Dashboard", "Habits", "Check-ins"] } },
      { id: generateId(), type: "stats", props: { cards: [{ label: "Habits Active", value: "—" }, { label: "Streak", value: "—" }, { label: "Completed Today", value: "—" }] } },
    ],
  });

  project = addPage(project, {
    id: generateId(),
    name: "Habits",
    route: "/habits",
    components: [
      { id: generateId(), type: "nav", props: { brand: "HabitTrack", links: ["Dashboard", "Habits", "Check-ins"] } },
      { id: generateId(), type: "hero", props: { title: "Your Habits", subtitle: "Track your daily habits and build consistency." } },
      { id: generateId(), type: "table", props: { title: "Habits", columns: ["Name", "Frequency", "Status", "Streak"] } },
      { id: generateId(), type: "button", props: { label: "Add Habit", variant: "primary" } },
    ],
  });

  project = addPage(project, {
    id: generateId(),
    name: "Check-ins",
    route: "/checkins",
    components: [
      { id: generateId(), type: "nav", props: { brand: "HabitTrack", links: ["Dashboard", "Habits", "Check-ins"] } },
      { id: generateId(), type: "table", props: { title: "Check-ins", columns: ["Date", "Habit", "Notes", "Completed"] } },
    ],
  });

  const habitsTable: DBTable = {
    name: "habits",
    fields: [
      { name: "id", type: "string", required: true },
      { name: "name", type: "string", required: true },
      { name: "frequency", type: "string", required: true },
      { name: "status", type: "string", required: true },
      { name: "createdAt", type: "date", required: true },
    ],
  };

  const checkinsTable: DBTable = {
    name: "checkins",
    fields: [
      { name: "id", type: "string", required: true },
      { name: "habitId", type: "relation", required: true },
      { name: "date", type: "date", required: true },
      { name: "notes", type: "string", required: false },
      { name: "completed", type: "boolean", required: true },
    ],
  };

  project = addTable(project, habitsTable);
  project = addTable(project, checkinsTable);

  project = addRoute(project, { path: "/api/habits", method: "GET", protected: false, description: "List all habits" });
  project = addRoute(project, { path: "/api/habits", method: "POST", protected: false, description: "Create a new habit" });
  project = addRoute(project, { path: "/api/habits/:id", method: "PUT", protected: false, description: "Update a habit" });
  project = addRoute(project, { path: "/api/checkins", method: "GET", protected: false, description: "List check-ins" });
  project = addRoute(project, { path: "/api/checkins", method: "POST", protected: false, description: "Log a check-in" });

  return project;
}

function makeBookingProject(prompt: string): VibeProject {
  let project = createEmptyProject();
  project.name = "Booking App";
  project.description = prompt;

  project = addPage(project, {
    id: generateId(),
    name: "Bookings",
    route: "/bookings",
    components: [
      { id: generateId(), type: "nav", props: { brand: "BookIt", links: ["Bookings", "Availability", "Dashboard"] } },
      { id: generateId(), type: "hero", props: { title: "Book a Session", subtitle: "Pick a time that works for you." } },
      { id: generateId(), type: "form", props: { title: "Book Appointment", fields: ["Name", "Email", "Date", "Time", "Notes"] } },
    ],
  });

  project = addPage(project, {
    id: generateId(),
    name: "Availability",
    route: "/availability",
    components: [
      { id: generateId(), type: "nav", props: { brand: "BookIt", links: ["Bookings", "Availability", "Dashboard"] } },
      { id: generateId(), type: "table", props: { title: "Availability Slots", columns: ["Day", "Start Time", "End Time", "Status"] } },
    ],
  });

  project = addPage(project, {
    id: generateId(),
    name: "Dashboard",
    route: "/dashboard",
    components: [
      { id: generateId(), type: "nav", props: { brand: "BookIt", links: ["Bookings", "Availability", "Dashboard"] } },
      { id: generateId(), type: "stats", props: { cards: [{ label: "Bookings This Week", value: "—" }, { label: "Revenue", value: "—" }, { label: "Cancellations", value: "—" }] } },
      { id: generateId(), type: "table", props: { title: "Upcoming Appointments", columns: ["Client", "Date", "Time", "Status"] } },
    ],
  });

  project = addTable(project, {
    name: "appointments",
    fields: [
      { name: "id", type: "string", required: true },
      { name: "clientName", type: "string", required: true },
      { name: "clientEmail", type: "string", required: true },
      { name: "date", type: "date", required: true },
      { name: "status", type: "string", required: true },
    ],
  });

  project = addTable(project, {
    name: "availability",
    fields: [
      { name: "id", type: "string", required: true },
      { name: "day", type: "string", required: true },
      { name: "startTime", type: "string", required: true },
      { name: "endTime", type: "string", required: true },
    ],
  });

  project = addRoute(project, { path: "/api/bookings", method: "GET", protected: false, description: "List all bookings" });
  project = addRoute(project, { path: "/api/bookings", method: "POST", protected: false, description: "Create a booking" });
  project = addRoute(project, { path: "/api/bookings/:id", method: "PUT", protected: false, description: "Update a booking" });
  project = addRoute(project, { path: "/api/availability", method: "GET", protected: false, description: "Get available slots" });
  project = addRoute(project, { path: "/api/availability", method: "POST", protected: false, description: "Set availability" });

  return project;
}

function makeCRMProject(prompt: string): VibeProject {
  let project = createEmptyProject();
  project.name = "Freelancer CRM";
  project.description = prompt;

  project = addPage(project, {
    id: generateId(),
    name: "Contacts",
    route: "/contacts",
    components: [
      { id: generateId(), type: "nav", props: { brand: "FreelanceCRM", links: ["Contacts", "Deals", "Dashboard"] } },
      { id: generateId(), type: "hero", props: { title: "Contacts", subtitle: "Manage your client relationships." } },
      { id: generateId(), type: "table", props: { title: "Contacts", columns: ["Name", "Email", "Company", "Status", "Last Contact"] } },
      { id: generateId(), type: "button", props: { label: "Add Contact", variant: "primary" } },
    ],
  });

  project = addPage(project, {
    id: generateId(),
    name: "Deals",
    route: "/deals",
    components: [
      { id: generateId(), type: "nav", props: { brand: "FreelanceCRM", links: ["Contacts", "Deals", "Dashboard"] } },
      { id: generateId(), type: "hero", props: { title: "Deals Pipeline", subtitle: "Track your active deals and opportunities." } },
      { id: generateId(), type: "table", props: { title: "Deals", columns: ["Title", "Contact", "Value", "Stage", "Close Date"] } },
      { id: generateId(), type: "button", props: { label: "Add Deal", variant: "primary" } },
    ],
  });

  project = addPage(project, {
    id: generateId(),
    name: "Dashboard",
    route: "/dashboard",
    components: [
      { id: generateId(), type: "nav", props: { brand: "FreelanceCRM", links: ["Contacts", "Deals", "Dashboard"] } },
      { id: generateId(), type: "stats", props: { cards: [{ label: "Total Contacts", value: "—" }, { label: "Open Deals", value: "—" }, { label: "Pipeline Value", value: "—" }] } },
    ],
  });

  project = addTable(project, {
    name: "contacts",
    fields: [
      { name: "id", type: "string", required: true },
      { name: "name", type: "string", required: true },
      { name: "email", type: "string", required: true },
      { name: "company", type: "string", required: false },
      { name: "status", type: "string", required: true },
      { name: "lastContact", type: "date", required: false },
    ],
  });

  project = addTable(project, {
    name: "deals",
    fields: [
      { name: "id", type: "string", required: true },
      { name: "title", type: "string", required: true },
      { name: "contactId", type: "relation", required: true },
      { name: "value", type: "number", required: true },
      { name: "stage", type: "string", required: true },
      { name: "closeDate", type: "date", required: false },
    ],
  });

  project = addRoute(project, { path: "/api/contacts", method: "GET", protected: false, description: "List all contacts" });
  project = addRoute(project, { path: "/api/contacts", method: "POST", protected: false, description: "Create a contact" });
  project = addRoute(project, { path: "/api/contacts/:id", method: "PUT", protected: false, description: "Update a contact" });
  project = addRoute(project, { path: "/api/contacts/:id", method: "DELETE", protected: false, description: "Delete a contact" });
  project = addRoute(project, { path: "/api/deals", method: "GET", protected: false, description: "List all deals" });
  project = addRoute(project, { path: "/api/deals", method: "POST", protected: false, description: "Create a deal" });
  project = addRoute(project, { path: "/api/deals/:id", method: "PUT", protected: false, description: "Update a deal" });

  return project;
}

function makeGenericProject(prompt: string): VibeProject {
  let project = createEmptyProject();
  project.name = "SaaS Dashboard";
  project.description = prompt || "A modern SaaS application";

  project = addPage(project, makeDashboardPage());

  project = addPage(project, {
    id: generateId(),
    name: "Settings",
    route: "/settings",
    components: [
      { id: generateId(), type: "nav", props: { brand: "SaaSApp", links: ["Dashboard", "Settings"] } },
      { id: generateId(), type: "hero", props: { title: "Settings", subtitle: "Configure your workspace." } },
      { id: generateId(), type: "form", props: { title: "General Settings", fields: ["App Name", "Email", "Timezone"] } },
    ],
  });

  project = addTable(project, {
    name: "users",
    fields: [
      { name: "id", type: "string", required: true },
      { name: "email", type: "string", required: true },
      { name: "name", type: "string", required: true },
      { name: "createdAt", type: "date", required: true },
    ],
  });

  project = addTable(project, {
    name: "settings",
    fields: [
      { name: "id", type: "string", required: true },
      { name: "key", type: "string", required: true },
      { name: "value", type: "string", required: true },
    ],
  });

  project = addRoute(project, { path: "/api/users", method: "GET", protected: false, description: "List users" });
  project = addRoute(project, { path: "/api/settings", method: "GET", protected: false, description: "Get settings" });
  project = addRoute(project, { path: "/api/settings", method: "PUT", protected: false, description: "Update settings" });

  return project;
}

export function generateProjectFromPrompt(prompt: string): VibeProject {
  const lower = prompt.toLowerCase();
  let project: VibeProject;

  if (lower.includes("habit")) {
    project = makeHabitProject(prompt);
  } else if (lower.includes("booking") || lower.includes("tutor") || lower.includes("appointment")) {
    project = makeBookingProject(prompt);
  } else if (lower.includes("crm") || lower.includes("contact") || lower.includes("freelancer")) {
    project = makeCRMProject(prompt);
  } else {
    project = makeGenericProject(prompt);
  }

  return project;
}

export function applyAIEdit(project: VibeProject, command: string): VibeProject {
  const lower = command.toLowerCase();

  if (lower.includes("leaderboard")) {
    project = addPage(project, {
      id: generateId(),
      name: "Leaderboard",
      route: "/leaderboard",
      components: [
        { id: generateId(), type: "nav", props: { brand: project.name, links: ["Dashboard", "Leaderboard"] } },
        { id: generateId(), type: "hero", props: { title: "Leaderboard", subtitle: "Top performers this week." } },
        { id: generateId(), type: "list", props: { title: "Rankings", items: ["1st Place", "2nd Place", "3rd Place"] } },
      ],
    });
    project = addTable(project, { name: "leaderboard_entries", fields: [{ name: "id", type: "string", required: true }, { name: "userId", type: "relation", required: true }, { name: "score", type: "number", required: true }, { name: "rank", type: "number", required: true }] });
    project = addRoute(project, { path: "/api/leaderboard", method: "GET", protected: false, description: "Get leaderboard" });
  }

  if (lower.includes("dashboard")) {
    project = addPage(project, {
      id: generateId(),
      name: "Dashboard",
      route: "/dashboard",
      components: [
        { id: generateId(), type: "nav", props: { brand: project.name, links: ["Dashboard"] } },
        { id: generateId(), type: "stats", props: { cards: [{ label: "Total", value: "—" }, { label: "Active", value: "—" }, { label: "Revenue", value: "—" }] } },
      ],
    });
  }

  if (lower.includes("admin")) {
    project = addPage(project, {
      id: generateId(),
      name: "Admin",
      route: "/admin",
      components: [
        { id: generateId(), type: "nav", props: { brand: project.name, links: ["Admin"] } },
        { id: generateId(), type: "hero", props: { title: "Admin Panel", subtitle: "Manage your application." } },
        { id: generateId(), type: "table", props: { title: "All Users", columns: ["ID", "Name", "Email", "Role", "Joined"] } },
      ],
    });
    project = addRoute(project, { path: "/api/admin/users", method: "GET", protected: true, description: "Admin: list all users" });
  }

  if (lower.includes("notes")) {
    project = addPage(project, {
      id: generateId(),
      name: "Notes",
      route: "/notes",
      components: [
        { id: generateId(), type: "nav", props: { brand: project.name, links: ["Dashboard", "Notes"] } },
        { id: generateId(), type: "hero", props: { title: "Notes", subtitle: "Capture your thoughts." } },
        { id: generateId(), type: "list", props: { title: "Recent Notes", items: [] } },
        { id: generateId(), type: "form", props: { title: "New Note", fields: ["Title", "Content", "Tags"] } },
      ],
    });
    project = addTable(project, { name: "notes", fields: [{ name: "id", type: "string", required: true }, { name: "title", type: "string", required: true }, { name: "content", type: "string", required: true }, { name: "createdAt", type: "date", required: true }] });
    project = addRoute(project, { path: "/api/notes", method: "GET", protected: false, description: "List notes" });
    project = addRoute(project, { path: "/api/notes", method: "POST", protected: false, description: "Create note" });
  }

  if (lower.includes("paid") || lower.includes("payment") || lower.includes("pricing")) {
    const { PLUGIN_REGISTRY } = require("./plugins");
    const paymentsPlugin = PLUGIN_REGISTRY.find((p: { id: string }) => p.id === "payments");
    if (paymentsPlugin) {
      project = paymentsPlugin.install(project);
    }
  }

  if (lower.includes("login") || lower.includes("auth")) {
    const { PLUGIN_REGISTRY } = require("./plugins");
    const authPlugin = PLUGIN_REGISTRY.find((p: { id: string }) => p.id === "auth");
    if (authPlugin) {
      project = authPlugin.install(project);
    }
  }

  if (lower.includes("analytics")) {
    const { PLUGIN_REGISTRY } = require("./plugins");
    const analyticsPlugin = PLUGIN_REGISTRY.find((p: { id: string }) => p.id === "analytics");
    if (analyticsPlugin) {
      project = analyticsPlugin.install(project);
    }
  }

  return project;
}
