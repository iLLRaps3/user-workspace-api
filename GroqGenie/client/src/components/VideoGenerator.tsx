import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Play, Download, AlertCircle, CheckCircle, Clock, Image as ImageIcon, Wand2, Sparkles, Copy, RefreshCw, Camera, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface VideoGenerationTask {
  taskId: string;
  status: 'Queueing' | 'Preparing' | 'Processing' | 'Success' | 'Fail';
  fileId?: string;
  downloadUrl?: string;
}

interface VideoGeneratorProps {
  initialPrompt?: string;
}

const VIDEO_MODELS = [
  { id: 'T2V-01', name: 'Text to Video (Basic)', description: 'Standard text-to-video generation' },
  { id: 'T2V-01-Director', name: 'Text to Video (Director)', description: 'Advanced text-to-video with camera controls' },
  { id: 'I2V-01', name: 'Image to Video (Basic)', description: 'Generate video from image' },
  { id: 'I2V-01-Director', name: 'Image to Video (Director)', description: 'Advanced image-to-video with camera controls' },
  { id: 'I2V-01-live', name: 'Image to Video (Live)', description: 'Live image-to-video generation' },
  { id: 'S2V-01', name: 'Subject Reference', description: 'Generate video with subject reference' }
];

const VIDEO_STYLES = [
  { id: 'realistic', name: 'Realistic', description: 'Photorealistic style' },
  { id: 'cinematic', name: 'Cinematic', description: 'Movie-like quality' },
  { id: 'anime', name: 'Anime', description: 'Japanese animation style' },
  { id: 'cartoon', name: 'Cartoon', description: 'Animated cartoon style' },
  { id: 'cole-bennett', name: 'Cole Bennett', description: 'Lyrical Lemonade music video style' },
  { id: 'trippy', name: 'Trippy/Psychedelic', description: 'Surreal and mind-bending visuals' },
  { id: 'glitch', name: 'Glitch Art', description: 'Digital glitch and distortion effects' },
  { id: 'neon', name: 'Neon/Cyberpunk', description: 'Bright neon colors and cyberpunk aesthetic' },
  { id: 'documentary', name: 'Documentary', description: 'Documentary film style' },
  { id: 'vintage', name: 'Vintage', description: 'Retro/vintage aesthetic' },
  { id: 'futuristic', name: 'Futuristic', description: 'Sci-fi futuristic style' },
  { id: 'artistic', name: 'Artistic', description: 'Creative artistic style' },
  { id: 'vaporwave', name: 'Vaporwave', description: '80s aesthetic with pink/purple tones' },
  { id: 'lo-fi', name: 'Lo-Fi', description: 'Chill, low-fidelity aesthetic' }
];

const CARTOON_STYLES = [
  { id: 'disney', name: 'Disney Style', description: 'Classic Disney animation' },
  { id: 'pixar', name: 'Pixar Style', description: '3D Pixar-like animation' },
  { id: 'rick-morty', name: 'Rick and Morty', description: 'Rick and Morty art style' },
  { id: 'simpsons', name: 'The Simpsons', description: 'Simpsons animation style' },
  { id: 'south-park', name: 'South Park', description: 'South Park cut-out style' },
  { id: 'family-guy', name: 'Family Guy', description: 'Family Guy animation style' },
  { id: 'adventure-time', name: 'Adventure Time', description: 'Adventure Time art style' },
  { id: 'gravity-falls', name: 'Gravity Falls', description: 'Gravity Falls style' },
  { id: 'steven-universe', name: 'Steven Universe', description: 'Steven Universe art style' },
  { id: 'tom-jerry', name: 'Tom and Jerry', description: 'Classic Tom and Jerry style' }
];

const CAMERA_MOVEMENTS = [
  'Static shot', 'Pan left', 'Pan right', 'Tilt up', 'Tilt down', 'Zoom in', 'Zoom out',
  'Push in', 'Pull out', 'Truck left', 'Truck right', 'Pedestal up', 'Pedestal down',
  'Tracking shot', 'Dolly shot', 'Crane shot', 'Handheld', 'Shake', 'Smooth movement',
  'Orbital shot', 'Drone shot', 'Fish-eye', 'Whip pan', 'Crash zoom', 'Dutch angle',
  'Match cut', 'Jump cut', 'Bullet time', 'Vertigo effect', 'Rotational', 'Spiral'
];

const ADVANCED_EFFECTS = [
  { id: 'slow-motion', name: 'Slow Motion', description: 'Slow motion effects' },
  { id: 'time-lapse', name: 'Time Lapse', description: 'Speed up time effects' },
  { id: 'color-grading', name: 'Color Grading', description: 'Professional color correction' },
  { id: 'particle-effects', name: 'Particle Effects', description: 'Magical particles and sparks' },
  { id: 'light-leaks', name: 'Light Leaks', description: 'Cinematic light leak effects' },
  { id: 'lens-flares', name: 'Lens Flares', description: 'Dramatic lens flare effects' },
  { id: 'chromatic-aberration', name: 'Chromatic Aberration', description: 'Color separation effects' },
  { id: 'film-grain', name: 'Film Grain', description: 'Vintage film texture' }
];

const LIGHTING_OPTIONS = [
  'Natural lighting', 'Golden hour', 'Blue hour', 'Soft lighting', 'Hard lighting',
  'Dramatic lighting', 'Studio lighting', 'Neon lighting', 'Candlelight', 'Sunset lighting'
];

const DURATIONS = [
  { value: '3s', label: '3 seconds' },
  { value: '5s', label: '5 seconds' },
  { value: '10s', label: '10 seconds' },
  { value: '15s', label: '15 seconds' },
  { value: '30s', label: '30 seconds' }
];

export default function VideoGenerator({ initialPrompt = "" }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState('T2V-01-Director');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedCartoonStyle, setSelectedCartoonStyle] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('5s');
  const [selectedCameraMovement, setSelectedCameraMovement] = useState('');
  const [selectedLighting, setSelectedLighting] = useState('');
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [realisticLevel, setRealisticLevel] = useState(50);
  const [hideTextOnScreen, setHideTextOnScreen] = useState(false);
  const [firstFrameImage, setFirstFrameImage] = useState<File | null>(null);
  const [currentTask, setCurrentTask] = useState<VideoGenerationTask | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [activeTab, setActiveTab] = useState("prompt-builder");
  
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const toggleEffect = (effectId: string) => {
    setSelectedEffects(prev => 
      prev.includes(effectId) 
        ? prev.filter(id => id !== effectId)
        : [...prev, effectId]
    );
  };

  const optimizePrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to optimize",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const response = await apiRequest("POST", "/api/prompt/optimize", {
        prompt,
        style: selectedStyle,
        cartoonStyle: selectedCartoonStyle,
        duration: selectedDuration,
        cameraMovement: selectedCameraMovement,
        lighting: selectedLighting,
        effects: selectedEffects,
        realisticLevel,
        hideTextOnScreen
      });

      const data = await response.json();
      setOptimizedPrompt(data.optimizedPrompt);
      setActiveTab("video-generation");
      toast({
        title: "Success",
        description: "Prompt optimized successfully!",
      });
    } catch (error) {
      console.error("Prompt optimization error:", error);
      toast({
        title: "Error",
        description: "Failed to optimize prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Prompt copied to clipboard!",
    });
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const generateVideo = async () => {
    const finalPrompt = optimizedPrompt || prompt;
    if (!finalPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for video generation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/video/generate", {
        prompt: finalPrompt,
        model: selectedModel
      });

      const data = await response.json();
      const task: VideoGenerationTask = {
        taskId: data.taskId,
        status: 'Queueing'
      };

      setCurrentTask(task);
      pollTaskStatus(data.taskId);

      toast({
        title: "Success",
        description: "Video generation started! This may take a few minutes.",
      });
    } catch (error) {
      console.error("Video generation error:", error);
      toast({
        title: "Error",
        description: "Failed to start video generation. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const pollTaskStatus = (taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await apiRequest("GET", `/api/video/status/${taskId}`);
        const data = await response.json();

        const updatedTask: VideoGenerationTask = {
          taskId,
          status: data.status,
          fileId: data.file_id
        };

        setCurrentTask(updatedTask);

        if (data.status === 'Success') {
          clearInterval(interval);
          setPollingInterval(null);
          setIsGenerating(false);
          
          // Get download URL
          if (data.file_id) {
            const downloadResponse = await apiRequest("GET", `/api/video/download/${data.file_id}`);
            const downloadData = await downloadResponse.json();
            setCurrentTask(prev => prev ? { ...prev, downloadUrl: downloadData.downloadUrl } : null);
          }

          toast({
            title: "Success",
            description: "Video generated successfully!",
          });
        } else if (data.status === 'Fail') {
          clearInterval(interval);
          setPollingInterval(null);
          setIsGenerating(false);
          toast({
            title: "Error",
            description: "Video generation failed. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Status polling error:", error);
      }
    }, 5000);

    setPollingInterval(interval);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Queueing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Preparing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'Processing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'Success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Fail':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getProgress = (status: string) => {
    switch (status) {
      case 'Queueing': return 25;
      case 'Preparing': return 50;
      case 'Processing': return 75;
      case 'Success': return 100;
      case 'Fail': return 0;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prompt-builder" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Prompt Builder
          </TabsTrigger>
          <TabsTrigger value="video-generation" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Video Generation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompt-builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                AI Video Prompt Builder
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Create optimized prompts for AI video generation using Groq's advanced language models
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Prompt Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Basic Description</label>
                <Textarea
                  placeholder="Describe what you want to see in your video..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Style Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Video Style</label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a style..." />
                    </SelectTrigger>
                    <SelectContent>
                      {VIDEO_STYLES.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.name} - {style.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Specific Cartoon Style (only show when Cartoon is selected) */}
                {selectedStyle === 'cartoon' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Specific Cartoon Style</label>
                    <Select value={selectedCartoonStyle} onValueChange={setSelectedCartoonStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a cartoon style..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CARTOON_STYLES.map((style) => (
                          <SelectItem key={style.id} value={style.id}>
                            {style.name} - {style.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATIONS.map((duration) => (
                        <SelectItem key={duration.value} value={duration.value}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Realistic Level Slider */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Realistic Level</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={realisticLevel}
                    onChange={(e) => setRealisticLevel(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Stylized</span>
                    <span>{realisticLevel}%</span>
                    <span>Photorealistic</span>
                  </div>
                </div>
              </div>

              {/* Camera and Lighting */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Camera Movement</label>
                  <Select value={selectedCameraMovement} onValueChange={setSelectedCameraMovement}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose camera movement..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CAMERA_MOVEMENTS.map((movement) => (
                        <SelectItem key={movement} value={movement}>
                          {movement}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Lighting</label>
                  <Select value={selectedLighting} onValueChange={setSelectedLighting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose lighting..." />
                    </SelectTrigger>
                    <SelectContent>
                      {LIGHTING_OPTIONS.map((lighting) => (
                        <SelectItem key={lighting} value={lighting}>
                          {lighting}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Advanced Effects */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Advanced Effects</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {ADVANCED_EFFECTS.map((effect) => (
                    <div key={effect.id} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => toggleEffect(effect.id)}>
                      <Checkbox
                        checked={selectedEffects.includes(effect.id)}
                        onChange={() => toggleEffect(effect.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{effect.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{effect.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Additional Settings</label>
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <Checkbox
                    checked={hideTextOnScreen}
                    onCheckedChange={(checked) => setHideTextOnScreen(checked === true)}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Hide Text on Screen</p>
                    <p className="text-xs text-muted-foreground">Remove any visible text or captions from the video</p>
                  </div>
                </div>
              </div>

              {/* Optimized Prompt Preview */}
              {optimizedPrompt && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Optimized Prompt</label>
                  <div className="p-4 bg-muted rounded-lg border">
                    <p className="text-sm whitespace-pre-wrap">{optimizedPrompt}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyPrompt(optimizedPrompt)}
                      className="mt-2"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Optimized Prompt
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={optimizePrompt}
                  disabled={!prompt.trim() || isOptimizing}
                  className="flex-1"
                >
                  {isOptimizing ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {isOptimizing ? "Optimizing..." : "Optimize with AI"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => copyPrompt(prompt)}
                  disabled={!prompt.trim()}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video-generation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Video Generation
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate videos using MiniMax's advanced AI models
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Final Prompt Display */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Prompt for Generation</label>
                <Textarea
                  value={optimizedPrompt || prompt}
                  onChange={(e) => optimizedPrompt ? setOptimizedPrompt(e.target.value) : setPrompt(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Enter your video prompt here..."
                />
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Video Model</label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VIDEO_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} - {model.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload for Image-to-Video */}
              {(selectedModel.includes('I2V') || selectedModel.includes('S2V')) && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reference Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFirstFrameImage(file);
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {firstFrameImage ? firstFrameImage.name : "Click to upload reference image"}
                      </p>
                    </label>
                  </div>
                </div>
              )}

              {/* Generation Status */}
              {currentTask && (
                <Card className="border">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(currentTask.status)}
                          <span className="font-medium">Status: {currentTask.status}</span>
                        </div>
                        <Badge variant={currentTask.status === 'Success' ? 'default' : 'secondary'}>
                          {currentTask.status}
                        </Badge>
                      </div>
                      
                      <Progress value={getProgress(currentTask.status)} className="w-full" />
                      
                      {currentTask.status === 'Success' && currentTask.downloadUrl && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => window.open(currentTask.downloadUrl, '_blank')}
                            className="flex-1"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Video
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Generate Button */}
              <Button
                onClick={generateVideo}
                disabled={isGenerating || !((optimizedPrompt || prompt).trim())}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Video
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}