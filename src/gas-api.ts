export const GAS_URL = "https://script.google.com/macros/s/AKfycbwrx3WcurjDcErU3XeirdeiP-Sf5U2Me1N9zQBFOZk5FAEja0_RCqt9FoZZwRJVI8WJRw/exec";
export const WA_NUMBER = "6282248991889";

export async function callBackend(payload: any) {
  if (!GAS_URL || GAS_URL === "URL_DEPLOY_GAS_ANDA_DISINI") {
    throw new Error("Peringatan: URL Backend GAS belum dikonfigurasi.");
  }
  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  } catch (error) {
    console.error("Backend Error:", error);
    throw error;
  }
}

export async function fetchPublicData(action = "getPublicData") {
  if (!GAS_URL || GAS_URL === "URL_DEPLOY_GAS_ANDA_DISINI") {
    throw new Error("Peringatan: URL Backend GAS belum dikonfigurasi.");
  }
  try {
    const response = await fetch(`${GAS_URL}?action=${action}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  } catch (error) {
    console.error("Fetch Data Error:", error);
    throw error;
  }
}
