export function Footer() {
  return (
    <footer className="bg-black mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © 2024 TV Goiás - Todos os direitos reservados.
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
