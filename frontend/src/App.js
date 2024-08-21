import { useState } from 'react';
import './App.css';

function loadScript(src) {
  return new Promise((resolve, _reject) => {
    const script = document.createElement('script');
    script.src = src;

    script.addEventListener('load', () => resolve(true));
    script.addEventListener('error', () => resolve(false));

    document.body.append(script);
  });
}

export default function App() {
  const [amount, setAmount] = useState('');

  const handlePayment = async e => {
    // Prevent default behaviour of submit event
    e.preventDefault();

    // Load checkout script
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      console.error('Error loading razorpay checkout');
      return;
    }

    // Make API request to create order in DB
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const { data: order } = await response.json();
      console.log(order);

      // Define checkout options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'Shopease',
        description: 'Payment for purchased items',
        order_id: order._id,
        handler: async function (response) {
          console.log(response);

          // Confirm order on payment success
          const res = await fetch(`/api/orders/${order._id}/confirm`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const { data: placedOrder } = await res.json();
          console.log(placedOrder);
        },
        prefill: {
          name: 'Shubham Purwar',
          email: 'shubhampurwar35@gmail.com',
          contact: '9897887871',
        },
        theme: {
          color: '#3399cc',
        },
        config: {
          display: {
            hide: [
              {
                method: 'emi',
              },
              {
                method: 'cardless_emi',
              },
            ],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        modal: {
          confirm_close: true,
        },
      };

      // Open checkout window
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      // Reset state variables
      setAmount('');
    } catch (error) {
      console.log(error.message || 'Failed to complete request');
    }
  };

  return (
    <main>
      <form onSubmit={handlePayment}>
        <input
          type='text'
          placeholder='Amount (₹)'
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button type='submit'>Checkout</button>
      </form>
    </main>
  );
}
