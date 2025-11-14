import LoginHero from '@/components/authentication/LoginHero';
import FooterThree from '@/components/shared/footer/FooterThree';
import NavbarOne from '@/components/shared/header/NavbarOne';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Login – Pilar Systems',
};

// Server Action: hier später echte Auth einbauen
async function handleLogin(formData: FormData) {
  'use server';

  const email = formData.get('email');
  const password = formData.get('password');

  // TODO:
  // 1. User in DB suchen / Auth prüfen
  // 2. Session / Token setzen
  // 3. Zu passendem Dashboard / Workspace leiten

  redirect('/dashboard'); // Zielroute, die wir später bauen
}

const LoginPage01 = () => {
  return (
    <Fragment>
      <NavbarOne
        megaMenuColor="dark:bg-background-7"
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:bg-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7">
        <LoginHero loginAction={handleLogin} />
      </main>
      <FooterThree />
    </Fragment>
  );
};

export default LoginPage01;
