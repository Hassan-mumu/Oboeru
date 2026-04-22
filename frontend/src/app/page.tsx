"use client";

import DropzoneArea from '@/src/features/importation/components/DropzoneArea';
import Button from '@/src/components/ui/Button_1'; // Ton nouveau composant générique
import { BookOpen, ScanLine } from 'lucide-react';

export default function Home() {
  
  const handleFileUpload = (file: File) => {
    alert(`Fichier "${file.name}" prêt à être envoyé au backend !`);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 flex justify-center items-start pt-20">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        <DropzoneArea onFileUpload={handleFileUpload} />

        <div className="grid grid-cols-2 gap-4 mt-6">
          {/* Utilisation de ton composant générique ! */}
          <Button 
            label="Importer depuis Anki" 
            icon={BookOpen} 
            onClick={() => console.log("Clic sur Anki")} 
          />
          
          <Button 
            label="Scanner un document (OCR)" 
            icon={ScanLine} 
            onClick={() => console.log("Clic sur OCR")} 
          />
        </div>

      </div>
    </main>
  );
}