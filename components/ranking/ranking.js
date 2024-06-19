customElements.define('ranking-component', class extends HTMLElement {
  async connectedCallback() {
    const db = firebase.firestore();
    const ratingsRef = db.collection('RATINGS');
    const formsRef = db.collection('FORMS');
    const usersRef = db.collection('USERS');

    // Fetch all ratings
    const ratingsSnapshot = await ratingsRef.get();
    const ratingsByUser = {};
    const movieRatings = {};

    ratingsSnapshot.forEach(doc => {
      const data = doc.data();
      const { userId, movieId, aspectoTecnico, concepcaoEstetica, relevanciaTema } = data;

      // Group ratings by user
      if (!ratingsByUser[userId]) {
        ratingsByUser[userId] = [];
      }
      ratingsByUser[userId].push({
        movieId,
        aspectoTecnico,
        concepcaoEstetica,
        relevanciaTema,
        total: aspectoTecnico + concepcaoEstetica + relevanciaTema
      });

      // Aggregate ratings by movie
      if (!movieRatings[movieId]) {
        movieRatings[movieId] = {
          aspectoTecnico: 0,
          concepcaoEstetica: 0,
          relevanciaTema: 0,
          total: 0
        };
      }
      movieRatings[movieId].aspectoTecnico += aspectoTecnico;
      movieRatings[movieId].concepcaoEstetica += concepcaoEstetica;
      movieRatings[movieId].relevanciaTema += relevanciaTema;
      movieRatings[movieId].total += aspectoTecnico + concepcaoEstetica + relevanciaTema;
    });

    // Fetch movie data
    const moviesSnapshot = await formsRef.get();
    const genres = {
      Ficção: [],
      Documentário: [],
      Videoclipe: [],
      Pepa: []
    };
    const movieTitles = {};

    moviesSnapshot.forEach(doc => {
      const data = doc.data();
      const movieId = doc.id;
      movieTitles[movieId] = data.titulo;

      if (movieRatings[movieId]) {
        const movieData = {
          ...movieRatings[movieId],
          titulo: data.titulo
        };
        if (data.genero === 'Ficção') {
          genres.Ficção.push(movieData);
        } else if (data.genero === 'Documentário') {
          genres.Documentário.push(movieData);
        } else if (data.genero === 'Videoclipe') {
          genres.Videoclipe.push(movieData);
        } else if (data.genero === 'Pepa') {
          genres.Pepa.push(movieData);
        }
      }
    });

    // Sort movies by total rating
    Object.keys(genres).forEach(genre => {
      genres[genre].sort((a, b) => b.total - a.total);
    });

    // Fetch user data
    const usersSnapshot = await usersRef.get();
    const users = [];

    usersSnapshot.forEach(doc => {
      const data = doc.data();
      const userId = doc.id;
      if (ratingsByUser[userId]) {
        users.push({ id: userId, nome: data.login });
      }
    });

    // Render the rankings
    this.innerHTML = `
      <link rel="stylesheet" href="components/ranking/ranking.css">              
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
      <header class="mb-4">
        <img src="assets/TAINHA-BRANCO-TRANSPARENTE.png" alt="Logo">  
        <div btn-group d-flex>
          <button id="curtas-btn" class="btn btn-primary">VER CURTAS CONCORRENTES</button>                
        </div>
      </header>      
      <div class="container mt-5">
        <h1 class="mb-4">Rankings por Gênero</h1>
        <div class="row">
          <div class="col-md-6">
            ${this.renderRankingTable('Melhor Ficção', genres.Ficção)}
          </div>
          <div class="col-md-6">
            ${this.renderRankingTable('Melhor Documentário', genres.Documentário)}
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            ${this.renderRankingTable('Melhor Videoclipe', genres.Videoclipe)}
          </div>
          <div class="col-md-6">
            ${this.renderRankingTable('Melhor Pepa', genres.Pepa)}
          </div>
        </div>
        <h1 class="mb-4">Rankings por Usuário</h1>
        <div class="row">
          <div class="col-md-12">
            ${users.map(user => this.renderUserRankingTable(user, ratingsByUser[user.id], movieTitles)).join('')}
          </div>
        </div>
      </div>
    `;

    // Adiciona o evento de clique ao botão de curtas concorrentes
    this.querySelector('#curtas-btn').addEventListener('click', () => {
      loadComponent('rating');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  renderRankingTable(title, movies) {
    return `
      <div class="ranking-table mb-4">
        <h4 class="mb-3">${title}</h4>
        <div class="table-responsive">
          <table class="table table-light table-striped table-sm">
            <thead class="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Título</th>
                <th scope="col">Técnico</th>
                <th scope="col">Estética</th>
                <th scope="col">Tema</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody class="text-center">
              ${movies.map((movie, index) => `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${movie.titulo}</td>
                  <td>${movie.aspectoTecnico.toFixed(2)}</td>
                  <td>${movie.concepcaoEstetica.toFixed(2)}</td>
                  <td>${movie.relevanciaTema.toFixed(2)}</td>
                  <td><b>${movie.total.toFixed(2)}</b></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderUserRankingTable(user, ratings, movieTitles) {
    return `
      <div class="ranking-table mb-4">
        <h4 class="mb-3">${user.nome}</h4>
        <div class="table-responsive">
          <table class="table table-light table-striped table-sm">
            <thead class="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Título</th>
                <th scope="col">Técnico</th>
                <th scope="col">Estética</th>
                <th scope="col">Tema</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody class="text-center">
              ${ratings.map((rating, index) => `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${movieTitles[rating.movieId]}</td>
                  <td>${rating.aspectoTecnico.toFixed(2)}</td>
                  <td>${rating.concepcaoEstetica.toFixed(2)}</td>
                  <td>${rating.relevanciaTema.toFixed(2)}</td>
                  <td><b>${rating.total.toFixed(2)}</b></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
});
