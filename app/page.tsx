'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const globeRef = useRef<HTMLDivElement>(null);
  const globeInstance = useRef<any>(null);

  // Initialize Globe
  useEffect(() => {
    if (!globeRef.current) return;

    initializeGlobe();

    return () => {
      if (globeInstance.current) {
        globeInstance.current = null;
      }
    };
  }, []);

  const initializeGlobe = useCallback(async () => {
    if (!globeRef.current || globeInstance.current || typeof window === 'undefined') return;

    try {
      const Globe = (await import('globe.gl')).default;

      const globe = new (Globe as any)(globeRef.current)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .enablePointerInteraction(true)
        .width(600)
        .height(600);

      // Set initial camera position
      globe.pointOfView({ altitude: 2.5 });

      // Enable auto rotation
      const controls = globe.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1;
        controls.enableZoom = false;
      }

      globeInstance.current = globe;
    } catch (error) {
      console.error('Error initializing globe:', error);
    }
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-deep-space relative">
      {/* Transparent Navigation Bar */}
      <motion.nav
        className="absolute top-0 w-full bg-transparent backdrop-blur-sm z-50 py-6 px-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="flex justify-between items-center">
          {/* Left side - Dashboard */}
          <motion.div
            className="font-orbitron text-3xl font-bold text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Dashboard
          </motion.div>

          {/* Right side - Navigation Links */}
          <motion.div
            className="flex space-x-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.a
              href="#data"
              className="text-white font-orbitron text-lg hover:text-satellite-cyan transition-all duration-300 relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Data
              <motion.div
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-satellite-cyan"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
            <motion.a
              href="#overview"
              className="text-white font-orbitron text-lg hover:text-satellite-cyan transition-all duration-300 relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Overview
              <motion.div
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-satellite-cyan"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </motion.div>
        </div>
      </motion.nav>

      {/* Main Content Container */}
      <div className="flex h-full">
        {/* Left Side - Content */}
        <div className="flex-1 flex items-center justify-center pl-12 pt-20">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            {/* Main Title */}
            <motion.h1
              className="font-orbitron text-7xl font-thin text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
            >
              <span className="text-satellite-cyan">TRACE</span>: Time-Resolved Accurate Clock & Ephemeris
            </motion.h1>

            {/* Animated Divider */}
            <motion.div
              className="w-32 h-1 bg-gradient-to-r from-satellite-cyan to-cosmic-purple mb-8"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ duration: 1, delay: 1.8 }}
            />

            {/* Description */}
            <motion.p
              className="text-gray-300 text-xl mb-12 leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2 }}
            >
              Advanced 3D visualization platform for real-time satellite positioning error prediction and analysis. Experience the future of space technology monitoring.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex space-x-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.2 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-satellite-cyan to-cosmic-purple text-white font-orbitron font-bold rounded-lg uppercase tracking-wider shadow-lg"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 201, 255, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Dashboard
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-white text-white font-orbitron font-bold rounded-lg uppercase tracking-wider hover:bg-white hover:text-deep-space"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#ffffff",
                  color: "#0A192F"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Explore Data
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.4 }}
            >  
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Globe */}
        <div className="flex-1 flex items-center justify-center relative">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.5, delay: 1 }}
          >
            <div ref={globeRef} className="w-[600px] h-[600px]">
              {/* Globe renders here */}
            </div>

            {/* Status Indicator */}
            <motion.div
              className="absolute top-8 left-8 bg-deep-space/80 backdrop-blur-sm border border-satellite-cyan/30 rounded-lg p-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 3.2 }}
            >
              <div className="text-satellite-cyan font-orbitron text-sm font-bold">EARTH VIEW</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
