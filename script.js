// Simple interactive behavior for the bookstore:
// - 'Enter' button reveals the shelf
// - Clicking a book plays a click sound & fades in an overlay before navigating
// - Back links are handled similarly for a smooth transition

(function(){
  const enterBtn = document.getElementById('enterBtn');
  const bookroom = document.getElementById('bookroom');
  const overlay = document.getElementById('transitionOverlay');
  const clickFX = document.getElementById('clickFX');

  // Show the bookshelf when Enter is clicked
  enterBtn && enterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    enterBtn.disabled = true;
    enterBtn.classList.add('pressed');
    // subtle delay to let user feel the entrance
    setTimeout(() => {
      document.querySelector('.entry').style.display = 'none';
      bookroom.classList.remove('hidden');
      bookroom.setAttribute('aria-hidden', 'false');
      // focus the first book for accessibility
      const first = document.querySelector('.book-link');
      first && first.focus();
    }, 300);
  });

  // Helper to play sound (guard for mobile autoplay)
  function tryPlaySound(){
    try {
      clickFX.currentTime = 0;
      clickFX.play().catch(()=>{/* ignore autoplay restrictions */});
    } catch(e){}
  }

  // Attach handlers to book links
  document.querySelectorAll('.book-link').forEach(a => {
    a.addEventListener('click', function(e){
      // Normal navigation is replaced with a smooth overlay
      e.preventDefault();
      const href = this.getAttribute('href');
      // Play sound
      tryPlaySound();
      // Show overlay
      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden','false');
      // After a short delay, go to page
      setTimeout(() => { window.location.href = href; }, 380);
    });

    // allow keyboard activate with Enter/Space for non-anchor behavior
    a.addEventListener('keydown', (ev) => {
      if(ev.key === 'Enter' || ev.key === ' '){
        ev.preventDefault();
        a.click();
      }
    });
  });

  // For back links on book pages, handle them the same way
  // This script runs on every page; if a .back-link exists, attach overlay nav
  document.querySelectorAll('.back-link').forEach(b => {
    b.addEventListener('click', function(e){
      e.preventDefault();
      tryPlaySound();
      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden','false');
      const href = this.getAttribute('href');
      setTimeout(()=>{ window.location.href = href; }, 320);
    });
  });

  // Prevent overlay from trapping focus if visible (simple)
  overlay.addEventListener('click', () => {
    // allow the user to cancel transition by clicking overlay (optional)
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden','true');
  });

})();
