import {
  Github,
  Facebook,
  Linkedin,
  Mail,
  Heart,
  Code,
  Coffee,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Todo List
              </h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              A modern Todo task management application built with Next.js.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Coffee className="h-4 w-4" />
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-400 fill-current" />
              <span>and lots of coffee</span>
            </div>
          </div>

          {/* Blank */}
          <div className="space-y-4"></div>

          {/* Blank */}
          <div className="space-y-4"></div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Connect</h4>
            <p className="text-slate-300 text-sm">
              If you think I&#39;m the right person
            </p>
            <div className="flex gap-3">
              {[
                {
                  icon: Github,
                  href: "https://github.com/sohrab09",
                  label: "GitHub",
                },
                {
                  icon: Facebook,
                  href: "https://www.facebook.com/sohrab09",
                  label: "Facebook",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/sohrab09/",
                  label: "LinkedIn",
                },
                {
                  icon: Mail,
                  href: "mailto:sohrab.cse9@gmail.com",
                  label: "Email",
                },
              ].map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200"
                  asChild
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>© {currentYear} Sohr@b.</span>
              <span className="hidden md:inline">•</span>
              <span className="text-xs">Built with Next.js</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
