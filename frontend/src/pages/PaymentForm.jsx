import React, { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const PaymentForm = ({ clientSecret, verifyPayment, onPaymentComplete }) => {
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [paymentSuccessful, setPaymentSuccessful] = useState(false); // To track payment status
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setProcessing(true);

        // Create a payment method with the CardElement
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (error) {
            setError(error.message);
            setProcessing(false);
        } else {
            // Payment was successful
            if (paymentIntent.status === 'succeeded') {
                console.log('Payment was successful');
                verifyPayment(paymentIntent.id); // Pass the paymentIntent.id to verify the payment
                setPaymentSuccessful(true); // Mark the payment as successful
            }
        }
    };

    useEffect(() => {
        if (paymentSuccessful) {
            // Trigger the payment complete action after payment is successful
            onPaymentComplete();
        }
    }, [paymentSuccessful, onPaymentComplete]);

    const cardStyle = {
        style: {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4',
                },
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                transition: 'border-color 0.3s',
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                {!paymentSuccessful ? (
                    <form onSubmit={handleSubmit} className="payment-form">
                        <h2 className="text-2xl font-semibold text-center mb-6">Payment Details</h2>
                        <div className="mb-4">
                            <CardElement options={cardStyle} />
                        </div>
                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-2 mt-4 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300"
                            disabled={processing || !stripe}
                        >
                            {processing ? 'Processing...' : 'Pay Now'}
                        </button>
                    </form>
                ) : (
                    // This will display after successful payment
                    <div className="text-center">
                        <h2 className="text-xl text-green-600 font-semibold mb-4">Payment Successful!</h2>
                        <p>Your payment was processed successfully. Thank you for booking with us!</p>
                        <button
                            className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600"
                            onClick={() => onPaymentComplete()} // Trigger to hide the payment form
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>

    );
};

export default PaymentForm;
