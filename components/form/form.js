customElements.define('form-component', class FormComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <link rel="stylesheet" href="components/form/form.css">        
            <header-component></header-component>
            <div class="background-container">
            <div class="fish fish1"></div>
            <div class="fish fish2"></div>
            <div class="bubbles bubble-2"></div>
            <div class="bubbles bubble-3"></div>
            <div class="bubbles bubble-4"></div>
            <div class="bubbles bubble-5"></div>
            <div class="bubbles bubble-6"></div>
            <div class="bubbles bubble-7"></div>
            <div class="bubbles bubble-8"></div>
            <form id="submission-form">
                <h2>Dados Pessoais do Responsável pela inscrição</h2>
                <div class="form-group">
                    <label>Nome completo: <input type="text" name="nome" required></label>
                    <label>Endereço: <input type="text" name="endereco" required></label>
                </div>
                <div class="form-group">
                    <label>Cidade: <input type="text" name="cidade" required></label>
                    <label>Estado: <input type="text" name="estado" required></label>
                </div>
                <div class="form-group">
                    <label>País: <input type="text" name="pais" required></label>
                    <label>Cep: <input type="text" name="cep" required></label>
                </div>
                <div class="form-group">
                    <label>E-mail: <input type="email" name="email" required></label>
                    <label>Telefone: <input type="tel" name="telefone" required></label>
                </div>



                <h2>Ficha Técnica</h2>             
                <div class="form-group">
                    <label>Direção: <input type="text" name="direcao" required></label>
                    <label>Produtor: <input type="text" name="produtor" required></label>
                </div>
                <div class="form-group">
                    <label>Roteirista: <input type="text" name="roteirista" required></label>
                    <label>Diretor de fotografia: <input type="text" name="fotografia" required></label>
                </div>
                <div class="form-group">
                    <label>Diretor de arte: <input type="text" name="arte" required></label>
                    <label>Elenco: <input type="text" name="elenco" required></label>
                </div>
                <div class="form-group">
                    <label>Trilha sonora: <input type="text" name="trilha" required></label>
                    <label>Editor de som: <input type="text" name="editor_som" required></label>
                </div>
                <div class="form-group">
                    <label>Montador / Editor de vídeo: <input type="text" name="editor_video" required></label>
                </div>
                <h2>Informações do Curta-metragem</h2> 
                <div class="form-group-full">
                    <label>Título: <input type="text" name="titulo" required></label>
                </div>   
                <div class="form-group-full">
                    <label>Link de Acesso: <input type="text" name="link-acesso" required></label>
                    <label>Observações para o acesso (ex: Login e Senha): <input type="text" name="obs-acesso" required></label>                    
                </div>   


                <h2>Documentos</h2>
                <div class="form-group-full">
                    <label>Comprovação de matrícula: <input type="file" name="matricula" required></label>
                </div>
                <div class="form-group-full">
                    <label>Ficha de autorização: <input type="file" name="autorizacao" required></label>
                </div>
                <div class="form-group-full">
                    <label>Cartaz de divulgação: <input type="file" name="cartaz" required></label>
                </div>

                <button type="submit">Enviar</button>
            </form>
            </div>
            
        `;

        this.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(event) {
        event.preventDefault(); // impedir que a página recarregue
        const form = document.getElementById('submission-form');
        const formData = new FormData(form);
    
        // obter o valor do campo 'Título do Curta-metragem'
        const titulo = formData.get('titulo');
    
        // criar uma referência à pasta com o nome do curta-metragem
        const storageRef = storage.ref(`uploads/${titulo}`);
    
        // prepare data to send to Firebase
        const data = {};
        const promises = [];
    
        formData.forEach((value, key) => {
            if (value instanceof File) {
                const fileRef = storageRef.child(value.name);
                promises.push(
                    fileRef.put(value).then(snapshot => snapshot.ref.getDownloadURL())
                        .then(url => {
                            data[key] = url;
                        })
                );
            } else {
                data[key] = value;
            }
        });
    
        Promise.all(promises)
            .then(() => {
                return db.collection("FORMS").add(data);
            })
            .then(() => {
                console.log("success");
                form.reset(); // limpa o formulário após adicionar
                alert('Inscrição realizada com sucesso, boa sorte!!');
            })
            .catch((error) => {
                console.error("error: ", error);
                alert('Erro ao enviar formulário. Por favor, tente novamente.');
            });
    }});

