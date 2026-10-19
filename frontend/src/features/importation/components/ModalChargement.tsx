"use client";

import React from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface ModalChargementProps {
  isOpen: boolean;
  pourcentage: number;
  message: string;
  erreur: string | null;
  onFermer: () => void;
}

export default function ModalChargement({ isOpen, pourcentage, message, erreur, onFermer }: ModalChargementProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* EN-TÊTE */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {erreur ? "Oups ! Un problème est survenu" : 
             pourcentage === 100 ? "Votre leçon est prête !" : 
             "Création de votre leçon..."}
          </h2>
          <p className="text-gray-500 text-sm">{message}</p>
        </div>

        {/* CONTENU CENTRAL (Erreur / Succès / Progression) */}
        <div className="flex flex-col items-center justify-center min-h-[120px]">
          {erreur ? (
            <XCircle className="w-16 h-16 text-red-500 animate-bounce" />
          ) : pourcentage === 100 ? (
            <CheckCircle className="w-16 h-16 text-[#2a5b45]" />
          ) : (
            <div className="w-full space-y-6">
              {/* Barre de progression avec animation fluide */}
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-[#2a5b45] to-[#4caf50] rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${pourcentage}%` }}
                >
                  {/* Effet de brillance animé sur la barre */}
                  <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm font-medium">
                <div className="flex items-center gap-2 text-[#2a5b45]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Génération en cours...</span>
                </div>
                <span className="text-gray-700">{pourcentage}%</span>
              </div>
            </div>
          )}
        </div>

        {/* BOUTON D'ACTION (Visible uniquement à la fin ou en cas d'erreur) */}
        {(pourcentage === 100 || erreur) && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={onFermer}
              className={`px-8 py-3 font-bold rounded-xl transition-colors shadow-md w-full ${
                erreur 
                  ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' 
                  : 'bg-[#2a5b45] text-white hover:bg-[#1f4534]'
              }`}
            >
              {erreur ? "Fermer et réessayer" : "Retour à l'accueil"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}