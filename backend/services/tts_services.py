from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

# On charge le fichier .env spécifiquement pour ce fichier
load_dotenv()

# Le client OpenAI va automatiquement lire la clé OPENAI_API_KEY dans ton fichier .env
client = OpenAI()

def generer_audio_mot(texte: str, voix: str = "nova", nom_fichier: str = "test.mp3"):
    """
    Envoie un texte à OpenAI et sauvegarde le fichier audio généré.
    Voix recommandées : 'nova' (féminine, très naturelle) ou 'alloy' (neutre).
    """
    try:
        # On s'assure que le dossier de destination existe
        dossier_audio = Path("audios_generes")
        dossier_audio.mkdir(exist_ok=True)
        
        chemin_complet = dossier_audio / nom_fichier

        # On fait la requête à l'API
        reponse = client.audio.speech.create(
            model="tts-1",
            voice=voix,
            input=texte
        )

        # On sauvegarde le flux binaire dans notre fichier MP3
        reponse.write_to_file(chemin_complet)
        
        return {"succes": True, "chemin": str(chemin_complet)}
    
    except Exception as e:
        return {"succes": False, "erreur": str(e)}