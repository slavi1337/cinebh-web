export type TicketDetails = {
  bookingId: string;
  ticketCode: string;
  movieTitle: string;
  cityName: string;
  venueName: string;
  hallName: string;
  projectionStartTime: string;
  seats: string[];
  totalPaid: number;
  currency: string;
};

export type TicketValidationResponse = {
  valid: boolean;
  status: "VALID" | "PENDING" | "INVALID";
  message: string;
  ticket: TicketDetails | null;
};
