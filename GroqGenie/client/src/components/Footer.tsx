import { useLocation } from "wouter";

export default function Footer() {
  const [_, navigate] = useLocation();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => navigate("/")}
                  className="text-gray-600 hover:text-primary-600"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/pricing")}
                  className="text-gray-600 hover:text-primary-600"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-primary-600">
                  Features
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="text-gray-600 hover:text-primary-600">
                  Blog
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-primary-600">
                  Documentation
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-primary-600">
                  Guides
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="text-gray-600 hover:text-primary-600">
                  About
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-primary-600">
                  Careers
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-primary-600">
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="text-gray-600 hover:text-primary-600">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-primary-600">
                  Terms of Service
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-primary-600">
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-gray-600 text-sm">© 2023 Groq AI Assistant. All rights reserved.</span>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-gray-700">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              <i className="fab fa-github"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
