import { Routes } from '@angular/router';
import { GuideList } from './components/guide-list/guide-list';
import { GuideEdition } from './components/guide-edition/guide-edition';

export const routes: Routes = [
  { path: '', redirectTo: 'guides', pathMatch: 'full' },
  { path: 'guides', component: GuideList },
  { path: 'guides/nouveau', component: GuideEdition },
  { path: 'guides/modifier/:id', component: GuideEdition },
  { path: '**', redirectTo: 'guides' },
];