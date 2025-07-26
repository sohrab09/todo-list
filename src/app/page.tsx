"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Todo List App.
              </h1>
              <p className="text-slate-600 mt-1">
                Organize your workflow with style
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <User className="h-4 w-4" />
                <span>2 total tasks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
