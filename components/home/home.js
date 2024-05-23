
// Exemplo de uso
//adicionarEmail("exemplo@email.com");


customElements.define('home-component', class HomeComponent extends HTMLElement {
    connectedCallback() {
            this.innerHTML = `
            <link rel="stylesheet" href="components/home/home.css">                 
            <div class="container-home">
                <div class="orange">
                
                    <div class="blue">
                        <span class="title">INSCRIÇÕES ABERTAS<br>22/05 A 19/06</span></span>
                    </div>         
                </div>    
                <div class="blue-box">            
                    <div class="white">
                       
                            <div id="txt1">
                                Clique aqui e inscreva seu curta-metragem!
                            </div>
                            <div class="email-form">
                                <button class="btn-field" type="button" id="subscribe-button">Inscrever-se</button>
                            </div>                      
                    </div>
                    
                </div>
                
            </div>
            `;
            // Adiciona o evento de clique ao botão

            this.querySelector('#subscribe-button').addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                const headerComponent = document.createElement('header-component');
                document.head.appendChild(headerComponent);

                const contentContainer = document.getElementById('content-container');
                contentContainer.innerHTML = '';
                
                const formComponent = document.createElement('form-component');                
                contentContainer.appendChild(formComponent);
                
            });
    }
});

function adicionarEmail(event) {
    event.preventDefault(); // Impedir que a página recarregue

    const email = document.getElementById('email').value;

    // Desabilitar o botão de envio para evitar envios duplicados
    document.querySelector('.btn-field').disabled = true;

    db.collection("EMAILS").add({
        email: email
    })
    .then(() => {
        console.log("Email adicionado com sucesso!");
        document.getElementById('email').value = ''; // Limpar o campo de email após adicionar
        document.querySelector('.email-form').style.display = 'none'; // Ocultar o formulário
        document.getElementById('txt1').style.display = 'none'; // Ocultar o formulário
        document.getElementById('txt2').style.display = 'none'; // Ocultar o formulário
        document.getElementById('email-success').style.display = 'block'; // Mostrar mensagem de sucesso
    })
    .catch((error) => {
        console.error("Erro ao adicionar email: ", error);
        // Habilitar o botão de envio em caso de erro para permitir que o usuário tente novamente
        document.querySelector('.btn-field').disabled = false;
    });
}

// document.addEventListener("DOMContentLoaded", function() {
//     document.getElementById('email-form').addEventListener('submit', adicionarEmail);
// });
