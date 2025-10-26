import { Globe, HelpCircle, Menu } from 'lucide-react'

export default function Header({ title, onOpenLanguage, onOpenHelp, onStartOver, language, strings }) {
  return (
    <header role="banner" className="fixed inset-x-0 top-0 z-30 h-16 border-b border-[#CBD5E1] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-full max-w-screen-md items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500" aria-hidden="true" />
          <span className="sr-only">Brand</span>
          <span className="text-sm font-semibold text-[#475569]">Care</span>
        </div>
        <div className="text-base font-semibold text-[#0B1220]" aria-live="polite">{title}</div>
        <nav aria-label="Global" className="flex items-center gap-2">
          <button
            className="flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-lg border border-[#CBD5E1] px-3 text-sm text-[#0B1220] hover:bg-[#EFF6FF] focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onOpenLanguage}
            aria-label={strings.language}
          >
            <Globe className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">{language.native}</span>
          </button>
          <button
            className="h-11 w-11 rounded-lg border border-[#CBD5E1] text-[#0B1220] hover:bg-[#EFF6FF] focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onOpenHelp}
            aria-label={strings.help}
          >
            <HelpCircle className="mx-auto h-5 w-5" aria-hidden="true" />
          </button>
          <div className="relative">
            <details className="group">
              <summary
                className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-lg border border-[#CBD5E1] text-[#0B1220] hover:bg-[#EFF6FF] focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={strings.menu}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </summary>
              <div className="absolute end-0 mt-2 w-56 rounded-lg border border-[#CBD5E1] bg-white p-2 shadow-lg">
                <button
                  onClick={onStartOver}
                  className="block w-full rounded-md px-3 py-2 text-start text-sm text-[#0B1220] hover:bg-[#EFF6FF] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {strings.startOver}
                </button>
                <button
                  onClick={onOpenLanguage}
                  className="block w-full rounded-md px-3 py-2 text-start text-sm text-[#0B1220] hover:bg-[#EFF6FF] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {strings.language}
                </button>
                <button
                  onClick={onOpenHelp}
                  className="block w-full rounded-md px-3 py-2 text-start text-sm text-[#0B1220] hover:bg-[#EFF6FF] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {strings.help}
                </button>
              </div>
            </details>
          </div>
        </nav>
      </div>
    </header>
  )
}
