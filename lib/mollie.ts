import { createMollieClient } from '@mollie/api-client';

export const ASSESSMENT_PRICE = 1000; // €10.00 in cents
export const ASSESSMENT_PRICE_DISPLAY = '10.00';

let mollieClient: ReturnType<typeof createMollieClient> | null = null;

export function getMollie() {
  if (!mollieClient) {
    const apiKey = process.env.MOLLIE_API_KEY;
    if (!apiKey) throw new Error('MOLLIE_API_KEY is not set');
    mollieClient = createMollieClient({ apiKey });
  }
  return mollieClient;
}
