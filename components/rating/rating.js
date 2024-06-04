customElements.define('rating-component', class extends HTMLElement {
  connectedCallback() {
    const db = firebase.firestore();
    const formsRef = db.collection('FORMS');

    formsRef.get().then((querySnapshot) => {
      const moviesMap = {};
      querySnapshot.forEach((doc) => {
        const movie = doc.data();
        // impede cadastros duplicados
        if (!moviesMap[movie.titulo]) {
          moviesMap[movie.titulo] = movie;
        }
      });
      const movies = Object.values(moviesMap);
      this.innerHTML = `
        <link rel="stylesheet" href="/components/rating/rating.css">
        <header>
          <img src="assets/TAINHA-BRANCO-TRANSPARENTE.png" alt="Logo">
        </header>
        <h1>CURTAS CONCORRENTES</h1>          
        <div class="container">
          <div class="row">
            ${movies.map(movie => `
              <div class="col-md-3">
                <div class="card" data-titulo="${movie.titulo}">
                  <img src="${movie.cartaz}" class="card-img-top movie-img" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">${movie.titulo}</h5>
                    <p class="card-text">Direção: ${movie.direcao}</p>
                    <p class="card-text text-end">Gênero: ${movie.genero}</p>                      
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
      `;

      this.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
          const titulo = card.getAttribute('data-titulo');
          const selectedMovie = moviesMap[titulo];
          const contentContainer = document.getElementById('content-container');
          contentContainer.innerHTML = ''; // Limpa o conteúdo atual

          const ratingDetails = document.createElement('rating-details-component');
          ratingDetails.movieData = selectedMovie;
          contentContainer.appendChild(ratingDetails);

          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });

    }).catch((error) => {
      console.error('Erro ao carregar filmes:', error);
      this.innerHTML = '<p>Ocorreu um erro ao carregar os filmes.</p>';
    });
  }
});
