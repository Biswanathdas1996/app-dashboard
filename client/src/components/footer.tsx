import { PwCLogo } from "./pwc-logo";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <PwCLogo size="md" className="text-white" />
              <div>
                <h3 className="text-xl font-bold text-white">
                  Application Portfolio
                </h3>
                <p className="text-gray-400 text-sm">
                  Powered by PwC Innovation
                </p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-md">
              Centralized access to our comprehensive suite of business
              applications and tools. Streamlining workflows and enhancing
              productivity across all departments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Access
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-primary transition-colors duration-200"
                >
                  Dashboard
                </a>
              </li>

              <li>
                <span className="text-gray-400 text-sm">Categories</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">Applications</span>
              </li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-300">Help Center</span>
              </li>
              <li>
                <span className="text-gray-300">Documentation</span>
              </li>
              <li>
                <span className="text-gray-300">Contact IT</span>
              </li>
              <li>
                <span className="text-gray-300">System Status</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} PwC. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Privacy Policy</span>
                <span>•</span>
                <span>Terms of Use</span>
                <span>•</span>
                <span>Security</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Version 2.1.0</span>
              <span>•</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
