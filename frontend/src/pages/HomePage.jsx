import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Download, RotateCcw, ShieldCheck, Zap, Layers, Eye, Code, FileJson } from 'lucide-react';
import { expandPrompt, generateHtml, getUsage, resetUsage } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_DEFAULT_GEMINI_KEY || '');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gemini-3.1-flash-lite');
  const [useSmart, setUseSmart] = useState(true);
  const [designSpec, setDesignSpec] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('idle'); // idle, expanding, generating, done
  const [usage, setUsage] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    if (apiKey) {
      fetchUsage();
    }
  }, [apiKey]);

  const fetchUsage = async () => {
    try {
      const data = await getUsage(apiKey);
      setUsage(data);
    } catch (err) {
      console.error("Failed to fetch usage", err);
    }
  };

  const handleGenerate = async () => {
    if (!apiKey) return alert("Please enter an API Key");
    if (!prompt) return alert("Please enter a prompt");

    setLoading(true);
    setStage('expanding');
    setDesignSpec('');
    setHtmlCode('');

    try {
      let finalSpec = prompt;
      if (useSmart) {
        const expandRes = await expandPrompt(prompt, model, apiKey);
        finalSpec = expandRes.expanded;
        setDesignSpec(finalSpec);
        await fetchUsage();
      }

      setStage('generating');
      const genRes = await generateHtml(finalSpec, model, apiKey);
      setHtmlCode(genRes.html);
      setStage('done');
      await fetchUsage();
    } catch (err) {
      console.error(err);
      alert("Generation failed: " + (err.response?.data?.detail || err.message));
      setStage('idle');
    } finally {
      setLoading(false);
    }
  };

  const downloadHtml = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const pctUsed = usage ? (usage.total / usage.limit) * 100 : 0;
  const barColor = pctUsed < 60 ? '#00b894' : pctUsed < 85 ? '#f39c12' : '#e17055';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar / Configuration */}
      <div className="lg:col-span-3 space-y-6">
        <section className="card space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#6c5ce7]">
            <ShieldCheck size={16} /> API Access
          </h3>
          <div className="space-y-2">
            <label className="text-xs text-[#8080a0]">Gemini API Key</label>
            <input 
              type="password" 
              placeholder="AIzaSy..." 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              className="input-field w-full"
            />
          </div>
        </section>

        {usage && (
          <section className="card space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#00b894]">
              <Zap size={16} /> Token Usage
            </h3>
            <div className="token-bar-wrap">
              <div 
                className="token-bar-fill" 
                style={{ width: `${pctUsed}%`, backgroundColor: barColor }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-[#07070f]">
                <div className="text-[10px] text-[#8080a0]">Used</div>
                <div className="font-mono text-sm">{usage.total.toLocaleString()}</div>
              </div>
              <div className="p-2 rounded-lg bg-[#07070f]">
                <div className="text-[10px] text-[#8080a0]">Remaining</div>
                <div className="font-mono text-sm">{usage.remaining.toLocaleString()}</div>
              </div>
            </div>
            <button 
              onClick={() => {
                const pass = prompt("Enter Admin Password");
                if (pass) resetUsage(apiKey, pass).then(fetchUsage);
              }}
              className="w-full text-[10px] text-[#505070] hover:text-[#6c5ce7] flex items-center justify-center gap-1 transition-colors"
            >
              <RotateCcw size={10} /> Reset Usage
            </button>
          </section>
        )}

        <section className="card space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#a0a0d0]">
            <Layers size={16} /> Settings
          </h3>
          <div className="space-y-2">
            <label className="text-xs text-[#8080a0]">Model Selection</label>
            <select 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              className="input-field w-full appearance-none"
            >
              <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</option>
              <option value="gemini-3-flash">Gemini 3 Flash</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={useSmart} 
                onChange={() => setUseSmart(!useSmart)} 
              />
              <div className={`w-10 h-5 rounded-full transition-colors ${useSmart ? 'bg-[#6c5ce7]' : 'bg-[#2a2a4a]'}`}></div>
              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${useSmart ? 'translate-x-5' : ''}`}></div>
            </div>
            <span className="text-xs font-medium text-[#8080a0] group-hover:text-white transition-colors">Smart Mode (Expansion)</span>
          </label>
        </section>
      </div>

      {/* Main Interaction Area */}
      <div className="lg:col-span-9 space-y-8">
        <section className="card bg-gradient-to-br from-[#111120] to-[#07070f] border-[#2a2a4a] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Sparkles size={120} className="text-[#6c5ce7]" />
          </div>
          <h2 className="text-xl font-bold mb-4">What should I build for you?</h2>
          <div className="relative">
            <textarea
              className="input-field min-h-[140px] w-full pr-32 resize-none"
              placeholder="Describe your landing page, email template, or UI component... e.g. 'Modern dark login page for a crypto app'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="absolute bottom-4 right-4 btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              )}
              {loading ? 'Processing...' : 'Generate'}
            </button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {['Netflix Landing', 'Amazon Receipt', 'Crypto Dashboard', 'SaaS Pricing'].map(ex => (
              <button 
                key={ex}
                onClick={() => setPrompt(ex)}
                className="text-[10px] px-2 py-1 rounded-md bg-[#1e1e38] text-[#8080a0] hover:text-white hover:bg-[#2a2a4a] transition-all"
              >
                {ex}
              </button>
            ))}
          </div>
        </section>

        {/* Results Area */}
        <AnimatePresence>
          {(stage !== 'idle' || loading) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-6"
            >
              {/* Pipeline Status */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#111120] rounded-full border border-[#2a2a4a]">
                <div className="flex items-center gap-6">
                  <StatusItem active={stage === 'expanding' || stage === 'generating' || stage === 'done'} label="Expand Spec" loading={stage === 'expanding'} />
                  <div className="h-px w-8 bg-[#2a2a4a]"></div>
                  <StatusItem active={stage === 'generating' || stage === 'done'} label="Generate HTML" loading={stage === 'generating'} />
                  <div className="h-px w-8 bg-[#2a2a4a]"></div>
                  <StatusItem active={stage === 'done'} label="Ready" />
                </div>
                {stage === 'done' && (
                  <button onClick={downloadHtml} className="text-[#00b894] hover:text-[#00d0a0] flex items-center gap-1 text-sm font-bold transition-colors">
                    <Download size={16} /> Download
                  </button>
                )}
              </div>

              {/* Viewer Tabs */}
              <div className="space-y-4">
                <div className="flex border-b border-[#2a2a4a]">
                  <Tab active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} icon={<Eye size={16}/>} label="Live Preview" />
                  <Tab active={activeTab === 'code'} onClick={() => setActiveTab('code')} icon={<Code size={16}/>} label="Source Code" />
                  {designSpec && <Tab active={activeTab === 'spec'} onClick={() => setActiveTab('spec')} icon={<FileJson size={16}/>} label="Design Spec" />}
                </div>

                <div className="card p-0 overflow-hidden min-h-[500px] border-[#2a2a4a] bg-black">
                  {activeTab === 'preview' && htmlCode && (
                    <iframe 
                      title="Preview"
                      srcDoc={htmlCode}
                      className="w-full h-[600px] border-none bg-white"
                    />
                  )}
                  {activeTab === 'preview' && !htmlCode && (
                    <div className="w-full h-[600px] flex flex-col items-center justify-center text-[#505070]">
                      <div className="w-12 h-12 border-4 border-[#2a2a4a] border-t-[#6c5ce7] rounded-full animate-spin mb-4"></div>
                      <p className="animate-pulse">Building your vision...</p>
                    </div>
                  )}
                  {activeTab === 'code' && (
                    <pre className="p-6 overflow-auto h-[600px] text-xs font-mono text-[#a0a0d0]">
                      <code>{htmlCode}</code>
                    </pre>
                  )}
                  {activeTab === 'spec' && (
                    <div className="p-8 h-[600px] overflow-auto prose prose-invert max-w-none">
                      <div className="text-[#6c5ce7] font-mono text-xs mb-4">// Generated Design Specification</div>
                      <div className="whitespace-pre-wrap leading-relaxed text-[#c0c0e0]">
                        {designSpec}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StatusItem = ({ active, label, loading }) => (
  <div className={`flex items-center gap-2 text-xs font-bold transition-colors ${active ? 'text-white' : 'text-[#505070]'}`}>
    <div className={`w-2 h-2 rounded-full ${loading ? 'bg-[#6c5ce7] animate-ping' : active ? 'bg-[#6c5ce7]' : 'bg-[#2a2a4a]'}`}></div>
    {label}
  </div>
);

const Tab = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all border-b-2 ${active ? 'border-[#6c5ce7] text-white bg-[#6c5ce7]/5' : 'border-transparent text-[#505070] hover:text-[#8080a0]'}`}
  >
    {icon} {label}
  </button>
);

export default HomePage;
