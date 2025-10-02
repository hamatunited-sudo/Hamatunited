import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        
        if (options.triggerOnce) {
          if (isElementIntersecting && !hasTriggered) {
            setIsIntersecting(true);
            setHasTriggered(true);
          }
        } else {
          setIsIntersecting(isElementIntersecting);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [options.threshold, options.rootMargin, options.triggerOnce, hasTriggered]);

  return { ref, isIntersecting };
};
