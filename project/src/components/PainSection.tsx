import { Calendar, Briefcase, Shirt, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const painPoints = [
  {
    icon: Calendar,
    title: 'Segunda-feira, 06h da manhã.',
    text: 'Você olha pro espelho e promete: "Hoje eu começo." Mas a rotina engole seu dia. O trabalho. O trânsito. O cansaço. Quando percebe, já é 23h e você só quer dormir.'
  },
  {
    icon: Briefcase,
    title: 'Você trabalha sentado o dia todo.',
    text: 'As costas doem. O pescoço trava. A barriga cresce. Você sabe que precisa se mexer, mas academia? Mensalidade cara. Horário ruim. Aquele olhar dos "marombeiros".'
  },
  {
    icon: Shirt,
    title: 'A roupa do armário não serve mais.',
    text: 'Você tenta fechar o botão da calça e... não vai. A camisa marca a barriga. A bermuda aperta. Você se olha no espelho e pensa: "Como eu cheguei aqui?"'
  },
  {
    icon: Zap,
    title: 'Sem energia pra nada.',
    text: 'Brincadeira com os filhos? Cansou. Sexo? Sem disposição. Subir uma escada? Falta de ar. Você não se reconhece mais.'
  }
];

export default function PainSection() {
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
    <section ref={sectionRef} className="py-24 bg-[#1A1A1A]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-black text-white mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            VOCÊ JÁ SABE COMO É...
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {painPoints.map((point, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] p-8 rounded-2xl border border-[#FF6B35]/20 hover:border-[#FF6B35]/50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-[#FF6B35] to-[#FF8C42] p-3 rounded-xl flex-shrink-0">
                  <point.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">{point.title}</h3>
                  <p className="text-white/70 leading-relaxed">{point.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-red-900/30 to-[#FF6B35]/20 border-2 border-red-500/50 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-4 text-center">
              E o pior de tudo?
            </h3>
            <div className="space-y-4 text-lg text-white/90 leading-relaxed">
              <p>Você <span className="text-[#FFD60A] font-bold">SABE</span> o que precisa fazer. Você <span className="text-[#FFD60A] font-bold">JÁ</span> tentou antes.</p>
              <p>Mas os treinos eram longos demais. As academias, caras demais. Os resultados, lentos demais.</p>
              <p className="text-xl font-bold text-[#FF6B35]">
                E toda vez que você desiste, a culpa aperta. A autoestima despenca. E você se pergunta:
              </p>
              <p className="text-2xl font-black text-center text-white mt-6">
                "Será que eu NUNCA vou conseguir?"
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#00B4D8]/20 to-[#0096C7]/10 border border-[#00B4D8]/30 rounded-2xl p-8">
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-4">
              A verdade é que o problema <span className="text-[#FFD60A] font-bold">nunca foi VOCÊ</span>.
            </p>
            <p className="text-lg text-white/80 leading-relaxed mb-4">
              O problema foi tentar forçar um método de academia de 1 hora numa vida que já não tem nem 10 minutos sobrando.
            </p>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              O problema foi achar que transformação precisa de equipamentos caros, personal trainer e "genética privilegiada".
            </p>
            <p className="text-2xl font-black text-[#FF6B35] text-center">
              Mas e se eu te provar que NADA disso é verdade?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
