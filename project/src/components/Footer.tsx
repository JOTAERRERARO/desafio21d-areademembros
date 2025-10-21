import { Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] px-6 py-2 rounded-full font-black text-white text-sm tracking-wider inline-block mb-4">
              DESAFIO 21D
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Transformando homens através da disciplina, consistência e método.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Links Importantes</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/60 hover:text-[#FF6B35] transition-colors text-sm">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-[#FF6B35] transition-colors text-sm">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-[#FF6B35] transition-colors text-sm">
                  Contato e Suporte
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-[#FF6B35] transition-colors text-sm">
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Redes Sociais</h4>
            <div className="flex gap-4 mb-6">
              <a
                href="#"
                className="bg-white/10 hover:bg-[#FF6B35] p-3 rounded-full transition-colors"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="bg-white/10 hover:bg-[#FF6B35] p-3 rounded-full transition-colors"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-3">Receba novidades:</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Seu melhor email"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#FF6B35]"
                />
                <button className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] px-6 py-2 rounded-lg text-white font-bold text-sm hover:scale-105 transition-transform">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p>
              © 2025 Desafio Corpo Definido 21D. Todos os direitos reservados.
            </p>
            <p>
              
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
