export interface DonneesImportees {
  nom_fichier: string;
  colonnes_detectees: string[];
  lignes_extraites: number;
  donnees: Record<string, string>[]; 
}