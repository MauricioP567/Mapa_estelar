/* ============================================================
   MENSAJES METEORO ROMÁNTICOS
   Aparecen por las zonas periféricas (laterales o superiores),
   evitando el centro del mapa estelar, y se desvanecen al entrar.
   ============================================================ */
(function () {
  'use strict';

  const MESSAGES = [
    "Te amo",
    "Gracias por aparecer en mi vida",
    "Eres todo lo que siempre soñé",
    "Me haces muy feliz",
    "Tienes una sonrisa demasiado hermosa",
    "Enséñale a las estrellas cómo se brilla",
    "Besitoooos",
    "Ten un día muy feliz",
    "Eres mi constelación favorita",
    "A tu lado todo brilla más",
    "Tu risa es mi melodía favorita",
    "Iluminas hasta el cielo más oscuro",
    "Cada día contigo es un regalo",
    "Eres magia hecha persona",
    "Mi lugar favorito es a tu lado"
  ];

  // Paleta romántica pero elegante, acorde al cielo nocturno
  const COLORS = [
    { color: '#ffe0a8', glow: 'rgba(255, 210, 140, 0.90)', soft: 'rgba(255, 200, 120, 0.35)', softer: 'rgba(255, 190, 100, 0.15)' }, // oro cálido
    { color: '#ffd0dc', glow: 'rgba(255, 180, 200, 0.90)', soft: 'rgba(255, 160, 180, 0.35)', softer: 'rgba(255, 140, 165, 0.15)' }, // rosa suave
    { color: '#dcd0ff', glow: 'rgba(200, 180, 255, 0.90)', soft: 'rgba(190, 170, 250, 0.35)', softer: 'rgba(180, 160, 245, 0.15)' }, // lavanda
    { color: '#d0e4ff', glow: 'rgba(170, 205, 255, 0.90)', soft: 'rgba(160, 195, 250, 0.35)', softer: 'rgba(150, 185, 245, 0.15)' }  // azul estelar
  ];

  function spawnMeteor() {
    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    const col = COLORS[Math.floor(Math.random() * COLORS.length)];

    const el = document.createElement('div');
    el.className = 'meteor-message';
    el.textContent = msg;
    el.style.setProperty('--m-color', col.color);
    el.style.setProperty('--m-glow', col.glow);
    el.style.setProperty('--m-glow-soft', col.soft);
    el.style.setProperty('--m-glow-softer', col.softer);
    document.body.appendChild(el);

    // Geometría del mapa (idéntica a la del mapa estelar)
    const w = window.innerWidth;
    const h = window.innerHeight;
    const mapAreaHeight = h - 120;
    const cx = w / 2;
    const cy = mapAreaHeight / 2;
    const radius = Math.min(w, mapAreaHeight) * 0.44;

    const elW = el.offsetWidth;
    const leftZone  = cx - radius;
    const rightZone = w - cx - radius;
    const topZone   = cy - radius;

    let startX, startY, endX, endY, dir;

    const useLateral = Math.max(leftZone, rightZone) > 150;
    const useLeft    = leftZone >= rightZone;

    if (useLateral) {
      const zoneW = useLeft ? leftZone : rightZone;

      if (useLeft) {
        // Zona izquierda: aparece por la izquierda, cae en diagonal hacia la derecha
        dir = 1;
        startX = -elW - 20;
        startY = 40 + Math.random() * (mapAreaHeight * 0.3);
        endX   = Math.max(20, zoneW - 20);
        endY   = Math.min(startY + 180 + Math.random() * 320, mapAreaHeight - 80);
      } else {
        // Zona derecha: aparece por la derecha, cae en diagonal hacia la izquierda
        dir = -1;
        startX = w + 20;
        startY = 40 + Math.random() * (mapAreaHeight * 0.3);
        endX   = Math.min(w - 20, cx + radius + 20);
        endY   = Math.min(startY + 180 + Math.random() * 320, mapAreaHeight - 80);
      }
    } else {
      // Sin espacio lateral (móvil vertical): cruzar por la franja superior
      dir = Math.random() > 0.5 ? 1 : -1;

      if (dir === 1) {
        startX = -elW - 20;
        endX   = w + 20;
      } else {
        startX = w + 20;
        endX   = -elW - 20;
      }

      const safeTop = Math.max(40, topZone - 30);
      startY = 20 + Math.random() * Math.max(10, safeTop - 40);
      endY   = Math.min(startY + 10 + Math.random() * 40, safeTop);
    }

    el.dataset.dir = dir;
    el.style.left = '0px';
    el.style.top  = '0px';

    const duration = 9000 + Math.random() * 4000; // 9–13 s

    const anim = el.animate([
      { transform: `translate(${startX}px, ${startY}px)`, opacity: 0 },
      { transform: `translate(${startX + (endX - startX) * 0.15}px, ${startY + (endY - startY) * 0.15}px)`, opacity: 1, offset: 0.15 },
      { transform: `translate(${startX + (endX - startX) * 0.80}px, ${startY + (endY - startY) * 0.80}px)`, opacity: 1, offset: 0.80 },
      { transform: `translate(${endX}px, ${endY}px)`, opacity: 0 }
    ], {
      duration: duration,
      easing: 'linear',
      fill: 'forwards'
    });

    anim.onfinish = () => el.remove();
  }

  function scheduleNext() {
    const delay = 3000 + Math.random() * 3000; // 3–6 s entre meteoros
    setTimeout(() => {
      spawnMeteor();
      scheduleNext();
    }, delay);
  }

  const start = () => setTimeout(() => { spawnMeteor(); scheduleNext(); }, 1200);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
  } else {
    start();
  }
})();