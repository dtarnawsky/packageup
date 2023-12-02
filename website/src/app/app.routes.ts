import {  Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'index',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },  
  {
    path: '',
    redirectTo: document.location.hostname.startsWith('edit') ? 'all' : 'index',
    pathMatch: 'full',
  }
];


