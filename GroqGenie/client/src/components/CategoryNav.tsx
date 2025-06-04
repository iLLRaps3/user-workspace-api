import { Categories } from "@/lib/constants";

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryNav({ selectedCategory, onSelectCategory }: CategoryNavProps) {
  return (
    <div className="mb-6 overflow-x-auto">
      <h2 className="text-foreground font-bold mb-3 text-glow">Categories</h2>
      <div className="flex space-x-2 min-w-max pb-1">
        {Categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-1.5 rounded-md text-sm font-medium border ${
              selectedCategory === category.id
                ? "bg-primary/20 text-primary border-primary/50 text-glow"
                : "bg-muted text-foreground/70 border-primary/20 hover:bg-primary/10"
            }`}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
