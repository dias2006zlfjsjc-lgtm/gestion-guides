export interface GuideTouristique {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  region: string;
  statut: 'Actif' | 'Inactif';
  note: number;
}