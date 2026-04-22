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

    if (!response.ok) {
      throw new Error(`Erreur lors de l'envoi : ${response.status} ${response.statusText}`);
    }

    // On transforme la réponse JSON du backend en objet JavaScript
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Erreur réseau ou serveur :", error);
    throw error; // On renvoie l'erreur pour la traiter dans l'interface visuelle
  }
}