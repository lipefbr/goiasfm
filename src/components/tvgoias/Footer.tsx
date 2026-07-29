export function Footer() {
  return (
    <footer className="bg-black mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © 2026 TV Goiás - Todos os direitos reservados. Criado por{' '}
            <a
              href="https://lipe.host"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C8102E] hover:text-red-400 font-bold transition-colors"
            >
              Lipe.Host
            </a>
          </p>
          <nav className="flex items-center gap-3 text-sm">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Política de Privacidade
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Termos de Uso
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
