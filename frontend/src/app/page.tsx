"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- NOUVEL IMPORT POUR LA NAVIGATION
import { uploadExcelFile } from '@/src/api/importation';
import DropzoneArea from '@/src/features/importation/components/DropzoneArea';
import Button from '@/src/components/ui/Button_1';
import { BookOpen, ScanLine, Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter(); // <-- INITIALISATION DU ROUTEUR
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const reponseBackend = await uploadExcelFile(file);
      
      // 1. On sauvegarde les données reçues dans la session du navigateur
      sessionStorage.setItem('oboeru_data', JSON.stringify(reponseBackend));
      
      // 2. On redirige vers la nouvelle page !
      router.push('/configuration');
      
    } catch (erreur) {
      alert("Erreur lors de l'envoi du fichier.");
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 flex justify-center items-start pt-20">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col justify-center">
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
            <p className="text-emerald-900 font-medium">Analyse et préparation de votre projet...</p>
          </div>
        ) : (
          <>
            <DropzoneArea onFileUpload={handleFileUpload} />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button label="Importer depuis Anki" icon={BookOpen} onClick={() => {}} />
              <Button label="Scanner un document (OCR)" icon={ScanLine} onClick={() => {}} />
            </div>
          </>
        )}

      </div>
    </main>
  );
}