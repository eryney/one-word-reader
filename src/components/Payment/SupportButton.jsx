export default function SupportButton() {
  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/dRm6oH1Pk0Cb1oc6glbQY00';

  return (
    <a
      href={STRIPE_PAYMENT_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 text-sm font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:scale-105"
      title="Optional — $5 appreciated"
    >
      <span>Support</span>
    </a>
  );
}
