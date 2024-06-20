
customElements.define('home-component', class HomeComponent extends HTMLElement {
    connectedCallback() {
            this.innerHTML = `
            <link rel="stylesheet" href="components/home/home.css">  
            <link rel="stylesheet" href="components/home/marquee.css">
                    
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
            <div class="container-home">
                <div class="orange">
                
                    <div class="blue">
                        <span class="title">INSCRIÇÕES ENCERRADAS</span><br>
                        <span>Obrigado aos mais de 100 inscritos! Acompanhe as atualizações do festival pelo nosso instagram.</span>
                    </div>         
                </div>    

                
            </div>
            `;
            
            // Adiciona o evento de clique ao botão de inscrição
            // this.querySelector('#subscribe-button').addEventListener('click', () => {
            //     window.scrollTo({ top: 0, behavior: 'smooth' });

            //     const headerComponent = document.createElement('header-component');
            //     document.head.appendChild(headerComponent);

            //     loadComponent('form');
                
            // });
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

// function adicionarEmail(event) {
//     event.preventDefault(); // Impedir que a página recarregue

//     const email = document.getElementById('email').value;

//     // Desabilitar o botão de envio para evitar envios duplicados
//     document.querySelector('.btn-field').disabled = true;

//     db.collection("EMAILS").add({
//         email: email
//     })
//     .then(() => {
//         console.log("Email adicionado com sucesso!");
//         document.getElementById('email').value = ''; // Limpar o campo de email após adicionar
//         document.querySelector('.email-form').style.display = 'none'; // Ocultar o formulário
//         document.getElementById('txt1').style.display = 'none'; // Ocultar o formulário
//         document.getElementById('txt2').style.display = 'none'; // Ocultar o formulário
//         document.getElementById('email-success').style.display = 'block'; // Mostrar mensagem de sucesso
//     })
//     .catch((error) => {
//         console.error("Erro ao adicionar email: ", error);
//         // Habilitar o botão de envio em caso de erro para permitir que o usuário tente novamente
//         document.querySelector('.btn-field').disabled = false;
//     });
// }

