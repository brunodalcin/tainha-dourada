
customElements.define('header-component', class HeaderComponent extends HTMLElement {
    connectedCallback() {
            this.innerHTML = `
            <link rel="stylesheet" href="components/header/header.css">      
            <header>          
                <div class="container">
                        <!-- Navbar brand -->                
                        <a id="home"><img src="assets/TAINHA-BRANCO-TRANSPARENTE.png" height="" alt="Tainha Dourada" loading="lazy" /></a>                        
                </div>
            </header>
            `;

            this.querySelector('#home').addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // const contentContainer = document.getElementById('content-container');
                // contentContainer.innerHTML = '';                
                
                // const marqueeComponent = document.createElement('marquee-component');                
                // contentContainer.appendChild(marqueeComponent);

                // const homeComponent = document.createElement('home-component');                
                // contentContainer.appendChild(homeComponent);
                loadComponent('marquee');
                loadComponent('home');                
                
            });            
    }
});
