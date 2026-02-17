async function getOAuthCode(): Promise<string> {
  const clientId = import.meta.env.WXT_CLIENT_ID;
  if (!clientId) {
    throw new Error("Client ID is not set.");
  }
  const redirectUrl = browser.identity.getRedirectURL();
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUrl,
    scope: "read write",
  });
  const paramsStr = params.toString();
  const requestUrl = `https://annict.com/oauth/authorize?${paramsStr}`;

  const responseUrl = await browser.identity.launchWebAuthFlow({
    url: requestUrl,
    interactive: true,
  });
  if (!responseUrl) {
    throw new Error("Authorization failed.");
  }
  const code = new URL(responseUrl).searchParams.get("code");
  if (!code) {
    throw new Error("Authorization failed.");
  }
  return code;
}

export async function generateToken(): Promise<void> {
  const code = await getOAuthCode();
  const redirectUrl = browser.identity.getRedirectURL();
  const params = new URLSearchParams({
    code,
    redirect_uri: redirectUrl,
  });
  const paramsStr = params.toString();
  const res = await fetch(
    `${import.meta.env.WXT_SERVER_URL}/token?${paramsStr}`,
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  const token = json.access_token;
  await storage.setItem<string>("sync:token", token);
}

export async function revokeToken(): Promise<void> {
  const token = await storage.getItem<string>("sync:token");
  if (!token) {
    return;
  }
  const res = await fetch(
    `${import.meta.env.WXT_SERVER_URL}/token?token=${token}`,
    {
      method: "DELETE",
    },
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  await storage.removeItem("sync:token");
}
