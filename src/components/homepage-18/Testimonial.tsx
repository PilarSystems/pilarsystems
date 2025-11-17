'use client';

import reviews from '@/data/json/testimonials/testimonials.json';
import RevealAnimation from '../animation/RevealAnimation';
import GradientOverlay from '../shared/reviews/GradientOverlay';
import LinkButton from '../ui/button/LinkButton';

import Image from 'next/image';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const Testimonial = () => {
  return (
    <section className="relative pt-[100px] pb-[100px] bg-white dark:bg-black bg-[url('/images/home-page-18/hero-bg.png')] bg-no-repeat bg-cover bg-top">
      <div className="main-container">
        {/* Heading + Intro */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-[70px]">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-green mb-4">Social Proof</span>
          </RevealAnimation>

          <RevealAnimation delay={0.25}>
            <h2 className="max-w-[750px] mx-auto mb-4">
              Warum Studios & Coaches auf PILAR SYSTEMS setzen.
            </h2>
          </RevealAnimation>

          <RevealAnimation delay={0.3}>
            <p className="max-w-[872px] mx-auto">
              Studios nutzen PILAR, um Anfragen, Probetrainings, Verträge und Mitgliederkommunikation zu automatisieren –
              ohne zusätzliche Rezeption, ohne Agentur-Projekte. Mehr gebuchte Termine, weniger No-Shows und klare
              Abläufe für das Team.
            </p>
          </RevealAnimation>

          {/* KPIs / Trust Badges */}
          <RevealAnimation delay={0.35}>
            <div className="mt-6 grid grid-cols-1 gap-4 text-tagline-2 text-secondary/70 dark:text-accent/70 sm:grid-cols-3">
              <div className="rounded-full border border-border bg-background-1/60 px-4 py-2 dark:bg-background-8/60">
                <span className="font-semibold text-secondary dark:text-accent">+60%</span> mehr gebuchte Probetrainings*
              </div>
              <div className="rounded-full border border-border bg-background-1/60 px-4 py-2 dark:bg-background-8/60">
                <span className="font-semibold text-secondary dark:text-accent">24/7</span> automatische Beantwortung von
                Anfragen
              </div>
              <div className="rounded-full border border-border bg-background-1/60 px-4 py-2 dark:bg-background-8/60">
                <span className="font-semibold text-secondary dark:text-accent">Minuten</span> statt Wochen Onboarding
                dank Setup-Wizard
              </div>
            </div>
          </RevealAnimation>
        </div>

        {/* Reviews Slider */}
        <RevealAnimation delay={0.4}>
          <div className="relative">
            <Swiper
              className="swiper reviews-swiper"
              spaceBetween={30}
              slidesPerView={3}
              centeredSlides={true}
              loop={true}
              speed={1500}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
              navigation={false}
              pagination={false}
              scrollbar={false}
            >
              <div className="swiper-wrapper">
                {reviews.map((review: any) => (
                  <SwiperSlide key={review.id} className="swiper-slide">
                    <div className="bg-background-2 dark:bg-background-5 relative z-0 mx-1 flex flex-col gap-y-8 overflow-hidden rounded-[20px] p-8 sm:mx-0">
                      <GradientOverlay />
                      <figure className="relative inline-block size-14 overflow-hidden rounded-full bg-linear-[156deg,_#FFF_32.92%,_#83E7EE_91%] ring-4 ring-white dark:ring-background-5">
                        <Image
                          src={review.avatar}
                          height={100}
                          width={100}
                          quality={100}
                          alt={review.name}
                          className="max-w-full object-cover"
                        />
                      </figure>
                      <p className="text-secondary/60 dark:text-accent/60 line-clamp-3 review-text">
                        {review.quote}
                      </p>
                      <div>
                        <p className="text-secondary dark:text-accent review-name text-lg leading-[1.5] font-medium">
                          {review.name}
                        </p>
                        <p className="text-secondary/60 dark:text-accent/60 text-tagline-2 review-title">
                          {review.position}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </div>
            </Swiper>
          </div>
        </RevealAnimation>

        {/* CTA */}
        <RevealAnimation delay={0.5}>
          <div className="text-center mt-10">
            <LinkButton
              href="/signup-01"
              className="btn btn-secondary btn-md inline-block dark:btn-transparent dark:border-primary-50 hover:btn-primary w-[85%] md:w-auto mx-auto"
              aria-label="Mit PILAR SYSTEMS starten"
            >
              Jetzt mit PILAR starten
            </LinkButton>
            <p className="mt-3 text-tagline-2 text-secondary/60 dark:text-accent/60">
              *Zahlen basieren auf ersten Pilotkunden – genaue Ergebnisse variieren je nach Studio und Setup.
            </p>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default Testimonial;
