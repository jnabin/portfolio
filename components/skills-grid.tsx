import { site } from "@/content/site";

export function SkillsGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {site.skills.map((group) => (
        <div key={group.category} className="rounded-xl border border-border p-4">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-brand">{group.category}</h3>
          <ul className="flex flex-wrap gap-1.5">
            {group.items.map((item) => (
              <li key={item} className="rounded-full bg-bg-subtle px-2.5 py-1 text-xs font-medium text-fg">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
