"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VerificationDonnees from '@/src/features/importation/components/VerificationDonnees';
import ParametresAudio from '@/src/features/importation/components/ParametresAudio';
import ParametresSortie from '@/src/features/importation/components/ParametresSortie';
import { DonneesImportees } from '@/src/types/importationTypes';
export default function ConfigurationPage() {
  const router = useRouter();
  const [donnees, setDonnees] = useState<DonneesImportees | null>(null);

  // --- 1. ÉTATS CENTRALISÉS POUR PARAMETRES AUDIO ---
  const [voix, setVoix] = useState<string>("nova");
  const [volume, setVolume] = useState<number>(100);
  const [vitesse, setVitesse] = useState<number>(110);
  const [silence, setSilence] = useState<number>(3);
  
  // --- 2. ÉTATS CENTRALISÉS POUR PARAMETRES SORTIE ---
  const [utiliserTraduction, setUtiliserTraduction] = useState<boolean>(true);
  const [langueTraduction, setLangueTraduction] = useState<string>("");

  // --- 3. ÉTAT POUR LE BOUTON GÉNÉRER ---
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedData = sessionStorage.getItem('oboeru_data');
      if (savedData) {
        setDonnees(JSON.parse(savedData));
      } else {
        router.push('/');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  // génération finale
  const handleGeneration = async () => {
    if (!donnees) return;
    setIsGenerating(true);

    const payload = {
      lignes: donnees.lignes,
      parametres_audio: { voix, volume, vitesse, silence },
      parametres_sortie: { utiliser_traduction: utiliserTraduction, langue_traduction: langueTraduction, format: "mp3" }
    };

    try {
      // NOTE: Remplacer l'URL par la bonne route API quand elle existera côté FastAPI
      const response = await fetch("http://localhost:8000/api/generer-lecon/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erreur serveur");

      // Logique pour télécharger le MP3 généré
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Ma_Lecon_Oboeru.mp3";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la génération. (Le backend est-il configuré ?)");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!donnees) return null;

  return (
    <main className="min-h-screen bg-gray-50 p-8 pt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLONNE GAUCHE */}
        <div className="flex flex-col">
          <VerificationDonnees donnees={donnees} />
        </div>

        {/* COLONNE DROITE */}
        <div className="flex flex-col gap-6">
          
          {/* Passage des Props à ParametresAudio */}
          <ParametresAudio 
            voix={voix} setVoix={setVoix}
            volume={volume} setVolume={setVolume}
            vitesse={vitesse} setVitesse={setVitesse}
            silence={silence} setSilence={setSilence}
          />
          
          {/* Passage des Props à ParametresSortie */}
          <ParametresSortie 
            utiliserTraduction={utiliserTraduction}
            setUtiliserTraduction={setUtiliserTraduction}
            langueTraduction={langueTraduction}
            setLangueTraduction={setLangueTraduction}
          />

          {/* LE BOUTON GÉNÉRER LA LEÇON */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleGeneration}
              disabled={isGenerating}
              className="px-8 py-3 bg-[#2a5b45] text-white font-bold rounded-lg hover:bg-[#1f4534] transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2a5b45] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Génération en cours...
                </>
              ) : (
                "Générer la leçon"
              )}
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}