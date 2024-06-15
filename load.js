// Função genérica para carregar um componente
function loadComponent(componentName) {
    const component = document.createElement(componentName + '-component');
    const contentContainer = document.getElementById('content-container');
    if (contentContainer) {
      contentContainer.innerHTML = ''; // Limpa o container
      contentContainer.appendChild(component);
    } else {
      console.error('Content container not found');
    }
  }
  