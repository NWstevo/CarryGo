// DEV STUB — replace with a real KYC vendor (Stripe Identity, Onfido, Persona, Sumsub, ...)
// before launch. No document/liveness check happens here; this only exists so the
// verification-gated flows are exercisable in local development without a vendor account.
// Per the architecture principle this is built around: never store raw ID/biometric media
// ourselves — a real provider implementation should return only a reference ID, exactly like
// this stub does.

const submit = async (userId) => {
  return {
    status: 'verified',
    reference: `mock_${userId}`,
  };
};

module.exports = { submit };
