/**
 * webhook.ts — Integration with n8n Lead Webhook
 * Webhook Endpoint: https://automate.nirosha.org/webhook/cakestorylead
 */

export const N8N_LEAD_WEBHOOK_URL = "https://automate.nirosha.org/webhook/cakestorylead";

export type WebhookLeadPayload = {
  id?: string;
  fullName: string;
  mobile: string;
  cityArea: string;
  investmentReadiness?: string;
  email?: string;
  subject?: string;
  message?: string;
  submittedAt?: string;
  status?: string;
  source?: string;
  brand?: string;
};

/**
 * Sends a lead payload to the n8n webhook.
 * Non-blocking, handles network failures gracefully without affecting UI flow.
 */
export async function sendLeadToWebhook(data: WebhookLeadPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      ...data,
      brand: "CakeStory Desserts",
      source: data.source || "CakeStory Website",
      submittedAt: data.submittedAt || new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(N8N_LEAD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn(`Webhook responded with status ${response.status}`);
      return { success: false, error: `Status ${response.status}` };
    }

    console.log("Lead successfully dumped to n8n webhook:", payload);
    return { success: true };
  } catch (err: any) {
    console.error("Failed to dump lead to n8n webhook:", err);
    return { success: false, error: err?.message || "Network error" };
  }
}

/**
 * Batch dumps an array of leads to the n8n webhook.
 */
export async function dumpAllLeadsToWebhook(leads: WebhookLeadPayload[]): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const lead of leads) {
    const res = await sendLeadToWebhook(lead);
    if (res.success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed };
}
