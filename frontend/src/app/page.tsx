"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadExcelFile } from '@/src/api/importation';
import DropzoneArea from '@/src/features/importation/components/DropzoneArea';
import Button from '@/src/components/ui/Button_1';
import { BookOpen, ScanLine, Loader2, AlertCircle } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // NOUVEAU : État pour l'erreur

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setErrorMessage(null); // On réinitialise l'erreur à chaque nouvelle tentative

    try {
      const reponseBackend = await uploadExcelFile(file);
      
      sessionStorage.setItem('oboeru_data', JSON.stringify(reponseBackend));
      router.push('/configuration');
      
    } catch (erreur: any) {
      // On récupère le message exact (celui de FastAPI ou du navigateur)
      setErrorMessage(erreur.message || "Erreur lors de l'envoi du fichier.");
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 flex justify-center items-start pt-20">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col justify-center">
        
        {/* NOUVEAU : Bloc d'affichage de l'erreur */}
        {errorMessage && !isUploading && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">Échec de l'importation</h3>
              <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
            </div>
            <button 
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              ✕
            </button>
          </div>
        )}

        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
            <p className="text-emerald-900 font-medium">Analyse et préparation de votre projet...</p>
          </div>
        ) : (
          <>
            <DropzoneArea onFileUpload={handleFileUpload} onError={setErrorMessage} />
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