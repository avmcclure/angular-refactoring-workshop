import { Component, output } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  PurchaseService,
  SubscriptionPurchaseOrder,
} from '../../../services/purchase.service';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './subscription-form.component.html',
  styleUrl: './subscription-form.component.scss',
})
export class SubscriptionFormComponent {
  subscriptionForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    ssn: ['', Validators.required],
    darkPact: [false, Validators.requiredTrue],
  });
  onClose = output();
  onSubmit = output<SubscriptionPurchaseOrder>();

  constructor(private formBuilder: FormBuilder) {}

  handleSubscriptionFormSubmit($event: Event) {
    $event.preventDefault();
    this.subscriptionForm.markAllAsTouched();
    if (this.subscriptionForm.invalid) return;

    this.onSubmit.emit(
      this.subscriptionForm.value as SubscriptionPurchaseOrder,
    );
  }

  handleClose($event: Event) {
    $event.preventDefault();
    this.onClose.emit();
  }
}
