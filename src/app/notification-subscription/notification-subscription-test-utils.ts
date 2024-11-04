import { UserEvent } from '@testing-library/user-event';
import { SubscriptionPurchaseOrder } from '../../services/purchase.service';
import { screen, within } from '@testing-library/angular';

export async function fillInPurchaseTypeForm(
  user: UserEvent,
  purchaseType: 'Subscription' | 'One-time purchase',
) {
  const radioGroup = screen.getByRole('group');
  expect(radioGroup).toHaveTextContent(
    /Would you like a subscription or a one time purchase?/i,
  );

  const subscriptionOption = within(radioGroup).getByLabelText(purchaseType);
  await user.click(subscriptionOption);

  const nextButton = screen.getByRole('button', { name: /next/i });
  await user.click(nextButton);
}

export async function fillInSubscriptionPurchaseOrderForm(
  user: UserEvent,
  order: Omit<SubscriptionPurchaseOrder, 'darkPact'>,
) {
  const firstNameInput = screen.getByLabelText('First name');
  await user.type(firstNameInput, order.firstName);

  const lastNameInput = screen.getByLabelText('Last name');
  await user.type(lastNameInput, order.lastName);

  const ssnInput = screen.getByLabelText('SSN');
  await user.type(ssnInput, order.ssn);

  const acceptPactCheckbox = screen.getByRole('checkbox');
  await user.click(acceptPactCheckbox);

  const submitButton = screen.getByRole('button', { name: /submit/i });
  await user.click(submitButton);
}
