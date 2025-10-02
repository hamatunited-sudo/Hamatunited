import { useEffect, useState } from 'react';

interface ParallaxOffset {
  x: number;
  y: number;
}

export const useParallax = (strength: number = 1) => {
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth - 0.5) * strength;
      const y = (clientY / innerHeight - 0.5) * strength;
      
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [strength]);

  return offset;
};
