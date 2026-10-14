"use client";

import React, { useState } from 'react';

export default function ParametresAudio() {
  // États pour stocker les choix de l'utilisateur (avec des valeurs par défaut)
  const [voix, setVoix] = useState<string>("nova");
  const [volume, setVolume] = useState<number>(100);
  const [vitesse, setVitesse] = useState<number>(110);
  const [silence, setSilence] = useState<number>(3); // 3 secondes par défaut

  // Fonction utilitaire pour calculer le pourcentage de remplissage
  const getProgressStyle = (value: number, min: number, max: number) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, #2a5b45 ${percentage}%, #e5e7eb ${percentage}%)`
    };
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">2. Paramètres Audio</h2>

      <div className="space-y-5">
        
        {/* Type de voix */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-900 font-medium">Type de voix</label>
          <select
            value={voix}
            onChange={(e) => setVoix(e.target.value)}
            className="p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a5b45] text-gray-700 cursor-pointer"
          >
            <option value="nova">Voix Féminine (Douce)</option>
            <option value="alloy">Voix Neutre (Standard)</option>
            <option value="onyx">Voix Masculine (Profonde)</option>
          </select>
        </div>

        <div className="h-px bg-gray-100 w-full"></div> {/* Séparateur visuel léger */}

        {/* Curseur : Volume */}
        <div className="flex items-center gap-4">
          <label className="w-20 text-gray-900 font-medium">Volume</label>
          <input
            type="range"
            min="0"
            max="200"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={getProgressStyle(volume, 0, 200)}
            className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-[#2a5b45]"
          />
          <span className="w-16 text-right text-gray-700 font-medium">{volume}%</span>
        </div>

        {/* Curseur : Vitesse */}
        <div className="flex items-center gap-4">
          <label className="w-20 text-gray-900 font-medium">Vitesse</label>
          <input
            type="range"
            min="50"
            max="200"
            value={vitesse}
            onChange={(e) => setVitesse(Number(e.target.value))}
            style={getProgressStyle(vitesse, 50, 200)}
            className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-[#2a5b45]"
          />
          <span className="w-16 text-right text-gray-700 font-medium">{vitesse}%</span>
        </div>

        {/* Curseur : Silence */}
        <div className="flex items-center gap-4">
          <label className="w-20 text-gray-900 font-medium">Silence</label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={silence}
            onChange={(e) => setSilence(Number(e.target.value))}
            style={getProgressStyle(silence, 0, 10)}
            className="flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-[#2a5b45]"
          />
          <span className="w-16 text-right text-gray-700 font-medium">{silence} sec</span>
        </div>

      </div>
    </div>
  );
}