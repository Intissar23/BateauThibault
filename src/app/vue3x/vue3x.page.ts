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
  selector: 'app-vue3x',
  standalone: true,
  templateUrl: './vue3x.page.html',
  styleUrls: ['./vue3x.page.scss'],
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
export class Vue3xPage {
  constructor() {}
}
