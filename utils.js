// Função genérica para carregar um componente
function loadComponent(componentName) {
  const component = document.createElement(componentName + "-component");
  const contentContainer = document.getElementById("content-container");
  if (contentContainer) {
    contentContainer.innerHTML = ""; // Limpa o container
    contentContainer.appendChild(component);
  } else {
    console.error("Content container not found");
  }
}

// Função para obter o usuário logado
async function getCurrentUser() {
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
