import { ArrowRight, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function FinalCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-[#0A0A0A]">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-5xl font-black text-white mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            AGORA É SUA ESCOLHA.
          </h2>

          <div className={`max-w-3xl mx-auto space-y-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              Você chegou até aqui.<br />
              Isso significa que uma parte de você <span className="text-[#FFD60A] font-bold">QUER</span> essa transformação.
            </p>

            <div className="border-t-2 border-white/20 pt-8">
              <p className="text-2xl font-bold text-white mb-4">E você tem 2 caminhos agora:</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border-2 border-red-500/50 rounded-2xl p-6">
                <p className="text-xl font-black text-red-400 mb-3">CAMINHO 1: FECHAR ESSA PÁGINA</p>
                <p className="text-white/70 text-sm leading-relaxed">
                  Voltar pra rotina de sempre. Prometer "segunda-feira eu começo". Ver o corpo piorando. A autoestima caindo. E daqui 1 ano... estar no mesmo lugar. Ou pior.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#FF6B35]/40 to-[#FF8C42]/20 border-2 border-[#FF6B35] rounded-2xl p-6">
                <p className="text-xl font-black text-[#FFD60A] mb-3">CAMINHO 2: APERTAR O BOTÃO</p>
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  Investir R$19,90 em você. Menos que uma pizza. Menos que um Uber.
                </p>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>✓ Em 7 dias: Primeiros resultados</li>
                  <li>✓ Em 14 dias: Roupas mais folgadas</li>
                  <li>✓ Em 21 dias: Irreconhecível</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#00B4D8]/20 to-[#0096C7]/10 border border-[#00B4D8]/30 rounded-2xl p-8 mt-8">
              <p className="text-xl md:text-2xl font-bold text-white mb-4">
                A escolha é SUA.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                Mas eu vou te dizer uma coisa:<br />
                Daqui 21 dias você vai <span className="text-[#FFD60A] font-bold">AGRADECER</span> a versão de HOJE que decidiu começar.<br />
                Ou vai se <span className="text-red-400 font-bold">ARREPENDER</span> de ter deixado passar.
              </p>
              <p className="text-3xl font-black text-[#FF6B35] mt-6">
                O que vai ser?
              </p>
            </div>
          </div>
        </div>

        <div className={`text-center transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <a
            href="https://www.ggcheckout.com/checkout/v2/6JbGGfj4KYNnvKedHEmM"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-r from-[#FF6B35] to-[#FF4420] text-white font-black text-xl md:text-2xl px-12 py-6 rounded-full hover:scale-105 hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-4 animate-pulse hover:animate-none mb-6"
          >
            🔥 SIM, ESTOU PRONTO PRA MUDAR – R$19,90
            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </a>

          <div className="flex items-center justify-center gap-2 text-sm text-white/60 mb-8">
            <span>⏰ Últimas 27 vagas</span>
            <span>|</span>
            <span>⏰ Preço aumenta em breve</span>
            <span>|</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-[#FFD60A] fill-[#FFD60A]" />
              <span>4.9/5.0 (847 avaliações)</span>
            </div>
          </div>
        </div>

        <div className={`max-w-3xl mx-auto bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border-2 border-[#FF6B35]/30 rounded-2xl p-8 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-sm text-white/60 mb-3 font-bold">P.S.: Lembra do Pedro?</p>
          <p className="text-white/80 text-sm md:text-base leading-relaxed mb-4">
            O cara de 32 anos que cuidava de todo mundo menos dele? Ele me mandou mensagem ontem:
          </p>
          <blockquote className="border-l-4 border-[#FF6B35] pl-4 italic text-white/90 leading-relaxed mb-4">
            "Cara, comecei o Desafio achando que não ia conseguir. Hoje, Dia 21, faço 40 flexões.<br /><br />
            Mas sabe o que mudou mesmo?<br /><br />
            Meu filho de 6 anos me viu treinando. E começou a me imitar.<br /><br />
            Ele disse: 'Quando eu crescer, quero ser forte como você, pai.'<br /><br />
            Eu chorei."
          </blockquote>
          <p className="text-[#FFD60A] font-bold text-lg text-center">
            Não é só sobre o corpo. É sobre quem você se torna.
          </p>
        </div>

        <div className="text-center mt-12">
          <p className="text-white/50 text-sm mb-4">Se isso não te convence... Nada vai convencer.</p>
          <a
            href="https://www.ggcheckout.com/checkout/v2/6JbGGfj4KYNnvKedHEmM"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF6B35] hover:text-[#FF8C42] font-bold text-lg underline transition-colors"
          >
            COMEÇAR MINHA TRANSFORMAÇÃO AGORA →
          </a>
        </div>
      </div>
    </section>
  );
}
