import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { CloseIconComponent } from '../close-icon/close-icon.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  PurchaseService,
  SubscriptionPurchaseOrder,
} from '../../services/purchase.service';

@Component({
  selector: 'app-notification-subscription',
  standalone: true,
  imports: [NgOptimizedImage, CloseIconComponent, ReactiveFormsModule],
  templateUrl: './notification-subscription.component.html',
  styleUrl: './notification-subscription.component.scss',
})
export class NotificationSubscriptionComponent {
  showDialog = signal(false);
  dialogOpenElement = signal<HTMLElement | undefined>(undefined);
  dialogClose = viewChild<ElementRef>('dialogClose');
  purchaseTypeForm = this.formBuilder.group({
    purchaseType: ['', Validators.required],
  });
  subscriptionForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    ssn: ['', Validators.required],
    darkPact: [false, Validators.requiredTrue],
  });
  purchaseType = signal<PurchaseType | undefined>(undefined);
  purchaseComplete = signal(false);

  constructor(
    private formBuilder: FormBuilder,
    private purchaseService: PurchaseService,
  ) {}

  showBuyNowDialog(event: Event) {
    this.dialogOpenElement.set(event.target as HTMLElement);
    this.showDialog.set(true);
    setTimeout(() => {
      this.dialogClose()?.nativeElement.focus();
    }, 5);
  }

  closeBuyNowDialog() {
    this.showDialog.set(false);
    this.purchaseType.set(undefined);
    this.purchaseTypeForm.reset();
    this.subscriptionForm.reset();
    this.dialogOpenElement()?.focus();
  }

  handlePurchaseTypeFormSubmit($event: Event) {
    $event.preventDefault();
    if (this.purchaseTypeForm.invalid) return;
    this.purchaseType.set(
      this.purchaseTypeForm.value.purchaseType as unknown as PurchaseType,
    );
  }

  handleSubscriptionFormSubmit($event: Event) {
    $event.preventDefault();
    this.subscriptionForm.markAllAsTouched();
    if (this.subscriptionForm.invalid) return;

    this.purchaseService.purchaseSubscription(
      this.subscriptionForm.value as SubscriptionPurchaseOrder,
    );

    this.purchaseComplete.set(true);
  }
}

type PurchaseType = 'sub' | 'otp';
