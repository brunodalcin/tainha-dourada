customElements.define('marquee-component', class MarqueeComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <link rel="stylesheet" href="components/marquee/marquee.css">
                    
            <div class="section">
            <video id="videoTainha" class="background-video" controls="controls" controls preload="auto" autoplay="autoplay"
              loop muted playsinline>
                <source src="/assets/video-home.mp4" type="video/mp4">
                Seu navegador não suporta o vídeo.
            </video>
    
            <div class="marquee marquee-top">
                <div class="marquee-content">
                  <span class="marquee-txt-sm">FESTIVAL DE CINEMA UNIVERSITÁRIO</span>
                  <span class="marquee-txt-bg">TAINHA DOURADA 2024 !</span>                  
                </div>
            </div>
    
            <div class="marquee marquee-bottom">
                <div class="marquee-content">
                    <span class="marquee-txt-sm">FOMENTE A ARTE // ABRACE OS ESTUDANTES</span>
                    <span class="marquee-txt-bg">UNIVALI 60 ANOS</span>                  
                </div>
            </div>
        </div>
        `;
        document.addEventListener('DOMContentLoaded', (event) => {
            const video = document.getElementById('videoTainha');
            video.volume = 0.15;  // Volume em 25%
        });
        var videoMobile = document.getElementById('tainhaDourada');

        // Adiciona um event listener para o evento touchstart (toque na tela)
        document.addEventListener('touchstart', function() {
            // Verifica se o vídeo está pausado
            if (videoMobile.paused) {
            // Inicia a reprodução do vídeo
            videoMobile.play();
    }
  });
    }
});

