import { useEffect } from 'react';
import Head from 'next/head';
// useRouter removed: language buttons were removed from the hero
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import EpistemicTopologySimulation from '../components/epistemic_topology_sim';
import EpistemicDataAnalysis from '../components/epistemic_data_analysis';

export const getStaticProps = async ({ locale }: { locale?: string }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'pt', ['common'])),
  },
})

export default function Home() {
  const { t } = useTranslation('common');
  // language switch handled via server-side routing; buttons removed

  useEffect(() => {
    // Canvas de partículas animadas
    const canvas = document.getElementById('particles') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = 100;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      canvas: HTMLCanvasElement;

      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(102, 126, 234, 0.5)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas));
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Conectar partículas próximas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(102, 126, 234, ${0.2 - distance / 500})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    // Responsivo
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Head>
        <title>{`${String(t('hero.title'))} - ${String(t('hero.subtitle'))}`}</title>
        <meta name="description" content={t('hero.description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Hero Section */}
      <section className="hero">
        <canvas id="particles"></canvas>
        <div className="hero-content">
          {/* translation buttons removed */}
          <h1>{t('hero.title')}</h1>
          <div className="subtitle">{t('hero.subtitle')}</div>
          <p className="quote">{t('hero.quote')}</p>
          <div className="cta-buttons">
            <a href="#paper" className="btn btn-primary">{t('hero.paper')}</a>
            <a href="#simulacao" className="btn btn-secondary">{t('hero.simulation')}</a>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="section" id="sobre">
        <h2 className="section-title">{t('discovery.title')}</h2>
        <div className="cards-grid">
          <div className="card">
            <h3>{t('discovery.question')}</h3>
            <p>{t('discovery.questionText')}</p>
          </div>
          <div className="card">
            <h3>{t('discovery.math')}</h3>
            <p>{t('discovery.mathText')}</p>
          </div>
          <div className="card">
            <h3>{t('discovery.validation')}</h3>
            <p>{t('discovery.validationText')}</p>
          </div>
        </div>
      </section>

      {/* Framework */}
      <section className="section" id="framework">
        <h2 className="section-title">{t('framework.title')}</h2>

        <div className="equation-box">
          {t('framework.equation')}
        </div>

        <div className="cards-grid">
          <div className="card">
            <h3>D·∇²ρ</h3>
            <p><strong>{t('framework.diffusion')}</strong> {t('framework.diffusionText')}</p>
          </div>
          <div className="card">
            <h3>σ(x,t,s)</h3>
            <p><strong>{t('framework.creation')}</strong> {t('framework.creationText')}</p>
          </div>
          <div className="card">
            <h3>μ·ρ</h3>
            <p><strong>{t('framework.dissipation')}</strong> {t('framework.dissipationText')}</p>
          </div>
        </div>
      </section>

      {/* Métricas */}
      <section className="section">
        <h2 className="section-title">{t('results.title')}</h2>
        <div className="metrics">
          <div className="metric">
            <div className="metric-value">87%</div>
            <div className="metric-label">{t('results.covid')}</div>
          </div>
          <div className="metric">
            <div className="metric-value">82%</div>
            <div className="metric-label">{t('results.deeplearning')}</div>
          </div>
          <div className="metric">
            <div className="metric-value">84%</div>
            <div className="metric-label">{t('results.climate')}</div>
          </div>
          <div className="metric">
            <div className="metric-value">8.2</div>
            <div className="metric-label">{t('results.rmse')}</div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <h2 className="section-title">{t('journey.title')}</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <h3>{t('journey.birth')}</h3>
            <p>{t('journey.birthText')}</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <h3>{t('journey.conception')}</h3>
            <p>{t('journey.conceptionText')}</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <h3>{t('journey.development')}</h3>
            <p>{t('journey.developmentText')}</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <h3>{t('journey.validation')}</h3>
            <p>{t('journey.validationText')}</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <h3>{t('journey.future')}</h3>
            <p>{t('journey.futureText')}</p>
          </div>
        </div>
      </section>

      {/* Simulação */}
      <section className="section" id="simulacao">
        <h2 className="section-title">{t('simulation.title')}</h2>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '2rem' }}>{t('simulation.description')}</p>
          <div>
            <EpistemicTopologySimulation />
          </div>
        </div>
      </section>

      {/* Análise Empírica */}
      <section className="section" id="analise">
        <h2 className="section-title">{t('analysis.title')}</h2>
        <EpistemicDataAnalysis />
      </section>

      {/* Paper */}
      <section className="section" id="paper">
        <h2 className="section-title">{t('publications.title')}</h2>
        <div className="cards-grid">
          <div className="card">
            <h3>{t('publications.preprint')}</h3>
            <p>{t('publications.preprintText')}</p>
            <a href="#" className="btn btn-secondary" style={{ display: 'inline-block', marginTop: '1rem' }}>{t('journey.future')}</a>
          </div>
          <div className="card">
            <h3>{t('publications.code')}</h3>
            <p>{t('publications.codeText')}</p>
            <a href="https://github.com/fragments-cloud/epistemic-topology" className="btn btn-secondary" style={{ display: 'inline-block', marginTop: '1rem' }}>{t('publications.github')}</a>
          </div>
          <div className="card">
            <h3>{t('publications.videos')}</h3>
            <p>{t('publications.videosText')}</p>
            <a href="#" className="btn btn-secondary" style={{ display: 'inline-block', marginTop: '1rem' }}>{t('journey.future')}</a>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="section">
        <h2 className="section-title">{t('collaboration.title')}</h2>
        <div className="card" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ marginBottom: '2rem' }}>{t('collaboration.description')}</p>
          <a href="mailto:contato@antoniomuller.com" className="btn btn-primary">{t('collaboration.email')}</a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="social-links">
          <a href="https://x.com/AntonioMullerJM" title={t('footer.social.twitter')}>𝕏</a>
          <a href="https://www.linkedin.com/in/antoniomuller/" title={t('footer.social.linkedin')}>in</a>
          <a href="https://github.com/fragments-cloud/epistemic-topology" title={t('footer.social.github')}>⚡</a>
        </div>
        <p style={{ color: '#666' }}>{t('footer.copyright')}</p>
        <p style={{ color: '#f093fb', marginTop: '1rem', fontStyle: 'italic' }}>{t('footer.quote')}</p>
      </footer>
    </>
  );
}