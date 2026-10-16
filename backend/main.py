import os
import pandas as pd
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

# Imports de tes services
from services.tts_services import generer_audio_mot
from services.audio_mixer import assembler_paire_audio, creer_piste_complet

load_dotenv()

# ==========================================
# 1. MODÈLES DE DONNÉES (PYDANTIC)
# ==========================================
class ParametresAudio(BaseModel):
    voix: str
    volume: int
    vitesse: int
    silence: float

class ParametresSortie(BaseModel):
    utiliser_traduction: bool
    langue_traduction: Optional[str] = ""
    format: str

class GenerationPayload(BaseModel):
    lignes: List[Dict[str, Any]]
    parametres_audio: ParametresAudio
    parametres_sortie: ParametresSortie


# ==========================================
# 2. INITIALISATION DE FASTAPI & CORS
# ==========================================
app = FastAPI()

origines_autorises = [
    os.getenv("FRONTEND_URL", "http://localhost:3000") # (Note : j'ai mis http au lieu de https pour du dev local)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origines_autorises,    # ouvre l'accès à mon frontend(Next.js)
    allow_credentials=True,             # Autorise le passage des cookies/sessions
    allow_methods=["*"],                # Autorise toute les requetes (get, post, etc)
    allow_headers=["*"],                # Autorise tous les en-tetes
)


# ==========================================
# 3. ROUTES DE L'API
# ==========================================

@app.post("/upload/")
async def upload_fichier(file: UploadFile = File(...)):
    try:
        extension = file.filename.split(".")[-1].lower()

        # On lit le fichier BRUT
        if extension == "csv":
            df = pd.read_csv(file.file, sep=None, engine='python', header=None)
        elif extension in ["xls", "xlsx"]:
            df = pd.read_excel(file.file, header=None)
        else:
            return {"erreur": f"Format non supporté ({extension})."}

        df = df.dropna(how="all", axis=0).dropna(how="all", axis=1)
        lignes_valides = df.dropna(thresh=2)

        if lignes_valides.empty:
            return {"erreur": "Le fichier semble vide ou ne contient pas au moins 2 colonnes."}

        index_entete = lignes_valides.index[0]
        df.columns = df.loc[index_entete]
        df = df.loc[index_entete + 1:]
        df = df.dropna(how="all")
        df = df.fillna("")
        
        data = df.to_dict(orient="records")

        return {
            "nom_fichier": file.filename,
            "colonnes_detectees": list(df.columns),
            "lignes_extraites": len(data),
            "donnees": data
        }
    except Exception as e:
        return {"erreur": f"Impossible de lire le fichier: {str(e)}"}
    

@app.get("/test-tts/")
async def tester_voix(voix: str = "nova", texte: str = "Ceci est un test de la voix sélectionnée pour votre leçon."):
    """
    Route dynamique pour tester la voix (Frontend: US-206).
    """
    resultat = generer_audio_mot(
        texte=texte, 
        voix=voix, 
        nom_fichier=f"apercu_{voix}.mp3" 
    )
    
    if resultat["succes"]:
        return FileResponse(resultat["chemin"], media_type="audio/mpeg")
    else:
        return {"erreur": "La génération a échoué", "details": resultat["erreur"]}


@app.get("/test-audio-mixer/")
async def texter_mixer():
    chemin_test = "audio/test_vroman.mp3"
    
    if not os.path.exists(chemin_test):
        return {"erreur": "le fichier de base est introuvable"}
    
    resultat = assembler_paire_audio(
        chemin_test,
        chemin_test,
        3.0,
        "test_silence_3s.mp3"
    )
    
    if resultat["succes"]:
        return {'message': "Mixage réussi !", "fichier": resultat["chemin"]}
    else:
        return {"erreur": "Le mixage a échoué", "details": resultat["erreur"]}


@app.post("/test-pipeline-complet/")
async def tester_pipeline_complet():
    """Route de test interne mise à jour avec les nouveaux paramètres"""
    data_test = [
        {"source": "おはようございます", "traduction": "Bonjour (le matin)"},
        {"source": "ありがとう", "traduction": "Merci"},
        {"source": "さようなら", "traduction": "Au revoir"}
    ]
    
    resultat = creer_piste_complet(
        lignes=data_test,
        voix="nova",
        volume=100,
        vitesse=1.0,
        silence_sec=3.0,
        utiliser_trad=True,
        fichier_sortie="leçon_japonaise_v2.mp3"
    )
    
    if resultat["succes"]:
        return {"message" : "Leçon générée avec succès!", "fichier": resultat["chemin"]}
    else:
        return {"erreur" : "La génération a échoué", "fichier": resultat["erreur"]}


# ==========================================
# 4. ROUTE DE GÉNÉRATION FINALE
# ==========================================
@app.post("/api/generer-lecon/")
async def api_generer_lecon(payload: GenerationPayload):
    """
    Reçoit le gros paquet de données du Frontend, génère la leçon, et renvoie le fichier.
    """
    # Conversion de la vitesse (ex: 110% -> 1.1)
    vitesse_ratio = payload.parametres_audio.vitesse / 100.0
    
    # Appel à notre service mis à jour
    resultat = creer_piste_complet(
        lignes=payload.lignes,
        voix=payload.parametres_audio.voix,
        volume=payload.parametres_audio.volume,
        vitesse=vitesse_ratio,
        silence_sec=payload.parametres_audio.silence,
        utiliser_trad=payload.parametres_sortie.utiliser_traduction,
        fichier_sortie="Ma_Lecon_Oboeru.mp3"
    )
    
    if resultat["succes"]:
        # Retourne le fichier MP3 au Frontend pour téléchargement
        return FileResponse(resultat["chemin"], media_type="audio/mpeg", filename="Ma_Lecon_Oboeru.mp3")
    else:
        return {"erreur": "La génération a échoué", "details": resultat["erreur"]}