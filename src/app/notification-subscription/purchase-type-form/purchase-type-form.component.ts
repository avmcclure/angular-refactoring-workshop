import { Component, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PurchaseType } from '../notification-subscription.component';

@Component({
  selector: 'app-purchase-type-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './purchase-type-form.component.html',
  styleUrl: './purchase-type-form.component.scss',
})
export class PurchaseTypeFormComponent {
  purchaseTypeForm = this.formBuilder.group({
    purchaseType: ['', Validators.required],
  });
  onClose = output();
  onSubmit = output<PurchaseType>();

  constructor(private formBuilder: FormBuilder) {}

  handlePurchaseTypeFormSubmit($event: Event) {
    $event.preventDefault();
    this.purchaseTypeForm.markAllAsTouched();

    if (this.purchaseTypeForm.invalid) return;
    this.onSubmit.emit(
      this.purchaseTypeForm.value.purchaseType as unknown as PurchaseType,
    );
  }

  handleClose($event: Event) {
    $event.preventDefault();
    this.onClose.emit();
  }
}
