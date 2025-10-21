"use client"

import { HelpCircle, Mail, MessageSquare, Book, Video, FileText } from "lucide-react"

export function SupportPage() {
  const faqs = [
    {
      question: "Como acesso os vídeos dos treinos?",
      answer: "Clique em qualquer semana no menu lateral e depois no dia específico para assistir ao vídeo do treino.",
    },
    {
      question: "Posso fazer os treinos em qualquer ordem?",
      answer:
        "Recomendamos seguir a ordem dos dias para melhor progressão, mas você pode adaptar conforme sua necessidade.",
    },
    {
      question: "O que fazer se perder um dia?",
      answer: "Não se preocupe! Continue de onde parou. O importante é manter a consistência a longo prazo.",
    },
    {
      question: "Como funciona o cálculo de calorias?",
      answer: "Acesse a seção 'Nutrição Inteligente' no menu para usar nossa calculadora personalizada.",
    },
  ]

  const resources = [
    {
      icon: Video,
      title: "Tutoriais em Vídeo",
      description: "Aprenda a usar todas as funcionalidades da plataforma",
      link: "#",
    },
    {
      icon: Book,
      title: "Guia Completo",
      description: "Manual detalhado do Desafio 21D",
      link: "#",
    },
    {
      icon: FileText,
      title: "Plano Alimentar",
      description: "Baixe seu guia de nutrição em PDF",
      link: "#",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-primary via-primary-light to-accent-yellow rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-2">
          <HelpCircle size={32} />
          SUPORTE
        </h1>
        <p className="text-lg opacity-90">Estamos aqui para ajudar você em sua jornada</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary transition-all">
          <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Mail className="text-primary" size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">Email</h3>
          <p className="text-gray-400 text-sm mb-4">Resposta em até 24 horas</p>
          <a
            href="mailto:suporte@desafio21d.com"
            className="text-primary hover:text-primary-light font-semibold text-sm"
          >
            suporte@desafio21d.com
          </a>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary transition-all">
          <div className="bg-accent-green/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <MessageSquare className="text-accent-green" size={24} />
          </div>
          <h3 className="font-bold text-lg mb-2">WhatsApp</h3>
          <p className="text-gray-400 text-sm mb-4">Atendimento direto e rápido</p>
          <a href="#" className="text-accent-green hover:text-accent-green/80 font-semibold text-sm">
            Iniciar conversa
          </a>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">PERGUNTAS FREQUENTES</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="bg-dark-bg border border-dark-border rounded-lg p-4 hover:border-primary transition-all group"
            >
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                {faq.question}
                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-400 mt-3 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">RECURSOS ÚTEIS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.link}
              className="bg-dark-bg border border-dark-border rounded-lg p-6 hover:border-primary hover:scale-105 transition-all group"
            >
              <resource.icon className="text-primary mb-3 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="font-bold mb-2">{resource.title}</h3>
              <p className="text-sm text-gray-400">{resource.description}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/20 to-accent-yellow/20 border border-primary rounded-xl p-6">
        <h3 className="font-bold text-lg mb-2">Precisa de ajuda personalizada?</h3>
        <p className="text-gray-300 mb-4">
          Nossa equipe está pronta para responder suas dúvidas e ajudar você a alcançar seus objetivos.
        </p>
        <button className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-6 rounded-lg transition-all hover:scale-105">
          Falar com Suporte
        </button>
      </div>
    </div>
  )
}
