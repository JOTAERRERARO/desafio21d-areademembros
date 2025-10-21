import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [spotsRemaining, setSpotsRemaining] = useState(27);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://i.imgur.com/mYfsUr4.jpeg')`,
          filter: 'brightness(0.4)'
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      


      <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
        <h1
          className={`text-4xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
        >
          VOCÊ NÃO É PREGUIÇOSO,<br />
          APENAS NUNCA TEVE UM MÉTODO<br />
          QUE SE ENCAIXASSE NA SUA VIDA.
        </h1>

        <p
          className={`text-xl md:text-3xl font-bold text-[#FFD60A] mb-6 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Em apenas 15 minutos por dia, transforme seu corpo e sua energia
sem academia, sem desculpas, direto da sua casa.
        </p>

        <p
          className={`text-base md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <br />
          <span className="text-[#FFFFFF] font-bold"></span>
        </p>

        <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <a
            href="https://www.ggcheckout.com/checkout/v2/6JbGGfj4KYNnvKedHEmM"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-r from-[#FF6B35] to-[#FF4420] text-white font-black text-lg md:text-xl px-10 py-5 rounded-full hover:scale-105 hover:shadow-2xl hover:rotate-1 transition-all duration-300 inline-flex items-center gap-3 animate-pulse hover:animate-none"
          >
            🔥 SIM, QUERO COMEÇAR MINHA TRANSFORMAÇÃO POR APENAS R$19,90
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>

        <div className={`mt-8 flex flex-wrap justify-center gap-6 text-sm md:text-base text-white/80 transition-all duration-1000 delay-900 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <span className="flex items-center gap-2">
            <span className="text-[#00B4D8]">✓</span> Acesso imediato
          </span>
          <span className="flex items-center gap-2">
            <span className="text-[#00B4D8]">✓</span> Treinos guiados
          </span>
          <span className="flex items-center gap-2">
            <span className="text-[#00B4D8]">✓</span> Garantia 7 dias
          </span>
        </div>

        <div className="mt-4 text-center">
          <p className="text-red-400 font-bold text-base md:text-lg">⚠️ Últimas {spotsRemaining} vagas com suporte personalizado</p>
          <p className="text-white/70 text-sm mt-2">
            
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
    </section>
  );
}
