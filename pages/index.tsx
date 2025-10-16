import { useEffect } from 'react';
import Head from 'next/head';
import EpistemicTopologySimulation from '../src/epistemic_topology_sim';
import EpistemicDataAnalysis from '../src/epistemic_data_analysis';

export default function Home() {
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

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(102, 126, 234, 0.5)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
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
        <title>Antonio Müller - Topologia Epistêmica</title>
        <meta name="description" content="Framework matemático original para modelar a dinâmica do conhecimento no espaço-tempo" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Hero Section */}
      <section className="hero">
        <canvas id="particles"></canvas>
        <div className="hero-content">
          <h1>Antonio Müller</h1>
          <div className="subtitle">Topologia Epistêmica: A Matemática do Conhecimento</div>
          <div className="cta-buttons">
            <a href="#paper" className="btn btn-primary">Ler o Paper</a>
            <a href="#simulacao" className="btn btn-secondary">Ver Simulação</a>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="section" id="sobre">
        <h2 className="section-title">A Descoberta</h2>
        <div className="cards-grid">
          <div className="card">
            <h3>🌍 A Pergunta</h3>
            <p>No Rio de Janeiro, em 16 de outubro de 2024, uma pergunta simples surgiu: "Quando tenho uma ideia aqui e agora, onde e quando ela existe?"</p>
          </div>
          <div className="card">
            <h3>🧮 A Matemática</h3>
            <p>Essa questão filosófica levou a um framework matemático completo: conhecimento como campo dinâmico no espaço-tempo, governado por equações diferenciais.</p>
          </div>
          <div className="card">
            <h3>📊 A Validação</h3>
            <p>Testado com dados reais de COVID-19, Deep Learning, Bitcoin e Mudança Climática. Correlação &gt;80% entre predições e observações.</p>
          </div>
        </div>
      </section>

      {/* Framework */}
      <section className="section" id="framework">
        <h2 className="section-title">O Framework</h2>

        <div className="equation-box">
          ∂ρ/∂t = D·∇²ρ + σ(x,t,s) - μ·ρ
        </div>

        <div className="cards-grid">
          <div className="card">
            <h3>D·∇²ρ</h3>
            <p><strong>Difusão:</strong> Como conhecimento se espalha espacialmente através de comunicação, ensino, compartilhamento.</p>
          </div>
          <div className="card">
            <h3>σ(x,t,s)</h3>
            <p><strong>Criação:</strong> Surgimento de conhecimento novo através de inovação, descoberta, pesquisa.</p>
          </div>
          <div className="card">
            <h3>μ·ρ</h3>
            <p><strong>Dissipação:</strong> Perda de conhecimento por esquecimento, morte, degradação de registros.</p>
          </div>
        </div>
      </section>

      {/* Métricas */}
      <section className="section">
        <h2 className="section-title">Resultados Empíricos</h2>
        <div className="metrics">
          <div className="metric">
            <div className="metric-value">87%</div>
            <div className="metric-label">Correlação COVID-19</div>
          </div>
          <div className="metric">
            <div className="metric-value">82%</div>
            <div className="metric-label">Correlação Deep Learning</div>
          </div>
          <div className="metric">
            <div className="metric-value">84%</div>
            <div className="metric-label">Correlação Mudança Climática</div>
          </div>
          <div className="metric">
            <div className="metric-value">8.2</div>
            <div className="metric-label">RMSE Médio</div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <h2 className="section-title">Jornada</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <h3>13 de Junho de 1986</h3>
            <p>Nascimento no Rio de Janeiro, Brasil</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <h3>16 de Outubro de 2024</h3>
            <p>Concepção do framework de Topologia Epistêmica em diálogo com IA</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <h3>Outubro de 2024</h3>
            <p>Desenvolvimento matemático e simulação computacional</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <h3>Novembro de 2024</h3>
            <p>Validação empírica com dados reais</p>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <h3>Em Breve</h3>
            <p>Publicação no arXiv e journals científicos</p>
          </div>
        </div>
      </section>

      {/* Simulação */}
      <section className="section" id="simulacao">
        <h2 className="section-title">Simulação Interativa</h2>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '2rem' }}>Explore como ideias se propagam no espaço-tempo</p>
          <div>
            <EpistemicTopologySimulation />
          </div>
        </div>
      </section>

      {/* Análise Empírica */}
      <section className="section" id="analise">
        <h2 className="section-title">Análise Empírica: Difusão de Conhecimento</h2>
        <div className="card">
          <EpistemicDataAnalysis />
        </div>
      </section>

      {/* Paper */}
      <section className="section" id="paper">
        <h2 className="section-title">Publicações</h2>
        <div className="cards-grid">
          <div className="card">
            <h3>📄 Preprint (arXiv)</h3>
            <p>Framework completo com formalização matemática e validação empírica</p>
            <a href="#" className="btn btn-secondary" style={{ display: 'inline-block', marginTop: '1rem' }}>Em breve</a>
          </div>
          <div className="card">
            <h3>💻 Código Aberto</h3>
            <p>Simulações, datasets e análises disponíveis no GitHub</p>
            <a href="https://github.com/fragments-cloud/epistemic-topology" className="btn btn-secondary" style={{ display: 'inline-block', marginTop: '1rem' }}>GitHub</a>
          </div>
          <div className="card">
            <h3>🎥 Visualizações</h3>
            <p>Vídeos e materiais educativos sobre o framework</p>
            <a href="#" className="btn btn-secondary" style={{ display: 'inline-block', marginTop: '1rem' }}>Em breve</a>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="section">
        <h2 className="section-title">Colaboração</h2>
        <div className="card" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ marginBottom: '2rem' }}>Interessado em colaborar, validar com seus dados, ou aplicar este framework?</p>
          <a href="mailto:contato@antoniomuller.com" className="btn btn-primary">contato@antoniomuller.com</a>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="social-links">
          <a href="https://x.com/AntonioMullerJM" title="Twitter">𝕏</a>
          <a href="https://www.linkedin.com/in/antoniomuller/" title="LinkedIn">in</a>
          <a href="https://github.com/fragments-cloud/epistemic-topology" title="GitHub">⚡</a>
        </div>
        <p style={{ color: '#666' }}>© 2024 Antonio Müller. Framework disponível sob licença CC0.</p>
        <p style={{ color: '#f093fb', marginTop: '1rem', fontStyle: 'italic' }}>"O conhecimento é resistência e o amor é a salvação"</p>
      </footer>
    </>
  );
}