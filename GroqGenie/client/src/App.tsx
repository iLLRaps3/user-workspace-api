import { Switch, Route } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import Landing from "@/pages/Landing";
import Pricing from "@/pages/Pricing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/not-found";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PromptBuilderPage from "@/pages/PromptBuilder";
import VideoGeneratorPage from "@/pages/VideoGenerator";
import { Toaster } from "@/components/ui/toaster";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      {isAuthenticated ? (
        <>
          <Route path="/" component={Home} />
          <Route path="/chat/:id?" component={Chat} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/payment/success" component={PaymentSuccess} />
          <Route path="/prompt-builder" component={PromptBuilderPage} />
          <Route path="/video-generator" component={VideoGeneratorPage} />
        </>
      ) : (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/pricing" component={Pricing} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <Router />;
}

export default App;