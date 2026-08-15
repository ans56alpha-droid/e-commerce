import crypto from "crypto";

import { jazzCashConfig } from "./jazzcash";
import { generateJazzCashSecureHash } from "./hash";

function formatJazzCashDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function generateTransactionReference() {
  const timestamp = Date.now().toString();

  const random = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `T${timestamp}${random}`.slice(0, 20);
}

function convertToJazzCashAmount(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid payment amount");
  }

  return Math.round(amount * 100).toString();
}

export interface CreateJazzCashPaymentInput {
  amount: number;
  orderNumber: string;
}

export function createJazzCashPayment(
  input: CreateJazzCashPaymentInput
) {
  const now = new Date();

  const expiry = new Date(
    now.getTime() + 30 * 60 * 1000
  );

  const txnRefNo = generateTransactionReference();

  const payload: Record<string, string> = {
    pp_Version: "1.1",
    pp_TxnType: "",
    pp_Language: "EN",
    pp_MerchantID: jazzCashConfig.merchantId,
    pp_SubMerchantID: "",
    pp_Password: jazzCashConfig.password,

    pp_TxnRefNo: txnRefNo,

    pp_Amount: convertToJazzCashAmount(
      input.amount
    ),

    pp_TxnCurrency: "PKR",

    pp_TxnDateTime: formatJazzCashDate(now),

    pp_TxnExpiryDateTime:
      formatJazzCashDate(expiry),

    pp_BillReference: input.orderNumber,

    pp_Description: `Payment for ${input.orderNumber}`,

    pp_ReturnURL: jazzCashConfig.returnUrl,
  };

  payload.pp_SecureHash =
    generateJazzCashSecureHash(payload);

  return {
    txnRefNo,
    payload,
    paymentUrl: jazzCashConfig.paymentUrl,
  };
}