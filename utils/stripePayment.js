const stripe = require('stripe')(process.env.STRIPE_SECRET);


const stripePayment = async (number, cvc, exp_month, exp_year, amount) => {
    try {
        const token = await stripe.tokens.create({
            card: {
                number: number,
                cvc: cvc,
                exp_month: exp_month,
                exp_year: exp_year,
            },
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to smallest currency unit
            currency: 'INR',
            payment_method_data: {
                type: 'card',
                card: { token: token.id },
            },
            confirm: true, // Automatically confirm the payment
        });

        return paymentIntent;
    }  catch (error) {
        console.log(error);
    }
}

module.exports = stripePayment; 