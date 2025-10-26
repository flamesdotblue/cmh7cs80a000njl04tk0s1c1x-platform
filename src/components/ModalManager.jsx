import { useEffect, useRef, useState } from 'react'

export default function ModalManager({ openLanguage, openHelp, onClose, languages, currentLanguage, onApplyLanguage, strings }) {
  return (
    <>
      {openLanguage && (
        <LanguageModal languages={languages} currentLanguage={currentLanguage} onApply={onApplyLanguage} onClose={onClose} strings={strings} />
      )}
      {openHelp && (
        <HelpModal onClose={onClose} strings={strings} />
      )}
    </>
  )
}

function BaseModal({ title, onClose, children }) {
  const dialogRef = useRef(null)
  const lastActive = useRef(null)

  useEffect(() => {
    lastActive.current = document.activeElement
    const key = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', key)
    setTimeout(() => dialogRef.current?.focus(), 0)
    return () => {
      document.removeEventListener('keydown', key)
      lastActive.current && lastActive.current.focus?.()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div
          ref={dialogRef}
          tabIndex={-1}
          className="w-full max-w-lg rounded-2xl border border-[#CBD5E1] bg-white p-4 shadow-xl focus:outline-none"
        >
          <div className="mb-3 text-base font-semibold text-[#0B1220]">{title}</div>
          <div className="max-h-[70vh] overflow-auto pr-1 text-[15px] leading-6 text-[#0B1220]">
            {children}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-sm text-[#0B1220] hover:bg-[#EFF6FF] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function LanguageModal({ languages, currentLanguage, onApply, onClose, strings }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(currentLanguage)
  const liveRef = useRef(null)

  useEffect(() => setSelected(currentLanguage), [currentLanguage])

  const filtered = languages.filter(l => `${l.native} ${l.english}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <BaseModal title={strings.language} onClose={onClose}>
      <div className="sr-only" aria-live="polite" ref={liveRef} />
      <label htmlFor="lang-search-modal" className="mb-2 block text-sm font-medium text-[#0B1220]">
        {strings.searchLang}
      </label>
      <input
        id="lang-search-modal"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={strings.searchLang}
        className="mb-3 w-full rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-[16px] leading-6 text-[#0B1220] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {filtered.map(l => (
          <button
            key={l.code}
            onClick={() => {
              setSelected(l)
              liveRef.current && (liveRef.current.textContent = strings.languageApplied)
            }}
            aria-pressed={selected.code === l.code}
            className={`rounded-xl border p-3 text-sm ${selected.code === l.code ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-[#CBD5E1] text-[#0B1220] hover:bg-[#EFF6FF]'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {l.native} ({l.english})
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => onApply(selected)}
          className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Apply
        </button>
      </div>
    </BaseModal>
  )
}

function HelpModal({ onClose, strings }) {
  return (
    <BaseModal title={strings.help} onClose={onClose}>
      <section className="space-y-3">
        <div>
          <h3 className="mb-1 text-sm font-semibold">About</h3>
          <p className="text-[15px] text-[#475569]">
            {strings.notDiagnosis}
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-sm font-semibold">Privacy & Data Use</h3>
          <p className="text-[15px] text-[#475569]">
            Your messages may be reviewed to improve the service. Do not share highly sensitive information. See our privacy policy for details.
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-sm font-semibold">Sources</h3>
          <p className="text-[15px] text-[#475569]">
            This assistant provides general health information and is not a substitute for professional medical advice.
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-sm font-semibold">Emergency</h3>
          <p className="text-[15px] text-[#B91C1C]">
            {strings.emergency}
          </p>
        </div>
      </section>
    </BaseModal>
  )
}
