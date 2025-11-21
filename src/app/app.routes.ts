import { Routes } from '@angular/router';

export const routes: Routes = [
  // Accueil
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage),
  },

  // Redirection racine -> /home
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  // Vue 1 : Le gérant
  {
    path: 'vue1',
    loadComponent: () =>
      import('./vue1/vue1.page').then(m => m.Vue1Page),
  },

  // Vue 2 : Les bateaux
  {
    path: 'vue2',
    loadComponent: () =>
      import('./vue2/vue2.page').then(m => m.Vue2Page),
  },

  // Vue 2X : Détails du bateau
  {
    path: 'vue2x',
    loadComponent: () =>
      import('./vue2x/vue2x.page').then(m => m.Vue2xPage),
  },

  // Vue 3 : Restaurants partenaires
  {
    path: 'vue3',
    loadComponent: () =>
      import('./vue3/vue3.page').then(m => m.Vue3Page),
  },

  // Vue 3X : Détail d'un restaurant
  {
    path: 'vue3x',
    loadComponent: () =>
      import('./vue3x/vue3x.page').then(m => m.Vue3xPage),
  },

  // Vue 4 : Idées de recettes
  {
    path: 'vue4',
    loadComponent: () =>
      import('./vue4/vue4.page').then(m => m.Vue4Page),
  },

  // Vue 4X : Détail d'une recette
  {
    path: 'vue4x',
    loadComponent: () =>
      import('./vue4x/vue4x.page').then(m => m.Vue4xPage),
  },

  // Vue 5 : Produits (Personne 2)
  {
    path: 'vue5',
    loadComponent: () =>
      import('./vue5/vue5.page').then(m => m.Vue5Page),
  },

  // Catégorie 0 - Poissons
  {
    path: 'vue50',
    loadComponent: () =>
      import('./vue50/vue50.page').then(m => m.Vue50Page),
  },

  // Catégorie 1 - Coquillages / huîtres
  {
    path: 'vue51',
    loadComponent: () =>
      import('./vue51/vue51.page').then(m => m.Vue51Page),
  },

  // Catégorie 2 - Crustacés
  {
    path: 'vue52',
    loadComponent: () =>
      import('./vue52/vue52.page').then(m => m.Vue52Page),
  },

  // Promotions
  {
    path: 'vue53',
    loadComponent: () =>
      import('./vue53/vue53.page').then(m => m.Vue53Page),
  },

  // Page panier (Personne 3)
  {
    path: 'cart',
    loadComponent: () =>
      import('./cart/cart.page').then(m => m.CartPage),
  },
];
