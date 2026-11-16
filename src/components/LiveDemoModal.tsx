'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GithubIcon } from './BrandIcons';
import {
  X,
  Play,
  ExternalLink,
  CheckCircle,
  Smartphone,
  Laptop,
  RotateCw,
  ShoppingBag,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function LiveDemoModal() {
  const { activeModal, activeProductForModal, closeModal, openVouchModal, openRoastModal } = useApp();

  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [demoState, setDemoState] = useState<'home' | 'action' | 'success'>('home');
  const [cartCount, setCartCount] = useState(2);

  if (activeModal !== 'live_demo' || !activeProductForModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-white">
        {/* Top Bar */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <div className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                <span>LIVE SIMULATION PLAYER</span>
                <span className="text-emerald-400 font-mono">• {activeProductForModal.title}</span>
              </div>
              <div className="text-[11px] text-slate-400">{activeProductForModal.tagline}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  deviceMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  deviceMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop View"
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={closeModal}
              className="rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Demo Stage */}
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center bg-radial from-slate-900 to-slate-950 min-h-[420px]">
          {deviceMode === 'mobile' ? (
            /* Mobile Mock Frame */
            <div className="w-72 rounded-3xl border-4 border-slate-700 bg-white text-slate-900 shadow-2xl overflow-hidden text-xs flex flex-col h-[460px]">
              {/* Phone Status Bar */}
              <div className="bg-slate-900 px-4 py-1.5 text-white flex justify-between items-center text-[10px] font-mono">
                <span>9:41 PM</span>
                <span className="text-emerald-400 font-bold">5G • 100%</span>
              </div>

              {/* App Navbar */}
              <div className="bg-blue-600 p-3 text-white flex items-center justify-between shadow-xs">
                <div>
                  <div className="font-extrabold text-xs tracking-tight">{activeProductForModal.title}</div>
                  <div className="text-[9px] text-blue-200">SOA ITER Campus Live</div>
                </div>
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-bold text-[8px] rounded-full h-3 w-3 flex items-center justify-center">
                    {cartCount}
                  </span>
                </div>
              </div>

              {/* Simulated App Screen */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
                {demoState === 'home' && (
                  <>
                    <div className="rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 p-3 text-white shadow-xs">
                      <div className="text-[10px] uppercase font-mono font-bold text-blue-200">
                        Night Canteen Sprint
                      </div>
                      <div className="font-bold text-xs mt-0.5">Hostel 1 to 12 Delivery</div>
                      <p className="text-[10px] text-blue-100 mt-1">Average ETA: 12 minutes</p>
                    </div>

                    <div className="space-y-2">
                      <div className="font-bold text-[11px] text-slate-800">Popular on Campus:</div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs">Paneer Roll + Masala Chai</div>
                          <div className="text-[10px] text-slate-500">Hostel 4 Canteen • ₹60</div>
                        </div>
                        <button
                          onClick={() => {
                            setCartCount((c) => c + 1);
                            setDemoState('action');
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1 rounded text-[10px]"
                        >
                          Add +
                        </button>
                      </div>

                      <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs">Lab Record Spiral Binding</div>
                          <div className="text-[10px] text-slate-500">SOA Stationery • ₹35</div>
                        </div>
                        <button
                          onClick={() => {
                            setCartCount((c) => c + 1);
                            setDemoState('action');
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-2.5 py-1 rounded text-[10px]"
                        >
                          Add +
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {demoState === 'action' && (
                  <div className="space-y-3 pt-2">
                    <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-xs space-y-2">
                      <div className="font-bold text-xs text-slate-900">Checkout Dispatch</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>Deliver to: <strong>Hostel 8, Room 304</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Courier: <strong>Kabir (1st Yr Scout)</strong></span>
                      </div>
                      <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-xs">
                        <span>Total:</span>
                        <span className="text-blue-700">₹95 (Zero Delivery Fee)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setDemoState('success')}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow-md text-xs"
                    >
                      Confirm Campus Order →
                    </button>
                  </div>
                )}

                {demoState === 'success' && (
                  <div className="p-4 text-center space-y-2 pt-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle className="h-7 w-7" />
                    </div>
                    <div className="font-bold text-sm text-slate-900">Order Dispatched!</div>
                    <p className="text-[11px] text-slate-600">
                      GPS Courier assigned. Live WebSocket stream active.
                    </p>
                    <button
                      onClick={() => setDemoState('home')}
                      className="mt-2 text-[10px] text-blue-600 underline font-bold"
                    >
                      Reset Simulation ↺
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Desktop Web Mock Frame */
            <div className="w-full max-w-xl rounded-xl border border-slate-700 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="ml-2 text-slate-300 font-bold">{activeProductForModal.liveDemoUrl}</span>
                </span>
                <span className="text-emerald-400">HTTP 200 OK</span>
              </div>

              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-base font-bold text-white">{activeProductForModal.title}</h4>
                <p className="text-xs text-slate-300">{activeProductForModal.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px]">CAMPUS USERS</div>
                    <div className="text-base font-bold text-emerald-400">
                      {activeProductForModal.userTraction}+ Active
                    </div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <div className="text-slate-400 text-[10px]">GITHUB COMMITS</div>
                    <div className="text-base font-bold text-blue-400">
                      {activeProductForModal.commitsCount} Verified
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Built by SOA ITER undergraduate squad: {activeProductForModal.squadMembers.map((m) => m.name).join(', ')}.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <a
              href={activeProductForModal.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              Inspect GitHub Repo
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeModal();
                openRoastModal(activeProductForModal);
              }}
              className="rounded-lg bg-pink-600 hover:bg-pink-500 px-3 py-1.5 text-xs font-bold text-white shadow-xs"
            >
              Drop 5-Min Roast
            </button>
            <button
              onClick={() => {
                closeModal();
                openVouchModal(activeProductForModal);
              }}
              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-xs"
            >
              Endorse & Vouch Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
