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
      const { userId, movieId, direcao, fotografia, direcaoArte, audioSom, edicaoMontagem, roteiro, atuacao } = data;

      // Group ratings by user
      if (!ratingsByUser[userId]) {
        ratingsByUser[userId] = [];
      }
      ratingsByUser[userId].push({
        userId,
        movieId,
        direcao,
        fotografia,
        direcaoArte,
        audioSom,
        edicaoMontagem,
        roteiro,
        atuacao,
        total: direcao + fotografia + direcaoArte + audioSom + edicaoMontagem + roteiro + atuacao
      });

      // Aggregate ratings by movie
      if (!movieRatings[movieId]) {
        movieRatings[movieId] = {
          direcao: 0,
          fotografia: 0,
          direcaoArte: 0,
          audioSom: 0,
          edicaoMontagem: 0,
          roteiro: 0,
          atuacao: 0,
          total: 0
        };
      }
      movieRatings[movieId].direcao += direcao;
      movieRatings[movieId].fotografia += fotografia;
      movieRatings[movieId].direcaoArte += direcaoArte;
      movieRatings[movieId].audioSom += audioSom;
      movieRatings[movieId].edicaoMontagem += edicaoMontagem;
      movieRatings[movieId].roteiro += roteiro;
      movieRatings[movieId].atuacao += atuacao;
      movieRatings[movieId].total += direcao + fotografia + direcaoArte + audioSom + edicaoMontagem + roteiro + atuacao;
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
        }
        if (data.PEPA) {
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
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/6.3.0/mdb.min.css">
      <header class="mb-4">
        <img src="assets/TAINHA-BRANCO-TRANSPARENTE.png" alt="Logo">  
        <div btn-group d-flex>
          <button id="curtas-btn" class="btn btn-primary">VER CURTAS CONCORRENTES</button>                
        </div>
      </header>          
      <div class="container mt-5">
        <h1 class="mb-4">Rankings por Gênero</h1>
        ${this.renderRankingTable('Melhor Ficção', genres.Ficção)}
        ${this.renderRankingTable('Melhor Documentário', genres.Documentário)}
        ${this.renderRankingTable('Melhor Videoclipe', genres.Videoclipe)}
        ${this.renderRankingTable('Melhor Pepa', genres.Pepa)}
        <h1 class="mb-4">Rankings por Usuário</h1>
        ${users.map(user => this.renderUserRankingTable(user, ratingsByUser[user.id], movieTitles)).join('')}
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
                <th scope="col">Direção</th>
                <th scope="col">Fotografia</th>
                <th scope="col">Direção de Arte</th>
                <th scope="col">Áudio e Som</th>
                <th scope="col">Edição e Montagem</th>
                <th scope="col">Roteiro</th>
                <th scope="col">Atuação</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody class="text-center">
              ${movies.map((movie, index) => `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${movie.titulo}</td>
                  <td>${movie.direcao}</td>
                  <td>${movie.fotografia}</td>
                  <td>${movie.direcaoArte}</td>
                  <td>${movie.audioSom}</td>
                  <td>${movie.edicaoMontagem}</td>
                  <td>${movie.roteiro}</td>
                  <td>${movie.atuacao}</td>                                                 
                  <td><b>${movie.total}</b></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  renderUserRankingTable(user, ratings, movieTitles) {
    ratings.sort((a, b) => b.total - a.total);
    return `
      <div class="ranking-table mb-4">
        <h4 class="mb-3">Ranking de ${user.nome}</h4>
        <div class="table-responsive">
          <table class="table table-light table-striped table-sm">
            <thead class="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Título</th>
                <th scope="col">Direção</th>
                <th scope="col">Fotografia</th>
                <th scope="col">Direção de Arte</th>
                <th scope="col">Áudio e Som</th>
                <th scope="col">Edição e Montagem</th>
                <th scope="col">Roteiro</th>
                <th scope="col">Atuação</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody class="text-center">
              ${ratings.map((rating, index) => `
                <tr>
                  <th scope="row">${index + 1}</th>
                  <td>${movieTitles[rating.movieId] || 'N/A'}</td>
                  <td>${rating.direcao}</td>
                  <td>${rating.fotografia}</td>
                  <td>${rating.direcaoArte}</td>
                  <td>${rating.audioSom}</td>
                  <td>${rating.edicaoMontagem}</td>
                  <td>${rating.roteiro}</td>
                  <td>${rating.atuacao}</td>                                                 
                  <td><b>${rating.total}</b></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
});
