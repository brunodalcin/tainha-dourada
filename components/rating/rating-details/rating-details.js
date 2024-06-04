customElements.define('rating-details-component', class extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  set movieData(data) {
    this._movieData = data;
    this.render();
  }

  get movieData() {
    return this._movieData;
  }

  render() {
    if (!this._movieData) return;

    this.innerHTML = `
      <link rel="stylesheet" href="/components/rating/rating-details/rating-details.css">
      <div class="container">
        <img class="cartaz" src="${this._movieData.cartaz}" alt="${this._movieData.titulo}">
        <div class="details">
          <form>
            <h2>Detalhes do Filme</h2>
            ${this.createInput('Título', 'titulo', this._movieData.titulo)}
            ${this.createInput('Produtor', 'produtor', this._movieData.produtor)}
            ${this.createInput('Roteirista', 'roteirista', this._movieData.roteirista)}
            ${this.createInput('Trilha', 'trilha', this._movieData.trilha)}
            ${this.createInput('Editor de Som', 'editor_som', this._movieData.editor_som)}
            ${this.createInput('Editor de Vídeo', 'editor_video', this._movieData.editor_video)}
            ${this.createInput('Elenco', 'elenco', this._movieData.elenco)}

            <h2>Informações Adicionais</h2>
            ${this.createInput('Arte', 'arte', this._movieData.arte)}
            ${this.createInput('Autorização', 'autorizacao', this._movieData.autorizacao)}
            ${this.createInput('Fotografia', 'fotografia', this._movieData.fotografia)}
            ${this.createInput('Gênero', 'genero', this._movieData.genero)}
            ${this.createInput('Link de Acesso', 'link-acesso', this._movieData['link-acesso'])}
            ${this.createInput('Observações de Acesso', 'obs-acesso', this._movieData['obs-acesso'])}
            ${this.createInput('Direção', 'direcao', this._movieData.direcao)}

            <h2>Ficha Técnica</h2>
            ${this.createInput('Nome', 'nome', this._movieData.nome)}
            ${this.createInput('Cidade', 'cidade', this._movieData.cidade)}
            ${this.createInput('País', 'pais', this._movieData.pais)}
            ${this.createInput('Email', 'email', this._movieData.email)}

            ${this.createInput('Endereço', 'endereco', this._movieData.endereco)}
            ${this.createInput('Estado', 'estado', this._movieData.estado)}
            ${this.createInput('CEP', 'cep', this._movieData.cep)}
            ${this.createInput('Telefone', 'telefone', this._movieData.telefone)}

            <h2>Documentação</h2>
            ${this.createInput('Matrícula', 'matricula', this._movieData.matricula)}
          </form>
        </div>
      </div>
    `;
  }

  createInput(label, id, value) {
    return `
      <div class="form-group col-md-6">
        <label for="${id}">${label}</label>
        <input type="text" class="form-control" id="${id}" value="${value}" readonly>
      </div>
    `;
  }
});
