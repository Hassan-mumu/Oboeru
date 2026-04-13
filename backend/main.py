import os
import pandas as pd
from fastapi import FastAPI, UploadFile, File
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()


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
