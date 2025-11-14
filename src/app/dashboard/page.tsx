import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterFour from '@/components/shared/footer/FooterFour';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import DashboardOverview from '@/components/dashboard/DashboardOverview';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Dashboard – Pilar Systems',
};

const DashboardPage = () => {
  return (
    <Fragment>
      <NavbarOne
        className="bg-accent/60 border border-stroke-2 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-lg"
        btnClassName="btn-secondary hover:btn-primary dark:btn-accent"
      />
      <main className="bg-background-2 dark:bg-background-5 min-h-screen pt-6 pb-16">
        <DashboardOverview />
      </main>
      <FooterFour className="border-t border-t-[#303032] dark:border-t-0 max-sm:z-[11]" />
    </Fragment>
  );
};

export default DashboardPage;
