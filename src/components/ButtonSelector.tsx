"use client";

import { useEffect } from 'react';

/**
 * ButtonSelector
 * - Any clickable element (button/a/div) with `data-selectable="true"` will get the
 *   `.is-selected-outline` class applied when clicked.
 * - If the element has `data-select-group="groupName"`, other elements with the same
 *   group will have the class removed (radio-style behavior).
 */
const ButtonSelector = () => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const el = target.closest('[data-selectable="true"]') as HTMLElement | null;
      if (!el) return;

      const group = el.getAttribute('data-select-group');

      if (group) {
        const others = Array.from(document.querySelectorAll(`[data-selectable="true"][data-select-group="${group}"]`)) as HTMLElement[];
        others.forEach((o) => o.classList.remove('is-selected-outline'));
        el.classList.add('is-selected-outline');
      } else {
        // Toggle single selectable
        if (el.classList.contains('is-selected-outline')) {
          el.classList.remove('is-selected-outline');
        } else {
          el.classList.add('is-selected-outline');
        }
      }
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return null;
};

export default ButtonSelector;
