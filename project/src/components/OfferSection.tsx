import { Check, Lock, Zap, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const included = [
  'Programa 21D completo',
  '80+ vídeos HD passo a passo',
  '21 áudios motivacionais diários (R$97)',
  'Guia Combustível da Performance (R$67)',
  'Treino ABS Explosivo 7\' (R$37)',
  'Mentalidade Alpha PDF (R$47)',
  'Planilha de Acompanhamento',
  'Comunidade VIP exclusiva',
  'Suporte personalizado',
  'Acesso vitalício + atualizações'
];

export default function OfferSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 37);
  const [spotsRemaining, setSpotsRemaining] = useState(27);
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
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-br from-[#FF6B35] via-[#FF4420] to-[#FF6B35] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFD60A] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF8C42] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            VOCÊ NÃO VAI RECEBER APENAS UM PROGRAMA.<br />
            VAI RECEBER UM ARSENAL COMPLETO.
          </h2>
        </div>

        <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="p-8 md:p-12">
            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-[#FF6B35]/30 rounded-2xl p-8 mb-10">
              <div className="text-center mb-6">
                <p className="text-gray-600 text-lg mb-2">VALOR TOTAL:</p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div>
                    <p className="text-gray-400 text-xl line-through">Programa R$197</p>
                    <p className="text-gray-400 text-lg line-through">+ Bônus R$248</p>
                  </div>
                  <p className="text-4xl font-black text-gray-400 line-through">R$445</p>
                </div>
              </div>

              <div className="text-center border-t-2 border-[#FF6B35] pt-6">
                <p className="text-2xl md:text-3xl font-black text-gray-700 mb-2">HOJE, VOCÊ LEVA TUDO POR:</p>
                <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF4420] p-6 rounded-2xl mb-4">
                 <p className="text-5xl md:text-7xl font-black text-white">19,90</p>
                </div>
                <p className="text-xl text-[#00B4D8] font-bold">
                  SIM. APENAS DEZENOVE E NOVENTA.<br />
                  MENOS QUE UM LANCHE NO SHOPPING.
                </p>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-2xl font-black text-[#0A0A0A] mb-6 text-center">
                TUDO QUE VOCÊ RECEBERÁ:
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {included.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                    style={{ transitionDelay: `${400 + index * 30}ms` }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://www.ggcheckout.com/checkout/v2/6JbGGfj4KYNnvKedHEmM"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-[#FF6B35] to-[#FF4420] text-white font-black text-xl md:text-2xl py-6 rounded-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300 mb-8 animate-pulse hover:animate-none text-center"
            >
              🔥 SIM, QUERO COMEÇAR MINHA TRANSFORMAÇÃO AGORA
            </a>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <Lock className="w-8 h-8 text-[#00B4D8] mx-auto mb-2" />
                <p className="text-xs md:text-sm font-bold text-gray-700">Compra 100% Segura</p>
              </div>
              <div className="text-center">
                <Zap className="w-8 h-8 text-[#FFD60A] mx-auto mb-2" />
                <p className="text-xs md:text-sm font-bold text-gray-700">Acesso Imediato</p>
              </div>
              <div className="text-center">
                <ShieldCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-xs md:text-sm font-bold text-gray-700">Garantia 7 Dias</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-400 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1 animate-pulse" />
                <div className="flex-1">
                  <p className="font-black text-red-600 text-lg md:text-xl mb-2">
                    🚨 ESTE PREÇO É TEMPORÁRIO
                  </p>
                  <p className="text-gray-700 font-medium mb-3 text-sm md:text-base">
                    Estamos limitando as vagas devido ao suporte personalizado.<br />
                    Quando acabar: <span className="font-bold text-red-600">preço volta para R$47</span>
                  </p>
                  <p className="text-gray-700 font-medium">
                    Restam apenas <span className="font-black text-[#FF6B35] text-xl">{spotsRemaining} de 100</span> vagas hoje
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FFD60A] to-[#FF4420] transition-all duration-1000"
                    style={{ width: `${27}%` }}
                  />
                </div>
              </div>

              <div className="text-center bg-black/90 text-white py-4 rounded-lg">
                <p className="text-sm mb-1">⏰ Preço aumenta em:</p>
                <p className="text-4xl font-black tabular-nums">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-white text-sm">
            Pagamento 100% seguro processado por plataforma certificada
          </p>
        </div>
      </div>
    </section>
  );
}
