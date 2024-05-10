
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
                <div class="waves">
                    <svg class="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                    <defs>
                    <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <g class="parallax">
                    <use xlink:href="#gentle-wave" x="48" y="0" fill="#0011b2" />
                    <use xlink:href="#gentle-wave" x="48" y="3" fill="#0014cc" />
                    <use xlink:href="#gentle-wave" x="48" y="5" fill="#0016e5" />
                    <use xlink:href="#gentle-wave" x="48" y="7" fill="#0019ff" />
                    </g>
                    </svg>
                </div>         
            </div>
            <div class="black">
                <div class="white">
                    <div class="txts-form">
                        <div class="fique-ligado">
                            Fique ligado nas novidades !
                        </div>
                        <div class="digite-aqui">
                            Digite seu email aqui! *
                        </div>
                        <div class="email-form">
                            <form onsubmit="adicionarEmail(event)">
                                <input class="email-field" type="email" id="email" name="email" required>
                                <button class="btn-field" type="submit">Inscrever-se</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        
        
            `;
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
    })
    .catch((error) => {
        console.error("Erro ao adicionar email: ", error);
    });
}
