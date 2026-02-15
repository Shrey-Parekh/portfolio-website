import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "framer-motion";

// macOS-style Typing Animation Component
const TypingAnimation: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const words = [
    "Web Development",
    "Vibe Coding",
    "Tech Enthusiast",
    "AI/ML",
    "Rest Development",
    "Software Development",
    "Web Dev",
  ];

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    const shouldDelete = isDeleting;

    const timeout = setTimeout(
      () => {
        if (!shouldDelete) {
          // Typing
          if (currentText.length < currentWord.length) {
            setCurrentText(currentWord.slice(0, currentText.length + 1));
          } else {
            // Pause before deleting
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          // Deleting
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      shouldDelete ? 50 : 100
    ); // Faster deletion, slower typing

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530); // macOS-like cursor blink rate

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1,
        delay: 1.4,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="mb-12 relative"
    >
      <div className="flex items-center justify-center">
        <motion.span
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal"
          style={{
            fontFamily:
              '".SF NS Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
            fontWeight: 400,
            color: "rgba(255, 255, 255, 0.9)",
            textShadow: "0 2px 15px rgba(0, 0, 0, 0.3)",
            letterSpacing: "0.01em",
            minHeight: "1.2em",
          }}
        >
          {currentText}
        </motion.span>
        <motion.span
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal ml-1"
          style={{
            fontFamily:
              '".SF NS Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
            color: "#007AFF",
            opacity: showCursor ? 1 : 0,
          }}
          animate={{
            opacity: showCursor ? [1, 1, 0, 0] : [0, 0, 1, 1],
          }}
          transition={{
            duration: 1.06,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          |
        </motion.span>
      </div>

      {/* Terminal-like background */}
      <motion.div
        className="absolute inset-0 -m-4 rounded-lg opacity-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(30, 41, 59, 0.2) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
        animate={{
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

// Minimalistic Interactive Background Component
interface Hero3DProps {
  isDarkMode: boolean;
}

const Hero3D: React.FC<Hero3DProps> = ({ isDarkMode }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const prefersReducedMotion = useReducedMotion();

  // Motion values for smooth animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [-5, 5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  // Throttle mouse movement for better performance
  const throttleTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current && window.innerWidth > 768 && !prefersReducedMotion) {
        // Throttle mouse updates to every 50ms
        if (throttleTimeout.current) return;
        
        throttleTimeout.current = setTimeout(() => {
          const rect = containerRef.current!.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          const normalizedX = x - 0.5;
          const normalizedY = y - 0.5;

          setMousePosition({ x: normalizedX, y: normalizedY });
          mouseX.set(normalizedX);
          mouseY.set(normalizedY);
          
          throttleTimeout.current = undefined;
        }, 50);
      }
    };

    const handleScroll = () => {
      // Only update scroll on desktop
      if (window.innerWidth > 768) {
        setScrollY(window.scrollY);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("scroll", handleScroll);
        if (throttleTimeout.current) {
          clearTimeout(throttleTimeout.current);
        }
      };
    }
  }, [mouseX, mouseY, prefersReducedMotion]);

  // Enhanced entrance animation
  useEffect(() => {
    controls.start({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
      },
    });
  }, [controls]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={controls}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Enhanced Animated Gradient Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isHovered
            ? `radial-gradient(circle at ${50 + mousePosition.x * 25}% ${
                50 + mousePosition.y * 25
              }%, rgba(0, 122, 255, 0.18) 0%, rgba(88, 86, 214, 0.12) 25%, rgba(175, 82, 222, 0.08) 50%, rgba(255, 45, 146, 0.04) 75%, transparent 90%)`
            : `radial-gradient(circle at 50% 50%, rgba(0, 122, 255, 0.1) 0%, rgba(88, 86, 214, 0.06) 35%, rgba(175, 82, 222, 0.03) 65%, transparent 85%)`,
        }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* Additional Gradient Layer for Depth */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isHovered
            ? `conic-gradient(from ${mousePosition.x * 180}deg at ${
                50 + mousePosition.x * 15
              }% ${
                50 + mousePosition.y * 15
              }%, rgba(0, 122, 255, 0.05) 0deg, rgba(88, 86, 214, 0.03) 120deg, rgba(175, 82, 222, 0.02) 240deg, rgba(0, 122, 255, 0.05) 360deg)`
            : "conic-gradient(from 0deg at 50% 50%, rgba(0, 122, 255, 0.02) 0deg, rgba(88, 86, 214, 0.01) 120deg, rgba(175, 82, 222, 0.01) 240deg, rgba(0, 122, 255, 0.02) 360deg)",
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Enhanced Geometric Grid Pattern */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: isHovered ? 0.4 : 0.25,
        }}
        transition={{ duration: 0.8 }}
        style={{
          transform: `translate(${mousePosition.x * 5}px, ${
            mousePosition.y * 5
          }px)`,
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <motion.path
                d="M 8 0 L 0 0 0 8"
                fill="none"
                stroke="rgba(0, 122, 255, 0.15)"
                strokeWidth="0.08"
                animate={{
                  strokeWidth: isHovered ? "0.12" : "0.08",
                  stroke: isHovered
                    ? "rgba(0, 122, 255, 0.2)"
                    : "rgba(0, 122, 255, 0.15)",
                }}
                transition={{ duration: 0.6 }}
              />
            </pattern>
            <pattern
              id="dots"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <motion.circle
                cx="10"
                cy="10"
                r="0.5"
                fill="rgba(88, 86, 214, 0.1)"
                animate={{
                  r: isHovered ? "0.8" : "0.5",
                  fill: isHovered
                    ? "rgba(88, 86, 214, 0.15)"
                    : "rgba(88, 86, 214, 0.1)",
                }}
                transition={{ duration: 0.6 }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#dots)" opacity="0.6" />
        </svg>
      </motion.div>

      {/* Interactive Floating Elements */}
      <div className="absolute inset-0">
        {/* Enhanced Large Central Element */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-3xl"
          style={{
            background: isHovered
              ? "linear-gradient(135deg, rgba(0, 122, 255, 0.15) 0%, rgba(88, 86, 214, 0.12) 50%, rgba(175, 82, 222, 0.08) 100%)"
              : "linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(88, 86, 214, 0.08) 100%)",
            backdropFilter: "blur(25px)",
            WebkitBackdropFilter: "blur(25px)",
            border: isHovered
              ? "1px solid rgba(0, 122, 255, 0.3)"
              : "1px solid rgba(0, 122, 255, 0.2)",
            boxShadow: isHovered
              ? "0 12px 48px rgba(0, 122, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
              : "0 8px 32px rgba(0, 122, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            rotateX: rotateX,
            rotateY: rotateY,
          }}
          animate={{
            x: mousePosition.x * 35 - 48,
            y: mousePosition.y * 35 - 48,
            scale: isHovered ? [1.08, 1.12, 1.08] : [1, 1.02, 1],
            rotate: mousePosition.x * 2,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 25,
            mass: 0.8,
          }}
        >
          {/* Inner glow effect */}
          <motion.div
            className="absolute inset-2 rounded-2xl"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
              opacity: isHovered ? 1 : 0.6,
            }}
            animate={{
              opacity: isHovered ? 1 : 0.6,
            }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>

        {/* Enhanced Smaller Accent Elements */}
        {[...Array(prefersReducedMotion ? 3 : 6)].map((_, i) => {
          const angle = (i * Math.PI * 2) / (prefersReducedMotion ? 3 : 6);
          const radius = 140 + Math.sin(i) * 20;
          const colors = [
            "rgba(0, 122, 255, 0.08)",
            "rgba(88, 86, 214, 0.08)",
            "rgba(175, 82, 222, 0.08)",
            "rgba(255, 45, 146, 0.08)",
            "rgba(0, 122, 255, 0.08)",
            "rgba(88, 86, 214, 0.08)",
          ];
          return (
            <motion.div
              key={i}
              className="absolute w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-2xl"
              style={{
                background: isHovered ? colors[i] : "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: `1px solid ${colors[i]}`,
                left: "50%",
                top: "50%",
                boxShadow: isHovered
                  ? `0 4px 20px ${colors[i]}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                  : `0 2px 12px ${colors[i]}`,
                willChange: prefersReducedMotion ? 'auto' : 'transform',
              }}
              animate={{
                x:
                  Math.cos(angle + mousePosition.x * 0.5) * radius +
                  mousePosition.x * 25 -
                  20,
                y:
                  Math.sin(angle + mousePosition.y * 0.5) * radius +
                  mousePosition.y * 25 -
                  20,
                rotate: mousePosition.x * 8 + mousePosition.y * 8 + i * 60,
                scale: isHovered ? 1.15 : 1,
                opacity: isHovered ? 0.9 : 0.7,
              }}
              whileHover={{
                scale: 1.25,
              }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 28,
                delay: i * 0.08,
              }}
            >
              {/* Inner highlight */}
              <motion.div
                className="absolute inset-1 rounded-xl"
                style={{
                  background: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`,
                }}
                animate={{
                  opacity: isHovered ? 1 : 0.5,
                }}
              />
            </motion.div>
          );
        })}

        {/* Enhanced Corner Accents with Morphing */}
        {[
          {
            position: "top-8 left-8",
            delay: 0,
            color: "rgba(0, 122, 255, 0.12)",
          },
          {
            position: "top-8 right-8",
            delay: 0.15,
            color: "rgba(88, 86, 214, 0.12)",
          },
          {
            position: "bottom-8 left-8",
            delay: 0.3,
            color: "rgba(175, 82, 222, 0.12)",
          },
          {
            position: "bottom-8 right-8",
            delay: 0.45,
            color: "rgba(255, 45, 146, 0.12)",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className={`absolute w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 ${item.position}`}
            style={{
              background: isHovered ? item.color : "rgba(0, 122, 255, 0.08)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: `1px solid ${item.color}`,
              borderRadius: isHovered ? "50%" : "12px",
              boxShadow: isHovered
                ? `0 4px 16px ${item.color}`
                : `0 2px 8px rgba(0, 122, 255, 0.1)`,
            }}
            animate={{
              scale: isHovered ? 1.3 : 1,
              rotate: mousePosition.x * 15 + mousePosition.y * 15 + i * 90,
              opacity: isHovered ? 1 : 0.8,
              borderRadius: isHovered ? "50%" : "12px",
            }}
            whileHover={{
              scale: 1.5,
            }}
            transition={{
              delay: item.delay,
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Pulsing inner light */}
            <motion.div
              className="absolute inset-1 rounded-full"
              style={{
                background: `radial-gradient(circle, ${item.color} 0%, transparent 70%)`,
              }}
              animate={{
                scale: isHovered ? [1, 1.2, 1] : 1,
                opacity: isHovered ? [0.5, 1, 0.5] : 0.3,
              }}
              transition={{
                duration: 2,
                repeat: isHovered ? Infinity : 0,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Enhanced Animated Lines with Multiple Layers */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Primary flowing lines */}
          <motion.path
            d="M0,50 Q25,30 50,50 T100,50"
            fill="none"
            stroke="rgba(0, 122, 255, 0.25)"
            strokeWidth="0.12"
            strokeLinecap="round"
            animate={{
              d: isHovered
                ? `M0,50 Q25,${30 + mousePosition.y * 12} 50,${
                    50 + mousePosition.x * 6
                  } T100,50`
                : "M0,50 Q25,30 50,50 T100,50",
              strokeWidth: isHovered ? "0.18" : "0.12",
            }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d="M50,0 Q30,25 50,50 T50,100"
            fill="none"
            stroke="rgba(88, 86, 214, 0.25)"
            strokeWidth="0.12"
            strokeLinecap="round"
            animate={{
              d: isHovered
                ? `M50,0 Q${30 + mousePosition.x * 12},25 ${
                    50 + mousePosition.y * 6
                  },50 T50,100`
                : "M50,0 Q30,25 50,50 T50,100",
              strokeWidth: isHovered ? "0.18" : "0.12",
            }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Secondary diagonal lines */}
          <motion.path
            d="M0,0 Q50,25 100,100"
            fill="none"
            stroke="rgba(175, 82, 222, 0.15)"
            strokeWidth="0.08"
            strokeLinecap="round"
            animate={{
              d: isHovered
                ? `M0,0 Q${50 + mousePosition.x * 8},${
                    25 + mousePosition.y * 8
                  } 100,100`
                : "M0,0 Q50,25 100,100",
              opacity: isHovered ? 1 : 0.6,
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.path
            d="M100,0 Q50,75 0,100"
            fill="none"
            stroke="rgba(255, 45, 146, 0.15)"
            strokeWidth="0.08"
            strokeLinecap="round"
            animate={{
              d: isHovered
                ? `M100,0 Q${50 - mousePosition.x * 8},${
                    75 - mousePosition.y * 8
                  } 0,100`
                : "M100,0 Q50,75 0,100",
              opacity: isHovered ? 1 : 0.6,
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      </div>

      {/* Enhanced Multi-Layer Ambient Light Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${
            50 + mousePosition.x * 35
          }% ${
            50 + mousePosition.y * 35
          }%, rgba(0, 122, 255, 0.08) 0%, rgba(88, 86, 214, 0.04) 30%, transparent 60%)`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.8 }}
      />

      {/* Secondary light layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at ${
            50 - mousePosition.x * 20
          }% ${
            50 - mousePosition.y * 20
          }%, rgba(175, 82, 222, 0.04) 0%, transparent 40%)`,
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0.5,
        }}
        transition={{ duration: 1 }}
      />

      {/* Floating light particles */}
      {isHovered && !prefersReducedMotion &&
        [...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: `rgba(${
                i % 2 === 0 ? "0, 122, 255" : "88, 86, 214"
              }, 0.6)`,
              left: `${20 + i * 15}%`,
              top: `${30 + i * 8}%`,
              boxShadow: `0 0 8px rgba(${
                i % 2 === 0 ? "0, 122, 255" : "88, 86, 214"
              }, 0.8)`,
              willChange: 'transform, opacity',
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i) * 15, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}

      {/* Hero Content - Exact Match to Original Design */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="text-center px-6 sm:px-8 md:px-12 lg:px-16 max-w-5xl mx-auto">
          {/* Shrey Parekh */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            transition={{
              duration: 1.8,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mb-8 relative perspective-1000 group"
          >
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light leading-none tracking-tight relative pointer-events-auto cursor-pointer"
              style={{
                fontFamily:
                  '".SF NS Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
                fontWeight: 200,
                letterSpacing: "-0.04em",
                color: "#FFFFFF",
              }}
              whileHover={{
                scale: 1.05,
                y: -8,
                letterSpacing: "0.01em",
                textShadow:
                  "0 8px 32px rgba(255, 255, 255, 0.3), 0 0 60px rgba(139, 92, 246, 0.2)",
                transition: {
                  duration: 0.4,
                  ease: [0.34, 1.56, 0.64, 1],
                },
              }}
            >
              Shrey Parekh
            </motion.h1>

            {/* Animated gradient underline */}
            <motion.div
              className="absolute -bottom-3 left-1/2 h-1 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #8B5CF6, #3B82F6, #06B6D4, transparent)",
                backgroundSize: "200% 100%",
              }}
              initial={{ width: 0, x: "-50%", opacity: 0 }}
              whileHover={{
                width: "70%",
                opacity: 1,
                backgroundPosition: ["0% 50%", "100% 50%"],
              }}
              transition={{
                width: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
                opacity: { duration: 0.3 },
                backgroundPosition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            />

            {/* Subtle glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 100% 50%, rgba(139, 92, 246, 0.15), transparent)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.2 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>

          {/* Portfolio */}
          <motion.div
            initial={{ opacity: 0, y: 80, rotateY: -15, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
            transition={{
              duration: 1.6,
              delay: 1.0,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mb-16 relative perspective-1000 group"
          >
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-none tracking-tight pointer-events-auto cursor-pointer"
              style={{
                fontFamily:
                  '".SF NS Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
                fontWeight: 300,
                letterSpacing: "-0.04em",
                color: isDarkMode ? "#FF6B9D" : "#3B82F6",
              }}
              animate={{
                color: isDarkMode ? "#FF6B9D" : "#3B82F6",
              }}
              transition={{
                duration: 0.5,
              }}
              whileHover={{
                scale: 1.06,
                y: -10,
                color: isDarkMode ? "#FFB3D1" : "#60A5FA",
                letterSpacing: "0.02em",
                textShadow: isDarkMode
                  ? "0 8px 40px rgba(255, 107, 157, 0.5), 0 0 80px rgba(255, 107, 157, 0.3)"
                  : "0 8px 40px rgba(59, 130, 246, 0.5), 0 0 80px rgba(59, 130, 246, 0.3)",
                rotateY: 5,
                transition: {
                  duration: 0.4,
                  ease: [0.34, 1.56, 0.64, 1],
                },
              }}
            >
              Portfolio
            </motion.h2>

            {/* Animated gradient underline with shimmer */}
            <motion.div
              className="absolute -bottom-4 left-1/2 h-1 rounded-full"
              style={{
                backgroundSize: "200% 100%",
              }}
              animate={{
                background: isDarkMode
                  ? "linear-gradient(90deg, transparent, #FF6B9D, #FFB74D, #E91E63, #FF8A80, transparent)"
                  : "linear-gradient(90deg, transparent, #3B82F6, #60A5FA, #2563EB, #1D4ED8, transparent)",
              }}
              initial={{ width: 0, x: "-50%", opacity: 0 }}
              whileHover={{
                width: "60%",
                opacity: 1,
                backgroundPosition: ["0% 50%", "200% 50%"],
              }}
              transition={{
                background: { duration: 0.5 },
                width: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
                opacity: { duration: 0.3 },
                backgroundPosition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            />

            {/* Radial glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
              animate={{
                background: isDarkMode
                  ? "radial-gradient(ellipse 100% 50%, rgba(255, 107, 157, 0.2), transparent)"
                  : "radial-gradient(ellipse 100% 50%, rgba(59, 130, 246, 0.2), transparent)",
              }}
              transition={{ duration: 0.5 }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.3 }}
            />

            {/* Floating particles on hover */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full pointer-events-none"
                style={{
                  background: isDarkMode
                    ? i % 2 === 0
                      ? "#FF6B9D"
                      : "#FFB74D"
                    : i % 2 === 0
                    ? "#3B82F6"
                    : "#60A5FA",
                  left: `${30 + i * 20}%`,
                  top: "50%",
                  boxShadow: isDarkMode
                    ? `0 0 10px ${i % 2 === 0 ? "#FF6B9D" : "#FFB74D"}`
                    : `0 0 10px ${i % 2 === 0 ? "#3B82F6" : "#60A5FA"}`,
                }}
                initial={{ opacity: 0, y: 0, scale: 0 }}
                whileHover={{
                  opacity: [0, 1, 0],
                  y: [-20, -40],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>

          {/* macOS-style Typing Animation */}
          <TypingAnimation />

          {/* Professional Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 2.0,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="mb-16 relative"
          >
            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed pointer-events-auto cursor-pointer"
              style={{
                fontFamily:
                  '".SF NS Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
                fontWeight: 300,
                color: "rgba(255, 255, 255, 0.8)",
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                lineHeight: "1.6",
                letterSpacing: "0.005em",
              }}
              whileHover={{
                color: "rgba(255, 255, 255, 1)",
                scale: 1.03,
                y: -5,
                textShadow:
                  "0 8px 30px rgba(0, 0, 0, 0.3), 0 0 40px rgba(59, 130, 246, 0.2)",
                letterSpacing: "0.01em",
                transition: {
                  duration: 0.4,
                  ease: [0.34, 1.56, 0.64, 1],
                },
              }}
            ></motion.p>

            {/* Subtle background glow on hover */}
            <motion.div
              className="absolute inset-0 rounded-2xl blur-2xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 50%, rgba(59, 130, 246, 0.1), transparent)",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Hero3D;
