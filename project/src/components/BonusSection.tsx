import { Flame, Hexagon, Brain, Headphones } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const bonuses = [
  {
    icon: Flame,
    title: 'Guia Combustível da Performance',
    description: 'Como montar refeições simples e poderosas pra acelerar definição',
    value: 'R$47',
    special: false
  },
  {
    icon: Hexagon,
    title: 'Treino ABS Explosivo 7\'',
    description: 'Exercício avançado pra trincar o abdômen com eficiência',
    value: 'R$37',
    special: false
  },
  {
    icon: Brain,
    title: 'Mentalidade Alpha',
    description: 'O guia rápido pra blindar foco, disciplina e consistência diária',
    value: 'R$67',
    special: false
  },
  {
    icon: Headphones,
    title: 'Modo Silêncio - 21 Áudios Diários',
    description: '21 áudios motivacionais (1 por dia) pra manter foco e mentalidade durante o desafio',
    value: 'R$97',
    special: true
  }
];

export default function BonusSection() {
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
            BÔNUS EXCLUSIVOS QUE<br />
            <span className="text-[#FF6B35]">ACELERAM SEUS RESULTADOS</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {bonuses.map((bonus, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-2 ${
                bonus.special ? 'border-[#FFD60A] animate-pulse' : 'border-gray-200'
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              {bonus.special && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-[#FFD60A] to-[#FF8C42] text-[#0A0A0A] px-6 py-2 rounded-full font-black text-sm shadow-lg">
                    EXCLUSIVO
                  </div>
                </div>
              )}

              <div className={`${bonus.special ? 'bg-gradient-to-br from-[#FFD60A] to-[#FF8C42]' : 'bg-gradient-to-br from-[#FF6B35] to-[#FF8C42]'} w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                <bonus.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-black text-[#0A0A0A] mb-3">
                {bonus.title}
              </h3>

              <p className="text-gray-600 leading-relaxed mb-6">
                {bonus.description}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <span className="text-gray-500 text-sm font-medium">Valor:</span>
                <span className="text-2xl font-black text-[#FF6B35]">{bonus.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-16 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto">
            <p className="text-white/80 text-lg mb-2">VALOR TOTAL DOS BÔNUS</p>
            <p className="text-white font-black text-5xl mb-2">R$248,00</p>
            <p className="text-[#FFD60A] text-xl font-bold">Inclusos no seu investimento de R$19,90</p>
          </div>
        </div>
      </div>
    </section>
  );
}
