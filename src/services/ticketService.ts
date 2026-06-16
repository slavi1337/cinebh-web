import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import api from "@/services/api";
import type { TicketValidationResponse } from "@/types/ticket";

export async function validateTicket(
  ticketCode: string,
): Promise<TicketValidationResponse> {
  const response = await api.get<TicketValidationResponse>(
    API_ENDPOINTS.tickets.validate(ticketCode),
  );
  return response.data;
}
