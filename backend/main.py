import os
import pandas as pd
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from services.tts_services import generer_audio_mot
from services.audio_mixer import assembler_paire_audio, creer_piste_complet

load_dotenv()

app = FastAPI()



origines_autorises = [
    os.getenv("FRONTEND_URL", "https://localhost:3000")
]

app.add_middleware(
    CORSMiddleware,
    allow_orgins=origines_autorises,    #ouvre l'accès à mon frontend(Next.js)
    allow_credentials=True,             # Autorise le passage des cookies/sessions
    allow_methods=["*"],                # Autorise toute les requetes (get, post, etc)
    allow_headers=["*"],                # Autorise tous les en-tetes
)

@app.post("/upload/")
async def upload_fichier(file: UploadFile = File(...)):
    try:
        extension = file.filename.split(".")[-1].lower()

        # On lit le fichier BRUT, sans définir d'en-tête par défaut (header=None)
        if extension == "csv":
            df = pd.read_csv(file.file, sep=None, engine='python', header=None)
        elif extension in ["xls", "xlsx"]:
            df = pd.read_excel(file.file, header=None)
        else:
            return {"erreur": f"Format non supporté ({extension})."}

        # On supprime les lignes et colonnes qui sont 100% vides
        df = df.dropna(how="all", axis=0).dropna(how="all", axis=1)

        # B. On cherche la vraie ligne d'en-tête.
        # C'est généralement la première ligne qui possède au moins 2 colonnes remplies (Mot source + Traduction)
        # 'thresh=2' veut dire "au moins 2 valeurs non nulles"
        lignes_valides = df.dropna(thresh=2)

        if lignes_valides.empty:
            return {"erreur": "Le fichier semble vide ou ne contient pas au moins 2 colonnes."}

        # On récupère le numéro de cette fameuse ligne
        index_entete = lignes_valides.index[0]

        # C. On dit à Pandas indique à panda les vrai entetes de colonne
        df.columns = df.loc[index_entete]

        # D. On coupe le tableau pour ne garder que les données SOUS l'en-tête
        df = df.loc[index_entete + 1:]

        # E. Dernier coup de balai (si l'utilisateur a laissé des lignes vides au milieu du tableau)
        df = df.dropna(how="all")

        # on rempli les dernier vide restant par des chaine vide pour éviter les erreures
        df = df.fillna("")
        
        # On transforme le tableau propre en JSON
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
async def tester_voix():
    texte_test = "Bonjour Madame Vroman, voici votre première génération audio depuis OpenAI !"
    
    # On appelle notre service
    resultat = generer_audio_mot(
        texte=texte_test, 
        voix="nova", 
        nom_fichier="test_vroman.mp3"
    )
    
    if resultat["succes"]:
        return {"message": "Audio généré avec succès !", "fichier": resultat["chemin"]}
    else:
        return {"erreur": "La génération a échoué", "details": resultat["erreur"]}
    
@app.get("/test-audio-mixer/")
async def texter_mixer():
    
    chemin_test = "audio/test_vroman.mp3"
    
    if not os.path.exists(chemin_test):
        return {"erreur": "lefichier de base est introuvable"}
    
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
    
    data_test = [
        {"source": "おはようございます", "traduction": "Bonjour (le matin)"},
        {"source": "ありがとう", "traduction": "Merci"},
        {"source": "さようなら", "traduction": "Au revoir"}
    ]
    
    resultat = creer_piste_complet(
        paire_mots=data_test,
        duree_silence_sec=3.0,
        fichier_sortie="leçon_japonaise_v2.mp3"
    )
    
    if resultat["succes"]:
        return {"message" : "Leçon généré avec succès!", "fichier": resultat["chemin"]}
    else:
        return {"erreur" : "La génération à échoué", "fichier": resultat["erreur"]}