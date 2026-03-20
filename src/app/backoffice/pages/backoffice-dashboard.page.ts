import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription, forkJoin, interval } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';

import { BackofficeApiService } from '../services/backoffice-api.service';
import { BackofficeAuthService } from '../services/backoffice-auth.service';
import { MarginTaxKpi, ProductCategoryKey, QuarterAlert, RevenueKpi } from '../models/backoffice.models';

@Component({
  selector: 'app-backoffice-dashboard',
  standalone: true,
  templateUrl: './backoffice-dashboard.page.html',
  styleUrls: ['./backoffice-dashboard.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption
  ]
})
export class BackofficeDashboardPage implements OnInit, OnDestroy {
  period: string = 'monthly';
  category: ProductCategoryKey = 'all';
  revenue: RevenueKpi | null = null;
  marginTax: MarginTaxKpi | null = null;
  alerts: QuarterAlert[] = [];
  loading = false;

  private autoRefreshSub?: Subscription;

  constructor(
    private api: BackofficeApiService,
    private auth: BackofficeAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/backoffice/login']);
      return;
    }

    this.refresh();
    this.autoRefreshSub = interval(15000).subscribe(() => this.refresh());
  }

  ngOnDestroy(): void {
    this.autoRefreshSub?.unsubscribe();
  }

  refresh(): void {
    this.loading = true;

    forkJoin({
      revenue: this.api.getRevenue(this.period, this.category),
      marginTax: this.api.getMarginTax(),
      alerts: this.api.getAlerts()
    }).subscribe({
      next: (res) => {
        this.revenue = res.revenue;
        this.marginTax = res.marginTax;
        this.alerts = res.alerts;
        this.loading = false;
      },
      error: () => {
        this.revenue = null;
        this.marginTax = null;
        this.alerts = [];
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.auth.clearToken();
    this.router.navigate(['/backoffice/login']);
  }
}
