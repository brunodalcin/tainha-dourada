
// Exemplo de uso
//adicionarEmail("exemplo@email.com");


customElements.define('home-component', class HomeComponent extends HTMLElement {
    connectedCallback() {
            this.innerHTML = `
            <link rel="stylesheet" href="components/home/home.css">                 
            <div class="container-home">
                <div class="orange">
                
                    <div class="blue">
                        <span class="title">TAINHA DOURADA 2024</span><br><br>
                        <span class="txt">EM BREVE!</span>
                    </div>         
                </div>

   

                <div class="blue-box">            
                    <div class="white">
                        <div>
                            <div id="txt1">
                                Fique ligado nas novidades !
                            </div>
                            <div id="txt2">
                                Digite seu email aqui! *
                            </div>
                            <div class="email-form">
                                <form id="email-form" onsubmit="adicionarEmail(event)">
                                    <input class="email-field" type="email" id="email" name="email" required>
                                    <button class="btn-field" type="submit">Inscrever-se</button>
                                </form>
                            </div>
                            <div id="email-success" style="display:none;">Email armazenado com sucesso! Você será notificado quando as inscrições forem liberadas.</div>
                        </div>
                    </div>
                </div>
            </div>`;
    }
});

function adicionarEmail(event) {
    event.preventDefault(); // Impedir que a página recarregue

    const email = document.getElementById('email').value;

    db.collection("EMAILS").add({
        email: email
    })
    .then(() => {
        console.log("Email adicionado com sucesso!");
        document.getElementById('email').value = ''; // Limpar o campo de email após adicionar
        document.getElementById('email-form').style.display = 'none'; // Ocultar o formulário
         document.getElementById('txts').style.display = 'none'; // Ocultar o formulário                
        document.getElementById('email-success').style.display = 'block'; // Mostrar mensagem de sucesso
    })
    .catch((error) => {
        console.error("Erro ao adicionar email: ", error);
    });
}