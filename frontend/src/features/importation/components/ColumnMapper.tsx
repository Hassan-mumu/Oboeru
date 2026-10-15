"use client";

import React, { useState } from 'react';
import Button from '@/src/components/ui/Button_1';
import { ArrowRight, Languages } from 'lucide-react';

interface ColumnMapperProps {
  colonnes: string[];
  onValidate: (mapping: { source: string; traduction: string }) => void;
}

export default function ColumnMapper({ colonnes, onValidate }: ColumnMapperProps) {
  // On stocke les choix de l'utilisateur
  const [sourceCol, setSourceCol] = useState<string>("");
  const [traductionCol, setTraductionCol] = useState<string>("");

  // Le bouton est valide seulement si les deux colonnes sont choisies et sont différentes
  const isValid = sourceCol !== "" && traductionCol !== "" && sourceCol !== traductionCol;

  return (
    <div className="flex flex-col items-center justify-center w-full p-6 animate-in fade-in zoom-in duration-300">
      <Languages className="w-16 h-16 text-emerald-600 mb-4" />
      
      <h3 className="text-xl font-bold text-emerald-900 text-center mb-2">
        Identifions vos colonnes
      </h3>
      <p className="text-sm text-gray-500 text-center mb-8">
        Indiquez à l&#39application où se trouvent vos données pour générer les voix correctement.
      </p>

      <div className="w-full max-w-md space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
        
        {/* Choix de la Langue Source (ex: Japonais) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">Langue Source (à deviner)</label>
          <select 
            className="p-3 rounded-lg border border-slate-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            value={sourceCol}
            onChange={(e) => setSourceCol(e.target.value)}
          >
            <option value="" disabled>-- Sélectionnez une colonne --</option>
            {colonnes.map((col, index) => (
              <option key={`source-${index}`} value={col}>{col}</option>
            ))}
          </select>
        </div>

        {/* Choix de la Traduction (ex: Français) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">Traduction (Réponse)</label>
          <select 
            className="p-3 rounded-lg border border-slate-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            value={traductionCol}
            onChange={(e) => setTraductionCol(e.target.value)}
          >
            <option value="" disabled>-- Sélectionnez une colonne --</option>
            {colonnes.map((col, index) => (
              <option key={`trad-${index}`} value={col}>{col}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Message d'erreur si l'utilisateur choisit la même colonne deux fois */}
      {sourceCol !== "" && sourceCol === traductionCol && (
        <p className="text-red-500 text-sm mt-4 font-medium">
          Vous ne pouvez pas choisir la même colonne pour les deux champs.
        </p>
      )}

      <div className="mt-8 w-full max-w-md">
        <Button 
          label="Valider et continuer" 
          icon={ArrowRight}
          disabled={!isValid}
          onClick={() => onValidate({ source: sourceCol, traduction: traductionCol })}
          className={`w-full ${isValid ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        />
      </div>
    </div>
  );
}