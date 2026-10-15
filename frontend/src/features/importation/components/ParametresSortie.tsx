"use client";

import React from 'react';

interface ParametresSortieProps {
  utiliserTraduction: boolean;
  setUtiliserTraduction: (val: boolean) => void;
  langueTraduction: string;
  setLangueTraduction: (val: string) => void;
}

export default function ParametresSortie({
  utiliserTraduction,
  setUtiliserTraduction,
  langueTraduction,
  setLangueTraduction
}: ParametresSortieProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Paramètres de Sortie</h2>

      <div className="space-y-4">
        
        {/* Case à cocher */}
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={utiliserTraduction}
              onChange={(e) => setUtiliserTraduction(e.target.checked)}
              className="w-5 h-5 rounded text-[#2a5b45] focus:ring-[#2a5b45] border-gray-300 cursor-pointer accent-[#2a5b45]"
            />
            <span className="text-gray-900 font-medium">
              Utiliser la colonne de traduction détectée
            </span>
          </label>

          {/* Choix de la langue (bien grisé si la case est cochée) */}
          <div className="flex items-center gap-4 ml-8">
            <label className={`text-sm transition-colors ${utiliserTraduction ? 'text-gray-400' : 'text-gray-700'}`}>
              Langue de Traduction souhaitée :
            </label>
            <select
              disabled={utiliserTraduction}
              value={langueTraduction}
              onChange={(e) => setLangueTraduction(e.target.value)}
              // Ajout de disabled:bg-gray-100 et disabled:text-gray-400 pour un effet grisé net
              className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a5b45] text-gray-700 text-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
            >
              <option value="">[Sélectionner, ex: Français]</option>
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
            </select>
          </div>
        </div>

        <div className="h-px bg-gray-100 w-full"></div>

        {/* Format de sortie */}
        <div className="flex items-center gap-6">
          <span className="text-gray-900 font-medium">Format de sortie :</span>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="format"
              value="mp3"
              defaultChecked
              className="w-4 h-4 text-[#2a5b45] focus:ring-[#2a5b45] border-gray-300 accent-[#2a5b45] cursor-pointer"
            />
            <span className="text-gray-700 text-sm">Audio (MP3)</span>
          </label>

          <label 
            className="flex items-center gap-2 cursor-not-allowed opacity-50" 
            title="Bientôt disponible dans une prochaine mise à jour"
          >
            <input
              type="radio"
              name="format"
              value="mp4"
              disabled
              className="w-4 h-4 text-gray-400 border-gray-300"
            />
            <span className="text-gray-500 text-sm">Vidéo (MP4)</span>
          </label>
        </div>

      </div>
    </div>
  );
}