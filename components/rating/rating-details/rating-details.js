 customElements.define(  
  "rating-details-component",
  class extends HTMLElement {
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
      const user = await getCurrentUser();
      if (!user) {
        this.innerHTML =
          "<p>Você precisa estar logado para avaliar este filme.</p>";
        return;
      }

      const isAdm = user.login === 'adm'; // Verifica se o usuário é admin
      const movieId = movie;
      const matriculaFiles = await this.getMatriculaFiles(this._movieData.titulo);

      const userRating = await this.getUserRating(user.uid, movieId);

      this.innerHTML = `
        <link rel="stylesheet" href="/components/rating/rating-details/rating-details.css">
        <div class="container align-items-center">
          <div>
            <button type="button" id="voltar">Voltar a listagem</button>
          </div>
          ${isAdm ? `
          <div class="form-check d-flex mt-1">     
            <input class="form-check-input-lg" type="checkbox" id="participante" ${
              this._movieData.PARTICIPANTE ? "checked" : ""
            }>
            <label class="form-check-label-lg ms-1" for="participante">
              Apto a participar?
            </label>           
          </div>` : ""}
          <div class="form-check d-flex mt-1">     
            <input class="form-check-input-lg" type="checkbox" id="pepa" ${
              this._movieData.PEPA ? "checked" : ""
            } ${!isAdm ? "disabled" : ""}>
            <label class="form-check-label-lg ms-1" for="pepa">
              É um Pepa?
            </label>           
          </div>
        </div>

      `;

      // Conteúdo específico para administradores
      if (isAdm) {
        this.innerHTML += `
        <div class="container">
          <img class="cartaz" src="${this._movieData.cartaz}" alt="${this._movieData.titulo}">        
            <div class="row">
              <div class="col-md-6">
                <h4 class="text-primary">Informações do Curta-metragem</h4>
                ${this.createInput("Título", "titulo", this._movieData.titulo)}            
                ${this.createInput("Link de Acesso", "link-acesso", this._movieData["link-acesso"])}
                ${this.createInput("Observações de Acesso", "obs-acesso", this._movieData["obs-acesso"])}
                ${this.createInput("Gênero", "genero", this._movieData.genero)}
                <h4 class="text-primary">Dados do Cadastrante</h4>
                ${this.createInput("Nome", "nome", this._movieData.nome)}
                ${this.createInput("Endereço", "endereco", this._movieData.endereco)}
                ${this.createInput("Cidade", "cidade", this._movieData.cidade)}
                ${this.createInput("Estado", "estado", this._movieData.estado)}
                ${this.createInput("País", "pais", this._movieData.pais)}
                ${this.createInput("Email", "email", this._movieData.email)}
                ${this.createInput("CEP", "cep", this._movieData.cep)}
                ${this.createInput("Telefone", "telefone", this._movieData.telefone)}            
              </div>
              <div class="col-md-6">
                <h4 class="text-primary">Documentos</h4>
                ${this.createInput("Cartaz", "cartaz", this._movieData.cartaz)}            
                ${this.createInput("Ficha de Autorização", "autorizacao", this._movieData.autorizacao)}
                ${this.createInput("Matrícula", "matricula", matriculaFiles)}    
                <h4 class="text-primary">Ficha Técnica<br></h4>
                ${this.createInput("Produtor", "produtor", this._movieData.produtor)}
                ${this.createInput("Direção", "direcao", this._movieData.direcao)}
                ${this.createInput("Roteirista", "roteirista", this._movieData.roteirista)}
                ${this.createInput("Trilha", "trilha", this._movieData.trilha)}
                ${this.createInput("Fotografia", "fotografia", this._movieData.fotografia)}
                ${this.createInput("Arte", "arte", this._movieData.arte)}            
                ${this.createInput("Editor de Som", "editor_som", this._movieData.editor_som)}
                ${this.createInput("Editor de Vídeo", "editor_video", this._movieData.editor_video)}
                ${this.createInput("Elenco", "elenco", this._movieData.elenco)}                    
              </div>
            </div>      
          </div>
        `;
      } else {
        // Conteúdo específico para usuários comuns
        this.innerHTML += `
        <div class="container">
          <img class="cartaz" src="${this._movieData.cartaz}" alt="${this._movieData.titulo}">        
            <div class="row" style="width:100%">
              <div class="col-md-6">            
                <h4 class="text-primary">Informações do Curta-metragem</h4>
                ${this.createInput("Título", "titulo", this._movieData.titulo)}            
                ${this.createInput("Link de Acesso", "link-acesso", this._movieData["link-acesso"])}
                ${this.createInput("Observações de Acesso", "obs-acesso", this._movieData["obs-acesso"])}
                ${this.createInput("Gênero", "genero", this._movieData.genero)}              
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="n1">Aspectos Técnicos </label>
                  <div class="star-rating">
                    ${this.createStars("n1", userRating ? userRating.aspectoTecnico : 0, 4)}
                  </div>
                  <label for="n2">Concepção Estética</label>
                  <div class="star-rating">
                    ${this.createStars("n2", userRating ? userRating.concepcaoEstetica : 0, 3)}
                  </div>
                  <label for="n3">Relevância do Tema</label>
                  <div class="star-rating">
                    ${this.createStars("n3", userRating ? userRating.relevanciaTema : 0, 3)}
                  </div>
                </div>
                <button type="button" id="submit-rating" class="btn btn-primary" ${userRating ? "disabled" : ""}>Enviar Notas</button>
              </div>
            </div>      
          </div>
        `;
      }

      if (userRating) {
        this.querySelectorAll(`input[name="n1"][value="${userRating.aspectoTecnico}"]`).forEach(el => el.checked = true);
        this.querySelectorAll(`input[name="n2"][value="${userRating.concepcaoEstetica}"]`).forEach(el => el.checked = true);
        this.querySelectorAll(`input[name="n3"][value="${userRating.relevanciaTema}"]`).forEach(el => el.checked = true);
      } else if (!isAdm) {
        this.querySelector('#submit-rating').addEventListener('click', () => this.submitRating(user.uid, movieId));
      }

      if (isAdm) {
        // Checkboxes
        document.querySelector("#participante").addEventListener("change", () => {
          this.updateCheckboxField(movieId, "participante", "PARTICIPANTE");
        });
        document.querySelector("#pepa").addEventListener("change", () => {
          this.updateCheckboxField(movieId, "pepa", "PEPA");
        });
      }

      // Voltar a listagem de filmes
      this.querySelector("#voltar").addEventListener("click", () => loadComponent('rating'));
    }
    createStars(name, rating, nrStars) {
      let stars = '';
      for (let i = nrStars; i > 0; i--) {
        const id = `${name}_${i}`; // Criar ID único
        stars += `
          <input type="radio" id="${id}" name="${name}" value="${i}" ${rating === i ? 'checked' : ''} />
          <label for="${id}">&#9733;</label>
        `;
      }
      return stars;
    }
    
    

    createInput(label, id, values) {
      if (id === "matricula" && !Array.isArray(values)) {
        values = [values];
      }

      if (!Array.isArray(values)) {
        return `
          <div class="form-outline" data-mdb-input-init>
            <label class="form-label" for="${id}">${label}</label>
            <input class="form-control" id="${id}" type="text" value="${values}" readonly>
          </div>
        `;
      }

      return values.map((value, index) => `
        <div class="form-outline" data-mdb-input-init>
          <label class="form-label" for="${id}_${index}">${label}${id === "matricula" ? ` ${index + 1}` : ""}</label>
          <input class="form-control" id="${id}_${index}" type="text" value="${value}" readonly>
        </div>
      `).join("");
    }

    async getCurrentMovie() {
      const movieId = localStorage.getItem("currentMovieId");
      if (!movieId) {
        return null;
      }
      return movieId;
    }

    async getMatriculaFiles(titulo) {
      const storageRef = firebase.storage().ref(`/uploads/${titulo}`);
        try {
          const files = await storageRef.listAll();
          const matriculaFiles = files.items.filter(item => item.name.startsWith('matricula'));
          const downloadUrls = await Promise.all(matriculaFiles.map(file => file.getDownloadURL()));
          return downloadUrls;
      } catch (error) {
          console.error('Erro ao obter arquivos de matrícula:', error);
      }

      return [];
    }



    async getUserRating(userId, movieId) {
      try {
        const ratingDoc = await firebase.firestore()
          .collection("RATINGS")
          .where("userId", "==", userId)
          .where("movieId", "==", movieId)
          .get();

        if (!ratingDoc.empty) {
          return ratingDoc.docs[0].data();
        }
      } catch (error) {
        console.error("Erro ao obter a avaliação do usuário:", error);
      }
      return null;
    }

    async submitRating(userId, movieId) {
      const aspectoTecnico = parseInt(this.querySelector(`input[name="n1"]:checked`).value);
      const concepcaoEstetica = parseInt(this.querySelector(`input[name="n2"]:checked`).value);
      const relevanciaTema = parseInt(this.querySelector(`input[name="n3"]:checked`).value);

      const ratingData = {
        userId: userId,
        movieId: movieId,
        aspectoTecnico: aspectoTecnico,
        concepcaoEstetica: concepcaoEstetica,
        relevanciaTema: relevanciaTema,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };

      try {
        await firebase.firestore().collection("RATINGS").add(ratingData);
        alert("Avaliação enviada com sucesso!");
        this.render();
      } catch (error) {
        console.error("Erro ao enviar a avaliação:", error);
        alert("Erro ao enviar a avaliação. Tente novamente.");
      }
    }

    async updateCheckboxField(movieId, checkboxId, firestoreField) {
      const isChecked = document.querySelector(`#${checkboxId}`).checked;
      try {
        await firebase.firestore()
          .collection("FORMS")
          .doc(movieId)
          .update({ [firestoreField]: isChecked });

        alert(`Campo ${firestoreField} atualizado com sucesso!`);
        console.log(`Campo ${firestoreField} atualizado com sucesso.`);
      } catch (error) {
        console.error(`Erro ao atualizar o campo ${firestoreField}:`, error);
      }
    }
  }
);
