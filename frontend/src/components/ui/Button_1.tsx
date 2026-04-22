import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: LucideIcon; //optionnel, pour permettre d'avoir des boutons sans icône
}

export default function Button({ label, icon: Icon, className = "", ...props }: ButtonProps) {
  return (
    <button 
      className={`flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors font-medium text-sm ${className}`}
      {...props} // Permet de passer les onClick, disabled, etc.
    >
      {/* Si on a fourni une icône, on l'affiche */}
      {Icon && <Icon className="w-5 h-5 text-emerald-800" />}
      {label}
    </button>
  );
}