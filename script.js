// Remote transparent PNGs for each item (realistic where possible).
// Replace any URL if you prefer a different look.

const ITEMS = [
  {
    id: "item1",
    label: "Smudged Lipstick",
    img: "https://www.pngall.com/wp-content/uploads/5/Lipstick-PNG-Image.png",
    alt: "A tube of lipstick, cap loose and color smudged",
    href: "clues/clue-1.html",
    top: "38%", left: "22%", width: 110, rot: -14, z: 2
  },
  {
    id: "item2",
    label: "Cracked Phone",
    img: "https://www.pngmart.com/files/7/Cracked-Phone-PNG-Transparent-Image.png",
    alt: "A phone with a cracked screen, faint fingerprints visible",
    href: "clues/clue-2.html",
    top: "58%", left: "58%", width: 170, rot: 7, z: 2
  },
  {
    id: "item3",
    label: "Diner Receipt",
    img: "https://www.pngall.com/wp-content/uploads/2016/04/Receipt-Free-Download-PNG.png",
    alt: "A thermal receipt, edges wrinkled and ink fading",
    href: "clues/clue-3.html",
    top: "34%", left: "64%", width: 160, rot: -6, z: 2
  },
  {
    id: "item4",
    label: "House Key",
    img: "https://www.pngall.com/wp-content/uploads/2016/03/Key-Free-Download-PNG.png",
    alt: "A single house key on a worn leather tag",
    href: "clues/clue-4.html",
    top: "70%", left: "34%", width: 120, rot: 18, z: 2
  },
  {
    id: "item5",
    label: "Matchbook",
    img: "https://www.pngall.com/wp-content/uploads/2016/06/Matchbox-Free-Download-PNG.png",
    alt: "A matchbook with a bar’s logo rubbed off",
    href: "clues/clue-5.html",
    top: "20%", left: "41%", width: 110, rot: 10, z: 2
  },
  {
    id: "item6",
    label: "Torn Polaroid",
    img: "https://www.pngall.com/wp-content/uploads/5/Polaroid-PNG-Clipart.png",
    alt: "A torn Polaroid photo, faces blurred by motion",
    href: "clues/clue-6.html",
    top: "49%", left: "16%", width: 150, rot: -3, z: 2
  },
  {
    id: "item7",
    label: "Bus Ticket",
    img: "https://www.pngall.com/wp-content/uploads/5/Ticket-PNG-Image.png",
    alt: "A bus ticket stub creased twice",
    href: "clues/clue-7.html",
    top: "63%", left: "74%", width: 150, rot: -8, z: 2
  },
  {
    id: "item8",
    label: "Broken Necklace",
    img: "https://www.pngall.com/wp-content/uploads/5/Necklace-PNG-Image.png",
    alt: "A thin chain with a snapped clasp and a small initial charm",
    href: "clues/clue-8.html",
    top: "27%", left: "78%", width: 130, rot: 15, z: 2
  },
  {
    id: "item9",
    label: "Scribbled Note",
    img: "https://www.pngall.com/wp-content/uploads/5/Note-PNG-Clipart.png",
    alt: "A small note card with hurried pencil writing",
    href: "clues/clue-9.html",
    top: "76%", left: "12%", width: 140, rot: -16, z: 2
  },
  {
    id: "item10",
    label: "Hotel Keycard",
    img: "https://www.pngall.com/wp-content/uploads/5/ID-Card-PNG-Picture.png",
    alt: "A striped keycard with a dull sheen",
    href: "clues/clue-10.html",
    top: "14%", left: "14%", width: 120, rot: -2, z: 2
  }
];

function mountItems(){
  const layer = document.getElementById('items-layer');
  ITEMS.forEach(it => {
    const a = document.createElement('a');
    a.href = it.href;
    a.className = 'item';
    a.id = it.id;
    a.setAttribute('aria-label', it.label);
    a.style.top = it.top;
    a.style.left = it.left;
    a.style.width = it.width + 'px';
    a.style.zIndex = String(it.z || 1);
    a.style.setProperty('--rot', it.rot + 'deg');

    const img = document.createElement('img');
    img.src = it.img;
    img.alt = it.alt || it.label;

    const fallback = document.createElement('span');
    fallback.className = 'fallback';
    fallback.textContent = it.label;
    img.addEventListener('error', () => {
      fallback.style.display = 'grid';
    }, { once: true });

    a.appendChild(img);
    a.appendChild(fallback);

    a.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){
        a.click();
        e.preventDefault();
      }
    });

    layer.appendChild(a);
  });
}

function setupAudio(){
  const audio = document.getElementById('ambience');
  const btn = document.querySelector('.mute');

  let enabled = false;

  function setState(on){
    enabled = on;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if(on && audio.src){
      audio.volume = 0.28;
      audio.play().catch(()=>{ /* gesture required */ });
    } else {
      audio.pause();
    }
  }

  btn.addEventListener('click', () => setState(!enabled));

  document.addEventListener('pointerdown', function once(){
    if(!enabled) setState(true);
    document.removeEventListener('pointerdown', once);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  mountItems();
  setupAudio();
});
