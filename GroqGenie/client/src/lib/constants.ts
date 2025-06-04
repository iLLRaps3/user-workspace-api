// Model options
export const Models = [
  {
    id: "Llama-3-70B",
    name: "Llama 3 70B",
    iconClass: "fas fa-microchip",
    iconColor: "text-gray-600",
    activeIconColor: "text-primary-600",
    model: "llama-3.1-70b-chat",
    provider: "groq"
  },
  {
    id: "Llama-3-8B",
    name: "Llama 3 8B",
    iconClass: "fas fa-microchip",
    iconColor: "text-blue-500",
    activeIconColor: "text-blue-600",
    model: "llama-3-8b-8192",
    provider: "groq"
  },
  {
    id: "Mixtral-8x7B",
    name: "Mixtral 8x7B",
    iconClass: "fas fa-microchip",
    iconColor: "text-purple-500",
    activeIconColor: "text-purple-600",
    model: "mixtral-8x7b-32768",
    provider: "groq"
  },
  {
    id: "Gemma-7B",
    name: "Gemma 7B",
    iconClass: "fas fa-robot",
    iconColor: "text-amber-500",
    activeIconColor: "text-amber-600",
    model: "gemma-7b-it",
    provider: "groq"
  },
  {
    id: "Falcon-7B",
    name: "Falcon 7B",
    iconClass: "fas fa-feather",
    iconColor: "text-teal-500",
    activeIconColor: "text-teal-600",
    model: "falcon-7b-instruct",
    provider: "groq"
  },
];

// Category options
export const Categories = [
  { id: "All", name: "All" },
  { id: "Education", name: "Education" },
  { id: "Writing", name: "Writing" },
  { id: "Coding", name: "Coding" },
  { id: "Creativity", name: "Creativity" },
  { id: "Business", name: "Business" },
];

// Tool cards
export const ToolCards = [
  {
    id: "study-helper",
    title: "Study Helper",
    description: "Get help with homework, research, and exam preparation",
    icon: "fas fa-graduation-cap",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    categories: ["Education"],
    tags: [
      { name: "Education", bgColor: "bg-blue-50", textColor: "text-blue-700" },
      { name: "Research", bgColor: "bg-purple-50", textColor: "text-purple-700" }
    ],
    popular: true,
    premium: false
  },
  {
    id: "math-solver",
    title: "Math Solver",
    description: "Solve complex math problems with step-by-step solutions",
    icon: "fas fa-calculator",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100",
    categories: ["Education"],
    tags: [
      { name: "Math", bgColor: "bg-purple-50", textColor: "text-purple-700" },
      { name: "Education", bgColor: "bg-blue-50", textColor: "text-blue-700" }
    ],
    popular: false,
    premium: false
  },
  {
    id: "language-tutor",
    title: "Language Tutor",
    description: "Learn new languages with personalized lessons and practice",
    icon: "fas fa-language",
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
    categories: ["Education"],
    tags: [
      { name: "Languages", bgColor: "bg-green-50", textColor: "text-green-700" },
      { name: "Education", bgColor: "bg-blue-50", textColor: "text-blue-700" }
    ],
    popular: false,
    premium: false
  },
  {
    id: "video-generator",
    title: "AI Video Studio",
    description: "Generate stunning videos with AI-powered prompt optimization and MiniMax models",
    icon: "fas fa-video",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100",
    categories: ["Creativity"],
    tags: [
      { name: "Video", bgColor: "bg-purple-50", textColor: "text-purple-700" },
      { name: "AI", bgColor: "bg-blue-50", textColor: "text-blue-700" }
    ],
    popular: true,
    premium: false
  },
  {
    id: "image-generator",
    title: "Image Generator",
    description: "Create stunning visuals and artwork from text descriptions",
    icon: "fas fa-image",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-100",
    categories: ["Creativity"],
    tags: [
      { name: "Creative", bgColor: "bg-amber-50", textColor: "text-amber-700" },
      { name: "Visual", bgColor: "bg-rose-50", textColor: "text-rose-700" }
    ],
    popular: false,
    premium: true
  },
  {
    id: "code-assistant",
    title: "Code Assistant",
    description: "Get help with coding, debugging, and software development",
    icon: "fas fa-code",
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-100",
    categories: ["Coding"],
    tags: [
      { name: "Programming", bgColor: "bg-indigo-50", textColor: "text-indigo-700" },
      { name: "Technical", bgColor: "bg-gray-100", textColor: "text-gray-700" }
    ],
    popular: false,
    premium: false
  },
  {
    id: "writing-assistant",
    title: "Writing Assistant",
    description: "Perfect your essays, articles, and creative writing projects",
    icon: "fas fa-pen-fancy",
    iconColor: "text-rose-600",
    bgColor: "bg-rose-100",
    categories: ["Writing"],
    tags: [
      { name: "Writing", bgColor: "bg-rose-50", textColor: "text-rose-700" },
      { name: "Creative", bgColor: "bg-amber-50", textColor: "text-amber-700" }
    ],
    popular: false,
    premium: false
  }
];

// Prompt library categories
export const PromptCategories = [
  {
    id: "explain-like-five",
    title: "Explain Like I'm Five",
    description: "Simplify complex topics in easy-to-understand language",
    icon: "fas fa-brain",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    premium: false
  },
  {
    id: "code-refactoring",
    title: "Code Refactoring",
    description: "Improve and optimize your existing code",
    icon: "fas fa-code",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100",
    premium: false
  },
  {
    id: "business-ideas",
    title: "Business Ideas",
    description: "Generate innovative startup and business concepts",
    icon: "fas fa-lightbulb",
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
    premium: true
  },
  {
    id: "essay-improvement",
    title: "Essay Improvement",
    description: "Enhance your writing with better structure and clarity",
    icon: "fas fa-edit",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-100",
    premium: false
  }
];

// Category icons mapping
export const CategoryIcons: Record<string, string> = {
  "graduation-cap": "fa-graduation-cap",
  "calculator": "fa-calculator",
  "language": "fa-language",
  "image": "fa-image",
  "code": "fa-code",
  "pen-fancy": "fa-pen-fancy",
  "brain": "fa-brain",
  "lightbulb": "fa-lightbulb",
  "edit": "fa-edit",
  "robot": "fa-robot",
  "comments": "fa-comments",
  "university": "fa-university",
  "flask": "fa-flask",
  "briefcase": "fa-briefcase",
  "music": "fa-music",
  "palette": "fa-palette",
  "chart-line": "fa-chart-line",
  "book": "fa-book",
  "microscope": "fa-microscope",
  "globe": "fa-globe",
};
