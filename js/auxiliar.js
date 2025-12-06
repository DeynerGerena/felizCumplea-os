/* js/auxiliar.js */
/*
  INSTRUCCIONES:
  - Pega tu API KEY en API_KEY abajo.
  - Asegúrate que la carpeta y los archivos sean visibles "Anyone with the link".
*/

const FOLDER_ID = '1XQheOQBvXT_9KzQxQt9dpGftpwNjxtdw';
const API_KEY = 'AIzaSyAoIVJvUKltxN6YNKwSAdpVXIumqDoIoQM'; // <-- sustituye aquí tu API KEY

const gallery = document.getElementById('videoGallery');
const emptyMessage = document.getElementById('emptyMessage');

const modal = document.getElementById('videoModal');
const closeModalBtn = document.getElementById('closeModal');
const player = document.getElementById('playerVideo');
const playerTitle = document.getElementById('playerTitle');

if (!API_KEY) {
  emptyMessage.style.display = 'block';
  emptyMessage.innerHTML = `No hay API key configurada. Edita <code>js/auxiliar.js</code> y coloca tu API Key de Google.`;
  console.warn('API_KEY missing in js/auxiliar.js');
} else {
  loadVideosFromDrive();
}

/** Construye la URL para listar archivos del folder en Drive */
function buildFilesUrl() {
  const q = `'${FOLDER_ID}'+in+parents+and+mimeType+contains+'video/'`;
  // solicitamos campos útiles: id, name, thumbnailLink, mimeType, createdTime
  const fields = 'files(id,name,thumbnailLink,mimeType,createdTime,webContentLink,webViewLink)';
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&key=${API_KEY}&fields=${encodeURIComponent(fields)}&orderBy=createdTime desc&pageSize=200`;
  return url;
}

/** Obtiene archivos y renderiza */
async function loadVideosFromDrive() {
  gallery.innerHTML = '';
  emptyMessage.style.display = 'none';

  try {
    const url = buildFilesUrl();
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Error al conectar con Drive API: ' + resp.statusText);
    const data = await resp.json();

    const files = data.files || [];
    if (!files.length) {
      emptyMessage.style.display = 'block';
      emptyMessage.textContent = 'No se encontraron videos en la carpeta. ¿Subiste archivos y los hiciste públicos?';
      return;
    }

    // Renderea cada archivo
    files.forEach(file => {
      // thumbnailLink puede no estar presente — fallback a placeholder
      const thumb = file.thumbnailLink || `assets/balloon1.png`;
      const title = file.name || 'Video';
      const id = file.id;

      // Drive direct link para reproducir en <video>
      // Nota: usamos el endpoint "uc?export=download&id=" para forzar streaming
      const videoUrl = `https://drive.google.com/uc?export=download&id=${id}`;

      const card = document.createElement('article');
      card.className = 'video-card';
      card.innerHTML = `
        <div class="thumb-wrap">
          <img class="thumb" src="${thumb}" alt="${escapeHtml(title)}" loading="lazy" />
          <div class="play-overlay"><i class="fa-solid fa-circle-play"></i></div>
        </div>
        <div class="card-body">
          <div class="meta">
            <div class="title">${escapeHtml(title)}</div>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openModal(videoUrl, title));
      gallery.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    emptyMessage.style.display = 'block';
    emptyMessage.innerHTML = 'Ocurrió un error al cargar los videos. Revisa la consola para más detalles.';
  }
}

/* Modal handlers */
function openModal(videoUrl, title){
  player.pause();
  player.src = videoUrl;
  playerTitle.textContent = title;
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');
  // autoplay (algunas plataformas bloquean autoplay sin interacción; aquí se reproduce al click)
  player.play().catch(()=>{ /* puede fallar el autoplay */ });
}

function closeModal(){
  player.pause();
  player.removeAttribute('src');
  player.load();
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}

closeModalBtn.addEventListener('click', closeModal);
modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

/* pequeña util */
function escapeHtml(str){
  if (!str) return '';
  return str.replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[s]));
}




