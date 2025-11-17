import { ICaseStudy } from '@/interface';
import getMarkDownData from '@/utils/getMarkDownData';
import RevealAnimation from '../animation/RevealAnimation';
import CaseStudyPaginationWrapper from './CaseStudyPaginationWrapper';

const caseStudies: ICaseStudy[] = getMarkDownData('src/data/case-study');

const Success = () => {
  return (
    <section className="py-[50px] lg:py-[100px]">
      <div className="main-container">
        <div className="space-y-[70px]">
          {/* heading */}
          <div className="space-y-3 text-center">
            <RevealAnimation delay={0.1}>
              <h2 className="text-heading-3">Weitere Erfolgsgeschichten</h2>
            </RevealAnimation>
            <RevealAnimation delay={0.2}>
              <p className="max-w-[738px] mx-auto">
                Hier findest du weitere Beispiele von Studios, Gyms und Coaches, die mit der KI-Infrastruktur von
                PILAR SYSTEMS arbeiten – von mehr Probetrainings über bessere Auslastung bis hin zu klareren Zahlen im
                Dashboard.
              </p>
            </RevealAnimation>
          </div>

          {/* Case Studies mit Pagination */}
          <div className="space-y-14">
            <CaseStudyPaginationWrapper caseStudies={caseStudies} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Success;
