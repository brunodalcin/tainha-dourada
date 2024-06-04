customElements.define('login-component', class LoginComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <link rel="stylesheet" href="components/login/login.css">            
            <header>
             <img src="assets/TAINHA-BRANCO-TRANSPARENTE.png" alt="Logo">
            </header>
            <div class="login-container">
                <h2>Login</h2>
                <div class="error-message" id="error-message"></div>
                <input type="text" id="email" placeholder="Usuário" required>
                <input type="password" id="password" placeholder="Senha" required>
                <button id="login-button">Login</button>
            </div>
        `;

        // Função de login
        const login = async () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');

            try {
                // Procura o usuário no Firestore pelo nome de usuário
                const userSnapshot = await firebase.firestore().collection('USERS').where('login', '==', email).get();
                if (userSnapshot.empty) {
                    throw new Error('Usuário não encontrado');
                }

                // Pega os dados do usuário
                const userDoc = userSnapshot.docs[0];
                const userData = userDoc.data();

                // Verifica se a senha está correta
                if (userData.password !== password) {
                    throw new Error('Senha incorreta');
                }

                // Login bem-sucedido
                console.log('Login bem-sucedido:', userData);
                // window.location.href = '/avaliacao.html';
                // Exibir componentes após login
                const headerComponent = document.createElement('header-component');
                document.body.prepend(headerComponent);

                const contentContainer = document.getElementById('content-container');
                if (contentContainer) {
                    contentContainer.innerHTML = ''; // Limpa o container

                    const ratingComponent = document.createElement('rating-component');
                    contentContainer.appendChild(ratingComponent);

                } else {
                    console.error('Content container not found');
                }

            } catch (error) {
                // Erro de login
                console.error('Erro de login:', error);
                errorMessage.textContent = error.message;
            }
        };

        // Adiciona o evento de clique ao botão de login
        this.querySelector('#login-button').addEventListener('click', login);
    }
});
