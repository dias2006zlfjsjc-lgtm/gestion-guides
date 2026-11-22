import { Injectable } from '@angular/core';
import { GuideTouristique } from '../models/guide-touristique';

@Injectable({ providedIn: 'root' })
export class GuideService {
  private guides: GuideTouristique[] = [
    { id: 1, nom: 'Diop', prenom: 'Awa', email: 'awa.diop@exemple.sn', telephone: '775667743', specialite: 'Histoire et patrimoine', region: 'Dakar', statut: 'Actif', note: 4.7 },
    { id: 2, nom: 'Fall', prenom: 'Moussa', email: 'moussa.fall@exemple.sn', telephone: '781234567', specialite: 'Écotourisme', region: 'Saint-Louis', statut: 'Actif', note: 4.2 },
    { id: 3, nom: 'Ndiaye', prenom: 'Fatou', email: 'fatou.ndiaye@exemple.sn', telephone: '761234567', specialite: 'Gastronomie', region: 'Thiès', statut: 'Inactif', note: 3.9 },
    { id: 4, nom: 'Sarr', prenom: 'Ibrahima', email: 'ibrahima.sarr@exemple.sn', telephone: '701234567', specialite: 'Plages et détente', region: 'Mbour', statut: 'Actif', note: 4.5 },
    { id: 5, nom: 'Ba', prenom: 'Khady', email: 'khady.ba@exemple.sn', telephone: '771112233', specialite: 'Culture et artisanat', region: 'Ziguinchor', statut: 'Inactif', note: 3.5 },
  ];

  getAll(): GuideTouristique[] {
    return [...this.guides];
  }

  getById(id: number): GuideTouristique | undefined {
    return this.guides.find(g => g.id === id);
  }

  add(guide: Omit<GuideTouristique, 'id'>): GuideTouristique {
    const nouveau = { ...guide, id: this.prochainId() };
    this.guides.push(nouveau);
    return nouveau;
  }

  update(guide: GuideTouristique): boolean {
    const index = this.guides.findIndex(g => g.id === guide.id);
    if (index === -1) return false;
    this.guides[index] = { ...guide };
    return true;
  }

  delete(id: number): boolean {
    const avant = this.guides.length;
    this.guides = this.guides.filter(g => g.id !== id);
    return this.guides.length < avant;
  }

  private prochainId(): number {
    return this.guides.length ? Math.max(...this.guides.map(g => g.id)) + 1 : 1;
  }
}