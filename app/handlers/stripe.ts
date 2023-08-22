import Stripe from 'stripe';

// Local modules
import config from '../config/config';

const STRIPE_SEC_KEY = config.get("stripeSecretKey");

export const stripe = new Stripe(STRIPE_SEC_KEY, {
  apiVersion: '2022-11-15',
});