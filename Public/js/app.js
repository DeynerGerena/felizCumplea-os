const uploadBtn = document.getElementById("uploadBtn");
const videoInput = document.getElementById("videoInput");
const status = document.getElementById("status");
const videoList = document.getElementById("videoList");


uploadBtn.onclick = async () => {
const file = videoInput.files[0];
if (!file) return alert("Selecciona un video primero.");


// Límite recomendado: 20 MB
if (file.size > 20 * 1024 * 1024) {
return alert("El video no debe superar los 20 MB.");
}


const fileRef = storage.ref().child("videos/" + Date.now() + "_" + file.name);
status.textContent = "Subiendo video...";


await fileRef.put(file);
const url = await fileRef.getDownloadURL();


await db.collection("videos").add({ url, timestamp: Date.now() });
status.textContent = "🎉 Video subido exitosamente";


videoInput.value = "";
loadVideos();
};


async function loadVideos() {
videoList.innerHTML = "Cargando...";
const snapshot = await db.collection("videos").orderBy("timestamp", "desc").get();


videoList.innerHTML = "";
snapshot.forEach(doc => {
const data = doc.data();
const wrapper = document.createElement("div");
wrapper.className = "bg-white p-4 rounded-2xl shadow";


const video = document.createElement("video");
video.src = data.url;
video.controls = true;
video.className = "w-full";


wrapper.appendChild(video);
videoList.appendChild(wrapper);
});
}


loadVideos();