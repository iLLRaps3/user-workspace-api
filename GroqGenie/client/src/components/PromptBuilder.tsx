
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Trash2, Plus, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptModifier {
  category: string;
  options: string[];
  color: string;
}

const PROMPT_MODIFIERS: PromptModifier[] = [
  {
    category: "Camera Angles",
    options: ["close-up", "wide shot", "medium shot", "bird's eye view", "worm's eye view", "over the shoulder", "POV", "aerial view", "tracking shot", "dolly zoom"],
    color: "bg-blue-100 text-blue-800"
  },
  {
    category: "Lighting",
    options: ["golden hour", "blue hour", "harsh sunlight", "soft lighting", "dramatic lighting", "backlighting", "rim lighting", "neon lighting", "candlelight", "moonlight", "studio lighting"],
    color: "bg-yellow-100 text-yellow-800"
  },
  {
    category: "Environments",
    options: ["urban city", "forest", "beach", "mountain", "desert", "space", "underwater", "laboratory", "library", "cafe", "rooftop", "abandoned building", "futuristic city"],
    color: "bg-green-100 text-green-800"
  },
  {
    category: "Weather/Atmosphere",
    options: ["foggy", "rainy", "snowy", "stormy", "windy", "sunny", "cloudy", "misty", "hazy", "clear sky", "overcast", "dramatic clouds"],
    color: "bg-purple-100 text-purple-800"
  },
  {
    category: "Emotions/Moods",
    options: ["happy", "sad", "angry", "surprised", "contemplative", "excited", "calm", "anxious", "confident", "mysterious", "playful", "serious"],
    color: "bg-pink-100 text-pink-800"
  },
  {
    category: "Actions",
    options: ["walking", "running", "dancing", "sitting", "standing", "jumping", "flying", "swimming", "climbing", "falling", "spinning", "gesturing"],
    color: "bg-orange-100 text-orange-800"
  },
  {
    category: "Art Styles",
    options: ["cinematic", "anime", "realistic", "cartoon", "oil painting", "watercolor", "sketch", "digital art", "vintage", "retro", "noir", "surreal"],
    color: "bg-indigo-100 text-indigo-800"
  },
  {
    category: "Time Periods",
    options: ["modern day", "1920s", "1950s", "1980s", "medieval", "renaissance", "victorian", "futuristic", "steampunk", "cyberpunk", "ancient times"],
    color: "bg-teal-100 text-teal-800"
  },
  {
    category: "Camera Movement",
    options: ["static", "panning left", "panning right", "tilting up", "tilting down", "zooming in", "zooming out", "rotating", "handheld", "smooth tracking"],
    color: "bg-red-100 text-red-800"
  },
  {
    category: "Quality Enhancers",
    options: ["4K", "8K", "ultra HD", "high detail", "sharp focus", "professional quality", "award winning", "masterpiece", "highly detailed", "photorealistic"],
    color: "bg-gray-100 text-gray-800"
  }
];

export default function PromptBuilder() {
  const [basePrompt, setBasePrompt] = useState("");
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [customModifier, setCustomModifier] = useState("");
  const { toast } = useToast();

  const addModifier = (modifier: string) => {
    if (!selectedModifiers.includes(modifier)) {
      setSelectedModifiers([...selectedModifiers, modifier]);
    }
  };

  const removeModifier = (modifier: string) => {
    setSelectedModifiers(selectedModifiers.filter(m => m !== modifier));
  };

  const addCustomModifier = () => {
    if (customModifier.trim() && !selectedModifiers.includes(customModifier.trim())) {
      setSelectedModifiers([...selectedModifiers, customModifier.trim()]);
      setCustomModifier("");
    }
  };

  const generateFinalPrompt = () => {
    const modifierText = selectedModifiers.length > 0 ? `, ${selectedModifiers.join(", ")}` : "";
    return `${basePrompt}${modifierText}`;
  };

  const copyPrompt = async () => {
    const finalPrompt = generateFinalPrompt();
    try {
      await navigator.clipboard.writeText(finalPrompt);
      toast({
        title: "Copied to clipboard",
        description: "Your prompt has been copied successfully",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setBasePrompt("");
    setSelectedModifiers([]);
    setCustomModifier("");
  };

  const getModifierColor = (modifier: string) => {
    for (const category of PROMPT_MODIFIERS) {
      if (category.options.includes(modifier)) {
        return category.color;
      }
    }
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5" />
            <span>AI Video Prompt Builder</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Prompt */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Base Prompt</label>
            <Textarea
              placeholder="Describe the main subject and action (e.g., 'A person walking through a busy street')"
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Selected Modifiers */}
          {selectedModifiers.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Selected Modifiers</label>
              <div className="flex flex-wrap gap-2">
                {selectedModifiers.map((modifier) => (
                  <Badge
                    key={modifier}
                    className={`${getModifierColor(modifier)} cursor-pointer hover:opacity-80`}
                    onClick={() => removeModifier(modifier)}
                  >
                    {modifier}
                    <Trash2 className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Custom Modifier Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Add Custom Modifier</label>
            <div className="flex space-x-2">
              <Input
                placeholder="Type custom modifier..."
                value={customModifier}
                onChange={(e) => setCustomModifier(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomModifier()}
              />
              <Button onClick={addCustomModifier} disabled={!customModifier.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Modifier Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Modifier Categories</h3>
            {PROMPT_MODIFIERS.map((category) => (
              <div key={category.category} className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">{category.category}</h4>
                <div className="flex flex-wrap gap-2">
                  {category.options.map((option) => (
                    <Badge
                      key={option}
                      className={`${category.color} cursor-pointer hover:opacity-80 transition-opacity ${
                        selectedModifiers.includes(option) ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => 
                        selectedModifiers.includes(option) 
                          ? removeModifier(option) 
                          : addModifier(option)
                      }
                    >
                      {option}
                      {selectedModifiers.includes(option) && <span className="ml-1">✓</span>}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Final Prompt Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Generated Prompt</label>
            <div className="p-4 bg-gray-50 rounded-lg border min-h-[100px]">
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {generateFinalPrompt() || "Your generated prompt will appear here..."}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={copyPrompt} disabled={!basePrompt.trim()}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Prompt
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => {
                const finalPrompt = generateFinalPrompt();
                if (finalPrompt.trim()) {
                  window.location.href = `/video-generator?prompt=${encodeURIComponent(finalPrompt)}`;
                }
              }}
              disabled={!basePrompt.trim()}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Video
            </Button>
            <Button variant="outline" onClick={clearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
