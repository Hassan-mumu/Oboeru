import os
from pathlib import Path
from pydub import AudioSegment

def assembler_paire_audio(chemin_audio_1: str, chemin_audio_2: str, duree_silence_sec: float, nom_fichier_sortie: str):
    """
    Charge deux fichiers MP3, génère un silence de X secondes,
    assemble le tout et exporte le résultat.
    """
    try:
        # Pydub travaille exclusivement en millisecondes. 
        # On convertit donc les secondes demandées par l'utilisateur.
        duree_silence_ms = int(duree_silence_sec * 1000)

        # 1. Chargement des pistes en mémoire
        audio_source = AudioSegment.from_mp3(chemin_audio_1)
        audio_traduction = AudioSegment.from_mp3(chemin_audio_2)

        # 2. Génération mathématique d'un "blanc" (un signal plat sans bruit de fond)
        silence = AudioSegment.silent(duration=duree_silence_ms)

        # 3. Assemblage des pistes (Concaténation)
        audio_final = audio_source + silence + audio_traduction

        # 4. Sauvegarde
        dossier_audio = Path("audios_generes")
        dossier_audio.mkdir(exist_ok=True)
        chemin_complet = dossier_audio / nom_fichier_sortie

        # Export avec un bitrate standard pour la voix (qualité/poids optimal)
        audio_final.export(chemin_complet, format="mp3", bitrate="128k")

        return {"succes": True, "chemin": str(chemin_complet)}
    
    except Exception as e:
        return {"succes": False, "erreur": str(e)}