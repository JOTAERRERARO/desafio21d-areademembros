import { Star, Quote } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const testimonials = [
  {
    name: 'Ricardo M., 41 anos',
    role: 'Analista de Sistemas',
    quote: '"Tenho 41 anos e estava totalmente sedentário. Achei que nunca ia conseguir. Mas comecei. Hoje, 21 dias depois, faço 30 flexões seguidas. Minha esposa notou. Meus filhos notaram. EU notei. Melhor decisão que tomei esse ano."',
    result: '30 flexões | Energia triplicada'
  },
  {
    name: 'Pedro M., 32 anos',
    role: 'Cuidador',
    quote: '"Eu cuidava de todo mundo menos de mim. Trabalho, família, contas... e eu ficava por último. O Desafio 21D me mostrou que 15 minutos NÃO É pedir demais. É o MÍNIMO que eu mereço. 32kg perdidos. Vida transformada."',
    result: '32kg perdidos | Autoestima recuperada'
  },
  {
    name: 'João T., 17 anos',
    role: 'Estudante',
    quote: '"94kg, 17 anos, e não conseguia fazer 1 flexão. Sofria bullying. Me escondia. Aceitei o desafio. Me comprometi. 21 dias depois, faço 25 flexões. A mudança não é só no corpo. É na confiança."',
    result: '25 flexões | Confiança restaurada'
  },
  {
    name: 'Gláucio S., 49 anos',
    role: 'Professor',
    quote: '"49 anos, barriga grande, sedentário há anos. Achei que era tarde demais pra mim. Errado. 3 semanas depois, subo escada sem cansar. Brinco com meu neto sem parar no meio. Me sinto 10 anos mais novo."',
    result: 'Barriga reduzida | 10 anos mais jovem'
  }
];

export default function SocialProof() {
  const [isVisible, setIsVisible] = useState(false);
  const [transformed, setTransformed] = useState(1247);
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

  useEffect(() => {
    if (isVisible) {
      let start = 1000;
      const end = 1247;
      const duration = 2000;
      const increment = (end - start) / (duration / 50);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setTransformed(end);
          clearInterval(timer);
        } else {
          setTransformed(Math.floor(start));
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-black text-white mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            ELES ESTAVAM EXATAMENTE<br />
            <span className="text-[#FF6B35]">ONDE VOCÊ ESTÁ AGORA.</span><br />
            OLHA SÓ O QUE ACONTECEU.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] p-8 rounded-2xl border-2 border-[#FF6B35]/30 hover:border-[#FF6B35] transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <Quote className="w-10 h-10 text-[#FF6B35] mb-4" />
              <p className="text-white/90 leading-relaxed mb-6 italic text-lg">
                {testimonial.quote}
              </p>
              <div className="border-t border-white/10 pt-4">
                <p className="text-white font-bold text-lg">{testimonial.name}</p>
                <p className="text-[#FFD60A] text-sm mb-2">{testimonial.role}</p>
                <p className="text-[#00B4D8] font-bold">{testimonial.result}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-[#FF6B35]/20 to-[#FF8C42]/10 border-2 border-[#FF6B35]/50 rounded-2xl p-8 text-center">
            <p className="text-2xl md:text-3xl font-black text-white mb-4">
              ⚡ TAXA DE CONCLUSÃO: <span className="text-[#00B4D8]">93%</span>
            </p>
            <p className="text-lg text-white/80 mb-2">
              🏆 MÉDIA DE EVOLUÇÃO: <span className="text-[#FFD60A] font-bold">8kg perdidos + 40% mais flexões</span>
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <p className="text-4xl font-black text-[#FFD60A]">4.9</p>
              <Star className="w-8 h-8 text-[#FFD60A] fill-[#FFD60A]" />
              <p className="text-white/70 text-lg">(847 homens avaliaram)</p>
            </div>
          </div>
        </div>

        <div className={`grid md:grid-cols-3 gap-8 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center">
            <p className="text-6xl font-black text-[#FF6B35] mb-2">{transformed}+</p>
            <p className="text-white/70 text-lg">HOMENS TRANSFORMADOS</p>
          </div>
          <div className="text-center">
            <p className="text-6xl font-black text-[#FFD60A] mb-2">15min</p>
            <p className="text-white/70 text-lg">POR DIA É SUFICIENTE</p>
          </div>
          <div className="text-center">
            <p className="text-6xl font-black text-[#00B4D8] mb-2">21</p>
            <p className="text-white/70 text-lg">DIAS PARA MUDAR SUA VIDA</p>
          </div>
        </div>
      </div>
    </section>
  );
}
