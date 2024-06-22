customElements.define(
  "rating-component",
  class extends HTMLElement {
    async connectedCallback() {
      const db = firebase.firestore();
      const formsRef = db.collection("FORMS");
      const user = await getCurrentUser();
      const isAdm = user.login === "adm";

      let selectedGenre = null;

      this.innerHTML = ` 
        <link rel="stylesheet" href="/components/rating/rating.css">
        <header>
          <img src="assets/TAINHA-BRANCO-TRANSPARENTE.png" alt="Logo">           
              <div btn-group d-flex " ${isAdm ? "" : 'style="display:none"'} ">
                <button id="ranking-btn" class="btn btn-primary">Ver Rankings</button>                
              </div>       
        </header>                
        <div class="btn-group d-flex" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" class="btn-check" name="genre" id="btn-check-todos" autocomplete="off" value="todos" checked>
          <label class="btn btn-outline-primary" for="btn-check-todos">Todos</label>

          <input type="radio" class="btn-check" name="genre" id="btn-check-clipe" autocomplete="off" value="Videoclipe">
          <label class="btn btn-outline-primary" for="btn-check-clipe">Videoclipe</label>

          <input type="radio" class="btn-check" name="genre" id="btn-check-doc" autocomplete="off" value="Documentário">
          <label class="btn btn-outline-primary" for="btn-check-doc">Documentário</label>

          <input type="radio" class="btn-check" name="genre" id="btn-check-fic" autocomplete="off" value="Ficção">
          <label class="btn btn-outline-primary" for="btn-check-fic">Ficção</label>

          <input type="radio" class="btn-check" name="genre" id="btn-check-pep" autocomplete="off" value="Pepa">
          <label class="btn btn-outline-primary" for="btn-check-pep">Pepa</label>
        </div>         
          <h1>CURTAS CONCORRENTES</h1>

        <div class="container">
          <div class="row" id="movie-list"></div>
        </div>`;       

     const renderMovies = async () => {
        let query = formsRef;
        // Faz a filtragem se um gênero foi selecionado
        if (selectedGenre && selectedGenre !== "todos") {
          if (selectedGenre === "Pepa") {
            query = query.where("PEPA", "==", true);
          } else {
            query = query.where("genero", "==", selectedGenre);
          }
        }
        // Se for jurado, só mostra os participantes
        if (!isAdm) {
          query = query.where("PARTICIPANTE", "==", true);
        }

        try {
          const querySnapshot = await query.get();
          const moviesMap = {};
          querySnapshot.forEach((doc) => {
            const movie = doc.data();
            const uid = doc.id;
            if (!moviesMap[movie.titulo]) {
              moviesMap[movie.titulo] = { ...movie, uid };
            }
          });
          const movies = Object.values(moviesMap);
          const movieList = document.getElementById("movie-list");

          movieList.innerHTML = "";
          movies.forEach((movie) => {
            const col = document.createElement("div");
            col.classList.add("col-md-3");
            col.innerHTML = ` 
          <div class="card" data-titulo="${movie.titulo}">           
            <img data-src="https://festivaltainhadourada2024.com/img/${movie.uid}.webp" class="card-img-top movie-img" alt="...">
            <div class="card-body">
              <h5 class="card-title">${movie.titulo}</h5>
              <p class="card-text">Direção: ${movie.direcao}</p>
              <p class="card-text text-end">Gênero: ${movie.genero}</p>   
            </div>
          </div>`;
            movieList.appendChild(col);
          });

          // Lazy loading das imagens
          const lazyLoadImages = () => {
            const images = document.querySelectorAll("img[data-src]");
            const config = {
              rootMargin: "0px 0px 50px 0px",
              threshold: 0.01,
            };

            let observer;
            if ("IntersectionObserver" in window) {
              observer = new IntersectionObserver(onIntersection, config);
              images.forEach((image) => {
                observer.observe(image);
              });
            } else {
              images.forEach((image) => {
                loadImage(image);
              });
            }

            function onIntersection(entries, observer) {
              entries.forEach((entry) => {
                if (entry.intersectionRatio > 0) {
                  observer.unobserve(entry.target);
                  loadImage(entry.target);
                }
              });
            }

            function loadImage(image) {
              image.src = image.getAttribute("data-src");
              image.removeAttribute("data-src");
            }
          };
          lazyLoadImages();

          // Adiciona os event listeners após os filmes serem renderizados
          this.querySelectorAll(".card").forEach((card) => {
            card.addEventListener("click", async () => {
              const titulo = card.getAttribute("data-titulo");
              const selectedMovie = moviesMap[titulo];
              const contentContainer =
                document.getElementById("content-container");
              contentContainer.innerHTML = "";

              try {
                const movieSnapshot = await firebase
                  .firestore()
                  .collection("FORMS")
                  .where("titulo", "==", titulo)
                  .get();
                if (movieSnapshot.empty) {
                  throw new Error("Filme não encontrado");
                }

                const movieDoc = movieSnapshot.docs[0];
                const movieId = movieDoc.id;
                localStorage.setItem("currentMovieId", movieId);
              } catch (error) {
                console.error("Erro ao obter o ID do filme:", error);
              }

              const ratingDetails = document.createElement(
                "rating-details-component"
              );
              ratingDetails.movieData = selectedMovie;
              contentContainer.appendChild(ratingDetails);

              window.scrollTo({ top: 0, behavior: "smooth" });
            });
          });
        } catch (error) {
          console.error("Erro ao carregar filmes:", error);
          this.innerHTML = "<p>Ocorreu um erro ao carregar os filmes.</p>";
        }
      };

      renderMovies();

      this.querySelector("#ranking-btn").addEventListener("click", () => {
        loadComponent("ranking");
      });

      document.addEventListener("change", (event) => {
        if (event.target && event.target.name === "genre") {
          selectedGenre = event.target.value;
          renderMovies();
        }
      });      
    }
  }
);
