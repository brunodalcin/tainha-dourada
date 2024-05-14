
customElements.define('header-component', class HeaderComponent extends HTMLElement {
    connectedCallback() {
            this.innerHTML = `
            <link rel="stylesheet" href="components/header/header.css">      
            <header>          
                            <div class="container">
                                    <!-- Navbar brand -->
                                    
                                            <img src="img/TAINHA-BRANCO-TRANSPARENTE.png" height="" alt="Tainha Dourada" loading="lazy" />
                                    
                                    <!-- Collapsible wrapper -->
                                    <!-- <div class="btns"> 
                                            Left links 
                                            <a id="routeHome" class="nav-link" href="#">HOME</a>
                                            <a id="routeSobre" class="nav-link" href="#">SOBRE</a>
                                            <a id="routeProgramacao" class="nav-link" href="#">PROGRAMAÇÃO</a>
                                            <a id="routeMais" class="nav-link" href="#">Mais</a>
                                    </div>-->
                                    <!-- Collapsible wrapper -->
                            </div>
            </header>
            `;
    }
});
