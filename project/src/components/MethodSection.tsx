import { Clock, Home, TrendingUp, Users, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const benefits = [
  {
    icon: Clock,
    title: 'TREINOS DE 15 MINUTOS',
    description: 'Feitos para caber na SUA rotina. Antes do trabalho. No intervalo do almoço. Antes de dormir. Você escolhe quando. Nós te mostramos como.'
  },
  {
    icon: Home,
    title: 'ZERO EQUIPAMENTOS',
    description: 'Apenas o peso do seu corpo. Sem mensalidade. Sem deslocamento. Sem vergonha. Sua casa se torna sua academia particular.'
  },
  {
    icon: TrendingUp,
    title: 'DO ZERO AO RESULTADO',
    description: 'Mesmo se você não consegue fazer 1 flexão hoje, em 21 dias você estará irreconhecível. Cada treino é progressivo. Cada dia, você evolui.'
  },
  {
    icon: Users,
    title: 'ACOMPANHAMENTO DIÁRIO',
    description: 'Você NUNCA estará sozinho. Checklist interativo. Áudios motivacionais. Comunidade de homens na mesma jornada que você.'
  }
];

export default function MethodSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-black text-[#0A0A0A] mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            CONHEÇA O MÉTODO QUE JÁ TRANSFORMOU<br />
            <span className="text-[#FF6B35]">MAIS DE 1.200 HOMENS COMO VOCÊ</span>
          </h2>
          <div className={`w-32 h-1 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] mx-auto mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'scale-x-100' : 'scale-x-0'}`} />
          <p className={`text-xl text-gray-700 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="font-bold">Desafio Corpo Definido 21D</span><br />
            O único programa de calistenia projetado para homens ocupados<br />
            que querem resultado REAL sem precisar pisar numa academia.
          </p>
        </div>

        <div className={`max-w-4xl mx-auto mb-16 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-br from-[#00B4D8]/10 to-[#0096C7]/5 border border-[#00B4D8]/30 rounded-2xl p-8">
            <p className="text-lg text-gray-700 leading-relaxed text-center">
              Baseado em ciência do exercício e testado por milhares de homens,<br />
              o Desafio 21D é a resposta que você procurava:
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${500 + index * 150}ms` }}
            >
              <div className="bg-gradient-to-br from-[#FF6B35] to-[#FF8C42] w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-[#0A0A0A] mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className={`text-center transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <a
            href="https://www.ggcheckout.com/checkout/v2/6JbGGfj4KYNnvKedHEmM"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF6B35] to-[#FF4420] text-white font-black text-lg md:text-xl px-10 py-5 rounded-full hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            🔥 QUERO COMEÇAR MINHA TRANSFORMAÇÃO AGORA
          </a>
        </div>
      </div>
    </section>
  );
}
