import { SubscriptionFormComponent } from './subscription-form.component';
import { render, screen, within } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { fillInSubscriptionPurchaseOrderForm } from '../notification-subscription-test-utils';

describe('SubscriptionFormComponent', () => {
  const onSubmit = jest.fn();
  const onClose = jest.fn();

  it('should require all fields for subscription', async () => {
    const { user } = await renderComponent();

    const firstNameInput = screen.getByLabelText('First name');
    const lastNameInput = screen.getByLabelText('Last name');
    const ssnInput = screen.getByLabelText('SSN');
    const acceptPactCheckbox = screen.getByRole('checkbox');

    expect(firstNameInput).not.toHaveAccessibleErrorMessage();
    expect(lastNameInput).not.toHaveAccessibleErrorMessage();
    expect(ssnInput).not.toHaveAccessibleErrorMessage();
    expect(acceptPactCheckbox).not.toHaveAccessibleErrorMessage();

    const submitButton = screen.getByRole('button', {
      name: /submit/i,
    });
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledTimes(0);

    expect(firstNameInput).toHaveAccessibleErrorMessage(
      'First name is required',
    );
    expect(lastNameInput).toHaveAccessibleErrorMessage('Last name is required');
    expect(ssnInput).toHaveAccessibleErrorMessage('SSN is required');
    expect(acceptPactCheckbox).toHaveAccessibleErrorMessage(
      'You are required to accept all risks of this product before purchasing',
    );
  });

  it('should emit purchase order when submitted', async () => {
    const { user } = await renderComponent();
    await fillInSubscriptionPurchaseOrderForm(user, {
      firstName: 'Alex',
      lastName: 'McClure',
      ssn: '123456789',
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      firstName: 'Alex',
      lastName: 'McClure',
      ssn: '123456789',
      darkPact: true,
    });
  });

  async function renderComponent() {
    const user = userEvent.setup();
    const result = await render(SubscriptionFormComponent, {
      on: {
        onClose,
        onSubmit,
      },
    });

    return { ...result, user };
  }
});
