'use client';

import { ICaseStudy } from '@/interface';
import Link from 'next/link';
import { useState } from 'react';
import RevealAnimation from '../animation/RevealAnimation';
import Pagination from '../shared/Pagination';
import LinkButton from '../ui/button/LinkButton';

interface CaseStudyPaginationWrapperProps {
  caseStudies: ICaseStudy[];
}

const CaseStudyPaginationWrapper = ({ caseStudies }: CaseStudyPaginationWrapperProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const caseStudiesPerPage = 3;

  const totalPages = Math.ceil(caseStudies.length / caseStudiesPerPage);
  const startIndex = (currentPage - 1) * caseStudiesPerPage;
  const endIndex = startIndex + caseStudiesPerPage;
  const currentCaseStudies = caseStudies?.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Case Study Cards */}
      <div className="grid grid-cols-12 items-start justify-center gap-8">
        {currentCaseStudies?.map((caseStudy, index) => (
          <RevealAnimation delay={0.2 + index * 0.1} key={caseStudy.slug}>
            <article
              className="group col-span-12 max-w-[409px] md:col-span-6 lg:col-span-4"
              itemScope
              itemType="http://schema.org/Article"
            >
              <div className="rounded-[20px] border border-stroke-2/70 bg-background-1/95 shadow-sm ring-0 transition-all duration-500 hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl dark:border-stroke-6/70 dark:bg-background-6/95">
                {/* Headerband statt Thumbnail */}
                <div className="relative overflow-hidden rounded-t-[20px] px-5 py-4">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/18 via-accent/8 to-transparent dark:from-accent/25 dark:via-accent/10" />
                  <div className="relative flex flex-col gap-1">
                    <span className="inline-flex w-fit rounded-full bg-background-1/70 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-secondary/70 dark:bg-background-9/70 dark:text-accent/80">
                      Erfolgsgeschichte
                    </span>
                    <p className="text-tagline-1 text-secondary/85 line-clamp-1 dark:text-accent/85" itemProp="headline">
                      {caseStudy.title}
                    </p>
                    {caseStudy.result && (
                      <p className="text-[11px] text-emerald-400/90 line-clamp-1">
                        Ergebnis: {caseStudy.result}
                      </p>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-6 px-6 py-5">
                  <div className="space-y-2">
                    <Link href={`/case-study/${caseStudy.slug}`}>
                      <h3 className="text-heading-6 line-clamp-2 text-secondary dark:text-accent" itemProp="headline">
                        {caseStudy.title}
                      </h3>
                      <div className="space-y-2">
                        <p
                          itemProp="description"
                          className="text-tagline-1 text-secondary/80 dark:text-accent/80 line-clamp-3"
                        >
                          {caseStudy.description}
                        </p>
                        {caseStudy.result && (
                          <p className="text-tagline-2 text-secondary/70 dark:text-accent/75">
                            <span className="font-medium text-secondary dark:text-accent">Kernresultat:&nbsp;</span>
                            {caseStudy.result}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>

                  {/* Kleine „Module“-Zeile, wenn vorhanden */}
                  {caseStudy.keyFeatures && caseStudy.keyFeatures.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[11px] text-secondary/60 dark:text-accent/60">Genutzte Module</p>
                      <div className="flex flex-wrap gap-1.5">
                        {caseStudy.keyFeatures.slice(0, 3).map((feature: string, idx: number) => (
                          <span
                            key={idx}
                            className="rounded-full bg-background-2 px-2.5 py-1 text-[11px] text-secondary/75 dark:bg-background-7 dark:text-accent/80"
                          >
                            {feature}
                          </span>
                        ))}
                        {caseStudy.keyFeatures.length > 3 && (
                          <span className="rounded-full bg-background-2 px-2.5 py-1 text-[11px] text-secondary/60 dark:bg-background-7 dark:text-accent/70">
                            + weitere
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Button */}
                  <div>
                    <LinkButton
                      href={`/case-study/${caseStudy.slug}`}
                      className="btn btn-md btn-white dark:btn-transparent hover:btn-primary"
                      aria-label={`Mehr über die Erfolgsgeschichte „${caseStudy.title}“ lesen`}
                      itemProp="url"
                    >
                      Mehr erfahren
                    </LinkButton>
                  </div>
                </div>
              </div>
            </article>
          </RevealAnimation>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-14">
          <RevealAnimation delay={0.5}>
            <Pagination
              totalItems={caseStudies.length}
              itemsPerPage={caseStudiesPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              className="mt-14"
            />
          </RevealAnimation>
        </div>
      )}
    </>
  );
};

CaseStudyPaginationWrapper.displayName = 'CaseStudyPaginationWrapper';
export default CaseStudyPaginationWrapper;
