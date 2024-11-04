import { NotificationSubscriptionComponent } from './notification-subscription.component';
import { render, screen, waitFor, within } from '@testing-library/angular';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { PurchaseService } from '../../services/purchase.service';
import {
  fillInPurchaseTypeForm,
  fillInSubscriptionPurchaseOrderForm,
} from './notification-subscription-test-utils';

describe('NotificationSubscriptionComponent', () => {
  let purchaseService: PurchaseService;
  beforeEach(() => {
    purchaseService = {
      purchaseSubscription: jest.fn(),
    };
  });

  it(`should open the purchase modal when 'Buy now' button is clicked`, async () => {
    const { user } = await renderComponent();
    const { dialog } = await openDialog(user);
    expect(dialog).toBeVisible();
  });

  it(`should focus the close button when the modal is opened`, async () => {
    const { user } = await renderComponent();
    const { dialog } = await openDialog(user);

    const closeDialogBtn = within(dialog).getByRole('button', {
      name: /close dialog/i,
    });
    await waitFor(() => {
      expect(closeDialogBtn).toHaveFocus();
    });
  });

  it('should return focus to the button use to open the modal when closed', async () => {
    const { user } = await renderComponent();
    const { buttons, dialog } = await openDialog(user);

    const closeButton = within(dialog).getByRole('button', {
      name: /close dialog/i,
    });
    await user.click(closeButton);

    expect(buttons[1]).toHaveFocus();
  });

  it('should capture subscription info', async () => {
    const { user } = await renderComponent();
    await openDialog(user);

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

  it('should reset modal when closed', async () => {
    const { user, detectChanges } = await renderComponent();
    const { dialog } = await openDialog(user);

    await fillInPurchaseTypeForm(user, 'Subscription');

    const closeButton = within(dialog).getByRole('button', {
      name: /close dialog/i,
    });
    await user.click(closeButton);

    await openDialog(user);
    const radios = within(dialog).getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio).not.toBeChecked();
    });
  });

  async function renderComponent() {
    const user = userEvent.setup();
    const renderResult = await render(NotificationSubscriptionComponent, {
      componentProviders: [
        {
          provide: PurchaseService,
          useValue: purchaseService,
        },
      ],
    });
    return { ...renderResult, user };
  }
});

async function openDialog(user: UserEvent) {
  const buttons = screen.getAllByRole('button', { name: /buy now/i });

  await user.click(buttons[1]);

  const dialog = await screen.findByRole('dialog', {
    name: /purchase snake oil now/i,
  });
  return { buttons, dialog };
}
