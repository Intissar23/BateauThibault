import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'vue5',
    loadComponent: () => import('./vue5/vue5.page').then( m => m.Vue5Page)
  },
  {
    path: 'vue50',
    loadComponent: () => import('./vue50/vue50.page').then( m => m.Vue50Page)
  },
  {
    path: 'vue51',
    loadComponent: () => import('./vue51/vue51.page').then( m => m.Vue51Page)
  },
  {
    path: 'vue52',
    loadComponent: () => import('./vue52/vue52.page').then( m => m.Vue52Page)
  },
  {
    path: 'vue53',
    loadComponent: () => import('./vue53/vue53.page').then( m => m.Vue53Page)
  },
];
