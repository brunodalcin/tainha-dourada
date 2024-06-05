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

  async render() {
    if (!this._movieData) return;

    const movie = await this.getCurrentMovie();
    const user = await this.getCurrentUser();
    if (!user) {
      this.innerHTML = '<p>Você precisa estar logado para avaliar este filme.</p>';
      return;
    }

    const movieId = movie;


    this.innerHTML = `
      <link rel="stylesheet" href="/components/rating/rating-details/rating-details.css">
      <div class="container">
        <img class="cartaz" src="${this._movieData.cartaz}" alt="${this._movieData.titulo}">
        <div class="details">
          <form id="rating-form">
            <h2>Ficha Técnica</h2>
            ${this.createInput('Título', 'titulo', this._movieData.titulo)}
            ${this.createInput('Produtor', 'produtor', this._movieData.produtor)}
            ${this.createInput('Direção', 'direcao', this._movieData.direcao)}
            ${this.createInput('Roteirista', 'roteirista', this._movieData.roteirista)}
            ${this.createInput('Trilha', 'trilha', this._movieData.trilha)}
            ${this.createInput('Fotografia', 'fotografia', this._movieData.fotografia)}
            ${this.createInput('Editor de Som', 'editor_som', this._movieData.editor_som)}
            ${this.createInput('Editor de Vídeo', 'editor_video', this._movieData.editor_video)}            
            ${this.createInput('Elenco', 'elenco', this._movieData.elenco)}            

            <h2>Informações Adicionais</h2>
            ${this.createInput('Arte', 'arte', this._movieData.arte)}
            ${this.createInput('Autorização', 'autorizacao', this._movieData.autorizacao)}
            ${this.createInput('Gênero', 'genero', this._movieData.genero)}
            ${this.createInput('Link de Acesso', 'link-acesso', this._movieData['link-acesso'])}
            ${this.createInput('Observações de Acesso', 'obs-acesso', this._movieData['obs-acesso'])}            

            <h2>Dados do Cadastrante</h2>
            ${this.createInput('Nome', 'nome', this._movieData.nome)}
            ${this.createInput('Endereço', 'endereco', this._movieData.endereco)}
            ${this.createInput('Cidade', 'cidade', this._movieData.cidade)}
            ${this.createInput('Estado', 'estado', this._movieData.estado)}
            ${this.createInput('País', 'pais', this._movieData.pais)}
            ${this.createInput('Email', 'email', this._movieData.email)}                      
            ${this.createInput('CEP', 'cep', this._movieData.cep)}
            ${this.createInput('Telefone', 'telefone', this._movieData.telefone)}
            
            <h2>Documentação</h2>
            ${this.createInput('Matrícula', 'matricula', this._movieData.matricula)}
            
            <h2>Deixe sua Nota</h2>
            <div class="form-group">
              <label for="rating">Nota</label>
              <select id="rating" class="form-control">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <button type="button" id="submit-rating" class="btn btn-primary">Enviar Nota</button>
          </form>
        </div>
      </div>
    `;

    this.querySelector('#submit-rating').addEventListener('click', () => this.submitRating(user.uid, movieId));
  }

  createInput(label, id, value) {
    return `
      <div class="form-group col-md-6">
        <label for="${id}">${label}</label>
        <input type="text" class="form-control" id="${id}" value="${value}" readonly>
      </div>
    `;
  }

  async getCurrentUser() {
    const userId = localStorage.getItem('loggedInUserId');
    if (!userId) {
      return null;
    }

    try {
      const userDoc = await firebase.firestore().collection('USERS').doc(userId).get();
      if (!userDoc.exists) {
        return null;
      }
      return { uid: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error('Erro ao obter o usuário logado:', error);
      return null;
    }
  }
  
  async getCurrentMovie() {
    const movieId = localStorage.getItem('currentMovieId');
    if (!movieId) {
      return null;
    }
  
    return movieId;
  }
  

  async submitRating(userId, movieId) {
    const rating = this.querySelector('#rating').value;

    if (!userId || !movieId) {
      console.error('User ID or Movie ID is undefined');
      alert('Erro ao enviar a nota. Tente novamente.');
      return;
    }

    const ratingData = {
      userId: userId,
      movieId: movieId,
      rating: parseInt(rating, 10),
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
      await firebase.firestore().collection('RATINGS').add(ratingData);
      alert('Nota enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar a nota:', error);
      alert('Erro ao enviar a nota. Tente novamente.');
    }
  }
});