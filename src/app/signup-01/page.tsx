import SignupHero from '@/components/authentication/SignupHero';
import FooterThree from '@/components/shared/footer/FooterThree';
import NavbarOne from '@/components/shared/header/NavbarOne';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Konto erstellen – Pilar Systems',
};

// Server Action: hier später User + Workspace in DB anlegen
async function handleSignup(formData: FormData) {
  'use server';

  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  const email = formData.get('email');
  const studioName = formData.get('studioName');
  const studioWebsite = formData.get('studioWebsite');
  const phone = formData.get('phone');
  const members = formData.get('members');
  const password = formData.get('password');

  // TODO:
  // 1. User in DB anlegen
  // 2. Workspace / Studio speichern
  // 3. Onboarding-State setzen
  // 4. Optional: E-Mail-Bestätigung

  // Danach weiter zu Schritt 2: Checkout
  redirect('/checkout');
}

const SignUpPage01 = () => {
  return (
    <Fragment>
      <NavbarOne
        megaMenuColor="dark:bg-background-7"
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:bg-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7">
        <SignupHero signupAction={handleSignup} />
      </main>
      <FooterThree />
    </Fragment>
  );
};

export default SignUpPage01;
