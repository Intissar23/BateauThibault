import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonModal
} from '@ionic/angular/standalone';

import { CartService } from '../services/cart';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonModal
  ]
})
export class CartPage implements OnInit {

  cartItems: any[] = [];
  total: number = 0;

  // Vue540 : quantité
  isQtyModalOpen = false;
  selectedItem: any | null = null;
  selectedQty: number = 1;

  // Vue541 : points relais
  relayPoints = [
    {
      id: 1,
      name: 'Point relais - Quai du Port',
      address: '12 quai du Port, 14000 Caen',
      deliveryDays: [3, 6]
    },
    {
      id: 2,
      name: 'Marché Central',
      address: 'Halle du Marché, 50500 Saint-Vaast',
      deliveryDays: [3]
    },
    {
      id: 3,
      name: 'Épicerie de la Plage',
      address: '8 avenue de la Plage, 14400 Arromanches',
      deliveryDays: [0, 6]
    }
  ];

  isDeliveryModalOpen = false;
  selectedRelay: any | null = null;
  deliveryDate: Date | null = null;

  // Vue542 : confirmation
  isConfirmModalOpen = false;

  // Overlay "✅ Commande confirmée !"
  showConfirmationMessage = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  ionViewWillEnter() {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.getCart();
    this.total = this.cartService.getTotal();
  }

  add(item: any) {
    this.cartService.addToCart(item);
    this.loadCart();
  }

  decrease(item: any) {
    this.cartService.decreaseQty(item);
    this.loadCart();
  }

  remove(item: any) {
    this.cartService.removeFromCart(item);
    this.loadCart();
  }

  clearCart() {
    this.cartService.clearCart();
    this.loadCart();
    this.router.navigate(['/home']);
  }

  clearCartAndGoHome() {
    this.clearCart();
  }

  // -------- Vue540 : quantité --------

  openQtyModal(item: any) {
    this.selectedItem = item;
    this.selectedQty = item.qty || 1;
    this.isQtyModalOpen = true;
  }

  closeQtyModal() {
    this.isQtyModalOpen = false;
    this.selectedItem = null;
  }

  changeQty(delta: number) {
    let q = this.selectedQty + delta;
    if (q < 0) q = 0;
    this.selectedQty = q;
  }

  confirmQty() {
    if (!this.selectedItem) {
      this.closeQtyModal();
      return;
    }

    const qty = this.selectedQty;
    this.cartService.setQty(this.selectedItem, qty);
    this.loadCart();

    this.isQtyModalOpen = false;
    this.selectedItem = null;
  }

  // -------- Vue541 : livraison / point relais --------

  openDeliveryModal() {
    this.isDeliveryModalOpen = true;
  }

  closeDeliveryModal() {
    this.isDeliveryModalOpen = false;
  }

  private getNextDeliveryDate(deliveryDays: number[]): Date {
    const today = new Date();
    const todayDow = today.getDay(); // 0 = dimanche

    let minDelta = Infinity;

    for (const d of deliveryDays) {
      let delta = d - todayDow;
      if (delta < 0) {
        delta += 7;
      }
      if (delta < minDelta) {
        minDelta = delta;
      }
    }

    const result = new Date(today);
    result.setDate(today.getDate() + minDelta);
    return result;
  }

  selectRelay(relay: any) {
    this.selectedRelay = relay;
  }

  confirmRelay() {
    if (!this.selectedRelay) {
      this.closeDeliveryModal();
      return;
    }

    this.deliveryDate = this.getNextDeliveryDate(this.selectedRelay.deliveryDays);
    this.isDeliveryModalOpen = false;
  }

  get formattedDeliveryDate(): string {
    if (!this.deliveryDate) return 'Non définie';
    return this.deliveryDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
  }

  // -------- Vue542 : confirmation commande --------

  openConfirmModal() {
    if (!this.cartItems.length) return;
    if (!this.selectedRelay || !this.deliveryDate) return;

    this.isConfirmModalOpen = true;
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
  }

  confirmOrder() {
    console.log('Commande confirmée :', {
      total: this.total,
      relay: this.selectedRelay,
      date: this.deliveryDate,
      items: this.cartItems
    });

    // On affiche l’overlay "✅ Commande confirmée !"
    this.showConfirmationMessage = true;

    setTimeout(() => {
      this.showConfirmationMessage = false;

      this.toastService.showSuccess(
        'Votre commande a été envoyée avec succès !'
      );

      this.cartService.clearCart();
      this.loadCart();
      this.isConfirmModalOpen = false;
      this.router.navigate(['/home']);
    }, 1200);
  }
}
