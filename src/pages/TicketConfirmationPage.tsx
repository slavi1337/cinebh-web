import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageStatusCard from "@/components/common/PageStatusCard";
import { validateTicket } from "@/services/ticketService";
import type { TicketValidationResponse } from "@/types/ticket";
import { getApiErrorMessage } from "@/utils/auth";

function formatProjectionStart(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(value: number, currency: string) {
  return `${Number(value).toFixed(2)} ${currency}`;
}

type TicketDetailRowProps = {
  label: string;
  children: ReactNode;
};

function TicketDetailRow({ label, children }: TicketDetailRowProps) {
  return (
    <div className="grid gap-1 bg-white p-4 md:grid-cols-[180px_1fr]">
      <span className="font-semibold text-page-muted">{label}</span>
      <span className="break-all font-bold text-page-heading">{children}</span>
    </div>
  );
}

function TicketPageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-page-background">
      <div className="mx-auto w-full max-w-360 px-4 pt-12 pb-20 md:px-8 lg:px-23">
        {children}
      </div>
    </main>
  );
}

export default function TicketConfirmationPage() {
  const [searchParams] = useSearchParams();
  const ticketCode = searchParams.get("ticketCode") ?? "";
  const [validation, setValidation] =
    useState<TicketValidationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadTicket = useCallback(async () => {
    if (!ticketCode) {
      setErrorMessage("Ticket QR code is missing validation information.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setValidation(await validateTicket(ticketCode));
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [ticketCode]);

  useEffect(() => {
    void loadTicket();
  }, [loadTicket]);

  if (isLoading) {
    return (
      <TicketPageLayout>
        <PageStatusCard label="Validating ticket..." />
      </TicketPageLayout>
    );
  }

  if (errorMessage || !validation) {
    return (
      <TicketPageLayout>
        <PageStatusCard
          label={errorMessage || "Ticket could not be validated."}
        />
      </TicketPageLayout>
    );
  }

  const ticket = validation.ticket;

  return (
    <TicketPageLayout>
      <section className="mx-auto max-w-210 rounded-3xl border border-border-default bg-white px-6 py-10 shadow-page-input md:px-12">
        <p className="text-[14px] leading-5 font-semibold tracking-[0.1em] text-brand-red uppercase">
          Ticket validation
        </p>
        <h1 className="mt-3 text-[32px] leading-10 font-bold tracking-[-0.0015em] text-page-heading">
          {validation.valid ? "Ticket is valid" : "Ticket is not ready"}
        </h1>
        <p className="mt-4 text-body-md text-page-muted">
          {validation.message}
        </p>

        {!ticket && (
          <div className="mt-8 rounded-2xl border border-brand-red/30 bg-brand-red/10 p-5 text-body-md text-brand-red">
            Ticket status:{" "}
            <span className="font-bold">{validation.status}</span>
            {validation.status === "PENDING" && (
              <button
                type="button"
                onClick={loadTicket}
                className="ml-3 font-bold underline"
              >
                Check again
              </button>
            )}
          </div>
        )}

        {ticket && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-border-default">
            <div className="grid gap-px bg-border-default text-body-md">
              <TicketDetailRow label="Booking ID">
                {ticket.bookingId}
              </TicketDetailRow>
              <TicketDetailRow label="Ticket Code">
                {ticket.ticketCode}
              </TicketDetailRow>
              <TicketDetailRow label="Movie">{ticket.movieTitle}</TicketDetailRow>
              <TicketDetailRow label="Cinema">
                {ticket.venueName}, {ticket.cityName}
              </TicketDetailRow>
              <TicketDetailRow label="Hall">{ticket.hallName}</TicketDetailRow>
              <TicketDetailRow label="Projection">
                {formatProjectionStart(ticket.projectionStartTime)}
              </TicketDetailRow>
              <TicketDetailRow label="Seats">
                {ticket.seats.join(", ")}
              </TicketDetailRow>
              <TicketDetailRow label="Amount paid">
                {formatAmount(ticket.totalPaid, ticket.currency)}
              </TicketDetailRow>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/currently-showing"
            className="inline-flex justify-center rounded-full bg-brand-red px-7 py-3 text-body-md font-semibold text-white transition hover:bg-brand-red/90"
          >
            Show Movies
          </Link>
          <Link
            to="/"
            className="inline-flex justify-center rounded-full border border-border-default px-7 py-3 text-body-md font-semibold text-page-heading transition hover:border-brand-red hover:text-brand-red"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </TicketPageLayout>
  );
}
