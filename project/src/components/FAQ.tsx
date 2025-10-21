import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const faqs = [
  {
    question: '"Eu nunca treinei na vida. Consigo fazer?"',
    answer: 'R: EXATAMENTE pra quem nunca treinou. O João tinha 17 anos e não conseguia fazer 1 flexão. O Gláucio tinha 49 anos e estava sedentário há décadas. Se eles conseguiram, você consegue. Cada exercício tem progressões. Se você não aguenta a versão "normal", tem a versão "facilitada". E no dia que você fizer a primeira flexão completa? Esse dia você nunca vai esquecer.'
  },
  {
    question: '"Preciso de algum equipamento?"',
    answer: 'R: ZERO. NADA. ZILCH. Apenas seu corpo. E vontade de mudar. Sem barra. Sem halter. Sem elástico. Você pode treinar na sala. No quarto. No quintal. No parque. Onde tiver VOCÊ, tem academia.'
  },
  {
    question: '"15 minutos por dia é suficiente?"',
    answer: 'R: Mais que suficiente. É IDEAL. Estudos provam: intensidade > duração. Melhor 15 minutos TODO DIA do que 1 hora 2x na semana. O segredo não é quanto tempo. É CONSISTÊNCIA. E 15 minutos? Todo mundo tem. (Você passa mais que isso no Instagram)'
  },
  {
    question: '"Tenho 40+ anos. Ainda dá tempo?"',
    answer: 'R: Dá tempo até aos 90. Nosso aluno mais velho tem 67 anos. Começou do ZERO. Hoje faz 20 flexões. Idade não é desculpa. É só mais um número. Seu corpo TEM capacidade de mudar. Em qualquer idade.'
  },
  {
    question: '"E se eu não tiver resultado?"',
    answer: 'R: Aí você ganha dinheiro. Sério. Se você fizer os 21 dias completos e não tiver NENHUM resultado, eu devolvo DOBRADO. Mas vou te contar um segredo: Isso nunca aconteceu. Porque é IMPOSSÍVEL você treinar 15 minutos por dia durante 21 dias e não ter resultado. A física não deixa.'
  },
  {
    question: '"Como acesso o conteúdo?"',
    answer: 'R: IMEDIATAMENTE após o pagamento. Login e senha no seu e-mail. Área de membros 24/7. App mobile disponível. Você pode treinar no celular, tablet, computador, TV. Onde você estiver. Quando você quiser.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
    <section ref={sectionRef} className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-black text-[#0A0A0A] mb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            PERGUNTAS QUE OUTROS HOMENS FIZERAM<br />
            <span className="text-[#FF6B35]">ANTES DE TRANSFORMAR SUAS VIDAS</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-xl border-2 ${
                openIndex === index ? 'border-[#FF6B35]' : 'border-transparent'
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-black text-lg md:text-xl text-[#0A0A0A] pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-[#FF6B35] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-8 pb-6 text-gray-700 leading-relaxed text-base md:text-lg">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
