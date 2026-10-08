import { useEffect, useRef } from 'react';

/**
 * useScrollReveal
 * Attaches an IntersectionObserver to a container ref.
 * When child elements with the selector enter the viewport,
 * they receive the `rv-visible` class, triggering CSS transitions.
 *
 * @param {string} selector - CSS selector for targets inside the container
 * @param {IntersectionObserverInit} options - Observer options
 * @returns {React.RefObject} - Attach to the container element
 */
export function useScrollReveal(
  selector = '.rv-reveal, .rv-title-reveal',
  options = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = container.querySelectorAll(selector);
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('rv-visible');
          // Once visible, stop observing (one-shot reveal)
          observer.unobserve(entry.target);
        }
      });
    }, options);

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector, options]);

  return containerRef;
}
