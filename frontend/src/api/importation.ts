const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Envoie le fichier Excel/CSV au backend FastAPI
 * @param file Le fichier sélectionné par l'utilisateur
 * @returns La réponse du serveur (qui devrait contenir la liste des colonnes)
 */
export async function uploadExcelFile(file: File) {
  // FormData est l'objet standard du navigateur pour envoyer des fichiers
  const formData = new FormData();
  
  // Attention : "file" doit correspondre exactement au nom du paramètre attendu par ta route FastAPI
  formData.append("file", file);

  try {
    const response = await fetch(`${API_URL}/upload/`, {
      method: "POST",
      body: formData,
      // Note : pas besoin de définir le Content-Type, le navigateur s'en charge automatiquement pour les FormData
    });

    // 1. On transforme directement la réponse en JSON pour pouvoir la lire
    const data = await response.json();

    // 2. Si le code HTTP n'est pas bon (ex: erreur 500 ou 422)
    if (!response.ok) {
      throw new Error(data.erreur || `Erreur lors de l'envoi : ${response.status} ${response.statusText}`);
    }

    // 3. NOUVEAU : Si FastAPI renvoie un HTTP 200 OK, mais avec une erreur logique (ex: fichier vide)
    if (data.erreur) {
      throw new Error(data.erreur);
    }

    // Si on arrive ici, c'est que tout est parfait !
    return data;
    
  } catch (error) {
    console.error("Erreur réseau ou serveur :", error);
    throw error; // On renvoie l'erreur pour la traiter dans l'interface visuelle (page.tsx)
  }
}