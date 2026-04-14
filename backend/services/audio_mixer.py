import os
import re
from pathlib import Path
from pydub import AudioSegment
from services.tts_services import generer_audio_mot

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
        dossier_audio = Path("audio")
        dossier_audio.mkdir(exist_ok=True)
        chemin_complet = dossier_audio / nom_fichier_sortie

        # Export avec un bitrate standard pour la voix (qualité/poids optimal)
        audio_final.export(chemin_complet, format="mp3", bitrate="128k")

        return {"succes": True, "chemin": str(chemin_complet)}
    
    except Exception as e:
        return {"succes": False, "erreur": str(e)}
    
    
def nettoyer_texte(texte:str):
    if not isinstance(texte,str):
        return ""
    texte_propre = re.sub(r"\(.*?\)","", texte)
    
    return texte_propre

def creer_piste_complet(paire_mots: list, duree_silence_sec: float, fichier_sortie: str="lecon_complete.mp3" ):
    """
    Reçoit une liste de dictionnaires: [{"source": "...", "traduction": "..."}, ...]
    Génère l'audio complet de la leçon et nettoie les fichiers temporaires.
    """
    try:
        dossier_audio = Path("audio")
        dossier_audio.mkdir(exist_ok=True)
        
        piste_final = AudioSegment.empty()
        
        silence_reflexion = AudioSegment.silent(duration=int(duree_silence_sec * 1000))
        silence_transition =  AudioSegment.silent(duration=3000)
        
        fichiers_temporaires = []
        
        for i, pair in enumerate(paire_mots):
            mot_source = nettoyer_texte(pair["source"])
            mot_trad = nettoyer_texte(pair["traduction"])
            
            temp_file_source = f"temp_file_source{i}.mp3"
            temp_file_trad = f"temp_file_trad{i}.mp3"
            
            res_source = generer_audio_mot(mot_source, "nova",temp_file_source)
            res_trad = generer_audio_mot(mot_trad,"alloy",temp_file_trad)
            
            if res_source["succes"] and res_trad["succes"]:
                
                audio_source = AudioSegment.from_mp3(res_source["chemin"])
                audio_trad = AudioSegment.from_mp3(res_trad["chemin"])
                
                bloc = audio_source + silence_reflexion + audio_trad + silence_transition
                piste_final += bloc
                
                fichiers_temporaires.extend([res_source["chemin"], res_trad["chemin"]])
                
            else:
                print(f"Erreure de génération pour la paire {i}")
                
        chemin_complet = dossier_audio/ fichier_sortie
        piste_final.export(chemin_complet, format="mp3", bitrate="128k")
        
        for fichier in fichiers_temporaires:
            if os.path.exists(fichier):
                os.remove(fichier)
                
        return {"succes": True, "chemin": str(chemin_complet)}
        
    except Exception as e:
        return {"succes": False, "erreur": str(e)}
        