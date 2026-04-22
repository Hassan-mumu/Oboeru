"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload } from 'lucide-react';

interface DropzoneAreaProps {
  onFileUpload: (file: File) => void;
}

export default function DropzoneArea({ onFileUpload }: DropzoneAreaProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
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

      {isDragReject && (
        <p className="text-sm text-red-500 mt-4 font-medium px-4 py-2 bg-red-100 rounded-md">
          Format non supporté. Veuillez utiliser un tableur ou du texte.
        </p>
      )}
    </div>
  );
}