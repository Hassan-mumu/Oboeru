import os
from datetime import datetime
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, APIC, TIT2, TPE1, TALB, TYER, error

def ajouter_tags_mp3(chemin_fichier:str,titre_lecon:str, chemin_image:str="assets/cover.png"):
    try:
        if not os.path.exists(chemin_fichier):
            return {"succes": False, "erreur" : "Fichier MP3 introuvable."}
        
        audio = MP3(chemin_fichier, ID3=ID3)
        try:
            audio.add_tags()
        except error:
            pass
        
        #Titre Artiste Album
        audio.tags.add(TIT2(encoding=3, text=titre_lecon)) 
        audio.tags.add(TPE1(encoding=3, text="Oboeru App"))
        audio.tags.add(TALB(encoding=3, text="Mes révisions Auto"))
        annee_actuelle = str(datetime.now().year)
        audio.tags.add(TYER(encoding=3, text=annee_actuelle))
        
        if os.path.exists(chemin_image):
            with open(chemin_image, "rb") as img_file:
                audio.tags.add(
                    APIC(
                        encoding=3,
                        mime="image/png",
                        type=3,
                        desc='Cover',
                        data=img_file.read()
                    )
                )
        audio.save(v2_version=3)
        return {"succes": True}

    except Exception as e:
        return {"succes": False, "erreur": str(e)}