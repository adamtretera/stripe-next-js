import { auth } from "./firebase";
const API = "https://stripe-backend-d23xncgmsq-ew.a.run.app";

export async function fetchFromAPI(endpointURL, opts) {
  const { method = "POST", body = null } = {
    method: "POST",
    body: null,
    ...opts,
  };

  const user = auth.currentUser;
  const token = user && (await user.getIdToken());

  const res = await fetch(`${API}/${endpointURL}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}
