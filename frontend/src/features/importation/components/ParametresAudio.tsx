"use client";

import React, { useState, useRef, useEffect } from 'react';

// 1. Définition des props attendues par le parent
interface ParametresAudioProps {
  voix: string;
  setVoix: (val: string) => void;
  volume: number;
  setVolume: (val: number) => void;
  vitesse: number;
  setVitesse: (val: number) => void;
  silence: number;
  setSilence: (val: number) => void;
}

export default function ParametresAudio({
  voix, setVoix,
  volume, setVolume,
  vitesse, setVitesse,
  silence, setSilence
}: ParametresAudioProps) {
  
  // 2. Les états purement locaux (UI du bouton) restent ici
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getProgressStyle = (value: number, min: number, max: number) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, #2a5b45 ${percentage}%, #e5e7eb ${percentage}%)`
    };
  };

  const handleTogglePlay = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    const url = `http://localhost:8000/test-tts/?voix=${voix}`;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.onloadeddata = () => {
      setIsLoading(false);
      setIsPlaying(true);
      audio.play();
    };

    audio.onended = () => {
      setIsPlaying(false);
    };

    audio.onerror = () => {
      setIsLoading(false);
      setIsPlaying(false);
      alert("Erreur : Impossible de charger l'aperçu audio. Vérifiez que votre backend est lancé.");
    };
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [voix]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Paramètres Audio</h2>

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

        <div className="h-px bg-gray-100 w-full"></div>

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

        {/* Bouton d'aperçu */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleTogglePlay}
            disabled={isLoading}
            className="w-10 h-10 rounded-full bg-[#2a5b45] text-white flex items-center justify-center hover:bg-[#1f4534] transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2a5b45] disabled:bg-gray-400"
            aria-label={isPlaying ? "Pause l'aperçu" : "Écouter l'aperçu"}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isPlaying ? (
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="h-4 w-4 fill-current ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <span className="text-sm font-medium text-gray-700">
            {isLoading ? "Génération de l'audio..." : isPlaying ? "Lecture en cours..." : "Écouter un aperçu"}
          </span>
        </div>

      </div>
    </div>
  );
}