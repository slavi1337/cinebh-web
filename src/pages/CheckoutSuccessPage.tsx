import { Link, useSearchParams } from "react-router-dom";

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const ticketCode = searchParams.get("ticketCode");
  const ticketUrl = ticketCode
    ? `/tickets/confirmation?ticketCode=${encodeURIComponent(ticketCode)}`
    : "";

  return (
    <main className="min-h-screen bg-page-background">
      <div className="mx-auto w-full max-w-360 px-4 pt-12 pb-20 md:px-8 lg:px-23">
        <section className="mx-auto max-w-190 rounded-3xl border border-border-default bg-white px-6 py-14 text-center shadow-page-input md:px-12">
          <p className="text-[14px] leading-5 font-semibold tracking-[0.1em] text-brand-red uppercase">
            Payment successful
          </p>
          <h1 className="mt-3 text-[32px] leading-10 font-bold tracking-[-0.0015em] text-page-heading">
            Your tickets are being confirmed
          </h1>
          <p className="mx-auto mt-4 max-w-140 text-body-md text-page-muted">
            Stripe has accepted the payment. Cinebh will mark your booking as
            paid after the payment webhook is processed. You can open the ticket
            here or from the confirmation email.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {ticketUrl && (
              <Link
                to={ticketUrl}
                className="rounded-full bg-brand-red px-7 py-3 text-body-md font-semibold text-white transition hover:bg-brand-red/90"
              >
                Show Ticket
              </Link>
            )}
            <Link
              to="/currently-showing"
              className="rounded-full border border-border-default px-7 py-3 text-body-md font-semibold text-page-heading transition hover:border-brand-red hover:text-brand-red"
            >
              Show Movies
            </Link>
            <Link
              to="/"
              className="rounded-full border border-border-default px-7 py-3 text-body-md font-semibold text-page-heading transition hover:border-brand-red hover:text-brand-red"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
