const functions = require('firebase-functions');
const admin = require('firebase-admin');
 // lub 'twój-klucz-testowy-stripe'
const cors = require('cors')({origin: true});

// Inicjalizacja Firebase Admin jeśli jeszcze nie zainicjalizowano
if (!admin.apps.length) {
  admin.initializeApp();
}
const stripe = require('stripe')(functions.config().stripe.secret);
/**
 * Funkcja tworząca sesję płatności Stripe
 */
exports.createCheckoutSessionHttp = functions.https.onRequest((request, response) => {
  return cors(request, response, async () => {
    try {
      // Zwróć sukces dla testu
      return response.status(200).json({ 
        success: true,
        message: "Funkcja działa poprawnie"
      });
    } catch (error) {
      console.error('Błąd:', error);
      return response.status(500).json({ error: error.message });
    }
  });
});

/**
 * Webhook do obsługi zdarzeń Stripe
 */
exports.stripeWebhook = functions.https.onRequest(async (request, response) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; // lub 'twój-klucz-webhook-stripe'

  try {
    // Weryfikacja zdarzenia Stripe
    let event;
    if (webhookSecret) {
      const signature = request.headers['stripe-signature'];
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        signature,
        webhookSecret
      );
    } else {
      event = request.body;
    }

    console.log(`Otrzymano zdarzenie Stripe: ${event.type}`);

    // Obsługa różnych typów zdarzeń
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        // Zaktualizuj status płatności w Firestore
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object;
        // Obsługa pomyślnej płatności faktury
        await handleInvoicePaid(invoice);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        // Obsługa nieudanej płatności faktury
        await handleInvoicePaymentFailed(invoice);
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        // Aktualizacja statusu subskrypcji
        await handleSubscriptionUpdated(subscription);
        break;
      }
      default:
        console.log(`Nieobsługiwane zdarzenie: ${event.type}`);
    }

    // Zwróć sukces
    return response.status(200).json({ received: true });
  } catch (error) {
    console.error('Błąd przetwarzania webhooka Stripe:', error);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Funkcje pomocnicze do obsługi zdarzeń Stripe

async function handleCheckoutSessionCompleted(session) {
  try {
    const { restaurantId } = session.metadata;
    if (!restaurantId) return;

    // Aktualizuj status restauracji w Firestore
    await admin.firestore().collection('restaurants').doc(restaurantId).update({
      isVerified: true,
      paidAt: admin.firestore.FieldValue.serverTimestamp(),
      checkoutSessionId: session.id,
      subscriptionId: session.subscription
    });

    console.log(`Zaktualizowano status restauracji po pomyślnej płatności: ${restaurantId}`);
  } catch (error) {
    console.error('Błąd podczas obsługi zakończonej sesji płatności:', error);
  }
}

async function handleInvoicePaid(invoice) {
  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const { firebaseUID } = subscription.metadata;
    
    if (!firebaseUID) return;

    // Aktualizuj status subskrypcji w Firestore
    await admin.firestore().collection('restaurants').doc(firebaseUID).update({
      subscriptionStatus: 'active',
      currentPeriodEnd: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Zaktualizowano status subskrypcji po opłaceniu faktury: ${firebaseUID}`);
  } catch (error) {
    console.error('Błąd podczas obsługi opłaconej faktury:', error);
  }
}

async function handleInvoicePaymentFailed(invoice) {
  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const { firebaseUID } = subscription.metadata;
    
    if (!firebaseUID) return;

    // Aktualizuj status subskrypcji w Firestore
    await admin.firestore().collection('restaurants').doc(firebaseUID).update({
      subscriptionStatus: 'past_due',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Zaktualizowano status subskrypcji po nieudanej płatności: ${firebaseUID}`);
  } catch (error) {
    console.error('Błąd podczas obsługi nieudanej płatności faktury:', error);
  }
}

async function handleSubscriptionUpdated(subscription) {
  try {
    const { firebaseUID } = subscription.metadata;
    if (!firebaseUID) return;

    // Aktualizuj status subskrypcji w Firestore
    await admin.firestore().collection('restaurants').doc(firebaseUID).update({
      subscriptionStatus: subscription.status,
      currentPeriodEnd: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    });

    console.log(`Zaktualizowano status subskrypcji: ${firebaseUID}, status: ${subscription.status}`);
  } catch (error) {
    console.error('Błąd podczas aktualizacji subskrypcji:', error);
  }
}