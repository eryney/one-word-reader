export default function SupportButton() {
  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/dRm6oH1Pk0Cb1oc6glbQY00';

  return (
    <a
      href={STRIPE_PAYMENT_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 text-sm font-black rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 border-2 border-yellow-600"
      title="Optional — pay if this is useful to you"
    >
      <span>💰 Pay $5</span>
    </a>
  );
}
