import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { GuideService } from '../../services/guide';
import { GuideTouristique } from '../../models/guide-touristique';

function normaliser(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

@Component({
  selector: 'app-guide-list',
  imports: [
    DecimalPipe,
    RouterLink,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './guide-list.html',
  styleUrl: './guide-list.css',
})
export class GuideList {
  private readonly guideService = inject(GuideService);

  readonly colonnes = ['nom', 'prenom', 'specialite', 'region', 'note', 'statut', 'actions'];
  readonly statuts: GuideTouristique['statut'][] = ['Actif', 'Inactif'];

  readonly guides = signal<GuideTouristique[]>(this.guideService.getAll());

  readonly recherche = signal('');
  readonly regionChoisie = signal('');
  readonly statutChoisi = signal('');
  readonly message = signal('');

  readonly regions = computed(() => [...new Set(this.guides().map((g) => g.region))].sort());

  readonly guidesFiltres = computed(() => {
    const terme = normaliser(this.recherche().trim());
    const region = this.regionChoisie();
    const statut = this.statutChoisi();

    return this.guides().filter((g) => {
      const okRecherche =
        !terme || [g.nom, g.prenom, g.specialite].some((v) => normaliser(v).includes(terme));
      const okRegion = !region || g.region === region;
      const okStatut = !statut || g.statut === statut;
      return okRecherche && okRegion && okStatut;
    });
  });

  readonly filtresActifs = computed(
    () => !!(this.recherche().trim() || this.regionChoisie() || this.statutChoisi()),
  );

  mettreAJourRecherche(event: Event): void {
    this.recherche.set((event.target as HTMLInputElement).value);
  }

  reinitialiserFiltres(): void {
    this.recherche.set('');
    this.regionChoisie.set('');
    this.statutChoisi.set('');
  }

  supprimer(guide: GuideTouristique): void {
    const confirme = confirm(`Voulez-vous vraiment supprimer ${guide.prenom} ${guide.nom} ?`);
    if (!confirme) return;

    const reussi = this.guideService.delete(guide.id);
    if (reussi) {
      this.guides.set(this.guideService.getAll());
      this.message.set(`Le guide ${guide.prenom} ${guide.nom} a été supprimé.`);
    } else {
      this.message.set('Erreur : la suppression a échoué.');
    }
  }
}
