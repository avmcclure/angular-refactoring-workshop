import { userEvent } from '@testing-library/user-event';
import { render, waitFor, screen } from '@testing-library/angular';
import { PurchaseTypeFormComponent } from '../purchase-type-form/purchase-type-form.component';
import { PurchaseDialogComponent } from './purchase-dialog.component';
import {
  fillInPurchaseTypeForm,
  fillInSubscriptionPurchaseOrderForm,
} from '../notification-subscription-test-utils';
import { PurchaseService } from '../../../services/purchase.service';

describe('PurchaseDialogComponent', () => {
  const onClose = jest.fn();
  const purchaseService = {
    purchaseSubscription: jest.fn(),
  };

  it('should focus close button when opened', async () => {
    const { user } = await renderComponent();

    const closeDialogBtn = screen.getByRole('button', {
      name: /close dialog/i,
    });
    await waitFor(() => {
      expect(closeDialogBtn).toHaveFocus();
    });
  });

  it('should capture subscription info', async () => {
    const { user } = await renderComponent();

    await fillInPurchaseTypeForm(user, 'Subscription');

    await fillInSubscriptionPurchaseOrderForm(user, {
      firstName: 'Alex',
      lastName: 'McClure',
      ssn: '123456789',
    });

    await screen.findByRole('heading', {
      name: 'Your order will arrive eventually',
    });

    expect(purchaseService.purchaseSubscription).toHaveBeenCalledTimes(1);
    expect(purchaseService.purchaseSubscription).toHaveBeenCalledWith({
      firstName: 'Alex',
      lastName: 'McClure',
      ssn: '123456789',
      darkPact: true,
    });
  });

  async function renderComponent() {
    const user = userEvent.setup();
    const renderResult = await render(PurchaseDialogComponent, {
      on: {
        onClose,
      },
      inputs: {
        showDialog: true,
      },
      providers: [{ provide: PurchaseService, useValue: purchaseService }],
    });
    return { ...renderResult, user };
  }
});
