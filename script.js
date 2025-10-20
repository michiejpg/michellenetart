// Bookstore interactions (cozy version)
// - Enter reveals bookshelf, starts ambient after user gesture
// - Clicking a book plays click and transitions to the book page
// - Back links behave similarly on book pages

(function(){
  const enterBtn = document.getElementById('enterBtn');
  const bookroom = document.getElementById('bookroom');
  const overlay = document.getElementById('transitionOverlay');
  const clickFX = document.getElementById('clickFX');
  const ambient = document.getElementById('ambientLoop');

  // Helper to play sound (guard for autoplay/muted browsers)
  function tryPlayAudio(audioEl){
    if(!audioEl) return;
    try {
      audioEl.currentTime = 0;
      const p = audioEl.play();
      if(p && p.catch){
        p.catch(()=>{/* ignore autoplay restrictions */});
      }
    } catch(e){}
  }

  // Reveal the bookshelf and start ambient audio (user gesture required)
  enterBtn && enterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    enterBtn.disabled = true;
    enterBtn.classList.add('pressed');
    // small entrance animation delay
    setTimeout(() => {
      document.querySelector('.entry').style.display = 'none';
      bookroom.classList.remove('hidden');
      bookroom.setAttribute('aria-hidden', 'false');
      const first = document.querySelector('.book-link');
      first && first.focus();
      // Start gentle ambient sound on user gesture
      tryPlayAudio(ambient);
    }, 320);
  });

  // Play click/pop sound safely
  function tryPlayClick(){
    tryPlayAudio(clickFX);
  }

  // Attach handlers to book links
  document.querySelectorAll('.book-link').forEach(a => {
    a.addEventListener('click', function(e){
      e.preventDefault();
      const href = this.getAttribute('href');
      // Play click
      tryPlayClick();
      // Add a soft overlay and slight scale for a tactile transition
      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden','false');
      document.body.style.filter = 'brightness(0.95)';
      setTimeout(() => { window.location.href = href; }, 420);
    });

    a.addEventListener('keydown', (ev) => {
      if(ev.key === 'Enter' || ev.key === ' '){
        ev.preventDefault();
        a.click();
      }
    });
  });

  // Back links (on book pages) should show overlay and navigate back
  document.querySelectorAll('.back-link').forEach(b => {
    b.addEventListener('click', function(e){
      e.preventDefault();
      tryPlayClick();
      overlay.classList.add('show');
      overlay.setAttribute('aria-hidden','false');
      setTimeout(()=>{ window.location.href = this.getAttribute('href'); }, 320);
    });
  });

  // Allow clicking overlay to cancel transition
  overlay.addEventListener('click', () => {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden','true');
    document.body.style.filter = '';
  });

  // Accessibility: stop ambient sound when navigating away/inactive
  window.addEventListener('pagehide', () => { if(ambient){ ambient.pause(); ambient.currentTime = 0; } });

})();
