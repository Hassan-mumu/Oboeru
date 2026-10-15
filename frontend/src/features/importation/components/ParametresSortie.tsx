"use client";

import React, { useState } from 'react';

export default function ParametresSortie() {
  // État local pour gérer l'activation/désactivation du choix de langue
  const [utiliserTraduction, setUtiliserTraduction] = useState<boolean>(true);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Paramètres de Sortie</h2>

      <div className="space-y-4">
        
        {/* Ligne 1 : Case à cocher pour la traduction */}
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

          {/* Sous-ligne : Choix de la langue de traduction (Désactivé si la case est cochée) */}
          <div className="flex items-center gap-4 ml-8">
            <label className={`text-sm ${utiliserTraduction ? 'text-gray-400' : 'text-gray-700'}`}>
              Langue de Traduction souhaitée :
            </label>
            <select
              disabled={utiliserTraduction}
              className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a5b45] text-gray-700 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="">[Sélectionner, ex: Français]</option>
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
            </select>
          </div>
        </div>

        <div className="h-px bg-gray-100 w-full"></div>

        {/* Ligne 2 : Format de sortie */}
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

          {/* à revoire */}
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