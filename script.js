// script.js - no heavy logic required; items are anchors to clue pages
// Add keyboard-accessible focus outlines and simple click analytics placeholder

document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.item');

  items.forEach((el, i) => {
    // Simple data attribute (for future analytics)
    el.dataset.itemIndex = i + 1;

    // allow Enter key navigation (anchors handle this by default)
    el.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        // Space by default scrolls; prevent and simulate click.
        ev.preventDefault();
        el.click();
      }
    });

    // small ripple of scale on click for feedback
    el.addEventListener('click', (ev) => {
      // brief visual feedback
      el.style.transform += ' scale(0.98)';
      setTimeout(() => {
        // restore transform by removing inline style (so CSS takes over)
        el.style.transform = '';
      }, 120);
      // In a real deployment, you might log clicks with fetch() to an analytics endpoint.
    });
  });
});
