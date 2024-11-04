import { NotificationSubscriptionComponent } from './notification-subscription.component';
import { render, screen, waitFor, within } from '@testing-library/angular';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { PurchaseService } from '../../services/purchase.service';

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

  it('should require subscription or one time purchase', async () => {
    const { user } = await renderComponent();
    const { dialog } = await openDialog(user);

    const nextButton = within(dialog).getByRole('button', { name: /next/i });
    await user.click(nextButton);

    const radioGroup = within(dialog).getByRole('group');
    expect(radioGroup).toHaveAccessibleErrorMessage(
      'Purchase type is required',
    );
  });

  it('should require all fields for subscription', async () => {
    const { user } = await renderComponent();
    const { dialog } = await openDialog(user);

    const radioGroup = within(dialog).getByRole('group');
    expect(radioGroup).toHaveTextContent(
      /Would you like a subscription or a one time purchase?/i,
    );

    const subscriptionOption =
      within(radioGroup).getByLabelText('Subscription');
    await user.click(subscriptionOption);

    const nextButton = within(dialog).getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(radioGroup).not.toBeVisible();

    const submitButton = within(dialog).getByRole('button', {
      name: /submit/i,
    });
    await user.click(submitButton);

    expect(purchaseService.purchaseSubscription).toHaveBeenCalledTimes(0);

    const firstNameInput = screen.getByLabelText('First name');
    expect(firstNameInput).toHaveAccessibleErrorMessage(
      'First name is required',
    );

    const lastNameInput = screen.getByLabelText('Last name');
    expect(lastNameInput).toHaveAccessibleErrorMessage('Last name is required');

    const ssnInput = screen.getByLabelText('SSN');
    expect(ssnInput).toHaveAccessibleErrorMessage('SSN is required');

    const acceptPactCheckbox = screen.getByRole('checkbox');
    expect(acceptPactCheckbox).toHaveAccessibleErrorMessage(
      'You are required to accept all risks of this product before purchasing',
    );
  });

  it('should capture subscription info', async () => {
    const { user } = await renderComponent();
    const { dialog } = await openDialog(user);

    const radioGroup = within(dialog).getByRole('group');
    expect(radioGroup).toHaveTextContent(
      /Would you like a subscription or a one time purchase?/i,
    );

    const subscriptionOption =
      within(radioGroup).getByLabelText('Subscription');
    await user.click(subscriptionOption);

    const nextButton = within(dialog).getByRole('button', { name: /next/i });
    await user.click(nextButton);

    const firstNameInput = screen.getByLabelText('First name');
    await user.type(firstNameInput, 'Alex');

    const lastNameInput = screen.getByLabelText('Last name');
    await user.type(lastNameInput, 'McClure');

    const ssnInput = screen.getByLabelText('SSN');
    await user.type(ssnInput, '123456789');

    const acceptPactCheckbox = screen.getByRole('checkbox');
    await user.click(acceptPactCheckbox);
    expect(acceptPactCheckbox).toBeChecked();

    const submitButton = within(dialog).getByRole('button', {
      name: /submit/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(firstNameInput).not.toBeVisible();
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

    const radioGroup = within(dialog).getByRole('group');
    expect(radioGroup).toHaveTextContent(
      /Would you like a subscription or a one time purchase?/i,
    );

    const subscriptionOption =
      within(radioGroup).getByLabelText('Subscription');
    await user.click(subscriptionOption);

    const nextButton = within(dialog).getByRole('button', { name: /next/i });
    await user.click(nextButton);

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
