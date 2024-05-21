customElements.define('marquee-component', class MarqueeComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <link rel="stylesheet" href="components/marquee/marquee.css">
                    
            <div class="section">
            <video class="background-video" autoplay loop muted>
                <source src="seu-video.mp4" type="video/mp4">
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
    }
});

