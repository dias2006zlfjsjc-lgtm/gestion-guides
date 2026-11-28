import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GuideForm, GuideSaisi } from '../guide-form/guide-form';
import { GuideService } from '../../services/guide';
import { GuideTouristique } from '../../models/guide-touristique';

@Component({
  selector: 'app-guide-edition',
  imports: [GuideForm],
  templateUrl: './guide-edition.html',
})
export class GuideEdition {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(GuideService);

  readonly guide = signal<GuideTouristique | null>(null);
  readonly introuvable = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      const trouve = this.service.getById(Number(id));
      if (trouve) this.guide.set(trouve);
      else this.introuvable.set(true);
    }
  }

  enregistrer(saisi: GuideSaisi): void {
    if (saisi.id !== undefined) {
      this.service.update({ ...saisi, id: saisi.id });
    } else {
      this.service.add(saisi);
    }
    setTimeout(() => this.retour(), 1500);
  }

  retour(): void {
    this.router.navigate(['/guides']);
  }
}