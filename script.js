function makeSlides(base, count, lead){
    const arr = [];
    for(let n=1; n<=count; n++){
    const idx = String(n).padStart(2,'0');
    arr.push({
    src: `${base}/${idx}.png`, // BACKTICK
    title: `${idx}/${String(count).padStart(2,'0')}`, // BACKTICK → tylko 01/05, bez nazwy działu
    lead // zachowane w razie gdyby było potrzebne gdzie indziej
    });
    }
    return arr;
    }
    
    // BACKTICK
    function renderStory(container, slides){
    // szkielet – bez nazwy działu w podpisie (zostaje tylko licznik)
    container.innerHTML = `
    <div class="progress" aria-hidden="true"></div>
    <div class="stage" role="button" aria-label="Następne zdjęcie">
    <img id="photo" alt="Slajd galerii">
    <div class="hotzone left" data-dir="prev"></div>
    <div class="hotzone right" data-dir="next"></div>
    <div class="arrow left">‹</div>
    <div class="arrow right">›</div>
    </div>
    <div class="caption">
    <h3 class="title"><span class="ttl"></span></h3>
    <p class="subtitle"></p>
    </div>
    `; // BACKTICK
    
    const progress = container.querySelector('.progress');
    const stage = container.querySelector('.stage');
    const imgEl = container.querySelector('#photo');
    const ttlEl = container.querySelector('.ttl');
    
    // paski postępu
    const segs = slides.map(() => {
    const seg = document.createElement('div'); seg.className = 'seg';
    const fill = document.createElement('span'); seg.appendChild(fill);
    progress.appendChild(seg);
    return {seg, fill};
    });
    
    let i = 0;
    const clamp = (n,min,max)=>Math.max(min,Math.min(max,n));
    const preload = (src)=>{ const im = new Image(); im.src = src; };
    
    function show(idx){
    i = clamp(idx,0,slides.length-1);
    const s = slides[i];
    
    // preload next
    const nextIdx = (i+1) % slides.length;
    preload(slides[nextIdx].src);
    
    // obraz + podpis (tylko licznik)
    imgEl.src = s.src;
    ttlEl.textContent = s.title || '';
    
    // pierwszy slajd cz-b (kolor po hoverze – załatwia CSS .is-first)
    stage.classList.toggle('is-first', i === 0);
    
    // pasek postępu
    segs.forEach((o,idx)=>{
    o.seg.classList.toggle('is-active', idx===i);
    o.seg.classList.toggle('is-done', idx<i);
    o.fill.style.width = (idx<i)?'100%':(idx===i?'100%':'0%');
    });
    }
    
    function next(){ show(i+1); }
    function prev(){ show(i-1); }
    
    // klik w lewo/prawo
    stage.addEventListener('click', (e)=>{
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    (x < rect.width/2) ? prev() : next();
    });
    
    // hotzony
    stage.querySelectorAll('.hotzone').forEach(z=>{
    z.addEventListener('click', e=>{
    e.stopPropagation();
    (z.dataset.dir === 'prev') ? prev() : next();
    }, {passive:true});
    });
    
    // klawiatura
    window.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowRight' || e.key===' '){ next(); }
    if(e.key==='ArrowLeft'){ prev(); }
    });
    
    // swipe
    let startX=0;
    stage.addEventListener('touchstart', e=>{ startX = e.touches[0].clientX }, {passive:true});
    stage.addEventListener('touchend', e=>{
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40){ dx<0 ? next() : prev(); }
    else { next(); } // tap = dalej
    }, {passive:true});
    
    show(0);
    }
    
    // BACKTICK
    // Inicjalizacja wszystkich instancji .story
    document.querySelectorAll('.story').forEach(story=>{
    const base = story.dataset.base; // np. "rysunki"
    const count = parseInt(story.dataset.count || '5', 10);
    const lead = story.dataset.lead || base;
    const slides = makeSlides(base, count, lead);
    renderStory(story, slides);
    });
    
    /* ========= LIGHTBOX dla SOCIAL (bez zmian) ========= */
    // BACKTICK
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const videoWrap = document.querySelector(".video-wrap");
    const lightboxVideo = document.getElementById("lightbox-video");
    const fsBtn = document.getElementById("fs-btn");
    const directLink = document.getElementById("video-direct-link");
    const closeBtn = document.querySelector(".close");
    const images = document.querySelectorAll(".social img");
    
    images.forEach(img => {
    img.addEventListener("click", () => {
    const videoSrc = img.dataset.video;
    if (videoSrc) {
    lightboxImg.style.display = "none";
    videoWrap.style.display = "block";
    lightboxVideo.src = videoSrc;
    directLink.href = videoSrc;
    lightbox.style.display = "flex";
    lightboxVideo.currentTime = 0;
    lightboxVideo.play().catch(() => {});
    fsBtn.style.display = "inline-block";
    } else {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    videoWrap.style.display = "none";
    lightboxImg.style.display = "block";
    lightboxImg.src = img.src;
    lightbox.style.display = "flex";
    }
    });
    });
    
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
    
    function closeLightbox() {
    lightbox.style.display = "none";
    lightboxImg.removeAttribute("src");
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    videoWrap.style.display = "none";
    }
    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });