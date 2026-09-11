const API_BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8000";

export interface JourneyRequest {
  query: string;
  origin?: string;
  destination?: string;
  date?: string;
  preferences?: Record<string, unknown>;
}

export const planCompleteJourney = async (
  request: JourneyRequest
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/journey/complete-plan`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Backend error ${response.status}: ${errorText}`
    );
  }

  return response.json();
};