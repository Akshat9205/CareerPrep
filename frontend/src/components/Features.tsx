import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { BookOpen, Mic, FileText, Target, BarChart, Building, ArrowRight, Play } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useNavigate } from 'react-router-dom';

interface Feature {
  label: string;
  pos: [number, number, number];
  color: number;
  desc: string;
  icon: any;
  route?: string;
}

const featuresData: Feature[] = [
  { label: "ENGLISH MODULES", icon: BookOpen, pos: [-5, 0, -2], color: 0x6e38f7, desc: "Master business English with AI-powered lessons tailored to your professional goals.", route: "/learning" },
  { label: "INTERVIEW PREP", icon: Mic, pos: [0, 0, -2], color: 0x9d50bb, desc: "Practice with realistic mock interviews and get instant feedback on your performance.", route: "/mock-interview" },
  { label: "ATS CHECKER", icon: FileText, pos: [5, 0, -2], color: 0xbc13fe, desc: "Optimize your resume for applicant tracking systems to ensure you get noticed.", route: "/resume-ai" },
  { label: "SKILL MATCHING", icon: Target, pos: [-5, 0, 3.5], color: 0xbc13fe, desc: "Get matched with internships that align perfectly with your technical skill set.", route: "/dashboard" },
  { label: "PROGRESS ANALYTICS", icon: BarChart, pos: [0, 0, 3.5], color: 0x9d50bb, desc: "Track your improvement with detailed analytics across all learning modules.", route: "/dashboard" },
  { label: "COMPANY RESOURCES", icon: Building, pos: [5, 0, 3.5], color: 0x6e38f7, desc: "Access company-specific preparation materials and insider interview tips.", route: "/learning" }
];

export const Features: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && isSystemDark);

    const mountElement = mountRef.current;
    let containerWidth = mountElement.clientWidth || window.innerWidth;
    let containerHeight = mountElement.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, containerWidth / containerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountElement.appendChild(renderer.domElement);

    camera.position.set(0, 15, 25);
    camera.lookAt(0, -6, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const pointLight = new THREE.PointLight(0xa855f7, 150);
    pointLight.position.set(0, 20, 10);
    scene.add(pointLight);

    const plateGroup = new THREE.Group();
    plateGroup.position.y = -5; // Pushes plates down
    scene.add(plateGroup);

    const createPremiumPlate = (data: Feature) => {
      const group = new THREE.Group();
      const geometry = new THREE.BoxGeometry(4.2, 0.25, 3.8);
      
      const material = new THREE.MeshPhysicalMaterial({
        color: isDark ? 0x0f172a : 0xffffff,
        metalness: isDark ? 0.2 : 0.05,
        roughness: isDark ? 0.1 : 0.2,
        transmission: 0.95,
        transparent: true,
        opacity: isDark ? 0.9 : 0.6,
        ior: 1.5
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = data;
      group.add(mesh);

      const edges = new THREE.EdgesGeometry(geometry);
      const lineMat = new THREE.LineBasicMaterial({ color: data.color, transparent: true, opacity: 0.8 });
      group.add(new THREE.LineSegments(edges, lineMat));

      return group;
    };

    const plates: THREE.Group[] = [];
    featuresData.forEach((f) => {
      const plate = createPremiumPlate(f);
      plate.position.set(f.pos[0], f.pos[1], f.pos[2]);
      plate.rotation.x = -Math.PI / 10;
      plate.scale.set(0, 0, 0);
      plateGroup.add(plate);
      plates.push(plate);
    });

    const tl = gsap.timeline();
    tl.to(headerRef.current, { opacity: 1, y: 0, duration: 1, ease: "expo.out", delay: 0.5 })
      .to(plates.map(p => p.scale), {
          x: 1, y: 1, z: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.2)"
      }, "-=0.2");

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredPlate: THREE.Object3D | null = null;

    const onMouseMove = (e: MouseEvent) => {
      const rect = mountElement.getBoundingClientRect();
      // Ensure mouse interacts only when over the 3D canvas
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;

      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Dynamic rotation of the grid
      gsap.to(plateGroup.rotation, { 
        y: mouse.x * 0.05, 
        x: -mouse.y * 0.03, 
        duration: 1.5 
      });

      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObjects(plateGroup.children, true);

      if (hit.length > 0) {
        let obj = hit[0].object;
        while (obj.parent && obj.parent !== plateGroup) obj = obj.parent;

        if (hoveredPlate !== obj) {
          if (hoveredPlate) gsap.to(hoveredPlate.position, { y: 0, duration: 0.4 });
          
          hoveredPlate = obj;
          // Lift effect
          gsap.to(obj.position, { y: 1.5, duration: 0.3, ease: "power2.out" });
          document.body.style.cursor = 'pointer';
        }
      } else {
        if (hoveredPlate) {
          gsap.to(hoveredPlate.position, { y: 0, duration: 0.4 });
          hoveredPlate = null;
          document.body.style.cursor = 'default';
        }
      }
    };

    let animationFrameId: number;
    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      
      plateGroup.children.forEach((p, i) => {
        if (p !== hoveredPlate && p.scale.x > 0.5) {
            p.position.y = Math.sin(time * 0.0015 + i) * 0.15;
        }
      });

      renderer.render(scene, camera);
    };

    const onResize = () => {
      const newWidth = mountElement.clientWidth || window.innerWidth;
      const newHeight = mountElement.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);
    animate(0);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      document.body.style.cursor = 'default';
      if (mountElement.contains(renderer.domElement)) {
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <section id="features" className="relative pt-20 pb-24 overflow-hidden border-t bg-background border-border/50">
      {/* 3D Visualizer Canvas */}
      <div 
        ref={mountRef} 
        className="absolute top-0 left-0 w-full h-[60vh] md:h-[70vh] z-0 pointer-events-auto" 
        style={{ background: 'radial-gradient(circle at center top, var(--feature-radial) 0%, var(--background) 100%)' }}
      />

      <div className="relative z-10 flex flex-col w-full h-full pt-10 container-custom">
        
        {/* Header Overlaying the 3D scene */}
        <div className="text-center mb-8 h-[50vh] md:h-[60vh] flex flex-col items-center pointer-events-none">
          <div ref={headerRef} className="opacity-0 translate-y-[-20px] max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-6 py-3 mb-6 border rounded-full bg-primary/10 border-primary/20 backdrop-blur-md">
              <span className="text-sm font-medium tracking-wider uppercase text-primary text-shadow">Platform Features</span>
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl text-foreground drop-shadow-xl">
              Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Launch Your Career</span>
            </h1>
            <p className="max-w-2xl pb-4 mx-auto text-lg leading-relaxed text-muted-foreground drop-shadow-md">
              A comprehensive platform designed to take you from learning to landing your dream internship. Hover the glowing modules to preview our technology.
            </p>
          </div>
        </div>

        {/* Rich Feature Grid below the 3D scene */}
        <div className="relative z-20 grid grid-cols-1 gap-6 mt-10 pointer-events-auto md:grid-cols-2 lg:grid-cols-3">
          {featuresData.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => feature.route && navigate(feature.route)}
              onMouseEnter={() => setHoveredFeature(feature.label)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="p-8 transition-all duration-300 border shadow-lg glass-card hover:-translate-y-2 rounded-3xl border-border/50 hover:border-primary/50 group cursor-pointer relative overflow-hidden"
            >
              {/* Hover gradient effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6 transition-transform duration-300 w-14 h-14 rounded-2xl bg-primary/10 group-hover:scale-110 group-hover:bg-primary/20">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">{feature.label}</h3>
                <p className="leading-relaxed text-muted-foreground">{feature.desc}</p>
                
                <div className={`flex items-center mt-6 text-sm font-medium transition-all duration-300 text-primary ${hoveredFeature === feature.label ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}>
                  {feature.route ? (
                    <>
                      Try it now <ArrowRight className="ml-1 w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Coming soon <Play className="ml-1 w-4 h-4" />
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};