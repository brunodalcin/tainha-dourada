customElements.define('ranking-component', class extends HTMLElement {
    async connectedCallback() {
      const db = firebase.firestore();
      const ratingsRef = db.collection('RATINGS');
      const formsRef = db.collection('FORMS');
  
      // Fetch all ratings
      const ratingsSnapshot = await ratingsRef.get();
      const ratings = {};
      ratingsSnapshot.forEach(doc => {
        const data = doc.data();
        if (!ratings[data.movieId]) {
          ratings[data.movieId] = {
            aspectoTecnico: 0,
            concepcaoEstetica: 0,
            relevanciaTema: 0,
            total: 0
          };
        }
        ratings[data.movieId].aspectoTecnico += data.aspectoTecnico;
        ratings[data.movieId].concepcaoEstetica += data.concepcaoEstetica;
        ratings[data.movieId].relevanciaTema += data.relevanciaTema;
        ratings[data.movieId].total += data.aspectoTecnico + data.concepcaoEstetica + data.relevanciaTema;
      });
  
      // Filmes por 'genero'
      const moviesSnapshot = await formsRef.get();
      const genres = {
          Ficção: [],
          Documentário: [],
          Videoclipe: [],
          Pepa: []
      };
      moviesSnapshot.forEach(doc => {
        const data = doc.data();
        const movieId = doc.id;
        if (ratings[movieId]) {
            if (data.genero === 'Ficção') {
                genres.Ficção.push({ ...ratings[movieId], titulo: data.titulo });
            } else if (data.genero === 'Documentário') {
                genres.Documentário.push({ ...ratings[movieId], titulo: data.titulo });
            } else if (data.genero === 'Videoclipe') {
                genres.Videoclipe.push({ ...ratings[movieId], titulo: data.titulo });
            } else if (data.PEPA) {
                genres.Pepa.push({ ...ratings[movieId], titulo: data.titulo });
            }
        }
    });
  
      // Ordenando pelo genero total da nota
      Object.keys(genres).forEach(genre => {
        genres[genre].sort((a, b) => b.total - a.total);
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
            <h1 class="mb-4">Rankings</h1>
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
                    <td>${movie.aspectoTecnico}</td>
                    <td>${movie.concepcaoEstetica}</td>
                    <td>${movie.relevanciaTema}</td>
                    <td><b>${movie.total}</b></td>
                    </tr>
                `).join('')}
                </tbody>
            </table>
            </div>
        </div>
      `;
    }
  });
  