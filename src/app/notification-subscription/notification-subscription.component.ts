import { Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { CloseIconComponent } from '../close-icon/close-icon.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PurchaseTypeFormComponent } from './purchase-type-form/purchase-type-form.component';
import { SubscriptionFormComponent } from './subscription-form/subscription-form.component';
import { PurchaseDialogComponent } from './purchase-dialog/purchase-dialog.component';

@Component({
  selector: 'app-notification-subscription',
  standalone: true,
  imports: [
    NgOptimizedImage,
    CloseIconComponent,
    ReactiveFormsModule,
    PurchaseTypeFormComponent,
    SubscriptionFormComponent,
    PurchaseDialogComponent,
  ],
  templateUrl: './notification-subscription.component.html',
  styleUrl: './notification-subscription.component.scss',
})
export class NotificationSubscriptionComponent {
  showDialog = signal(false);
  dialogOpenElement = signal<HTMLElement | undefined>(undefined);

  constructor() {}

  showBuyNowDialog(event: Event) {
    this.dialogOpenElement.set(event.target as HTMLElement);
    this.showDialog.set(true);
  }

  handleDialogClose() {
    this.showDialog.set(false);
  }
}

export type PurchaseType = 'sub' | 'otp';
