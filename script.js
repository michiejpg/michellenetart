// script.js
// - Randomizes positions of .item elements inside #table on each load
// - Avoids overlaps with a simple trial-placement algorithm
// - Sets rotation via CSS variable (--rot) so hover transforms won't clobber it
// - Keeps keyboard accessibility for Enter/Space

(function () {
  const MAX_ATTEMPTS = 200; // attempts per item to find a non-overlapping spot
  const GAP = 8; // minimum gap between items in px
  const itemsSelector = '.item';
  const table = document.getElementById('table');
  const itemsContainer = document.getElementById('items');

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function placeItems() {
    const items = Array.from(itemsContainer.querySelectorAll(itemsSelector));
    // Use bounding sizes for each item (after styles applied). For safety, temporarily make items visible at 0,0 to measure
    // Ensure the container resizing is considered
    const containerRect = itemsContainer.getBoundingClientRect();
    const placed = []; // {x, y, w, h}

    items.forEach((el) => {
      // Ensure images are loaded enough to have size constraints; we will use computed size from CSS rather than image natural size
      const style = window.getComputedStyle(el);
      // Compute width/height from layout (some items differ)
      const w = el.offsetWidth || parseFloat(style.width) || 96;
      const h = el.offsetHeight || parseFloat(style.height) || 96;

      let attempt = 0;
      let x, y, ok;

      while (attempt < MAX_ATTEMPTS) {
        // keep margins inside container
        const minX = 8;
        const minY = 8;
        const maxX = Math.max(8, containerRect.width - w - 8);
        const maxY = Math.max(8, containerRect.height - h - 8);

        x = Math.round(rand(minX, maxX));
        y = Math.round(rand(minY, maxY));

        // collision check with already placed items
        ok = true;
        for (const p of placed) {
          const dx = (x + w/2) - (p.x + p.w/2);
          const dy = (y + h/2) - (p.y + p.h/2);
          const minDistX = (w + p.w)/2 + GAP;
          const minDistY = (h + p.h)/2 + GAP;
          // simple rectangle overlap test with a buffer
          if (Math.abs(dx) < minDistX && Math.abs(dy) < minDistY) {
            ok = false;
            break;
          }
        }

        if (ok) break;
        attempt++;
      }

      // If couldn't find a non-overlapping spot, place it anyway (last x,y)
      if (!ok) {
        x = Math.round(rand(8, Math.max(8, containerRect.width - w - 8)));
        y = Math.round(rand(8, Math.max(8, containerRect.height - h - 8)));
      }

      // Apply position relative to itemsContainer
      el.style.left = x + 'px';
      el.style.top = y + 'px';

      // small random rotation between -40 and 40 degrees
      const rot = Math.round(rand(-40, 40));
      el.style.setProperty('--rot', rot + 'deg');

      // store that placement
      placed.push({ x, y, w, h });
    });
  }

  // Ensure images have at least started loading before measuring (so sizes and offsetWidth are reliable)
  function whenImagesReady(callback) {
    const imgs = Array.from(document.querySelectorAll('.item img'));
    if (imgs.length === 0) { callback(); return; }

    let loaded = 0;
    imgs.forEach((img) => {
      if (img.complete) {
        loaded++;
      } else {
        img.addEventListener('load', () => {
          loaded++;
          if (loaded === imgs.length) callback();
        }, { once: true });
        img.addEventListener('error', () => {
          // treat error as loaded to avoid blocking
          loaded++;
          if (loaded === imgs.length) callback();
        }, { once: true });
      }
    });

    if (loaded === imgs.length) callback();
  }

  document.addEventListener('DOMContentLoaded', () => {
    whenImagesReady(() => {
      placeItems();
      // Re-place on window resize to adapt to different viewport sizes (debounced)
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => placeItems(), 120);
      });
    });

    // Accessibility key handling: allow Enter and Space to activate anchors via keyboard
    const items = document.querySelectorAll(itemsSelector);
    items.forEach((el) => {
      el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          // follow the link
          window.location.href = el.getAttribute('href');
        }
      });
      // Slight visual feedback on click (no transform appending, uses CSS)
      el.addEventListener('click', () => {
        el.classList.add('clicked');
        setTimeout(() => el.classList.remove('clicked'), 150);
      });
    });
  });
})();
