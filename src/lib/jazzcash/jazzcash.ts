const requiredEnv = [
    "JAZZCASH_MERCHANT_ID",
    "JAZZCASH_PASSWORD",
    "JAZZCASH_INTEGRITY_SALT",
    "JAZZCASH_PAYMENT_URL",
    "JAZZCASH_RETURN_URL",
  ] as const;
  
  for (const key of requiredEnv) {
    if (!process.env[key]) {
      throw new Error(`${key} is not defined`);
    }
  }
  
  export const jazzCashConfig = {
    merchantId: process.env.JAZZCASH_MERCHANT_ID!,
    password: process.env.JAZZCASH_PASSWORD!,
    integritySalt: process.env.JAZZCASH_INTEGRITY_SALT!,
    paymentUrl: process.env.JAZZCASH_PAYMENT_URL!,
    returnUrl: process.env.JAZZCASH_RETURN_URL!,
  } as const;