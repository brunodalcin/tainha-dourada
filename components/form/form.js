customElements.define('form-component', class FormComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <link rel="stylesheet" href="components/form/form.css">
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
                    <label>e-mail: <input type="email" name="email" required></label>
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

                <h2>Documentos</h2>
                <div class="form-group">
                    <label>Comprovação de matrícula: <input type="file" name="matricula" required></label>
                </div>
                <div class="form-group">
                    <label>Ficha de autorização: <input type="file" name="autorizacao" required></label>
                </div>
                <div class="form-group">
                    <label>Cartaz de divulgação: <input type="file" name="cartaz" accept="image/*" required></label>
                </div>
                <div class="form-group">
                    <label>Curtametragem: <input type="file" name="curtametragem" accept="image/*" required></label>
                </div>

                <button type="submit">Enviar</button>
            </form>
        `;

        this.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(event) {
        event.preventDefault(); // Impedir que a página recarregue
        const form = document.getElementById('submission-form');
        const formData = new FormData(form);
    
        // Prepare data to send to Firebase
        const data = {};
        const promises = [];
    
        formData.forEach((value, key) => {
            if (value instanceof File) {
                const storageRef = storage.ref(`uploads/${value.name}`);
                const uploadTask = storageRef.put(value);
                promises.push(
                    uploadTask.then(snapshot => snapshot.ref.getDownloadURL())
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
                console.log("Formulário enviado com sucesso!");
                form.reset(); // Limpar o formulário após adicionar
                alert('Formulário enviado com sucesso!');
            })
            .catch((error) => {
                console.error("Erro ao enviar formulário: ", error);
                alert('Erro ao enviar formulário. Por favor, tente novamente.');
            });
    }
    
});
