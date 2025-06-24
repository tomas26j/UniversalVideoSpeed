function createFloatingPanel(video, idx) {
  // Evitar duplicados
  if (video.parentElement.querySelector('.uvs-float-panel')) return;

  const panel = document.createElement('div');
  panel.className = 'uvs-float-panel';
  panel.innerHTML = `
    <button class="uvs-btn" data-action="down">-</button>
    <span class="uvs-speed">${video.playbackRate.toFixed(2)}x</span>
    <button class="uvs-btn" data-action="up">+</button>
    <button class="uvs-close">×</button>
  `;
  panel.style.display = video.paused ? 'flex' : 'none';

  // Flag para evitar doble efecto
  let ignoreNextEvent = false;

  // Eventos de los botones de velocidad
  const btnDown = panel.querySelector('[data-action="down"]');
  const btnUp = panel.querySelector('[data-action="up"]');
  const closeBtn = panel.querySelector('.uvs-close');

  btnDown.onclick = (e) => {
    e.stopPropagation();
    const wasPaused = video.paused;
    video.playbackRate = Math.max(0.1, video.playbackRate - 0.1);
    panel.querySelector('.uvs-speed').textContent = video.playbackRate.toFixed(2) + 'x';
    if (wasPaused) {
      ignoreNextEvent = true;
      video.pause();
    }
  };
  btnUp.onclick = (e) => {
    e.stopPropagation();
    const wasPaused = video.paused;
    video.playbackRate = Math.min(10, video.playbackRate + 0.1);
    panel.querySelector('.uvs-speed').textContent = video.playbackRate.toFixed(2) + 'x';
    if (wasPaused) {
      ignoreNextEvent = true;
      video.pause();
    }
  };
  // Botón cerrar
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    panel.remove();
  };

  // Actualizar visibilidad al cambiar estado
  video.addEventListener('play', () => {
    if (ignoreNextEvent) {
      ignoreNextEvent = false;
      return;
    }
    panel.style.display = 'none';
  });
  video.addEventListener('pause', () => {
    if (ignoreNextEvent) {
      ignoreNextEvent = false;
      return;
    }
    panel.style.display = 'flex';
  });

  // Posicionar el panel sobre el video
  panel.style.position = 'absolute';
  panel.style.top = '10px';
  panel.style.right = '10px';
  panel.style.zIndex = 9999;
  panel.style.background = 'rgba(34,34,34,0.85)';
  panel.style.color = '#fff';
  panel.style.borderRadius = '8px';
  panel.style.padding = '4px 8px';
  panel.style.alignItems = 'center';
  panel.style.gap = '6px';
  panel.style.fontSize = '1em';
  panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  panel.style.userSelect = 'none';
  panel.style.transition = 'opacity 0.2s';
  panel.style.cursor = 'pointer';
  panel.style.height = '40px';

  // Asegurar que el contenedor del video sea relativo
  const parent = video.parentElement;
  if (getComputedStyle(parent).position === 'static') {
    parent.style.position = 'relative';
  }
  parent.appendChild(panel);
}

function injectPanels() {
  const videos = document.querySelectorAll('video');
  videos.forEach((video, idx) => {
    createFloatingPanel(video, idx);
  });
}

// Inyectar paneles al cargar y cuando se agreguen nuevos videos
document.addEventListener('DOMContentLoaded', injectPanels);
window.addEventListener('load', injectPanels);
setInterval(injectPanels, 2000); // Por si se agregan videos dinámicamente 