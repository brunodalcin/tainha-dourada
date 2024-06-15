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
      const user = await this.getCurrentUser();
      if (!user) {
        this.innerHTML =
          "<p>Você precisa estar logado para avaliar este filme.</p>";
        return;
      }

      const movieId = movie;
      const matriculaFiles = await this.getMatriculaFiles(
        this._movieData.titulo
      );

      this.innerHTML = `
      <link rel="stylesheet" href="/components/rating/rating-details/rating-details.css">
      <div class="container align-items-center">
        <div>
            <button type="button" id="voltar">Voltar a listagem</button>
        </div>          
      <div class="form-check d-flex mt-1">     
        <input class="form-check-input-lg" type="checkbox" id="participante" ${
          this._movieData.PARTICIPANTE ? "checked" : ""
        }>
        <label class="form-check-label-lg ms-1" for="participante">
          Apto a participar?
        </label>           
      </div>
      <div class="form-check d-flex mt-1">     
        <input class="form-check-input-lg" type="checkbox" id="pepa" ${
          this._movieData.PEPA ? "checked" : ""
        }>
        <label class="form-check-label-lg ms-1" for="pepa">
          É um Pepa?
        </label>           
      </div>
      
      </div>
    
      <div class="container">
        <img class="cartaz" src="${this._movieData.cartaz}" alt="${
        this._movieData.titulo
      }">
        <div class="row">
          <div class="col-md-6">
           <h2>Deixe sua Nota</h2>
            <div class="form-group">
              <label for="rating">Aspectos Técnicos</label>
              <select id="rating" class="form-control">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              <label for="rating">Concepção Estética</label>              
              <select id="rating" class="form-control">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
              <label for="rating">Relevância do Tema</label>              
              <select id="rating" class="form-control">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>                            
            </div>
            <button type="button" id="submit-rating" class="btn btn-primary">Enviar Nota</button>
            <h4 class="text-primary">Informações do Curta-metragem</h4>
            ${this.createInput(
              "Título",
              "titulo",
              this._movieData.titulo
            )}            
            ${this.createInput(
              "Link de Acesso",
              "link-acesso",
              this._movieData["link-acesso"]
            )}
            ${this.createInput(
              "Observações de Acesso",
              "obs-acesso",
              this._movieData["obs-acesso"]
            )}
            ${this.createInput("Gênero", "genero", this._movieData.genero)}
            <h4 class="text-primary">Dados do Cadastrante</h4>
            ${this.createInput("Nome", "nome", this._movieData.nome)}
            ${this.createInput(
              "Endereço",
              "endereco",
              this._movieData.endereco
            )}
            ${this.createInput("Cidade", "cidade", this._movieData.cidade)}
            ${this.createInput("Estado", "estado", this._movieData.estado)}
            ${this.createInput("País", "pais", this._movieData.pais)}
            ${this.createInput("Email", "email", this._movieData.email)}
            ${this.createInput("CEP", "cep", this._movieData.cep)}
            ${this.createInput(
              "Telefone",
              "telefone",
              this._movieData.telefone
            )}            
          </div>        
          <div class="col-md-6">
            <h4 class="text-primary">Documentos</h4>
            ${this.createInput(
              "Cartaz",
              "cartaz",
              this._movieData.cartaz
            )}            
            ${this.createInput(
              "Ficha de Autorização",
              "autorizacao",
              this._movieData.autorizacao
            )}
            ${this.createInput("Matrícula", "matricula", matriculaFiles)}    
            <h4 class="text-primary">Ficha Técnica<br></h4>
            ${this.createInput(
              "Produtor",
              "produtor",
              this._movieData.produtor
            )}
            ${this.createInput("Direção", "direcao", this._movieData.direcao)}
            ${this.createInput(
              "Roteirista",
              "roteirista",
              this._movieData.roteirista
            )}
            ${this.createInput("Trilha", "trilha", this._movieData.trilha)}
            ${this.createInput(
              "Fotografia",
              "fotografia",
              this._movieData.fotografia
            )}
            ${this.createInput(
              "Arte",
              "arte",
              this._movieData.arte
            )}            
            ${this.createInput(
              "Editor de Som",
              "editor_som",
              this._movieData.editor_som
            )}
            ${this.createInput(
              "Editor de Vídeo",
              "editor_video",
              this._movieData.editor_video
            )}
            ${this.createInput(
              "Elenco",
              "elenco",
              this._movieData.elenco
            )}                    
          </div>
        </div>      
      </div>    
    `;

      this.querySelector('#submit-rating').addEventListener('click', () => this.submitRating(user.uid, movieId));

      // Checkboxes
      document.querySelector("#participante").addEventListener("change", () => {
        this.updateCheckboxField(movieId, "participante", "PARTICIPANTE");
      });
      document.querySelector("#pepa").addEventListener("change", () => {
        this.updateCheckboxField(movieId, "pepa", "PEPA");
      });

      // Voltar a listagem de filmes
      this.querySelector("#voltar").addEventListener("click", () =>
        this.voltar()
      );
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

      return values
        .map(
          (value, index) => `
        <div class="form-outline" data-mdb-input-init>
            <label class="form-label" for="${id}_${index}">${label}${
            id === "matricula" ? ` ${index + 1}` : ""
          }</label>
            <input class="form-control" id="${id}_${index}" type="text" value="${value}" readonly>
        </div>
    `
        )
        .join("");
    }

    async getCurrentUser() {
      const userId = localStorage.getItem("loggedInUserId");
      if (!userId) {
        return null;
      }

      try {
        const userDoc = await firebase
          .firestore()
          .collection("USERS")
          .doc(userId)
          .get();
        if (!userDoc.exists) {
          return null;
        }
        return { uid: userDoc.id, ...userDoc.data() };
      } catch (error) {
        console.error("Erro ao obter o usuário logado:", error);
        return null;
      }
    }

    async getCurrentMovie() {
      const movieId = localStorage.getItem("currentMovieId");
      if (!movieId) {
        return null;
      }

      return movieId;
    }

    async submitRating(userId, movieId) {
      const rating = this.querySelector("#rating").value;

      if (!userId || !movieId) {
        console.error("User ID or Movie ID is undefined");
        alert("Erro ao enviar a nota. Tente novamente.");
        return;
      }

      const ratingData = {
        usuario: userId,
        filme: movieId,
        aspectoTecnico: parseInt(rating, 4),
        concepcaoEstetica: parseInt(rating, 3),
        relevanciaTema: parseInt(rating, 3),                
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };

      try {
        await firebase.firestore().collection("RATINGS").add(ratingData);
        alert("Notas enviadas com sucesso!");
      } catch (error) {
        console.error("Erro ao enviar as notas:", error);
        alert("Erro ao enviar as notas. Tente novamente.");
      }
    }

    // Função para marcar e desmarcar os checks
    async updateCheckboxField(movieId, checkboxId, fieldName) {
      const checkbox = this.querySelector(`#${checkboxId}`);
      const isChecked = checkbox.checked;

      try {
        await firebase
          .firestore()
          .collection("FORMS")
          .doc(movieId)
          .update({ [fieldName]: isChecked });
        console.log(`Campo ${fieldName} atualizado com sucesso!`);
        alert(`Campo ${fieldName} atualizado com sucesso!`);
      } catch (error) {
        console.error(`Erro ao atualizar o campo ${fieldName}:`, error);
        alert(`Erro ao atualizar o campo ${fieldName}. Tente novamente.`);
      }
    }

    async getMatriculaFiles(titulo) {
      const storageRef = firebase.storage().ref(`/uploads/${titulo}`);
      try {
        const files = await storageRef.listAll();
        const matriculaFiles = files.items.filter((item) =>
          item.name.startsWith("matricula")
        );
        const downloadUrls = await Promise.all(
          matriculaFiles.map((file) => file.getDownloadURL())
        );
        return downloadUrls;
      } catch (error) {
        console.error("Erro ao obter arquivos de matrícula:", error);
        return [];
      }
    }
    voltar() {
      const headerComponent = document.createElement("header-component");
      document.body.prepend(headerComponent);

      const contentContainer = document.getElementById("content-container");
      if (contentContainer) {
        contentContainer.innerHTML = ""; // Limpa o container

        const ratingComponent = document.createElement("rating-component");
        contentContainer.appendChild(ratingComponent);
      } else {
        console.error("Content container not found");
      }
    }
  }
);
