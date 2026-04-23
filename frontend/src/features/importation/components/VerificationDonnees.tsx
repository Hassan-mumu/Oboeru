"use client";

import React, { useState } from 'react';
import { DonneesImportees } from '@/src/types/importation';

interface VerificationDonneesProps {
  donnees: DonneesImportees;
}

export default function VerificationDonnees({ donnees }: VerificationDonneesProps) {
  const [nomProjet, setNomProjet] = useState(donnees.nom_fichier.replace('.xlsx', '').replace('.csv', ''));
  
  // États pour savoir quelle colonne de l'Excel est branchée sur nos 2 colonnes Oboeru
  const [sourceCol, setSourceCol] = useState<string>(donnees.colonnes_detectees[0] || "");
  const [tradCol, setTradCol] = useState<string>(donnees.colonnes_detectees[1] || "");

  // Empêcher de sélectionner la même colonne Excel pour les deux
  const handleSourceChange = (newCol: string) => {
    setSourceCol(newCol);
    if (newCol === tradCol) setTradCol(""); // Retire la trad si c'est la même
  };

  const handleTradChange = (newCol: string) => {
    setTradCol(newCol);
    if (newCol === sourceCol) setSourceCol(""); // Retire la source si c'est la même
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">1. Vérification des Données</h2>
      
      <div className="space-y-4 mb-8">
        {/* Nom du projet */}
        <div className="flex items-center gap-4">
          <label className="text-gray-900 font-medium w-1/4">Nom du projet :</label>
          <input 
            type="text" 
            value={nomProjet}
            onChange={(e) => setNomProjet(e.target.value)}
            className="flex-1 p-2 bg-slate-100 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2a5b45]"
          />
        </div>

        {/* Informations */}
        <p className="text-gray-900 font-medium">
          Type de fichier : <span className="font-normal text-gray-700">Excel</span>
        </p>
        <p className="text-gray-900 font-medium">
          Total : <span className="font-normal text-gray-700">{donnees.donnees.length} mots/phrases</span>
        </p>
      </div>

      {/* Le Tableau à DEUX colonnes fixes */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="max-h-100 overflow-y-auto">
          <table className="w-full text-left border-collapse table-fixed">
            
            <thead className="sticky top-0 z-10">
              <tr>
                {/* 1ère Colonne : LANGUE SOURCE */}
                <th className="p-0 border-b border-[#1f4534] bg-[#2a5b45] text-white w-1/2">
                  <div className="flex flex-col">
                    <select
                      className="w-full bg-transparent text-white font-semibold p-3 outline-none cursor-pointer text-sm"
                      value={sourceCol}
                      onChange={(e) => handleSourceChange(e.target.value)}
                    >
                      <option value="" disabled className="text-gray-900 bg-white">-- Choisir la colonne Source --</option>
                      {donnees.colonnes_detectees.map((col) => (
                        <option key={`src-${col}`} value={col} className="text-gray-900 bg-white">
                          Source : {col}
                        </option>
                      ))}
                    </select>
                  </div>
                </th>

                {/* 2ème Colonne : TRADUCTION */}
                <th className="p-0 border-b border-[#1f4534] bg-[#2a5b45] text-white w-1/2 border-l border-[#407a5f]">
                  <div className="flex flex-col">
                    <select
                      className="w-full bg-transparent text-white font-semibold p-3 outline-none cursor-pointer text-sm"
                      value={tradCol}
                      onChange={(e) => handleTradChange(e.target.value)}
                    >
                      <option value="" className="text-gray-900 bg-white">-- Aucune traduction --</option>
                      {donnees.colonnes_detectees.map((col) => (
                        <option key={`trad-${col}`} value={col} className="text-gray-900 bg-white">
                          Traduction : {col}
                        </option>
                      ))}
                    </select>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {donnees.donnees.map((ligne, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  
                  {/* Donnée Source */}
                  <td className="p-3 text-sm font-medium text-gray-900 truncate">
                    {sourceCol && ligne[sourceCol] ? (
                      ligne[sourceCol]
                    ) : (
                      <span className="text-gray-400 italic">Vide</span>
                    )}
                  </td>

                  {/* Donnée Traduction */}
                  <td className="p-3 text-sm text-gray-700 border-l border-gray-100 truncate">
                    {tradCol && ligne[tradCol] ? (
                      ligne[tradCol]
                    ) : (
                      <span className="text-gray-400 italic">Vide</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}