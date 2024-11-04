import {
  Component,
  effect,
  ElementRef,
  input,
  output,
  signal,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { CloseIconComponent } from '../../close-icon/close-icon.component';
import { PurchaseTypeFormComponent } from '../purchase-type-form/purchase-type-form.component';
import { SubscriptionFormComponent } from '../subscription-form/subscription-form.component';
import { PurchaseType } from '../notification-subscription.component';
import {
  PurchaseService,
  SubscriptionPurchaseOrder,
} from '../../../services/purchase.service';

@Component({
  selector: 'app-purchase-dialog',
  standalone: true,
  imports: [
    CloseIconComponent,
    PurchaseTypeFormComponent,
    SubscriptionFormComponent,
  ],
  templateUrl: './purchase-dialog.component.html',
  styleUrl: './purchase-dialog.component.scss',
})
export class PurchaseDialogComponent {
  showDialog = input.required<boolean>();
  onClose = output();
  dialogOpenElement = input<HTMLElement>();

  purchaseType = signal<PurchaseType | undefined>(undefined);
  purchaseComplete = signal(false);
  dialogClose = viewChild<ElementRef>('dialogClose');

  constructor(private purchaseService: PurchaseService) {
    effect(() => {
      if (!this.showDialog()) return;

      setTimeout(() => {
        this.dialogClose()?.nativeElement?.focus();
      }, 5);
    });
  }

  closeBuyNowDialog() {
    this.onClose.emit();
    this.purchaseType.set(undefined);
    this.dialogOpenElement()?.focus();
  }

  handleSubscriptionFormSubmit(order: SubscriptionPurchaseOrder) {
    this.purchaseService.purchaseSubscription(order);
    this.purchaseComplete.set(true);
  }

  handlePurchaseTypeFormSubmit(purchaseType: PurchaseType) {
    this.purchaseType.set(purchaseType);
  }
}
