import { useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header'
import WelcomeScreen from './components/WelcomeScreen'
import ChatInterface from './components/ChatInterface'
import ModalManager from './components/ModalManager'

const LANGS = [
  { code: 'en', native: 'English', english: 'English', dir: 'ltr', sample: 'Health Chat', common: true },
  { code: 'es', native: 'Español', english: 'Spanish', dir: 'ltr', sample: 'Chat de salud', common: true },
  { code: 'fr', native: 'Français', english: 'French', dir: 'ltr', sample: 'Discussion Santé', common: true },
  { code: 'ar', native: 'العربية', english: 'Arabic', dir: 'rtl', sample: 'دردشة الصحة', common: true },
  { code: 'hi', native: 'हिन्दी', english: 'Hindi', dir: 'ltr', sample: 'स्वास्थ्य चैट', common: true },
  { code: 'zh', native: '中文', english: 'Chinese', dir: 'ltr', sample: '健康聊天', common: true },
  { code: 'pt', native: 'Português', english: 'Portuguese', dir: 'ltr', sample: 'Chat de Saúde', common: true },
  { code: 'ru', native: 'Русский', english: 'Russian', dir: 'ltr', sample: 'Чат о здоровье', common: true },
]

const uiStrings = {
  en: {
    title: 'Health Chat',
    welcomeTitle: 'Welcome. Choose your language to begin.',
    searchLang: 'Search your language',
    start: 'Start',
    emergency: 'If this is an emergency, call local emergency services.',
    describeSymptoms: 'Describe your symptoms…',
    send: 'Send',
    voiceStart: 'Start voice input',
    voiceStop: 'Stop',
    notDiagnosis: 'I am not a medical diagnosis. If urgent, call emergency services.',
    help: 'Help & Info',
    language: 'Language',
    menu: 'Menu',
    startOver: 'Start over',
    privacy: 'Privacy & data use',
    emergencyInfo: 'Emergency information',
    about: 'About',
    confirmClear: 'This will clear your conversation. Continue?',
    undo: 'Undo',
    assistantTyping: 'Assistant is typing…',
    reviewing: 'Reviewing your symptoms… usually <10s.',
    options: 'Options',
    yes: 'Yes',
    no: 'No',
    notSure: 'Not sure',
    addSymptom: 'Add symptom',
    moreOptions: 'More options',
    languageApplied: 'Language applied',
  },
  es: {
    title: 'Chat de salud',
    welcomeTitle: 'Bienvenido. Elige tu idioma para comenzar.',
    searchLang: 'Busca tu idioma',
    start: 'Comenzar',
    emergency: 'Si es una emergencia, llama a los servicios de emergencia de tu país.',
    describeSymptoms: 'Describe tus síntomas…',
    send: 'Enviar',
    voiceStart: 'Iniciar voz',
    voiceStop: 'Detener',
    notDiagnosis: 'No es un diagnóstico médico. Si es urgente, llama a emergencias.',
    help: 'Ayuda e información',
    language: 'Idioma',
    menu: 'Menú',
    startOver: 'Comenzar de nuevo',
    privacy: 'Privacidad y uso de datos',
    emergencyInfo: 'Información de emergencia',
    about: 'Acerca de',
    confirmClear: 'Esto borrará la conversación. ¿Continuar?',
    undo: 'Deshacer',
    assistantTyping: 'El asistente está escribiendo…',
    reviewing: 'Revisando tus síntomas… usualmente <10s.',
    options: 'Opciones',
    yes: 'Sí',
    no: 'No',
    notSure: 'No estoy seguro',
    addSymptom: 'Agregar síntoma',
    moreOptions: 'Más opciones',
    languageApplied: 'Idioma aplicado',
  },
  fr: {
    title: 'Discussion Santé',
    welcomeTitle: 'Bienvenue. Choisissez votre langue pour commencer.',
    searchLang: 'Recherchez votre langue',
    start: 'Commencer',
    emergency: 'En cas d’urgence, appelez les services d’urgence locaux.',
    describeSymptoms: 'Décrivez vos symptômes…',
    send: 'Envoyer',
    voiceStart: 'Démarrer la voix',
    voiceStop: 'Arrêter',
    notDiagnosis: 'Ceci n’est pas un diagnostic. En cas d’urgence, appelez les secours.',
    help: 'Aide et info',
    language: 'Langue',
    menu: 'Menu',
    startOver: 'Recommencer',
    privacy: 'Confidentialité et données',
    emergencyInfo: 'Infos d’urgence',
    about: 'À propos',
    confirmClear: 'Cela effacera la conversation. Continuer ?',
    undo: 'Annuler',
    assistantTyping: 'L’assistant écrit…',
    reviewing: 'Analyse de vos symptômes… <10s.',
    options: 'Options',
    yes: 'Oui',
    no: 'Non',
    notSure: 'Je ne sais pas',
    addSymptom: 'Ajouter un symptôme',
    moreOptions: 'Plus d’options',
    languageApplied: 'Langue appliquée',
  },
  ar: {
    title: 'دردشة الصحة',
    welcomeTitle: 'مرحبًا. اختر لغتك للبدء.',
    searchLang: 'ابحث عن لغتك',
    start: 'ابدأ',
    emergency: 'في حالة الطوارئ اتصل بخدمات الطوارئ المحلية.',
    describeSymptoms: 'صف أعراضك…',
    send: 'إرسال',
    voiceStart: 'ابدأ إدخال الصوت',
    voiceStop: 'إيقاف',
    notDiagnosis: 'هذا ليس تشخيصًا طبيًا. في الحالات العاجلة اتصل بالطوارئ.',
    help: 'مساعدة ومعلومات',
    language: 'اللغة',
    menu: 'القائمة',
    startOver: 'بدء من جديد',
    privacy: 'الخصوصية واستخدام البيانات',
    emergencyInfo: 'معلومات الطوارئ',
    about: 'حول',
    confirmClear: 'سيؤدي ذلك إلى مسح المحادثة. المتابعة؟',
    undo: 'تراجع',
    assistantTyping: 'المساعد يكتب…',
    reviewing: 'جارٍ مراجعة الأعراض… عادة أقل من 10 ثوانٍ.',
    options: 'خيارات',
    yes: 'نعم',
    no: 'لا',
    notSure: 'لست متأكدًا',
    addSymptom: 'أضف عرضًا',
    moreOptions: 'المزيد من الخيارات',
    languageApplied: 'تم تطبيق اللغة',
  },
}

export default function App() {
  const detected = useMemo(() => {
    const nav = navigator?.language?.split('-')[0] || 'en'
    const found = LANGS.find(l => l.code === nav)
    return found || LANGS[0]
  }, [])

  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('hc_lang')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {}
    }
    return detected
  })
  const strings = uiStrings[language.code] || uiStrings.en
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('hc_started'))
  const [modals, setModals] = useState({ language: false, help: false })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mql.matches)
    const h = (e) => setReducedMotion(e.matches)
    mql.addEventListener('change', h)
    return () => mql.removeEventListener('change', h)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language.code
    document.documentElement.dir = language.dir
  }, [language])

  const applyLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('hc_lang', JSON.stringify(lang))
  }

  const onStart = (lang) => {
    if (lang) applyLanguage(lang)
    localStorage.setItem('hc_started', '1')
    setShowWelcome(false)
  }

  const clearConversationRef = useRef(null)

  const onStartOver = () => {
    if (window.confirm(strings.confirmClear)) {
      clearConversationRef.current?.()
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1220] selection:bg-blue-100">
      <Header
        title={strings.title}
        onOpenLanguage={() => setModals(m => ({ ...m, language: true }))}
        onOpenHelp={() => setModals(m => ({ ...m, help: true }))}
        onStartOver={onStartOver}
        language={language}
        strings={strings}
      />

      <main id="main" role="main" className="mx-auto max-w-screen-md px-4 pb-24 pt-20">
        {showWelcome ? (
          <WelcomeScreen
            reducedMotion={reducedMotion}
            languages={LANGS}
            defaultLang={language}
            onApplyLanguage={applyLanguage}
            onStart={onStart}
            strings={strings}
          />
        ) : (
          <ChatInterface
            language={language}
            strings={strings}
            reducedMotion={reducedMotion}
            bindClear={(fn) => (clearConversationRef.current = fn)}
          />
        )}
      </main>

      <ModalManager
        openLanguage={modals.language}
        openHelp={modals.help}
        onClose={() => setModals({ language: false, help: false })}
        languages={LANGS}
        currentLanguage={language}
        onApplyLanguage={(l) => {
          applyLanguage(l)
          setModals({ language: false, help: false })
        }}
        strings={strings}
      />
    </div>
  )
}
