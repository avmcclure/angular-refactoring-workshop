import { userEvent } from '@testing-library/user-event';
import { render, screen, within } from '@testing-library/angular';
import { PurchaseTypeFormComponent } from './purchase-type-form.component';
import { fillInPurchaseTypeForm } from '../notification-subscription-test-utils';

describe('PurchaseTypeFormComponent', () => {
  const onClose = jest.fn();
  const onSubmit = jest.fn();

  it('should require subscription or one time purchase', async () => {
    const { user } = await renderComponent();
    const radioGroup = screen.getByRole('group');
    expect(radioGroup).not.toHaveAccessibleErrorMessage();

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(radioGroup).toHaveAccessibleErrorMessage(
      'Purchase type is required',
    );
  });

  it(`should emit purchase type when 'Next' button is clicked`, async () => {
    const { user } = await renderComponent();

    await fillInPurchaseTypeForm(user, 'Subscription');

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('sub');
  });

  it(`should emit close event when 'Close' button is clicked`, async () => {
    const { user } = await renderComponent();
    const closeButton = screen.getByRole('button', { name: /close/i });

    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  async function renderComponent() {
    const user = userEvent.setup();
    const renderResult = await render(PurchaseTypeFormComponent, {
      on: {
        onClose,
        onSubmit,
      },
    });
    return { ...renderResult, user };
  }
});
