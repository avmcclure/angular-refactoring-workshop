import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  constructor() {}

  purchaseSubscription(order: SubscriptionPurchaseOrder) {
    console.log(`purchaseSubscription order: ${JSON.stringify(order)}`);
  }
}

export type SubscriptionPurchaseOrder = {
  firstName: string;
  lastName: string;
  ssn: string;
  darkPact: boolean;
};
