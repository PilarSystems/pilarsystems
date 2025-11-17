import { projectAchievements } from '@/data/achievements';
import RevealAnimation from '../animation/RevealAnimation';
import OurAchievements from '../shared/OurAchievements';

const Experience = () => {
  return (
    <section className="lg:py-[100px] py-[50px] md:py-[75px]">
      <div className="main-container">
        <div className="space-y-[70px]">
          <div className="space-y-3 text-center">
            <RevealAnimation delay={0.2}>
              <h2>Ergebnisse statt Versprechen – warum Studios mit PILAR arbeiten.</h2>
            </RevealAnimation>
            <RevealAnimation delay={0.3}>
              <p className="max-w-[798px] md:w-full mx-auto">
                PILAR SYSTEMS entsteht direkt aus dem Studioalltag: volle Telefone, unbeantwortete WhatsApps,
                verstreute Leads. Die Kombination aus echter Praxis, klarer Prozesslogik und moderner KI sorgt dafür,
                dass Anfragen nicht mehr verloren gehen – und aus Interessenten Mitglieder werden.
              </p>
            </RevealAnimation>
          </div>

          <OurAchievements achievements={projectAchievements} />
        </div>
      </div>
    </section>
  );
};

export default Experience;
