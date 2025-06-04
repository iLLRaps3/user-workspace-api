import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Landing() {
  const [_, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl font-bold text-gray-900 md:text-5xl mb-6">
                  Experience the Power of Groq AI
                </h1>
                <p className="text-xl text-gray-700 mb-8 md:max-w-md">
                  Unlock advanced AI capabilities with lightning-fast responses 
                  and unlimited possibilities.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button 
                    size="lg" 
                    className="text-md"
                    onClick={() => navigate("/register")}
                  >
                    Get Started Free
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-md"
                    onClick={() => navigate("/login")}
                  >
                    Log In
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-robot text-blue-600"></i>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-3 rounded-lg rounded-tr-none max-w-[80%] ml-auto">
                      <p>Can you explain how quantum computing works?</p>
                    </div>
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mr-2">
                        <span className="text-white font-bold text-xs">G</span>
                      </div>
                      <div className="bg-primary-50 p-3 rounded-lg max-w-[80%]">
                        <p>Quantum computing uses quantum bits or "qubits" that can exist in multiple states simultaneously (superposition). Unlike classical bits that are either 0 or 1, qubits leverage quantum mechanics to process information in new ways...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">
                Features that Make the Difference
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Explore the unique capabilities of our Groq-powered platform
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-bolt text-blue-600 text-lg"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-gray-600">
                    Get responses in milliseconds with Groq's optimized inference engine.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-book text-purple-600 text-lg"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Prompt Library</h3>
                  <p className="text-gray-600">
                    Access our curated collection of prompts to get the most out of AI.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-microchip text-green-600 text-lg"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Model Selection</h3>
                  <p className="text-gray-600">
                    Choose from top AI models including GPT-4o, Gemini, Claude and more.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">
                What Our Users Say
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <h4 className="font-medium">Alex Thompson</h4>
                      <p className="text-sm text-gray-500">Software Developer</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "The speed of this service is mind-blowing. I get responses almost instantly, which has dramatically improved my workflow."
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <h4 className="font-medium">Jamie Rivera</h4>
                      <p className="text-sm text-gray-500">Content Creator</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    "The prompt library is a game-changer for content creation. I've found templates that have taken my writing to the next level."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary-500 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Experience the Future of AI?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who are already leveraging our platform. Get started for free today.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-gray-100 text-md"
              onClick={() => navigate("/register")}
            >
              Create Free Account
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
