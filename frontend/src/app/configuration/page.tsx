"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import VerificationDonnees from '@/src/features/importation/components/VerificationDonnees';
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
        
        {/* COLONNE DE GAUCHE : US-203 (et bientôt US-204) */}
        <div className="space-y-6">
          <VerificationDonnees donnees={donnees} />
        </div>

        {/* COLONNE DE DROITE : En construction */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 opacity-50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Paramètres Audio</h2>
            <p className="text-gray-500 italic">En construction...</p>
          </div>
        </div>

      </div>
    </main>
  );
}