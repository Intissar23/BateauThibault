import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-vue1',
  standalone: true,
  templateUrl: './vue1.page.html',
  styleUrls: ['./vue1.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonFab,
    IonFabButton,
    IonIcon,
    IonContent
  ]
})
export class Vue1Page {
  constructor() {}
}
