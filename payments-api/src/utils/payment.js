// The actual payment service will go here
// Currently I am just adding a mock service
export async function payWithCreditCard(creditCardDetails, bill) {
  if (
    creditCardDetails &&
    creditCardDetails.number &&
    typeof creditCardDetails.number == 'string' &&
    creditCardDetails.cvt &&
    typeof creditCardDetails.cvt == 'number' &&
    creditCardDetails.expiry &&
    typeof creditCardDetails.expiry == 'string' &&
    typeof bill == 'number'
  ) {
    return Math.random() > 0.5;
  } else {
    throw new Error('missing required parameters');
  }
}
