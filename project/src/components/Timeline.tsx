import { Flame, Dumbbell, Trophy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const weeks = [
  {
    week: 1,
    title: 'Base e Reativação',
    description: 'Reconecte corpo e mente. Ative músculos esquecidos e retome o controle.',
    icon: Flame,
    color: 'from-[#FF6B35] to-[#FF8C42]'
  },
  {
    week: 2,
    title: 'Queima e Definição',
    description: 'Entre no ritmo. A intensidade aumenta. O espelho começa a mostrar resultado.',
    icon: Dumbbell,
    color: 'from-[#00B4D8] to-[#0096C7]'
  },
  {
    week: 3,
    title: 'Performance e Consistência',
    description: 'A reta final. Energia no máximo, físico firme, mente afiada.',
    icon: Trophy,
    color: 'from-[#FFD60A] to-[#FF8C42]'
  }
];

export default function Timeline() {
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
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-[#1A1A1A] via-[#0A0A0A] to-[#1A1A1A]">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-20">
          <h2 className={`text-4xl md:text-5xl font-black text-white mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            SUA JORNADA DE TRANSFORMAÇÃO
          </h2>
          <p className={`text-xl text-white/70 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            3 semanas que vão mudar sua relação com seu corpo
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#FF6B35] via-[#00B4D8] to-[#FFD60A] hidden md:block" />

          <div className="space-y-16">
            {weeks.map((week, index) => (
              <div
                key={week.week}
                className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'} ${
                  index % 2 === 0 ? 'translate-x-0' : 'translate-x-0'
                }`}
                style={{ transitionDelay: `${300 + index * 200}ms` }}
              >
                <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1">
                    <div className={`bg-gradient-to-br ${week.color} p-8 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                          <week.icon className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-white/90 font-black text-sm tracking-widest">
                          SEMANA {week.week}
                        </span>
                      </div>
                      <h3 className="text-3xl font-black text-white mb-3">
                        {week.title}
                      </h3>
                      <p className="text-white/90 leading-relaxed text-lg">
                        {week.description}
                      </p>
                    </div>
                  </div>

                  <div className="hidden md:block relative">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${week.color} flex items-center justify-center shadow-2xl border-4 border-[#0A0A0A] z-10 relative`}>
                      <span className="text-white font-black text-2xl">{week.week}</span>
                    </div>
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`mt-20 bg-gradient-to-r from-[#1A1A1A] to-[#0A0A0A] p-12 rounded-2xl border border-[#FF6B35]/30 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center">
            <p className="text-[#FFD60A] font-black text-sm tracking-widest mb-4">PROGRESSÃO GARANTIDA</p>
            <div className="flex items-center justify-center gap-8 text-white">
              <div>
                <p className="text-4xl font-black mb-2">DIA 1</p>
                <p className="text-white/60">Início</p>
              </div>
              <div className="flex-1 max-w-md">
                <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FFD60A] rounded-full animate-pulse" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <p className="text-4xl font-black mb-2">DIA 21</p>
                <p className="text-white/60">Transformado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
