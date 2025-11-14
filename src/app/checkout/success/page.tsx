// app/checkout/success/page.tsx
import Link from 'next/link';

const CheckoutSuccessPage = () => {
  return (
    <main className="min-h-screen bg-background-2 dark:bg-background-6 flex items-center justify-center px-5">
      <div className="max-w-lg w-full rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1 dark:bg-background-8 px-6 py-10 text-center shadow-[0_0_40px_rgba(15,23,42,0.5)]">
        <h1 className="text-heading-4 mb-3">
          Zahlung erfolgreich 🎉
        </h1>
        <p className="text-tagline-1 text-secondary/70 dark:text-accent/70 mb-6">
          Dein Pilar Systems Account wird gerade vorbereitet.
          Du erhältst in Kürze eine Bestätigung per E-Mail und kannst dich dann in dein Dashboard einloggen.
        </p>
        <div className="space-y-3">
          <Link href="/login-01" className="btn btn-primary hover:btn-secondary dark:hover:btn-accent btn-md w-full">
            Zum Login
          </Link>
          <Link href="/" className="text-tagline-2 text-secondary/70 dark:text-accent/70 underline underline-offset-2">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </main>
  );
};

export default CheckoutSuccessPage;
