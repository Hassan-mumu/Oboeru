"use client";

import React, { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone'; // <-- Ajout de FileRejection
import { CloudUpload } from 'lucide-react';

interface DropzoneAreaProps {
  onFileUpload: (file: File) => void;
  onError?: (errorMessage: string) => void; // <-- NOUVEAU : Prop pour envoyer l'erreur au parent
}

export default function DropzoneArea({ onFileUpload, onError }: DropzoneAreaProps) {
  
  // Fonction quand le fichier est valide
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  // NOUVEAU : Fonction quand le fichier est refusé (mauvais format ou trop lourd)
  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    if (onError && fileRejections.length > 0) {
      const erreur = fileRejections[0].errors[0];
      
      if (erreur.code === 'file-too-large') {
        onError("Le fichier est trop volumineux. La taille maximale acceptée est de 5 Mo.");
      } else if (erreur.code === 'file-invalid-type') {
        onError("Format non supporté. Veuillez importer un fichier Excel (.xls, .xlsx) ou CSV/Texte.");
      } else {
        onError("Le fichier a été rejeté.");
      }
    }
  }, [onError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    onDropRejected, // <-- NOUVEAU : On attache la fonction de rejet
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // <-- NOUVEAU : Limite fixée à 5 Mo (5 * 1024 * 1024 octets)
  });

  return (
    <div
      {...getRootProps()}
      className={`
        flex flex-col items-center justify-center w-full h-80 p-6 
        border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
        ${isDragActive ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' : 'border-gray-300 bg-white'}
        ${isDragReject ? 'border-red-500 bg-red-50' : ''}
        hover:bg-emerald-50 hover:border-emerald-400
      `}
    >
      <input {...getInputProps()} />
      
      <CloudUpload 
        className={`w-20 h-20 mb-4 transition-colors ${isDragActive ? 'text-emerald-500' : 'text-emerald-800'}`} 
        strokeWidth={1.5}
      />
      
      <h3 className="text-xl font-bold text-emerald-900 text-center mb-2">
        Glissez-déposez votre fichier Excel, CSV ou Texte ici
      </h3>
      
      <p className="text-sm text-gray-400 text-center">
        Ou cliquez pour sélectionner
      </p>

      {/* Le message visuel en cours de glissement reste très utile */}
      {isDragReject && (
        <p className="text-sm text-red-500 mt-4 font-medium px-4 py-2 bg-red-100 rounded-md">
          Format non supporté ou fichier trop lourd.
        </p>
      )}
    </div>
  );
}