// script.js - realistic overlapping scatter, randomized tilt/z-index, hotlink diagnostics
(function () {
  const itemsSelector = '.item';
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

  // place items allowing slight overlaps; give a z-order and tilt for realism
  function placeItemsPile() {
    const items = Array.from(itemsContainer.querySelectorAll(itemsSelector));
    const containerRect = itemsContainer.getBoundingClientRect();

    // Prefer cluster center around table center with some spread
    const centerX = containerRect.width * 0.52;
    const centerY = containerRect.height * 0.52;
    const spreadX = Math.max(120, containerRect.width * 0.38);
    const spreadY = Math.max(120, containerRect.height * 0.36);

    // Randomize a base offset for the pile so each load is different
    const baseOffsetX = rand(-containerRect.width * 0.06, containerRect.width * 0.06);
    const baseOffsetY = rand(-containerRect.height * 0.04, containerRect.height * 0.04);

    // Shuffle items so z-order varies
    const shuffled = items.sort(() => Math.random() - 0.5);

    shuffled.forEach((el, idx) => {
      const w = el.offsetWidth || 100;
      const h = el.offsetHeight || 100;

      // position biased toward pile center with gaussian-ish spread
      const x = Math.round(centerX + baseOffsetX + (rand(-1,1) + rand(-1,1)) * 0.5 * spreadX - w/2);
      const y = Math.round(centerY + baseOffsetY + (rand(-1,1) + rand(-1,1)) * 0.5 * spreadY - h/2);

      el.style.left = Math.max(6, Math.min(containerRect.width - w - 6, x)) + 'px';
      el.style.top = Math.max(6, Math.min(containerRect.height - h - 6, y)) + 'px';

      // rotation - more subtle for realism
      const rot = rand(-28, 28);
      el.style.setProperty('--rot', rot + 'deg');

      // tilt in X for fake 3D
      const tiltX = rand(-6, 10);
      el.style.setProperty('--tiltX', tiltX + 'deg');

      // z-index: later items sit on top
      const z = 40 + idx;
      el.style.setProperty('--z', (idx % 8) + 'px');
      el.style.zIndex = 100 + idx;

      // small random scale variation
      const s = 1 + rand(-0.03, 0.05);
      el.style.transform += ` scale(${s})`;

      // subtle shadow tweak based on z
      el.style.boxShadow = `0 ${6 + idx/2}px ${18 + idx}px rgba(0,0,0,0.6)`;
    });
  }

  // Wait for images to start loading before measuring
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
          const src = img.getAttribute('src') || '[unknown]';
          console.error(`Image failed to load: ${src}`);
          logDiag(`Image failed to load: ${src}`);
          if (loaded === imgs.length) callback();
        }, { once: true });
      }
    });
    if (loaded === imgs.length) callback();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!itemsContainer) {
      console.error('#items container missing');
      logDiag('#items container missing in DOM');
      return;
    }

    whenImagesReady(() => {
      try {
        placeItemsPile();
      } catch (err) {
        console.error('Error placing items:', err);
        logDiag('Error placing items: ' + (err && err.message ? err.message : String(err)));
      }

      // responsive re-place (debounced)
      let t = null;
      window.addEventListener('resize', () => {
        clearTimeout(t);
        t = setTimeout(() => {
          try { placeItemsPile(); } catch (e) {
            console.error(e);
            logDiag('Error on resize: ' + e.message);
          }
        }, 140);
      });
    });

    // keyboard activation for anchors
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

    // small cinematic flicker effect on page load
    document.body.style.transition = 'filter 400ms ease';
    document.body.style.filter = 'brightness(0.96) saturate(0.9)';
    setTimeout(() => document.body.style.filter = '', 900);
  });
})();
