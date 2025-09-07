export const createPaymentSession = async (orderId, orderAmount, customerDetails) => {
  const response = await fetch('https://backendgnbweb.onrender.com/api/create-payment-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, orderAmount, customerDetails }),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment session');
  }

  const data = await response.json();
  return data.paymentSessionId;
};
