import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class HomePage {

  // 🧺 Liste des points relais affichés en bas de l'accueil
  relayPoints = [
    {
      name: 'Point relais - Quai du Port',
      address: '12 quai du Port, 14000 Caen',
      hours: 'Lun–Sam : 9h–19h'
    },
    {
      name: 'Point relais - Marché Central',
      address: 'Halle du Marché, 50500 Saint-Vaast',
      hours: 'Mar–Dim : 8h–13h'
    },
    {
      name: 'Point relais - Épicerie de la Plage',
      address: '8 avenue de la Plage, 14400 Arromanches',
      hours: 'Tous les jours : 10h–20h'
    }
  ];

  constructor() {}
}
