import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText
} from '@ionic/angular/standalone';

import { BackofficeApiService } from '../services/backoffice-api.service';
import { BackofficeAuthService } from '../services/backoffice-auth.service';

@Component({
  selector: 'app-backoffice-login',
  standalone: true,
  templateUrl: './backoffice-login.page.html',
  styleUrls: ['./backoffice-login.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonText
  ]
})
export class BackofficeLoginPage {
  loading = false;
  errorMessage = '';

  readonly loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private api: BackofficeApiService,
    private auth: BackofficeAuthService,
    private router: Router
  ) {}

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.api.login(this.loginForm.getRawValue()).subscribe({
      next: (res) => {
        if (!res.access) {
          this.errorMessage = 'Identifiants invalides.';
          this.loading = false;
          return;
        }

        this.auth.setToken(res.access);
        this.loading = false;
        this.router.navigate(['/backoffice/products']);
      },
      error: () => {
        this.errorMessage = 'Echec de connexion au backend.';
        this.loading = false;
      }
    });
  }
}
