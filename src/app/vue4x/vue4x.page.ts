import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-vue4x',
  standalone: true,
  templateUrl: './vue4x.page.html',
  styleUrls: ['./vue4x.page.scss'],
  imports: [
   CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent
  ]
})
export class Vue4xPage {
  constructor() {}
}
