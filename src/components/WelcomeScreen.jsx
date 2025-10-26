import { useEffect, useMemo, useRef, useState } from 'react'

export default function WelcomeScreen({ reducedMotion, languages, defaultLang, onApplyLanguage, onStart, strings }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(defaultLang)
  const inputRef = useRef(null)
  const liveRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 350)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    if (!query) return languages
    const q = query.toLowerCase()
    return languages.filter(l => `${l.native} ${l.english}`.toLowerCase().includes(q))
  }, [languages, query])

  const common = useMemo(() => languages.filter(l => l.common), [languages])

  const handleSelect = (lang) => {
    setSelected(lang)
    liveRef.current && (liveRef.current.textContent = `${lang.native} selected`)
  }

  return (
    <section className="mx-auto max-w-screen-md" aria-labelledby="welcome-title">
      <h1 id="welcome-title" className="sr-only">{strings.welcomeTitle}</h1>

      <div className="mx-auto mt-6 flex items-center justify-center">
        {reducedMotion ? (
          <div
            className="h-56 w-56 rounded-full bg-gradient-to-br from-blue-200 to-emerald-200"
            aria-hidden="true"
          />
        ) : (
          <div
            className="h-56 w-56 rounded-3xl bg-gradient-to-br from-blue-200 via-blue-100 to-emerald-200 shadow-inner"
            role="img"
            aria-label="Calming abstract graphic"
          />
        )}
      </div>

      <p className="mx-auto mt-6 max-w-prose text-center text-[17px] leading-7 text-[#475569]">
        {strings.welcomeTitle}
      </p>

      <div className="sr-only" aria-live="polite" ref={liveRef} />

      <div className="mt-6">
        <label htmlFor="lang-search" className="mb-2 block text-sm font-medium text-[#0B1220]">
          {strings.searchLang}
        </label>
        <div className="relative">
          <input
            id="lang-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={strings.searchLang}
            className="w-full rounded-lg border border-[#CBD5E1] bg-white px-4 py-3 pr-10 text-[16px] leading-6 text-[#0B1220] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500"
            role="searchbox"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute inset-y-0 end-2 my-auto h-9 rounded-md px-2 text-sm text-[#475569] hover:bg-[#EFF6FF] focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Clear"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-sm font-medium text-[#0B1220]">Common languages</div>
        <div className="flex flex-wrap gap-2" role="listbox" aria-label="Common languages">
          {common.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={selected.code === l.code}
              onClick={() => handleSelect(l)}
              className={`rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selected.code === l.code
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-[#CBD5E1] text-[#0B1220] hover:bg-[#EFF6FF]'
              }`}
            >
              {l.native} ({l.english})
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4" role="listbox" aria-label="All languages">
        {filtered.map((l) => (
          <button
            key={l.code}
            role="option"
            aria-selected={selected.code === l.code}
            onClick={() => handleSelect(l)}
            className={`flex min-h-[52px] items-center justify-center rounded-xl border p-3 text-center text-[15px] leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              selected.code === l.code
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-[#CBD5E1] text-[#0B1220] hover:bg-[#EFF6FF]'
            }`}
          >
            <span>{l.native} ({l.english})</span>
          </button>
        ))}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-20 flex justify-center">
        <span className="rounded-md bg-white/80 px-3 py-1 text-xs text-[#475569] shadow ring-1 ring-[#CBD5E1]">
          {strings.emergency}
        </span>
      </div>

      <div className="sticky bottom-4 mt-8">
        <div className="mx-auto max-w-screen-md rounded-2xl border border-[#CBD5E1] bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="truncate text-sm text-[#475569]" aria-live="polite">
              {selected.native} ({selected.english})
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onApplyLanguage(selected)}
                className="rounded-lg border border-transparent bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {strings.language}
              </button>
              <button
                onClick={() => onStart(selected)}
                className="rounded-lg border border-transparent bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                disabled={!selected}
              >
                {strings.start}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
