class RatingDetailsComponent extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = `
            <style>
                .movie-detail-container {
                    padding: 20px;
                }
                .movie-detail-container img {
                    max-width: 100%;
                    height: auto;
                }
                .movie-detail-container a {
                    display: block;
                    margin-top: 10px;
                }
            </style>
            <div id="movie-detail-container" class="movie-detail-container"></div>
        `;

        await this.initializeDetailPage();
    }

    async getMovieDetail(titulo) {
        const doc = await firebase.firestore().collection('FORMS').where('TITULO', '==', titulo).get();
        if (doc.empty) {
            console.error('No matching documents.');
            return null;
        }

        const movieData = doc.docs[0].data();
        const storageRef = firebase.storage().ref(`UPLOADS/${movieData.TITULO}`);
        const files = await storageRef.listAll();
        const movieFiles = {
            autorizacao: null,
            cartaz: null,
            matricula: []
        };

        for (const item of files.items) {
            const fileName = item.name;
            if (fileName.startsWith('autorizacao_')) {
                movieFiles.autorizacao = await item.getDownloadURL();
            } else if (fileName.startsWith('cartaz_')) {
                movieFiles.cartaz = await item.getDownloadURL();
            } else if (fileName.startsWith('matricula_')) {
                movieFiles.matricula.push(await item.getDownloadURL());
            }
        }

        return {
            ...movieData,
            files: movieFiles
        };
    }

    renderMovieDetail(movie) {
        const container = this.querySelector('#movie-detail-container');
        container.innerHTML = '';

        if (!movie) {
            container.textContent = 'Filme não encontrado.';
            return;
        }

        const title = document.createElement('h2');
        title.textContent = movie.TITULO;
        container.appendChild(title);

        const cartazImg = document.createElement('img');
        cartazImg.src = movie.files.cartaz;
        cartazImg.alt = movie.TITULO;
        container.appendChild(cartazImg);

        const autorizacaoLink = document.createElement('a');
        autorizacaoLink.href = movie.files.autorizacao;
        autorizacaoLink.textContent = 'Autorização';
        container.appendChild(autorizacaoLink);

        movie.files.matricula.forEach((matriculaUrl, index) => {
            const matriculaLink = document.createElement('a');
            matriculaLink.href = matriculaUrl;
            matriculaLink.textContent = `Matrícula ${index + 1}`;
            container.appendChild(matriculaLink);
        });
    }

    async initializeDetailPage() {
        const params = new URLSearchParams(window.location.search);
        const titulo = params.get('titulo');
        if (!titulo) {
            console.error('Título não especificado.');
            return;
        }

        const movie = await this.getMovieDetail(titulo);
        this.renderMovieDetail(movie);
    }
}

customElements.define('rating-details-component', RatingDetailsComponent);
