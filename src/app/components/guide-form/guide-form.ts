import { Component, computed, effect, inject, input, output, signal, viewChild } from '@angular/core';
import {
  AbstractControl,
  FormGroupDirective,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { GuideTouristique } from '../../models/guide-touristique';

/** Ce que le formulaire renvoie : un guide complet, avec `id` seulement en modification. */
export type GuideSaisi = Omit<GuideTouristique, 'id'> & { id?: number };

export const REGIONS_SENEGAL: readonly string[] = [
  'Dakar', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kédougou', 'Kolda',
  'Louga', 'Matam', 'Saint-Louis', 'Sédhiou', 'Tambacounda', 'Thiès', 'Ziguinchor',
];

/** E-mail : exige un point dans le domaine (plus strict que Validators.email). */
const emailStrict: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const v = String(c.value ?? '').trim();
  if (!v) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : { emailInvalide: true };
};

/** Téléphone sénégalais : 70/75/76/77/78 ou 30/33 + 7 chiffres, +221 facultatif. */
const telephoneSenegal: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
  const v = String(c.value ?? '').replace(/[\s.\-]/g, '');
  if (!v) return null;
  return /^(\+221|00221)?(7[05-8]|3[03])\d{7}$/.test(v) ? null : { telephoneInvalide: true };
};

type NomChamp = 'prenom' | 'nom' | 'email' | 'telephone' | 'region' | 'specialite' | 'note' | 'statut';

@Component({
  selector: 'app-guide-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './guide-form.html',
  styleUrl: './guide-form.css',
})
export class GuideForm {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly formDir = viewChild(FormGroupDirective);

  /** Guide à modifier. Laisser vide pour un ajout. */
  readonly guide = input<GuideTouristique | null>(null);
  /** Émis quand le formulaire est valide et soumis. */
  readonly enregistrer = output<GuideSaisi>();
  /** Émis au clic sur « Annuler ». */
  readonly annuler = output<void>();

  readonly regions = REGIONS_SENEGAL;
  readonly modeModification = computed(() => this.guide() !== null);

  readonly messageSucces = signal('');
  readonly messageErreur = signal('');

  readonly formulaire = this.fb.group({
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    nom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, emailStrict]],
    telephone: ['', [Validators.required, telephoneSenegal]],
    region: ['', [Validators.required]],
    specialite: ['', [Validators.required, Validators.minLength(3)]],
    note: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.max(5)]),
    statut: this.fb.control<'Actif' | 'Inactif'>('Actif', [Validators.required]),
  });

  constructor() {
    // Pré-remplit le formulaire quand un guide à modifier est fourni.
    effect(() => {
      const g = this.guide();
      if (g) {
        this.formulaire.patchValue({
          prenom: g.prenom,
          nom: g.nom,
          email: g.email,
          telephone: g.telephone,
          region: g.region,
          specialite: g.specialite,
          note: g.note,
          statut: g.statut,
        });
      }
    });
  }

  /** Message d'erreur d'un champ (affiché par <mat-error> seulement après interaction). */
  erreurDe(champ: NomChamp): string {
    const e = this.formulaire.controls[champ].errors ?? {};

    if (e['required']) return 'Ce champ est obligatoire.';
    if (e['minlength']) {
      return `Minimum ${e['minlength'].requiredLength} caractères (actuellement ${e['minlength'].actualLength}).`;
    }
    if (e['emailInvalide']) return 'Adresse e-mail invalide (ex. prenom.nom@exemple.sn).';
    if (e['telephoneInvalide']) return 'Numéro invalide (ex. 77 123 45 67 ou +221 77 123 45 67).';
    if (e['min'] || e['max']) return 'La note doit être comprise entre 0 et 5.';
    return 'Valeur invalide.';
  }

  soumettre(): void {
    this.messageSucces.set('');
    this.messageErreur.set('');

    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      this.messageErreur.set('Le formulaire contient des erreurs. Corrigez les champs signalés puis réessayez.');
      return;
    }

    const v = this.formulaire.getRawValue();
    const resultat: GuideSaisi = {
      id: this.guide()?.id,
      prenom: v.prenom.trim(),
      nom: v.nom.trim(),
      email: v.email.trim(),
      telephone: v.telephone.trim(),
      region: v.region,
      specialite: v.specialite.trim(),
      note: Number(v.note),
      statut: v.statut,
    };

    this.enregistrer.emit(resultat);

    if (this.modeModification()) {
      this.messageSucces.set(`La fiche de ${resultat.prenom} ${resultat.nom} a été modifiée.`);
    } else {
      this.messageSucces.set(`${resultat.prenom} ${resultat.nom} a été ajouté(e) au répertoire.`);
      this.formDir()?.resetForm(); // vide le formulaire sans afficher d'erreurs
    }
  }
}
