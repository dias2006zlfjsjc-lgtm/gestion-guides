import { Routes } from '@angular/router';
import { GuideList } from './components/guide-list/guide-list';

export const routes: Routes = [
  { path: '', redirectTo: 'guides', pathMatch: 'full' },
  { path: 'guides', component: GuideList },
  { path: '**', redirectTo: 'guides' },
];