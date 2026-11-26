import { ApiError } from "./errors";

export interface MidtransCredentials {
  serverKey: string;
  clientKey: string;
}

export function validateMidtransCredentials(
  serverKeyValue: string | undefined,
  clientKeyValue: string | undefined,
  isProduction: boolean
): MidtransCredentials {
  const serverKey = serverKeyValue?.trim();
  const clientKey = clientKeyValue?.trim();
  if (!serverKey || !clientKey) {
    throw new ApiError(503, "PAYMENT_NOT_CONFIGURED", "Midtrans server and client keys must both be configured.");
  }

  const expectedServerPrefix = isProduction ? "Mid-server-" : "SB-Mid-server-";
  const expectedClientPrefix = isProduction ? "Mid-client-" : "SB-Mid-client-";
  if (!serverKey.startsWith(expectedServerPrefix) || !clientKey.startsWith(expectedClientPrefix)) {
    throw new ApiError(
      503,
      "PAYMENT_KEYS_ENVIRONMENT_MISMATCH",
      `The Midtrans keys do not match ${isProduction ? "production" : "sandbox"} mode. Use both ${isProduction ? "production" : "sandbox"} keys, or change MIDTRANS_IS_PRODUCTION to match the keys.`
    );
  }

  return { serverKey, clientKey };
}

export function getMidtransHttpStatus(error: unknown): number | undefined {
  if (
    error &&
    typeof error === "object" &&
    "httpStatusCode" in error &&
    typeof error.httpStatusCode === "number"
  ) {
    return error.httpStatusCode;
  }
  return undefined;
}
