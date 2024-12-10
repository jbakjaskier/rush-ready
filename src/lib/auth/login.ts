"use server";

import { AccessTokenResponse, AuthErrorResponse } from "./models";

const docuSignAuthScopes = ["signature", "openid", "cors", "extended"];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateOAuthState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString("base64url");
}

export async function createAuthUrl(): Promise<string> {
  const loginUrl = new URL(
    process.env.NODE_ENV === "development"
      ? `https://account-d.docusign.com/oauth/auth`
      : `https://account.docusign.com/oauth/auth`
  );
  loginUrl.searchParams.append(`response_type`, `code`);
  loginUrl.searchParams.append(`scope`, docuSignAuthScopes.join(" "));
  loginUrl.searchParams.append(
    `client_id`,
    process.env.DOCUSIGN_INTEGRATION_KEY!
  );
  loginUrl.searchParams.append(
    `redirect_uri`,
    process.env.DOCUSIGN_REDIRECT_URI!
  );

  return loginUrl.toString();
}

export async function getAccessToken(
  authCode: string
): Promise<AccessTokenResponse | AuthErrorResponse> {
  try {
    const authFetchResult = await fetch(
      process.env.NODE_ENV === "development"
        ? `https://account-d.docusign.com/oauth/token`
        : `https://account.docusign.com/oauth/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(
            `${process.env.DOCUSIGN_INTEGRATION_KEY!}:${process.env
              .DOCUSIGN_SECRET_KEY!}`
          )}`,
          'Content-Type': `application/x-www-form-urlencoded`
        },
        body: new URLSearchParams({
          grant_type: `authorization_code`,
          code: authCode,
        }).toString(),
      }
    );

    if (!authFetchResult.ok) {
      console.info(`authFetchResult status`, authFetchResult.status);
      return {
        errorMessage: `We weren't able to successfully authenticate you. Please try again in a bit`,
      };
    }
    
    const tokenResponse = (await authFetchResult.json()) as AccessTokenResponse;

    return tokenResponse;
  } catch (error: unknown) {
    if (typeof error === "string") {
      return {
        errorMessage: error,
      };
    }

    if (error instanceof Error) {
      return {
        errorMessage: error.message,
      };
    }

    return {
      errorMessage: `We weren't able to successfully authenticate you. Please try again in a bit`,
    };
  }
}
