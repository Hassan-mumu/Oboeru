"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VerificationDonnees from '@/src/features/importation/components/VerificationDonnees';
import ParametresAudio from '@/src/features/importation/components/ParametresAudio';
import ParametresSortie from '@/src/features/importation/components/ParametresSortie';
import { DonneesImportees } from '@/src/types/importation';

export default function ConfigurationPage() {
  const router = useRouter();
  
  const [donnees, setDonnees] = useState<DonneesImportees | null>(null);

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

  if (!donnees) return null;

  return (
    <main className="min-h-screen bg-gray-50 p-8 pt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLONNE DE GAUCHE */}
        <div className="space-y-6">
          <VerificationDonnees donnees={donnees} />
        </div>

        {/* COLONNE DE DROITE */}
        <div className="space-y-6">

          <ParametresAudio /> 
          <ParametresSortie />
        </div>

      </div>
    </main>
  );
}
