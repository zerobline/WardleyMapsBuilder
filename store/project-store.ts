"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VibeProject } from "@/lib/types";
import { checkProject } from "@/lib/sanity-checks";

interface ProjectStore {
  project: VibeProject | null;
  selectedPageId: string | null;
  setProject: (project: VibeProject) => void;
  updateProject: (updater: (project: VibeProject) => VibeProject) => void;
  setSelectedPage: (pageId: string) => void;
  runChecks: () => void;
  clearProject: () => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      project: null,
      selectedPageId: null,

      setProject: (project) => {
        const withChecks = { ...project, checks: checkProject(project) };
        set({ project: withChecks, selectedPageId: project.pages[0]?.id ?? null });
      },

      updateProject: (updater) => {
        const { project } = get();
        if (!project) return;
        const updated = updater(project);
        const withChecks = { ...updated, checks: checkProject(updated) };
        set({ project: withChecks });
      },

      setSelectedPage: (pageId) => set({ selectedPageId: pageId }),

      runChecks: () => {
        const { project } = get();
        if (!project) return;
        set({ project: { ...project, checks: checkProject(project) } });
      },

      clearProject: () => set({ project: null, selectedPageId: null }),
    }),
    {
      name: "vibepress-project",
      partialize: (state) => ({ project: state.project, selectedPageId: state.selectedPageId }),
    }
  )
);
