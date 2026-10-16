import os
import re
from pathlib import Path
from pydub import AudioSegment
from services.tts_services import generer_audio_mot
from services.metadata_services import ajouter_tags_mp3

def assembler_paire_audio(chemin_audio_1: str, chemin_audio_2: str, duree_silence_sec: float, nom_fichier_sortie: str):
    """
    Charge deux fichiers MP3, génère un silence de X secondes,F
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

def creer_piste_complet(lignes: list, voix: str, volume: int, vitesse: float, silence_sec: float, utiliser_trad: bool, fichier_sortie: str="lecon_complete.mp3"):
    try:
        dossier_audio = Path("audio")
        dossier_audio.mkdir(exist_ok=True)
        
        piste_final = AudioSegment.empty()
        silence_reflexion = AudioSegment.silent(duration=int(silence_sec * 1000))
        silence_transition = AudioSegment.silent(duration=2000) # 2 sec entre chaque bloc
        
        fichiers_temporaires = []
        
        for i, ligne in enumerate(lignes):
            # On extrait dynamiquement les valeurs (Col 1 = Source, Col 2 = Traduction)
            valeurs = list(ligne.values())
            if len(valeurs) < 1:
                continue
                
            mot_source = nettoyer_texte(str(valeurs[0]))
            mot_trad = nettoyer_texte(str(valeurs[1])) if len(valeurs) > 1 else ""
            
            temp_file_source = f"temp_src_{i}.mp3"
            res_source = generer_audio_mot(mot_source, voix, temp_file_source, vitesse)
            
            if res_source["succes"]:
                audio_source = AudioSegment.from_mp3(res_source["chemin"])
                bloc = audio_source + silence_reflexion
                fichiers_temporaires.append(res_source["chemin"])
                
                # Ajout de la traduction uniquement si la case est cochée et que le texte existe
                if utiliser_trad and mot_trad:
                    temp_file_trad = f"temp_trad_{i}.mp3"
                    res_trad = generer_audio_mot(mot_trad, voix, temp_file_trad, vitesse)
                    
                    if res_trad["succes"]:
                        audio_trad = AudioSegment.from_mp3(res_trad["chemin"])
                        bloc += audio_trad
                        fichiers_temporaires.append(res_trad["chemin"])
                
                bloc += silence_transition
                piste_final += bloc
            else:
                print(f"Erreur de génération pour la ligne {i}")
                
        # Ajustement du volume global
        if volume != 100:
            if volume == 0:
                piste_final = piste_final - 100
            else:
                changement_db = 20 * math.log10(volume / 100.0)
                piste_final = piste_final + changement_db
                
        # Exportation
        chemin_complet = dossier_audio / fichier_sortie
        piste_final.export(chemin_complet, format="mp3", bitrate="128k")
        
        # Nettoyage des petits fichiers MP3
        for fichier in fichiers_temporaires:
            if os.path.exists(fichier):
                os.remove(fichier)
                
        # Ajout des métadonnées (US-304)
        ajouter_tags_mp3(
            chemin_fichier=str(chemin_complet),
            titre_lecon="Leçon Oboeru"
        )
        
        return {"succes": True, "chemin": str(chemin_complet)}
        
    except Exception as e:
        return {"succes": False, "erreur": str(e)}