"use client";

import React, { useState } from 'react';
import { DonneesImportees } from '@/src/types/importation'; // <-- On importe notre nouveau type !

interface VerificationDonneesProps {
  donnees: DonneesImportees; 
}

export default function VerificationDonnees({ donnees }: VerificationDonneesProps) {
  // États locaux pour les choix de l'utilisateur
  const [nomProjet, setNomProjet] = useState(donnees.nom_fichier.replace('.xlsx', '').replace('.csv', ''));
  const [colonneSource, setColonneSource] = useState(donnees.colonnes_detectees[0] || "");
  const [colonneTraduction, setColonneTraduction] = useState(donnees.colonnes_detectees[1] || "");

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">1. Vérification des Données</h2>
      
      <div className="space-y-4">
        {/* Nom du projet */}
        <div className="flex items-center gap-4">
          <label className="text-black font-medium w-1/3">Nom du projet :</label>
          <input 
            type="text" 
            value={nomProjet}
            onChange={(e) => setNomProjet(e.target.value)}
            className="flex-1 p-2 bg-slate-100 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Type de fichier & Total */}
        <p className="text-gray-700 font-medium">Type de fichier : <span className="font-normal">Excel</span></p>
        <p className="text-gray-700 font-medium">Total : <span className="font-normal">{donnees.lignes_extraites} mots/phrases</span></p>

        <div className="h-px bg-gray-100 my-4"></div> {/* Séparateur visuel */}

        {/* US-203 : Mapping des colonnes */}
        <div className="flex flex-col gap-4 bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
          
          <div className="flex items-center gap-4">
            <label className="text-emerald-900 font-medium w-1/3">Langue Source :</label>
            <select 
              value={colonneSource}
              onChange={(e) => setColonneSource(e.target.value)}
              className="flex-1 p-2 border border-emerald-200 rounded-md bg-white text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {donnees.colonnes_detectees.map((col: string, idx: number) => (
                <option key={`src-${idx}`} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-emerald-900 font-medium w-1/3">Traduction :</label>
            <select 
              value={colonneTraduction}
              onChange={(e) => setColonneTraduction(e.target.value)}
              className="flex-1 p-2 border border-emerald-200 rounded-md bg-white text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- Ignorer / Aucune --</option>
              {donnees.colonnes_detectees.map((col: string, idx: number) => (
                <option key={`trad-${idx}`} value={col}>{col}</option>
              ))}
            </select>
          </div>

          {colonneSource === colonneTraduction && colonneSource !== "" && (
            <p className="text-red-500 text-sm mt-1 font-medium">⚠️ Les deux colonnes ne peuvent pas être identiques.</p>
          )}

        </div>
      </div>

      {/* TODO: L'US-204 viendra s'insérer juste ici avec le magnifique tableau ! */}

    </div>
  );
}