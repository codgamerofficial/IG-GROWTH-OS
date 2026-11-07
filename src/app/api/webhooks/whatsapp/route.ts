// =============================================================================
// RIIQX — WhatsApp Cloud API Webhook Route (Phase 5)
// GET & POST /api/webhooks/whatsapp
// Handles Verification Handshake & Real-Time Message Processing (<1.5s)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppTwinEngine } from '@/services/messaging/whatsapp-twin-engine';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  const { isValid, challenge: responseChallenge } = WhatsAppTwinEngine.verifyWebhook(
    mode,
    token,
    challenge
  );

  if (isValid && responseChallenge) {
    return new NextResponse(responseChallenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Meta Webhook payload check
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (Array.isArray(messages) && messages.length > 0) {
      const incoming = messages[0];
      const fromPhone = incoming.from;

      // Process incoming message asynchronously
      WhatsAppTwinEngine.processIncomingMessage({
        from: fromPhone,
        id: incoming.id,
        timestamp: incoming.timestamp,
        type: incoming.type || 'text',
        text: incoming.text,
        image: incoming.image,
      }).then(async (result) => {
        if (result.responseText && fromPhone) {
          await WhatsAppTwinEngine.sendWhatsAppMessage(fromPhone, result.responseText);
        }
      });
    }

    // Always respond with 200 OK immediately for Meta Webhook contract
    return NextResponse.json({ status: 'EVENT_RECEIVED' });
  } catch (err: any) {
    console.error('[WhatsAppWebhook] Error handling event:', err);
    return NextResponse.json({ status: 'EVENT_RECEIVED' });
  }
}

