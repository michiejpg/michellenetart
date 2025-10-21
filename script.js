// script.js - randomized placement + diagnostics
(function () {
  const MAX_ATTEMPTS = 200; // attempts per item to find a non-overlapping spot
  const GAP = 8; // minimum gap between items in px
  const itemsSelector = '.item';
  const table = document.getElementById('table');
  const itemsContainer = document.getElementById('items');
  const diag = document.getElementById('diag');
  const diagList = document.getElementById('diag-list');

  function logDiag(msg) {
    if (!diag) return;
    diag.hidden = false;
    const li = document.createElement('li');
    li.textContent = msg;
    diagList.appendChild(li);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function placeItems() {
    const items = Array.from(itemsContainer.querySelectorAll(itemsSelector));
    const containerRect = itemsContainer.getBoundingClientRect();
    const placed = []; // {x, y, w, h}

    items.forEach((el) => {
      const w = el.offsetWidth || parseFloat(getComputedStyle(el).width) || 96;
      const h = el.offsetHeight || parseFloat(getComputedStyle(el).height) || 96;

      let attempt = 0;
      let x, y, ok;

      while (attempt < MAX_ATTEMPTS) {
        const minX = 8;
        const minY = 8;
        const maxX = Math.max(8, containerRect.width - w - 8);
        const maxY = Math.max(8, containerRect.height - h - 8);

        x = Math.round(rand(minX, maxX));
        y = Math.round(rand(minY, maxY));

        ok = true;
        for (const p of placed) {
          const dx = (x + w/2) - (p.x + p.w/2);
          const dy = (y + h/2) - (p.y + p.h/2);
          const minDistX = (w + p.w)/2 + GAP;
          const minDistY = (h + p.h)/2 + GAP;
          if (Math.abs(dx) < minDistX && Math.abs(dy) < minDistY) {
            ok = false;
            break;
          }
        }

        if (ok) break;
        attempt++;
      }

      if (!ok) {
        // couldn't find a non-overlapping spot; place anyway
        x = Math.round(rand(8, Math.max(8, containerRect.width - w - 8)));
        y = Math.round(rand(8, Math.max(8, containerRect.height - h - 8)));
        logDiag(`Placed "${el.dataset.name || el.title || 'item'}" with overlap (fallback).`);
      }

      el.style.left = x + 'px';
      el.style.top = y + 'px';

      const rot = Math.round(rand(-40, 40));
      el.style.setProperty('--rot', rot + 'deg');

      placed.push({ x, y, w, h });
    });
  }

  function whenImagesReady(callback) {
    const imgs = Array.from(document.querySelectorAll('.item img'));
    if (imgs.length === 0) { callback(); return; }

    let loaded = 0;
    imgs.forEach((img) => {
      if (img.complete && img.naturalWidth !== 0) {
        loaded++;
      } else {
        img.addEventListener('load', () => {
          loaded++;
          if (loaded === imgs.length) callback();
        }, { once: true });
        img.addEventListener('error', () => {
          loaded++;
          const src = img.getAttribute('src') || img.dataset.src || '[unknown]';
          console.error(`Image failed to load: ${src}`);
          logDiag(`Image failed to load: ${src}`);
          // still count it to avoid blocking placement
          if (loaded === imgs.length) callback();
        }, { once: true });
      }
    });

    if (loaded === imgs.length) callback();
  }

  document.addEventListener('DOMContentLoaded', () => {
    // basic sanity checks
    if (!itemsContainer) {
      console.error('Missing #items container. Ensure index.html includes <div id="items">...');
      logDiag('Missing #items container (check index.html).');
      return;
    }
    if (!table) {
      console.error('Missing #table container. Ensure index.html includes <div id="table">...');
      logDiag('Missing #table container (check index.html).');
      return;
    }

    // catch and display global errors
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.message, e.filename + ':' + e.lineno);
      logDiag(`Error: ${e.message} (${e.filename}:${e.lineno})`);
    });

    whenImagesReady(() => {
      try {
        placeItems();
      } catch (err) {
        console.error('Error placing items:', err);
        logDiag('Error placing items: ' + (err && err.message ? err.message : String(err)));
      }

      // Re-place on window resize to adapt to different viewport sizes (debounced)
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          try { placeItems(); } catch (err) {
            console.error('Error on resize placement:', err);
            logDiag('Error on resize placement: ' + (err && err.message ? err.message : String(err)));
          }
        }, 120);
      });
    });

    // Accessibility: Enter/Space to follow anchor
    const items = document.querySelectorAll(itemsSelector);
    items.forEach((el) => {
      el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          window.location.href = el.getAttribute('href');
        }
      });
      el.addEventListener('click', () => {
        el.classList.add('clicked');
        setTimeout(() => el.classList.remove('clicked'), 150);
      });
    });
  });
})();
