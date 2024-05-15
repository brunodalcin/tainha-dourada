
// Exemplo de uso
//adicionarEmail("exemplo@email.com");


customElements.define('footer-component', class FooterComponent extends HTMLElement {
    connectedCallback() {
            this.innerHTML = `
            <link rel="stylesheet" href="components/footer/footer.css">    
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">                          
        
          <div class="footer">
            <div class="card" style="cursor:auto">
            <a target="_blank"> 
              <div class="card-icon"><img src="img/mail.png"></div>
              <div class="card-title">ORGANIZAÇÃO TAINHA DOURADA</div>              
              <div class="card-description">cinematainhadourada@gmail.com</div>
              <div class="card-text"></div>
              </a>               
            </div>
            <div class="card">
            <a href="https://festivaltainhadourada2024.com/docs/ficha.pdf" target="_blank">
              <div class="card-icon"><img src="img/file.png"></div>
              <div class="card-title">FICHA DE AUTORIZAÇÃO</div>              
              <div class="card-description">Faça o download aqui!</div>
              <div class="card-text"></div>  
            </a>              
            </div>
            <div class="card">
            <a href="https://festivaltainhadourada2024.com/docs/regulamento.pdf" target="_blank">
              <div class="card-icon"><img src="img/file.png"></div>
              <div class="card-title">REGULAMENTO</div>              
              <div class="card-description">Verifique o edital do festival</div>
              <div class="card-text"></div>    
            </a>            
            </div>
            <div class="card">
            <a href="https://www.instagram.com/tainhadourada/" target="_blank">
              <div class="card-icon"><img src="img/insta.png"></div>
              <div class="card-title">INSTAGRAM</div>              
              <div class="card-description">Acompanhe as atualizações do festival</div>
              <div class="card-text"></div>   
            </a>             
            </div>
          </div>
          <div class="footer-univali">
          <div>ORGANIZAÇÃO</div>                        
          <div class="card-univali"><img src="img/AUDIOVISUAL-BRANCO-TRANSPARENTE.png"></div>
          <div>FESTIVAL DE CINEMA UNIVERSITÁRIO TAINHA DOURADA © 2024.</div>         
        
        </div>


              
            `;
    }
});
