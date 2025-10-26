import { useEffect, useMemo, useRef, useState } from 'react'
import { Mic, Send, ShieldCheck } from 'lucide-react'

function MessageBubble({ role, text, time, dir, strings }) {
  const isUser = role === 'user'
  const align = dir === 'rtl' ? (isUser ? 'me-auto' : 'ms-auto') : isUser ? 'ms-auto' : 'me-auto'
  const bg = isUser ? 'bg-[#2563EB] text-white' : 'bg-white text-[#0B1220]'
  const border = isUser ? 'border-transparent' : 'border-[#CBD5E1]'
  const label = isUser ? undefined : (
    <div className="mb-1 flex items-center gap-1 text-[13px] font-semibold text-[#0B1220]">
      <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
      <span>AI Health Assistant</span>
    </div>
  )
  return (
    <div className={`max-w-[85%] ${align}`}>
      <div className={`rounded-2xl border ${border} ${bg} px-4 py-3 shadow-sm`}>{label}{text}</div>
      <div className={`mt-1 text-[12px] leading-5 text-[#475569] ${isUser ? (dir === 'rtl' ? 'text-start' : 'text-end') : (dir === 'rtl' ? 'text-end' : 'text-start')}`}>{time}</div>
    </div>
  )
}

export default function ChatInterface({ language, strings, reducedMotion, bindClear }) {
  const [messages, setMessages] = useState(() => [])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [recording, setRecording] = useState(false)
  const endRef = useRef(null)
  const liveRef = useRef(null)

  const timeFmt = useMemo(() => new Intl.DateTimeFormat(language.code, { hour: 'numeric', minute: '2-digit' }), [language.code])

  useEffect(() => {
    if (messages.length === 0) {
      const first = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: strings.notDiagnosis,
        time: timeFmt.format(new Date()),
      }
      setMessages([first])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language.code])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'end' })
  }, [messages, reducedMotion])

  useEffect(() => {
    bindClear?.(() => {
      const cleared = [{ id: crypto.randomUUID(), role: 'assistant', text: strings.notDiagnosis, time: timeFmt.format(new Date()) }]
      setMessages(cleared)
      liveRef.current && (liveRef.current.textContent = 'Conversation cleared')
    })
  }, [bindClear, strings.notDiagnosis, timeFmt])

  const send = (text) => {
    if (!text.trim()) return
    const userMsg = { id: crypto.randomUUID(), role: 'user', text: text.trim(), time: timeFmt.format(new Date()) }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)
    liveRef.current && (liveRef.current.textContent = strings.assistantTyping)
    setTimeout(() => {
      const reply = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: `${strings.reviewing}\n\n${strings.options}:` + `\n• ${strings.yes}\n• ${strings.no}\n• ${strings.notSure}`,
        time: timeFmt.format(new Date()),
      }
      setMessages((m) => [...m, reply])
      setTyping(false)
      liveRef.current && (liveRef.current.textContent = 'New message received')
    }, 900)
  }

  const onQuick = (val) => send(val)

  return (
    <section aria-label={strings.title} className="flex flex-col">
      <div className="sr-only" aria-live="polite" ref={liveRef} />

      <div className="flex flex-col gap-3">
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} text={m.text} time={m.time} dir={language.dir} strings={strings} />
        ))}
        {typing && (
          <div className={`max-w-[85%] ${language.dir === 'rtl' ? 'ms-auto' : 'me-auto'}`}>
            <div className="flex items-center gap-2 rounded-2xl border border-[#CBD5E1] bg-white px-4 py-3 shadow-sm" aria-live="polite">
              <div className="flex items-center gap-1 text-[13px] font-semibold text-[#0B1220]">
                <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                <span>AI Health Assistant</span>
              </div>
              <span className="sr-only">{strings.assistantTyping}</span>
              <div className="ms-2 flex items-center gap-1">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#475569]" />
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#94A3B8] [animation-delay:150ms]" />
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#CBD5E1] [animation-delay:300ms]" />
              </div>
            </div>
            <div className={`mt-1 text-[12px] leading-5 text-[#475569] ${language.dir === 'rtl' ? 'text-end' : 'text-start'}`}>{timeFmt.format(new Date())}</div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2" role="toolbar" aria-label="Quick replies">
        {[strings.yes, strings.no, strings.notSure, strings.addSymptom].map((q) => (
          <button
            key={q}
            onClick={() => onQuick(q)}
            className="h-10 shrink-0 rounded-full border border-[#CBD5E1] bg-white px-4 text-sm text-[#0B1220] hover:bg-[#EFF6FF] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {q}
          </button>
        ))}
        <button
          onClick={() => onQuick(strings.moreOptions)}
          className="h-10 shrink-0 rounded-full border border-[#CBD5E1] bg-white px-4 text-sm text-[#0B1220] hover:bg-[#EFF6FF] focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {strings.moreOptions}
        </button>
      </div>

      <div className="sticky inset-x-0 bottom-0 mt-3 rounded-2xl border border-[#CBD5E1] bg-white p-2 shadow-sm">
        <div className="flex items-end gap-2">
          <button
            className={`flex h-11 w-11 items-center justify-center rounded-lg border border-[#CBD5E1] text-[#0B1220] hover:bg-[#EFF6FF] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              recording ? 'bg-emerald-50 ring-2 ring-emerald-500' : ''
            }`}
            aria-pressed={recording}
            aria-label={recording ? strings.voiceStop : strings.voiceStart}
            onClick={() => setRecording((r) => !r)}
          >
            <Mic className="h-5 w-5" aria-hidden="true" />
          </button>
          <label className="sr-only" htmlFor="chat-input">
            {strings.describeSymptoms}
          </label>
          <textarea
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={strings.describeSymptoms}
            className="min-h-[44px] max-h-44 w-full resize-none rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-[16px] leading-6 text-[#0B1220] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
              if (e.key === '/' && e.target.selectionStart === 0) {
                e.preventDefault()
                e.currentTarget.focus()
              }
            }}
          />
          <button
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 text-sm font-semibold text-white hover:bg-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            onClick={() => send(input)}
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{strings.send}</span>
          </button>
        </div>
        <div className="mt-2 text-xs text-[#475569]">
          {strings.notDiagnosis}
        </div>
      </div>
    </section>
  )
}
