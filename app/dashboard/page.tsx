'use client'

import React, { useState, useRef, useId, useEffect } from 'react';
import { ChevronDown, Satellite, TrendingUp, Clock, AlertTriangle, CheckCircle, Activity, ChevronLeft, ChevronRight, Target, Zap, Radar, Shield, Database, Signal, Wifi } from 'lucide-react';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { LayoutTextFlip } from '@/components/ui/layout-text-flip';
import { Meteors } from '@/components/ui/meteors';

// Animation hook for staggered component rendering
const useStaggeredAnimation = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return isVisible;
};

// Enhanced Carousel Component with satellite selection
interface SlideData {
  title: string;
  button: string;
  src: string;
  satelliteId?: string;
  status?: string;
  lastUpdate?: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
  onSatelliteSelect?: (satelliteId: string) => void;
}

const Slide = ({ slide, index, current, handleSlideClick, onSatelliteSelect }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;
      const x = xRef.current;
      const y = yRef.current;
      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, button, title, satelliteId, status, lastUpdate } = slide;

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'active': return '#00FFAB';
      case 'warning': return '#FFD700';
      case 'error': return '#FF4C4C';
      default: return '#A0AEC0';
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (satelliteId && onSatelliteSelect) {
      onSatelliteSelect(satelliteId);
    }
  };

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-80 h-80 mx-4 z-10"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-lg overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-600 ease-in-out"
            style={{
              opacity: current === index ? 1 : 0.5,
            }}
            alt={title}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
          {current === index && (
            <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
          )}
        </div>

        <article
          className={`relative p-8 transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="flex items-center justify-center mb-2">
            <Satellite className="w-5 h-5 mr-2" style={{color: getStatusColor(status)}} />
            {status && (
              <div
                className="w-2 h-2 rounded-full"
                style={{backgroundColor: getStatusColor(status)}}
              />
            )}
          </div>
          <h2 className="text-lg md:text-2xl font-semibold relative mb-2 font-orbitron">
            {title}
          </h2>
          {satelliteId && (
            <div className="text-sm text-gray-300 mb-2">{satelliteId}</div>
          )}
          {lastUpdate && (
            <div className="text-xs text-gray-400 mb-4">Last update: {lastUpdate}</div>
          )}
          <div className="flex justify-center">
            <button 
              onClick={handleButtonClick}
              className="px-4 py-2 w-fit text-black bg-green-500 h-10 border border-transparent text-xs flex justify-center items-center rounded-xl hover:shadow-lg transition duration-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
            >
              {button}
            </button>
          </div>
        </article>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => {
  const IconComponent = type === "previous" ? ChevronLeft : ChevronRight;
  
  return (
    <button
      className="w-10 h-10 flex items-center mx-2 justify-center bg-gray-800 border border-gray-600 rounded-full focus:border-blue-500 focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200"
      title={title}
      onClick={handleClick}
    >
      <IconComponent className="text-gray-300 w-5 h-5" />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
  onSatelliteSelect?: (satelliteId: string) => void;
}

const Carousel = ({ slides, onSatelliteSelect }: CarouselProps) => {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    const previous = current - 1;
    const newIndex = previous < 0 ? slides.length - 1 : previous;
    setCurrent(newIndex);
    if (slides[newIndex]?.satelliteId && onSatelliteSelect) {
      onSatelliteSelect(slides[newIndex].satelliteId);
    }
  };

  const handleNextClick = () => {
    const next = current + 1;
    const newIndex = next >= slides.length ? 0 : next;
    setCurrent(newIndex);
    if (slides[newIndex]?.satelliteId && onSatelliteSelect) {
      onSatelliteSelect(slides[newIndex].satelliteId);
    }
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
      if (slides[index]?.satelliteId && onSatelliteSelect) {
        onSatelliteSelect(slides[index].satelliteId);
      }
    }
  };

  const id = useId();

  return (
    <div className="relative w-80 h-80 mx-auto" aria-labelledby={`carousel-heading-${id}`}>
      <ul
        className="absolute flex transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * (100 / slides.length)}%)`,
          width: `${slides.length * 100}%`,
        }}
      >
        {slides.map((slide, index) => (
          <div key={index} style={{ width: `${100 / slides.length}%` }}>
            <Slide
              slide={slide}
              index={index}
              current={current}
              handleSlideClick={handleSlideClick}
              onSatelliteSelect={onSatelliteSelect}
            />
          </div>
        ))}
      </ul>

      <div className="absolute flex justify-center w-full top-full m-4">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />
        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
};

// Main Dashboard Component
const IntegratedSatelliteDashboard = () => {
  const [selectedSatellite, setSelectedSatellite] = useState('SAT-001');
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // Animation states for each component with staggered delays
  const carouselVisible = useStaggeredAnimation(0);
  const systemHealthVisible = useStaggeredAnimation(800);
  const satelliteInfoVisible = useStaggeredAnimation(1200);
  const timelineVisible = useStaggeredAnimation(1600);
  const dualErrorVisible = useStaggeredAnimation(2000);
  const satelliteStatusVisible = useStaggeredAnimation(2400);
  const modelPerformanceVisible = useStaggeredAnimation(2800);
  const quickActionsVisible = useStaggeredAnimation(3200);
  const networkStatusVisible = useStaggeredAnimation(3600);
  
  // Mock satellite data
  const satellites = [
    { id: 'SAT-001', name: 'Starlink-15240', status: 'active', lastUpdate: '2 min ago' },
    { id: 'SAT-002', name: 'ISS Module-7', status: 'warning', lastUpdate: '5 min ago' },
    { id: 'SAT-003', name: 'Hubble-Main', status: 'active', lastUpdate: '1 min ago' },
    { id: 'SAT-004', name: 'GPS-IIF-12', status: 'error', lastUpdate: '8 min ago' },
  ];

  // Create carousel data from satellites with sample images
  const satelliteImages = [
    "/starlink.webp",
    "/iss-module.jpg",
    "/hubble-main.webp",
    "/gps.jpg",
  ];

  const satelliteSlides = satellites.map((satellite, index) => ({
    title: satellite.name,
    button: `Selected`,
    src: satelliteImages[index % satelliteImages.length],
    satelliteId: satellite.id,
    status: satellite.status,
    lastUpdate: satellite.lastUpdate
  }));
  
  // Generate enhanced prediction data
  const generatePredictionData = (satelliteId: string) => {
    const data = [];
    const now = new Date();
    const totalPredictions = 48; // 24 hours at 30-minute intervals
    
    for (let i = 0; i < totalPredictions; i++) {
      const time = new Date(now.getTime() + i * 30 * 60 * 1000);
      
      // Generate realistic satellite error values with some variation based on satellite ID
      const satelliteVariation = selectedSatellite === 'SAT-004' ? 1.5 : 1.0; // Error satellite has higher errors
      const clockError = (0.08 + Math.sin(i * 0.3) * 0.04) * satelliteVariation;
      const ephemerisError = (0.15 + Math.cos(i * 0.2) * 0.08) * satelliteVariation;
      const combinedError = (clockError * 30 + ephemerisError) * (1 + i * 0.01);
      
      data.push({
        timestamp_offset_minutes: i * 30,
        time,
        clock_error: parseFloat(clockError.toFixed(3)),
        ephemeris_error: parseFloat(ephemerisError.toFixed(2)),
        combined_error_m: parseFloat(combinedError.toFixed(1)),
        errorLevel: combinedError < 50 ? 'low' : combinedError < 150 ? 'medium' : 'high'
      });
    }
    
    return {
      satellite_id: satelliteId,
      prediction_horizon_hours: 24,
      total_predictions: totalPredictions,
      predictions: data,
      model_confidence: {
        clock_error_std: '0.05μs',
        ephemeris_error_std: '0.12m',
        prediction_stability: selectedSatellite === 'SAT-004' ? 0.72 : 0.89
      }
    };
  };
  
  const [predictionData, setPredictionData] = useState(() => 
    generatePredictionData('SAT-001')
  );
  
  // Update prediction data when satellite changes
  useEffect(() => {
    setPredictionData(generatePredictionData(selectedSatellite));
  }, [selectedSatellite]);

  // Animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'active': return '#00FFAB';
      case 'warning': return '#FFD700';
      case 'error': return '#FF4C4C';
      default: return '#A0AEC0';
    }
  };
  
  const getErrorColor = (level: string) => {
    switch (level) {
      case 'low': return '#00FFAB';
      case 'medium': return '#FFD700';
      case 'high': return '#FF4C4C';
      default: return '#A0AEC0';
    }
  };
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };
  
  const currentSatellite = satellites.find(sat => sat.id === selectedSatellite);
  const maxError = Math.max(...predictionData.predictions.map(p => p.combined_error_m));
  const avgError = predictionData.predictions.reduce((sum, p) => sum + p.combined_error_m, 0) / predictionData.predictions.length;

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #0A192F 0%, #1a2844 50%, #0A192F 100%) font-orbitron'}}>
      {/* Animated background elements */}
      <AuroraBackground className="relative">
        <div className="relative w-full py-6">
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-1 h-1 bg-cyan-300 rounded-full opacity-40 animate-ping"></div>
            <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-400 rounded-full opacity-30 animate-ping"></div>
          </div>

          {/* Satellite Fleet Carousel with Meteors Background */}
          {carouselVisible && (
            <div className="relative w-full mb-0 bg-gray-900/40 backdrop-blur-sm pt-8 pb-16 overflow-hidden animate-fade-in-up">
              <Meteors number={20} className="pointer-events-none" />

              <div className="max-w-7xl mx-auto px-6 mb-6 relative z-10">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Activity
                    className="w-8 h-8 mr-3 flex-shrink-0"
                    style={{ color: "#6C63FF" }}
                  />
                  <div className="relative flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:items-baseline font-orbitron">
                    <LayoutTextFlip
                      text="Satellite "
                      words={["Fleet", "Armada", "Squadron", "Flotilla"]}
                    />
                  </div>
                </h2>
              </div>

              <div className="flex justify-center relative z-10">
                <Carousel 
                  slides={satelliteSlides} 
                  onSatelliteSelect={setSelectedSatellite}
                />
              </div>
            </div>
          )}
          <div className='px-6'>
      
            {/* System Health (Moved to Top, Full Width, Thin) */}
            {systemHealthVisible && (
              <div className="bg-transparent backdrop-blur-2xl rounded-2xl border border-[#6C63FF]/30 p-3 shadow-lg shadow-[#6C63FF]/10 mb-4 mt-5 hover:border-[#6C63FF]/50 transition-all duration-150 hover:bg-black/40 animate-fade-in-up">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2 font-orbitron">
                  <Activity className="w-4 h-4 text-[#00C9FF]" />
                  System Health
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { name: "Prediction Engine", status: "Online", color: "#00FFAB", icon: CheckCircle },
                    { name: "Data Pipeline", status: "Streaming", color: "#00FFAB", icon: CheckCircle },
                    { name: "Alert System", status: "Monitoring", color: "#FFD700", icon: AlertTriangle },
                    { name: "ML Models", status: "Trained", color: "#00FFAB", icon: CheckCircle },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm text-[#A0AEC0]">
                      <span>{item.name}</span>
                      <div className="flex items-center gap-1">
                        <item.icon className="w-3 h-3" style={{ color: item.color }} />
                        <span className="font-medium" style={{ color: item.color }}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Main Dashboard Content */}
              <div className="xl:col-span-3 space-y-6">
                {/* Satellite Info Header */}
                {satelliteInfoVisible && (
                  <div className="bg-transparent backdrop-blur-2xl rounded-2xl border border-[#6C63FF]/30 p-6 shadow-lg shadow-[#6C63FF]/10 hover:border-[#6C63FF]/50 transition-all duration-150 hover:bg-black/40 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                          <Target className="w-6 h-6 text-[#00C9FF]" />
                          <div>
                            <h2 className="text-xl font-bold text-white font-orbitron">{currentSatellite?.name}</h2>
                            <p className="text-[#A0AEC0] text-sm">{currentSatellite?.id} • GPS Constellation</p>
                          </div>
                        </div>
                        <div className="h-8 w-px bg-[#6C63FF]/30"></div>
                        <div className="grid grid-cols-3 gap-6 text-center">
                          <div>
                            <div className="text-2xl font-bold text-[#00FFAB]">{avgError.toFixed(1)}m</div>
                            <div className="text-xs text-[#A0AEC0]">Avg Error</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-[#FFD700]">{maxError.toFixed(1)}m</div>
                            <div className="text-xs text-[#A0AEC0]">Max Error</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-[#6C63FF]">{predictionData.predictions.filter(p => p.errorLevel === 'high').length}</div>
                            <div className="text-xs text-[#A0AEC0]">Risk Points</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Timeline Forecast */}
                {timelineVisible && (
                  <div className="bg-transparent backdrop-blur-2xl rounded-2xl border border-[#6C63FF]/30 p-6 shadow-lg shadow-[#6C63FF]/10 hover:border-[#6C63FF]/50 transition-all duration-150 hover:bg-black/40 animate-fade-in-up">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2 font-orbitron">
                        <TrendingUp className="w-6 h-6 text-[#00C9FF]" />
                        24-Hour Error Prediction Timeline
                      </h2>
                      <div className="flex items-center space-x-2">
                        <div className="px-3 py-1 rounded-lg bg-[#6C63FF]/10 border border-[#6C63FF]/30">
                          <span className="text-[#6C63FF] text-sm font-medium">
                            {predictionData.total_predictions} Predictions
                          </span>
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-[#00C9FF]/10 border border-[#00C9FF]/30">
                          <span className="text-[#00C9FF] text-sm font-medium">
                            {predictionData.prediction_horizon_hours}h Horizon
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fixed Timeline Strip with better alignment */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-[#0A192F]/30 via-[#6C63FF]/5 to-[#0A192F]/30 rounded-lg p-4">
                      <div className="flex space-x-1 overflow-x-auto pb-4 scrollbar-thin min-h-[180px]" style={{ scrollbarGutter: 'stable' }}>
                        {predictionData.predictions.map((point, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center relative flex-shrink-0 min-w-[60px] group cursor-pointer hover:bg-[#6C63FF]/30 rounded-lg p-2 transition-all duration-100"
                          >
                            {/* Time Label - Fixed at top */}
                            <div className="text-xs text-[#A0AEC0] mb-2 font-mono h-4 flex items-center">
                              {formatTime(point.timestamp_offset_minutes)}
                            </div>

                            {/* Bar Container - Fixed height for alignment */}
                            <div className="relative w-12 h-24 flex items-end justify-center">
                              <div
                                className="w-full rounded-lg transition-all duration-500 shadow-lg group-hover:shadow-xl"
                                style={{
                                  backgroundColor: getErrorColor(point.errorLevel),
                                  height: `${Math.max(8, Math.min(100, (point.combined_error_m / 300) * 100))}%`,
                                  boxShadow: `0 0 20px ${getErrorColor(point.errorLevel)}30`,
                                  opacity: 0.9,
                                  transformOrigin: "bottom",
                                  transform: "scaleY(1)",
                                }}
                              ></div>
                            </div>

                            {/* Value Label - Fixed at bottom */}
                            <div className="text-xs text-[#A0AEC0] mt-2 font-mono h-4 flex items-center">
                              {point.combined_error_m}m
                            </div>

                            {/* Enhanced Hover Tooltip */}
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 pointer-events-none">
                              <div className="bg-[#0A192F]/95 backdrop-blur-sm text-white text-xs rounded-xl px-4 py-3 whitespace-nowrap border border-[#6C63FF]/40 shadow-2xl">
                                <div className="font-bold mb-2 text-[#00C9FF]">Error Analysis</div>
                                <div className="space-y-1">
                                  <div className="flex justify-between gap-4">
                                    <span className="text-[#A0AEC0]">Combined:</span>
                                    <span className="font-mono text-white">
                                      {point.combined_error_m}m
                                    </span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-[#A0AEC0]">Clock:</span>
                                    <span className="font-mono text-[#00C9FF]">
                                      {point.clock_error}μs
                                    </span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-[#A0AEC0]">Ephemeris:</span>
                                    <span className="font-mono text-[#FFD700]">
                                      {point.ephemeris_error}m
                                    </span>
                                  </div>
                                  <div className="pt-1 border-t border-[#6C63FF]/30">
                                    <div className="text-[#A0AEC0] text-center">
                                      {point.time.toLocaleTimeString()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Enhanced Legend */}
                      <div className="flex justify-center items-center space-x-8 mt-6 p-3 bg-[#6C63FF]/5 rounded-xl border border-[#6C63FF]/20">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full shadow-md border border-[#00FFAB]/30"
                            style={{ backgroundColor: '#00FFAB', boxShadow: "0 0 8px #00FFAB40" }}
                          ></div>
                          <span className="text-[#A0AEC0] text-sm">Low Risk (&lt;50m)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full shadow-md border border-[#FFD700]/30"
                            style={{ backgroundColor: '#FFD700', boxShadow: "0 0 8px #FFD70040" }}
                          ></div>
                          <span className="text-[#A0AEC0] text-sm">Medium Risk (50-150m)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full shadow-md border border-[#FF4C4C]/30"
                            style={{ backgroundColor: '#FF4C4C', boxShadow: "0 0 8px #FF4C4C40" }}
                          ></div>
                          <span className="text-[#A0AEC0] text-sm">High Risk (&gt;150m)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Dual Error Component Chart */}
                {dualErrorVisible && (
                  <div className="bg-transparent backdrop-blur-2xl rounded-2xl border border-[#6C63FF]/30 p-6 shadow-lg shadow-[#6C63FF]/10 hover:border-[#6C63FF]/50 transition-all duration-150 hover:bg-black/40 pr-5 animate-fade-in-up">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center font-orbitron">
                      <Clock className="w-6 h-6 mr-3 text-[#FFD700]" />
                      Dual Error Component Analysis
                    </h3>
                    <div className="relative bg-gradient-to-br from-[#6C63FF]/5 to-[#00C9FF]/5 rounded-xl p-6 border border-[#6C63FF]/20 hover:border-[#6C63FF]/40 transition-all duration-300">
                      <div className="h-64 relative">
                        <svg className="w-full h-full" viewBox="0 0 800 200">
                          <defs>
                            <linearGradient id="clockGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#00C9FF" stopOpacity="0.8"/>
                              <stop offset="100%" stopColor="#00C9FF" stopOpacity="0.1"/>
                            </linearGradient>
                            <linearGradient id="ephemerisGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8"/>
                              <stop offset="100%" stopColor="#FFD700" stopOpacity="0.1"/>
                            </linearGradient>
                            <filter id="glow">
                              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                              <feMerge> 
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </defs>
                          
                          {/* Grid lines */}
                          {[0, 25, 50, 75, 100].map(y => (
                            <line 
                              key={y} 
                              x1="0" 
                              y1={y * 2} 
                              x2="800" 
                              y2={y * 2} 
                              stroke="#6C63FF" 
                              strokeOpacity="0.15" 
                              strokeWidth="1"
                              strokeDasharray="5,5"
                            />
                          ))}
                          
                          {/* Vertical grid lines */}
                          {[0, 20, 40, 60, 80, 100].map(x => (
                            <line 
                              key={x} 
                              x1={x * 8} 
                              y1="0" 
                              x2={x * 8} 
                              y2="200" 
                              stroke="#6C63FF" 
                              strokeOpacity="0.1" 
                              strokeWidth="1"
                              strokeDasharray="3,3"
                            />
                          ))}
                          
                          {/* Clock Error Area */}
                          <path
                            d={`M 0,200 ${predictionData.predictions.map((point, index) => 
                              `L ${(index / (predictionData.predictions.length - 1)) * 800},${200 - (point.clock_error / 0.25) * 120}`
                            ).join(' ')} L 800,200 Z`}
                            fill="url(#clockGradient)"
                            opacity="0.7"
                          />
                          
                          {/* Ephemeris Error Area */}
                          <path
                            d={`M 0,200 ${predictionData.predictions.map((point, index) => 
                              `L ${(index / (predictionData.predictions.length - 1)) * 800},${200 - (point.ephemeris_error / 0.6) * 100}`
                            ).join(' ')} L 800,200 Z`}
                            fill="url(#ephemerisGradient)"
                            opacity="0.6"
                          />
                          
                          {/* Clock Error Line */}
                          <path
                            d={`M 0,${200 - (predictionData.predictions[0].clock_error / 0.25) * 120} ${predictionData.predictions.map((point, index) => 
                              `L ${(index / (predictionData.predictions.length - 1)) * 800},${200 - (point.clock_error / 0.25) * 120}`
                            ).join(' ')}`}
                            stroke="#00C9FF"
                            strokeWidth="3"
                            fill="none"
                            filter="url(#glow)"
                          />
                          
                          {/* Ephemeris Error Line */}
                          <path
                            d={`M 0,${200 - (predictionData.predictions[0].ephemeris_error / 0.6) * 100} ${predictionData.predictions.map((point, index) => 
                              `L ${(index / (predictionData.predictions.length - 1)) * 800},${200 - (point.ephemeris_error / 0.6) * 100}`
                            ).join(' ')}`}
                            stroke="#FFD700"
                            strokeWidth="3"
                            fill="none"
                            filter="url(#glow)"
                          />
                          
                          {/* Interactive hover points */}
                          {predictionData.predictions.map((point, index) => (
                            <g key={index}>
                              <circle
                                cx={(index / (predictionData.predictions.length - 1)) * 800}
                                cy={200 - (point.clock_error / 0.25) * 120}
                                r="4"
                                fill="#00C9FF"
                                opacity="0"
                                className="hover:opacity-100 transition-opacity duration-200"
                              />
                              <circle
                                cx={(index / (predictionData.predictions.length - 1)) * 800}
                                cy={200 - (point.ephemeris_error / 0.6) * 100}
                                r="4"
                                fill="#FFD700"
                                opacity="0"
                                className="hover:opacity-100 transition-opacity duration-200"
                              />
                            </g>
                          ))}
                        </svg>
                        
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#A0AEC0] -ml-12 py-2">
                          <span>0.25μs</span>
                          <span>0.20μs</span>
                          <span>0.15μs</span>
                          <span>0.10μs</span>
                          <span>0.05μs</span>
                          <span>0.00μs</span>
                        </div>
                        
                        {/* X-axis labels */}
                        <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-[#A0AEC0] -mb-8 px-2">
                          <span>Now</span>
                          <span>6h</span>
                          <span>12h</span>
                          <span>18h</span>
                          <span>24h</span>
                        </div>
                      </div>
                      
                      {/* Enhanced Chart Legend with hover effects */}
                      <div className="flex justify-center items-center space-x-8 mt-8 p-3 bg-[#6C63FF]/10 rounded-lg border border-[#6C63FF]/20">
                        <div className="flex items-center space-x-3 hover:bg-[#00C9FF]/10 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer">
                          <div className="w-4 h-4 bg-[#00C9FF] rounded-full opacity-80 shadow-lg" style={{boxShadow: '0 0 10px #00C9FF50'}}></div>
                          <span className="text-[#00C9FF] text-sm font-medium">Clock Error (μs)</span>
                        </div>
                        <div className="w-px h-6 bg-[#6C63FF]/30"></div>
                        <div className="flex items-center space-x-3 hover:bg-[#FFD700]/10 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer">
                          <div className="w-4 h-4 bg-[#FFD700] rounded-full opacity-80 shadow-lg" style={{boxShadow: '0 0 10px #FFD70050'}}></div>
                          <span className="text-[#FFD700] text-sm font-medium">Ephemeris Error (m)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                {/* Satellite Status Panel */}
                {satelliteStatusVisible && (
                  <div className="bg-transparent backdrop-blur-2xl rounded-2xl border border-[#6C63FF]/30 p-6 shadow-lg shadow-[#6C63FF]/10 hover:border-[#6C63FF]/50 transition-all duration-150 hover:bg-black/40 animate-fade-in-up">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center font-orbitron">
                      <Satellite className="w-5 h-5 mr-2 text-[#6C63FF]" />
                      Satellite Status
                    </h3>
                    <div className="space-y-3">
                      {satellites.map((satellite) => (
                        <div
                          key={satellite.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                            selectedSatellite === satellite.id
                              ? 'bg-[#6C63FF]/20 border-[#6C63FF]/50'
                              : 'bg-[#0A192F]/30 border-[#6C63FF]/20 hover:border-[#6C63FF]/40'
                          }`}
                          onClick={() => setSelectedSatellite(satellite.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium text-sm">{satellite.name}</span>
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: getStatusColor(satellite.status) }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-[#A0AEC0]">
                            <span>{satellite.id}</span>
                            <span>{satellite.lastUpdate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Model Performance */}
                {modelPerformanceVisible && (
                  <div className="bg-transparent backdrop-blur-2xl rounded-2xl border border-[#6C63FF]/30 p-6 shadow-lg shadow-[#6C63FF]/10 hover:border-[#6C63FF]/50 transition-all duration-150 hover:bg-black/40 animate-fade-in-up">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center font-orbitron">
                      <Zap className="w-5 h-5 mr-2 text-[#FFD700]" />
                      Model Performance
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[#A0AEC0] text-sm">Prediction Stability</span>
                        <span className="text-[#00FFAB] font-mono text-sm">
                          {(predictionData.model_confidence.prediction_stability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-[#0A192F]/50 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${predictionData.model_confidence.prediction_stability * 100}%`,
                            backgroundColor: predictionData.model_confidence.prediction_stability > 0.8 ? '#00FFAB' : '#FFD700'
                          }}
                        />
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#A0AEC0]">Clock Std Dev:</span>
                          <span className="text-[#00C9FF] font-mono">{predictionData.model_confidence.clock_error_std}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#A0AEC0]">Ephemeris Std Dev:</span>
                          <span className="text-[#FFD700] font-mono">{predictionData.model_confidence.ephemeris_error_std}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                {quickActionsVisible && (
                  <div className="bg-transparent backdrop-blur-2xl rounded-2xl border border-[#6C63FF]/30 p-6 shadow-lg shadow-[#6C63FF]/10 hover:border-[#6C63FF]/50 transition-all duration-150 hover:bg-black/40 animate-fade-in-up">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center font-orbitron">
                      <Shield className="w-5 h-5 mr-2 text-[#00FFAB]" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full px-4 py-2 bg-[#6C63FF]/20 hover:bg-[#6C63FF]/30 border border-[#6C63FF]/40 text-[#6C63FF] rounded-lg transition-all duration-200 text-sm font-medium">
                        Export Predictions
                      </button>
                      <button className="w-full px-4 py-2 bg-[#00C9FF]/20 hover:bg-[#00C9FF]/30 border border-[#00C9FF]/40 text-[#00C9FF] rounded-lg transition-all duration-200 text-sm font-medium">
                        Generate Report
                      </button>
                      <button className="w-full px-4 py-2 bg-[#FFD700]/20 hover:bg-[#FFD700]/30 border border-[#FFD700]/40 text-[#FFD700] rounded-lg transition-all duration-200 text-sm font-medium">
                        Set Alert Threshold
                      </button>
                    </div>
                  </div>
                )}

                {/* Network Status */}
                {networkStatusVisible && (
                  <div className="bg-transparent backdrop-blur-2xl rounded-2xl border border-[#6C63FF]/30 p-6 shadow-lg shadow-[#6C63FF]/10 hover:border-[#6C63FF]/50 transition-all duration-150 hover:bg-black/40 animate-fade-in-up">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center font-orbitron">
                      <Wifi className="w-5 h-5 mr-2 text-[#00C9FF]" />
                      Network Status
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: "Ground Stations", count: 12, status: "active", icon: Radar },
                        { name: "Data Links", count: 8, status: "active", icon: Signal },
                        { name: "Processing Nodes", count: 4, status: "active", icon: Database },
                      ].map((item) => (
                        <div key={item.name} className="flex items-center justify-between p-2 bg-[#0A192F]/20 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <item.icon className="w-4 h-4 text-[#00FFAB]" />
                            <span className="text-white text-sm">{item.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[#A0AEC0] text-xs">{item.count}</span>
                            <div className="w-2 h-2 bg-[#00FFAB] rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AuroraBackground>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </div>
  );
};

export default IntegratedSatelliteDashboard;