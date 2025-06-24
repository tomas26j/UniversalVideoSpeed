// === Traducciones y soporte multilingüe ===
const translations = {
  es: {
    title: 'Control de Velocidad',
    speed: 'Velocidad',
    custom: 'Personalizada',
    placeholder: 'Ej: 1.33',
    loading: 'Cargando videos...',
    noVideos: 'No se encontraron videos.',
    apply: 'Aplicar',
    reset: 'Restablecer',
    durationUnknown: 'Duración desconocida',
    invalidSpeed: 'Por favor ingresa una velocidad válida entre 0.1x y 10x',
    video: 'Video'
  },
  en: {
    title: 'Speed Control',
    speed: 'Speed',
    custom: 'Custom',
    placeholder: 'Ex: 1.33',
    loading: 'Loading videos...',
    noVideos: 'No videos found.',
    apply: 'Apply',
    reset: 'Reset',
    durationUnknown: 'Unknown duration',
    invalidSpeed: 'Please enter a valid speed between 0.1x and 10x',
    video: 'Video'
  }
};

// Detecta el idioma del navegador (solo español o inglés)
function getLang() {
  const lang = navigator.language || navigator.userLanguage || 'en';
  return lang.startsWith('es') ? 'es' : 'en';
}

// Aplica los textos traducidos a la interfaz
function setTexts() {
  const lang = getLang();
  const t = translations[lang];
  document.getElementById('titleText').textContent = t.title;
  document.getElementById('speedLabel').textContent = t.speed;
  document.getElementById('customSpeedInput').placeholder = t.placeholder;
  document.getElementById('loadingText').textContent = t.loading;
  document.getElementById('applyBtn').textContent = t.apply;
  document.getElementById('resetBtn').textContent = t.reset;
  document.querySelector('#speedSelector option[value="custom"]').textContent = t.custom;
}

setTexts();

// === Funciones principales ===

// Obtiene información de los videos en la página activa
function getVideosInfo() {
  const videos = Array.from(document.querySelectorAll('video'));
  return videos.map((video, idx) => {
    // Intenta obtener una miniatura (primer frame)
    let thumbnail = '';
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 80;
      canvas.height = 45;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, 80, 45);
      thumbnail = canvas.toDataURL();
    } catch (e) {
      // Si no se puede, dejar vacío
    }
    return {
      idx,
      duration: video.duration,
      thumbnail
    };
  });
}

// Formatea la duración en mm:ss
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Al cargar el popup, muestra la lista de videos y aplica traducción
window.addEventListener('DOMContentLoaded', () => {
  setTexts();
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: getVideosInfo,
    }, (results) => {
      const lang = getLang();
      const t = translations[lang];
      const videos = results[0].result;
      const listDiv = document.getElementById('videosList');
      if (!videos.length) {
        listDiv.innerHTML = `<p>${t.noVideos}</p>`;
        return;
      }
      listDiv.innerHTML = '';
      videos.forEach((video, i) => {
        const div = document.createElement('div');
        div.className = 'video-item';
        div.innerHTML = `
          <label>
            <input type="checkbox" class="video-checkbox" value="${video.idx}" checked aria-label="${t.video} ${i+1}">
            ${video.thumbnail ? `<img src="${video.thumbnail}" width="60" height="34" style="vertical-align:middle;">` : ''}
            <span>${t.video} ${i+1} (${video.duration ? formatDuration(video.duration) : t.durationUnknown})</span>
          </label>
        `;
        listDiv.appendChild(div);
      });
    });
  });
});

// Muestra/oculta el campo de velocidad personalizada
const speedSelector = document.getElementById('speedSelector');
speedSelector.addEventListener('change', function() {
  const customContainer = document.getElementById('customSpeedContainer');
  if (this.value === 'custom') {
    customContainer.style.display = 'block';
    document.getElementById('customSpeedInput').focus();
  } else {
    customContainer.style.display = 'none';
  }
});

// Aplica la velocidad seleccionada a los videos marcados
document.getElementById('applyBtn').addEventListener('click', async () => {
  let speed;
  const lang = getLang();
  const t = translations[lang];
  if (speedSelector.value === 'custom') {
    const customSpeed = parseFloat(document.getElementById('customSpeedInput').value);
    if (isNaN(customSpeed) || customSpeed < 0.1 || customSpeed > 10) {
      alert(t.invalidSpeed);
      return;
    }
    speed = customSpeed;
  } else {
    speed = parseFloat(speedSelector.value);
  }
  const checkboxes = document.querySelectorAll('.video-checkbox:checked');
  const selectedIdxs = Array.from(checkboxes).map(cb => parseInt(cb.value));
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (speed, selectedIdxs) => {
        const videos = Array.from(document.querySelectorAll('video'));
        selectedIdxs.forEach(idx => {
          if (videos[idx]) {
            videos[idx].playbackRate = parseFloat(speed);
          }
        });
      },
      args: [speed, selectedIdxs]
    });
  });
});

// Restablece la velocidad a 1x en los videos marcados
document.getElementById('resetBtn').addEventListener('click', async () => {
  const checkboxes = document.querySelectorAll('.video-checkbox:checked');
  const selectedIdxs = Array.from(checkboxes).map(cb => parseInt(cb.value));
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (selectedIdxs) => {
        const videos = Array.from(document.querySelectorAll('video'));
        selectedIdxs.forEach(idx => {
          if (videos[idx]) {
            videos[idx].playbackRate = 1;
          }
        });
      },
      args: [selectedIdxs]
    });
  });
}); 