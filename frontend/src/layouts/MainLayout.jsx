import React from 'react';
import { Layout } from 'lucide-react';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#07070f] text-[#e0e0f0] font-sans selection:bg-[#6c5ce7] selection:text-white">
      <header className="border-b border-[#2a2a4a] bg-[#07070f]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6c5ce7] to-[#5040cc] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-[#a0a0d0]">
              Prompt2Web
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#8080a0]">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Templates</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
            </nav>
            <button className="bg-[#111120] border border-[#2a2a4a] px-4 py-2 rounded-lg text-sm font-semibold hover:border-[#6c5ce7] transition-all">
              Login
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-[#2a2a4a] py-8 bg-[#07070f]">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-[#505070]">
          <p>© 2024 Prompt2Web AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
