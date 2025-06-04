import { Models } from "@/lib/constants";

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

export default function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  return (
    <div className="mb-6 overflow-x-auto">
      <h2 className="text-foreground font-bold mb-3 text-glow">Select Model</h2>
      <div className="flex space-x-3 min-w-max pb-2">
        {Models.map((model) => (
          <button
            key={model.id}
            className="flex flex-col items-center"
            onClick={() => onSelectModel(model.id)}
          >
            <div className={`w-12 h-12 ${
              selectedModel === model.id 
                ? "bg-primary/20 border-2 border-primary evil-border" 
                : "bg-muted border border-primary/20"
            } flex items-center justify-center mb-1`}>
              <i className={`${model.iconClass} ${
                selectedModel === model.id ? "text-accent text-glow-accent" : "text-foreground/70"
              }`}></i>
            </div>
            <span className={`text-xs font-medium ${
              selectedModel === model.id ? "text-primary text-glow" : "text-foreground/70"
            }`}>
              {model.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
