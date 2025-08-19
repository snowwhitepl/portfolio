const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const videoWrap = document.querySelector(".video-wrap");
const lightboxVideo = document.getElementById("lightbox-video");
const fsBtn = document.getElementById("fs-btn");
const directLink = document.getElementById("video-direct-link");
const closeBtn = document.querySelector(".close");
const images = document.querySelectorAll(".fashion img, .pack img, .social img");

/* otwieranie: obraz lub video w zależności od data-video */
images.forEach(img => {
img.addEventListener("click", () => {
const videoSrc = img.dataset.video;

if (videoSrc) {
// tryb video
lightboxImg.style.display = "none";
videoWrap.style.display = "block";
lightboxVideo.src = videoSrc;
directLink.href = videoSrc; // fallback link
lightbox.style.display = "flex";
lightboxVideo.currentTime = 0;
lightboxVideo.play().catch(() => {}); // autoplay może być blokowany
fsBtn.style.display = "inline-block";
} else {
// tryb obrazka
lightboxVideo.pause();
lightboxVideo.removeAttribute("src");
videoWrap.style.display = "none";
lightboxImg.style.display = "block";
lightboxImg.src = img.src;
lightbox.style.display = "flex";
}
});
});

/* pełny ekran dla video */
fsBtn.addEventListener("click", () => {
const el = lightboxVideo;
if (!document.fullscreenElement) {
if (el.requestFullscreen) el.requestFullscreen();
else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
} else {
if (document.exitFullscreen) document.exitFullscreen();
else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
}
});

/* zamykanie */
function closeLightbox() {
lightbox.style.display = "none";
lightboxImg.removeAttribute("src");
lightboxVideo.pause();
lightboxVideo.removeAttribute("src");
videoWrap.style.display = "none";
}

closeBtn.addEventListener("click", closeLightbox);

/* zamknięcie po kliknięciu tła */
lightbox.addEventListener("click", (e) => {
if (e.target === lightbox) closeLightbox();
});

/* zamknięcie ESC */
document.addEventListener("keydown", (e) => {
if (e.key === "Escape") closeLightbox();
});