import {
  projects,
  type Project,
  type WorkCategoryId,
} from "@/data/projects";

type WorkCategoryDefinition = {
  id: WorkCategoryId;
  index: string;
  title: string;
};

const workCategoryDefinitions = [
  { id: "uiux", index: "01", title: "UI/UX" },
  {
    id: "interaction-games",
    index: "02",
    title: "Interaction & Games",
  },
] as const satisfies readonly WorkCategoryDefinition[];

const projectsBySlug: Record<string, Project | undefined> = Object.fromEntries(
  projects.map((project) => [project.slug, project]),
);

const orderedProjects = [...projects].sort((a, b) => a.order - b.order);
const knownCategories = new Set<WorkCategoryId>(
  workCategoryDefinitions.map((category) => category.id),
);

function assertCatalogInvariants() {
  const slugs = new Set<string>();
  const orders = new Set<number>();

  for (const project of projects) {
    if (slugs.has(project.slug)) {
      throw new Error(`Duplicate Project slug: ${project.slug}`);
    }
    if (orders.has(project.order)) {
      throw new Error(`Duplicate Project order: ${project.order}`);
    }
    if (!knownCategories.has(project.category)) {
      throw new Error(
        `Unknown Work Category "${project.category}" for ${project.slug}`,
      );
    }
    slugs.add(project.slug);
    orders.add(project.order);
  }
}

assertCatalogInvariants();

const groups = workCategoryDefinitions.map((category) => ({
  ...category,
  projects: orderedProjects.filter(
    (project) => project.category === category.id,
  ),
}));

export const projectCatalog = {
  all: projects as readonly Project[],
  groups,

  get(slug: string) {
    return projectsBySlug[slug];
  },

  adjacent(slug: string) {
    const index = orderedProjects.findIndex((project) => project.slug === slug);
    if (index < 0) return { prev: null, next: null };

    return {
      prev: index > 0 ? orderedProjects[index - 1] : null,
      next:
        index < orderedProjects.length - 1
          ? orderedProjects[index + 1]
          : null,
    };
  },
} as const;
