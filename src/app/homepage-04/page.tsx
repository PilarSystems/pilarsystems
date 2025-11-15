import Blogs from '@/components/homepage-04/Blogs';
import Hero from '@/components/homepage-04/Hero';
import Pricing from '@/components/homepage-04/Pricing';
import Process from '@/components/homepage-04/Process';
import SearchCta from '@/components/homepage-04/SearchCta';
import Services from '@/components/homepage-04/Services';
import Solutions from '@/components/homepage-04/Solutions';
import FooterThree from '@/components/shared/footer/FooterThree';
import NavbarThree from '@/components/shared/header/NavbarThree';
import ReviewsV2 from '@/components/shared/reviews/ReviewsV2';
import { defaultMetadata } from '@/utils/generateMetaData';
import { Metadata } from 'next';



export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Web Hosting - NextSaaS',
  description: 'Web Hosting of NextSaaS',
};

const HomePage04 = () => {
  return (
    <>
      <NavbarThree btnClassName="btn-primary hover:btn-white-dark dark:hover:btn-white" />
      <main className="bg-background-3 dark:bg-background-7 overflow-x-hidden">
        <Hero />
        <SearchCta />
        <Solutions />
        <Services />
        <Pricing />
        <ReviewsV2 badgeColor="badge-green" sectionSpacingClass="space-y-[70px] py-14 md:py-20 xl:py-[100px]" />
        <Process />
        <Blogs />
      </main>
      <FooterThree className="rounded-t-[20px] relative overflow-hidden" />
      /
    </>
  );
};

export default HomePage04;
