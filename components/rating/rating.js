customElements.define('rating-component', class extends HTMLElement {
    connectedCallback() {
      const db = firebase.firestore();
      const formsRef = db.collection('FORMS');
  
      formsRef.get().then((querySnapshot) => {
        const moviesMap = {};
        querySnapshot.forEach((doc) => {
          const movie = doc.data();
          //impede cadastros duplicados
          if (!moviesMap[movie.titulo]) {
            moviesMap[movie.titulo] = movie;
          }
        });
        const movies = Object.values(moviesMap);
        this.innerHTML = `
          <style>
            @import url('https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/3.6.0/mdb.min.css');
            .card {
              margin: 10px;          
              flex-direction: column;
              align-items: center;     
              border-radius: 10%;       
            }
            .movie-img { 
              width: 75%; 
              height: auto; 
              content-align: center;
              border-radius: 10%;             
            }
          </style>
          <div class="container">
            <div class="row">
              ${movies.map(movie => `
                <div class="col-md-4">
                  <div class="card">
                    <img src="${movie.cartaz}" class="card-img-top movie-img" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${movie.titulo}</h5>
                      <p class="card-text">Direção: ${movie.direcao}</p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).catch((error) => {
        console.error('Erro ao carregar filmes:', error);
        this.innerHTML = '<p>Ocorreu um erro ao carregar os filmes.</p>';
      });
    }
  });
  