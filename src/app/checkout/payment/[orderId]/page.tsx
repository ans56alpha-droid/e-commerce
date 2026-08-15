import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { initiateJazzCashPayment } from "@/services/payment/jazzcash";

type PaymentPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function JazzCashPaymentPage({ params }: PaymentPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { orderId } = await params;

  const payment = await initiateJazzCashPayment(session.user.id, orderId);

  if (!payment.paymentUrl || !payment.payload) {
    redirect(`/orders/${orderId}`);
  }

  return (
    <main className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-lg border p-8 text-center">
        <h1 className="text-2xl font-bold">Redirecting to JazzCash</h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Please wait while we securely redirect you to JazzCash to complete your payment.
        </p>

        <form id="jazzcash-payment-form" action={payment.paymentUrl} method="POST" className="mt-6">
          {Object.entries(payment.payload).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}

          <button
            type="submit"
            className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground"
          >
            Continue to JazzCash
          </button>
        </form>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(() => {
                document
                  .getElementById("jazzcash-payment-form")
                  ?.submit();
              }, 1500);
            `,
          }}
        />
      </div>
    </main>
  );
}
