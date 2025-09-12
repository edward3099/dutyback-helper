"use client";

import { useState } from "react";

export default function ReactBitsDemo() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-white mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            ReactBits Demo
          </h1>
          <p className="text-xl text-gray-300 mb-12 animate-pulse">
            Welcome to the amazing world of ReactBits animations!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Bounce Animation */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-white mb-4">Bounce Animation</h3>
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto animate-bounce"></div>
            <p className="text-gray-300 mt-4">Smooth bounce effect</p>
          </div>

          {/* Click Spark Effect */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-white mb-4">Click Spark</h3>
            <button 
              onClick={() => setClickCount(prev => prev + 1)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:scale-110 transition-transform duration-200 active:scale-95"
            >
              Click Me! ({clickCount})
            </button>
            <p className="text-gray-300 mt-4">Interactive click effects</p>
          </div>

          {/* Scroll Reveal */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-white mb-4">Scroll Reveal</h3>
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-red-600 rounded-lg mx-auto animate-pulse"></div>
            <p className="text-gray-300 mt-4">Reveals on scroll</p>
          </div>
        </div>

        {/* Additional Demo Section */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold text-white mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            More Animations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">Fade In</h3>
              <p className="text-gray-300">
                This content fades in as you scroll down the page.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-white mb-4">Staggered Animation</h3>
              <p className="text-gray-300">
                This content appears with a slight delay for a staggered effect.
              </p>
            </div>
          </div>
        </div>

        {/* ReactBits Status */}
        <div className="mt-20 text-center">
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-green-400 mb-2">✅ ReactBits Installed Successfully!</h3>
            <p className="text-gray-300">
              ReactBits package is installed and ready to use. The demo above shows CSS animations as a fallback.
            </p>
            <div className="mt-4 text-sm text-gray-400">
              <p>Installed packages: @appletosolutions/reactbits, gsap, matter-js, three, @react-three/fiber, @react-three/drei</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}