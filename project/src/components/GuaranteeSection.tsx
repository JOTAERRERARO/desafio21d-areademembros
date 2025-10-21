import { Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function GuaranteeSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [rotation, setRotation] = useState(0);
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

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setRotation((prev) => (prev + 1) % 360);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center">
          <div className={`inline-block mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 rotate-180'}`}>
            <div className="relative w-48 h-48 mx-auto">
              <div
                className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className="absolute inset-4 bg-white rounded-full" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Shield className="w-20 h-20 text-green-600 mb-2" />
                <p className="font-black text-green-600 text-xl">GARANTIA</p>
                <p className="font-black text-green-600 text-2xl">7 DIAS</p>
              </div>
            </div>
          </div>

          <h2 className={`text-4xl md:text-5xl font-black text-[#0A0A0A] mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            GARANTIA INCONDICIONAL<br />
            <span className="text-[#FF6B35]">DE 7 DIAS</span>
          </h2>

          <p className={`text-2xl font-bold text-[#00B4D8] mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            RISCO ZERO. TESTE SEM PRESSÃO.
          </p>

          <div className={`max-w-3xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p>
              Experimente o Desafio por <span className="font-black text-[#FF6B35]">7 dias completos</span>.
              Assista as aulas. Faça os treinos. Acesse todo o conteúdo.
            </p>

            <p className="text-xl font-bold text-[#0A0A0A]">
              Se por qualquer motivo você não sentir diferença no corpo,
              energia e foco devolvemos 100% do seu dinheiro.
            </p>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-8 mt-8">
              <p className="font-black text-2xl text-[#0A0A0A] mb-4">
                Sem perguntas. Sem enrolação. Sem burocracia.
              </p>
              <p className="text-[#FF6B35] font-bold text-xl">
                O risco é todo nosso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
