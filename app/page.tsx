'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

const config = { agentName: 'Isadora Melo', whatsappNumber: '971500000000', redirectSeconds: 6 }
type Lang = 'en' | 'pt' | 'es'
type Question = { id: string; q: string; type: 'choice' | 'text' | 'textarea' | 'contact'; options?: readonly string[]; note?: string }
const questionSets: Record<Lang, Question[]> = {
  en: [
    { id: 'intent', q: 'What are you looking to do?', type: 'choice', options: ['Buy', 'Invest', 'Sell'] },
    { id: 'timeline', q: 'When are you planning to move forward?', type: 'choice', options: ['Immediately', 'Within 1–3 months', 'Within 3–6 months', 'Just exploring for now'] },
    { id: 'budget', q: "What's your budget?", type: 'choice', options: ['Under AED 1M', 'AED 1M – 2M', 'AED 2M – 5M', 'AED 5M+'] },
    { id: 'payment', q: 'How are you planning to pay?', type: 'choice', options: ['Cash', 'Mortgage', 'Payment plan (off-plan)', 'Not sure yet'] },
    { id: 'goal', q: "What's the main goal for this property?", type: 'choice', options: ['Live in it', 'Rental income', 'Long-term investment / capital growth', 'Golden Visa'] },
    { id: 'nationality', q: "What's your nationality?", type: 'text', note: 'Some communities and payment plans depend on it.' },
    { id: 'notes', q: 'Anything else I should know?', type: 'textarea', note: 'Optional. A preferred area, bedroom count, or anything specific you are after.' },
    { id: 'contact', q: 'Where should I send your shortlist?', type: 'contact', note: "I'll prepare it and send it over on WhatsApp." },
  ],
  pt: [
    { id: 'intent', q: 'O que você procura fazer?', type: 'choice', options: ['Comprar', 'Investir', 'Vender'] },
    { id: 'timeline', q: 'Quando pretende avançar?', type: 'choice', options: ['Imediatamente', 'Dentro de 1–3 meses', 'Dentro de 3–6 meses', 'Apenas pesquisando'] },
    { id: 'budget', q: 'Qual é o seu orçamento?', type: 'choice', options: ['Menos de AED 1M', 'AED 1M – 2M', 'AED 2M – 5M', 'AED 5M+'] },
    { id: 'payment', q: 'Como pretende pagar?', type: 'choice', options: ['À vista', 'Financiamento', 'Plano de pagamento (lançamento)', 'Ainda não sei'] },
    { id: 'goal', q: 'Qual é o principal objetivo deste imóvel?', type: 'choice', options: ['Morar nele', 'Renda de aluguel', 'Investimento de longo prazo', 'Golden Visa'] },
    { id: 'nationality', q: 'Qual é a sua nacionalidade?', type: 'text', note: 'Algumas comunidades e planos de pagamento dependem disso.' },
    { id: 'notes', q: 'Há mais alguma coisa que eu deva saber?', type: 'textarea', note: 'Opcional. Região, número de quartos ou algo específico que procura.' },
    { id: 'contact', q: 'Para onde devo enviar sua seleção?', type: 'contact', note: 'Vou preparar tudo e enviar pelo WhatsApp.' },
  ],
  es: [
    { id: 'intent', q: '¿Qué te gustaría hacer?', type: 'choice', options: ['Comprar', 'Invertir', 'Vender'] },
    { id: 'timeline', q: '¿Cuándo piensas avanzar?', type: 'choice', options: ['Inmediatamente', 'En 1–3 meses', 'En 3–6 meses', 'Solo estoy explorando'] },
    { id: 'budget', q: '¿Cuál es tu presupuesto?', type: 'choice', options: ['Menos de AED 1M', 'AED 1M – 2M', 'AED 2M – 5M', 'AED 5M+'] },
    { id: 'payment', q: '¿Cómo piensas pagar?', type: 'choice', options: ['Al contado', 'Hipoteca', 'Plan de pagos (sobre plano)', 'Aún no lo sé'] },
    { id: 'goal', q: '¿Cuál es el objetivo principal de esta propiedad?', type: 'choice', options: ['Vivir en ella', 'Ingresos por alquiler', 'Inversión a largo plazo', 'Golden Visa'] },
    { id: 'nationality', q: '¿Cuál es tu nacionalidad?', type: 'text', note: 'Algunas comunidades y planes de pago dependen de ella.' },
    { id: 'notes', q: '¿Hay algo más que deba saber?', type: 'textarea', note: 'Opcional. Zona preferida, número de habitaciones o algo específico.' },
    { id: 'contact', q: '¿Dónde envío tu selección?', type: 'contact', note: 'La prepararé y te la enviaré por WhatsApp.' },
  ],
}

const copies = {
  en: {
    eyebrow: 'Off-plan & ready property',
    hero: 'Find the right Dubai property in',
    seconds: '60 seconds',
    role: 'Property Consultant',
    reply: 'Replies within the hour',
    lede: 'Eight quick questions, then I send a hand-picked shortlist straight to your WhatsApp, with payment plans and full costs included. No cold calls.',
    locations: 'Downtown · Marina · Palm Jumeirah',
    question: 'Question',
    of: 'of',
    next: 'Continue',
    back: 'Back',
    submit: 'Get my shortlist',
    skip: 'Skip this',
    complete: 'Complete',
    thanks: 'Thanks',
    wa: 'Continue on WhatsApp',
    cert: 'RERA-certified broker',
    langAria: 'Choose language',
    cardAria: 'Property matching questions',
    doneTitle: 'I have everything I need.',
    doneBody: 'Open WhatsApp and your answers come through with you, so we can start from the shortlist.',
    recapIntent: 'Looking to',
    recapTimeline: 'Timeline',
    recapBudget: 'Budget',
    recapGoal: 'Main goal',
    recapPriority: 'Priority',
    countdownOpen: 'Opening WhatsApp in',
    countdownFallback: 'If WhatsApp did not open, use the button above.',
    nationality: 'Nationality',
    phNationality: 'e.g. Brazilian',
    message: 'Your message',
    phNotes: 'e.g. 2-bed in Dubai Marina with a sea view',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    waNumber: 'WhatsApp number',
    consent: '✓ Used only to prepare and send your shortlist. No cold calls, never shared with third parties.',
    errNationality: 'Please enter your nationality.',
    errName: 'Please enter your first name.',
    errEmail: 'Please check your email address.',
    errPhone: 'Please enter a valid WhatsApp number.',
    errSubmit: 'We could not submit your details. Please try again.',
    subs: ['approx. $270K', 'approx. $270K – $545K', 'approx. $545K – $1.36M', 'approx. $1.36M+'],
    whyTitle: 'Why buyers choose Dubai',
    stat1Label: 'Annual property tax',
    stat1Desc: 'No recurring property tax and no tax on rental income for individuals.',
    stat2Label: 'Typical gross rental yield',
    stat2Desc: 'Across established communities, ahead of London, Singapore and Hong Kong.',
    stat3Label: 'Golden Visa threshold',
    stat3Desc: 'Property at or above this value can qualify you for the 10-year residency visa.',
    step1Title: 'You answer 8 short questions',
    step1Desc: 'Budget, timeline, payment method and goal. It takes about a minute and there is nothing to download.',
    step2Title: 'I match you against live stock',
    step2Desc: 'Ready units and off-plan launches that fit your budget and your reason for buying.',
    step3Title: 'Your shortlist lands on WhatsApp',
    step3Desc: 'Floor plans, payment schedules, service charges and every transfer cost.',
    footer: 'Your details are used only to prepare and send your property shortlist. Figures shown are market indicators, not a guarantee of return.',
    waIntro: 'I just finished your Dubai property questionnaire.',
    waName: 'Name',
    waIntent: 'Looking to',
    waTimeline: 'Timeline',
    waBudget: 'Budget',
    waPayment: 'Payment',
    waGoal: 'Main goal',
    waNationality: 'Nationality',
    waAsk: 'Please send my shortlist.',
  },
  pt: {
    eyebrow: 'Na planta e pronto para morar',
    hero: 'Encontre o imóvel certo em Dubai em',
    seconds: '60 segundos',
    role: 'Consultora Imobiliária',
    reply: 'Responde em até uma hora',
    lede: 'Oito perguntas rápidas e envio uma seleção personalizada direto para seu WhatsApp, com planos de pagamento e custos completos. Sem ligações indesejadas.',
    locations: 'Downtown · Marina · Palm Jumeirah',
    question: 'Pergunta',
    of: 'de',
    next: 'Continuar',
    back: 'Voltar',
    submit: 'Quero minha seleção',
    skip: 'Pular esta',
    complete: 'Concluído',
    thanks: 'Obrigada',
    wa: 'Continuar no WhatsApp',
    cert: 'Corretora certificada RERA',
    langAria: 'Escolher idioma',
    cardAria: 'Perguntas para encontrar seu imóvel',
    doneTitle: 'Tenho tudo o que preciso.',
    doneBody: 'Abra o WhatsApp e suas respostas virão junto com você, para começarmos pela seleção.',
    recapIntent: 'Intenção',
    recapTimeline: 'Prazo',
    recapBudget: 'Orçamento',
    recapGoal: 'Objetivo',
    recapPriority: 'Prioridade',
    countdownOpen: 'Abrindo o WhatsApp em',
    countdownFallback: 'Se o WhatsApp não abriu, use o botão acima.',
    nationality: 'Nacionalidade',
    phNationality: 'ex. Brasileiro(a)',
    message: 'Sua mensagem',
    phNotes: 'ex. 2 quartos na Dubai Marina com vista para o mar',
    firstName: 'Nome',
    lastName: 'Sobrenome',
    email: 'E-mail',
    waNumber: 'Número do WhatsApp',
    consent: '✓ Usado apenas para preparar e enviar sua seleção. Sem ligações indesejadas e nunca compartilhado com terceiros.',
    errNationality: 'Informe sua nacionalidade.',
    errName: 'Informe seu nome.',
    errEmail: 'Verifique seu e-mail.',
    errPhone: 'Informe um WhatsApp válido.',
    errSubmit: 'Não foi possível enviar. Tente novamente.',
    subs: ['aprox. $270K', 'aprox. $270K – $545K', 'aprox. $545K – $1,36M', 'aprox. $1,36M+'],
    whyTitle: 'Por que compradores escolhem Dubai',
    stat1Label: 'Imposto predial anual',
    stat1Desc: 'Sem imposto recorrente sobre o imóvel e sem imposto sobre renda de aluguel para pessoas físicas.',
    stat2Label: 'Rentabilidade bruta típica de aluguel',
    stat2Desc: 'Em comunidades consolidadas, à frente de Londres, Singapura e Hong Kong.',
    stat3Label: 'Limite do Golden Visa',
    stat3Desc: 'Imóvel neste valor ou acima pode qualificar você para o visto de residência de 10 anos.',
    step1Title: 'Você responde 8 perguntas rápidas',
    step1Desc: 'Orçamento, prazo, forma de pagamento e objetivo. Leva cerca de um minuto e não há nada para baixar.',
    step2Title: 'Comparo com o estoque disponível',
    step2Desc: 'Unidades prontas e lançamentos na planta que cabem no seu orçamento e no seu motivo para comprar.',
    step3Title: 'Sua seleção chega no WhatsApp',
    step3Desc: 'Plantas, cronogramas de pagamento, taxas de condomínio e todos os custos de transferência.',
    footer: 'Seus dados são usados apenas para preparar e enviar sua seleção de imóveis. Os números exibidos são indicadores de mercado, não uma garantia de retorno.',
    waIntro: 'Acabei de responder seu questionário de imóveis em Dubai.',
    waName: 'Nome',
    waIntent: 'Intenção',
    waTimeline: 'Prazo',
    waBudget: 'Orçamento',
    waPayment: 'Pagamento',
    waGoal: 'Objetivo principal',
    waNationality: 'Nacionalidade',
    waAsk: 'Por favor, envie minha seleção.',
  },
  es: {
    eyebrow: 'Sobre plano y listo para entrar',
    hero: 'Encuentra la propiedad ideal en Dubái en',
    seconds: '60 segundos',
    role: 'Consultora Inmobiliaria',
    reply: 'Respondo en menos de una hora',
    lede: 'Ocho preguntas rápidas y te envío una selección personalizada directamente a WhatsApp, con planes de pago y costes completos. Sin llamadas no deseadas.',
    locations: 'Downtown · Marina · Palm Jumeirah',
    question: 'Pregunta',
    of: 'de',
    next: 'Continuar',
    back: 'Atrás',
    submit: 'Quiero mi selección',
    skip: 'Saltar esta',
    complete: 'Completado',
    thanks: 'Gracias',
    wa: 'Continuar en WhatsApp',
    cert: 'Corredora certificada RERA',
    langAria: 'Elegir idioma',
    cardAria: 'Preguntas para encontrar tu propiedad',
    doneTitle: 'Tengo todo lo que necesito.',
    doneBody: 'Abre WhatsApp y tus respuestas irán contigo, para que empecemos por la selección.',
    recapIntent: 'Intención',
    recapTimeline: 'Plazo',
    recapBudget: 'Presupuesto',
    recapGoal: 'Objetivo principal',
    recapPriority: 'Prioridad',
    countdownOpen: 'Abriendo WhatsApp en',
    countdownFallback: 'Si WhatsApp no se abrió, usa el botón de arriba.',
    nationality: 'Nacionalidad',
    phNationality: 'p. ej. Brasileño',
    message: 'Tu mensaje',
    phNotes: 'p. ej. 2 habitaciones en Dubai Marina con vistas al mar',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo electrónico',
    waNumber: 'Número de WhatsApp',
    consent: '✓ Se usa solo para preparar y enviar tu selección. Sin llamadas no deseadas y nunca se comparte con terceros.',
    errNationality: 'Indica tu nacionalidad.',
    errName: 'Indica tu nombre.',
    errEmail: 'Revisa tu correo electrónico.',
    errPhone: 'Indica un número de WhatsApp válido.',
    errSubmit: 'No se pudo enviar. Inténtalo de nuevo.',
    subs: ['aprox. $270K', 'aprox. $270K – $545K', 'aprox. $545K – $1,36M', 'aprox. $1,36M+'],
    whyTitle: 'Por qué los compradores eligen Dubái',
    stat1Label: 'Impuesto anual sobre la propiedad',
    stat1Desc: 'Sin impuesto recurrente sobre la propiedad y sin impuesto sobre ingresos por alquiler para particulares.',
    stat2Label: 'Rentabilidad bruta típica',
    stat2Desc: 'En comunidades consolidadas, por delante de Londres, Singapur y Hong Kong.',
    stat3Label: 'Umbral del Golden Visa',
    stat3Desc: 'Una propiedad de este valor o superior puede calificarte para la visa de residencia de 10 años.',
    step1Title: 'Respondes 8 preguntas rápidas',
    step1Desc: 'Presupuesto, plazo, forma de pago y objetivo. Toma alrededor de un minuto y no hay nada que descargar.',
    step2Title: 'Comparo con el inventario disponible',
    step2Desc: 'Unidades listas y lanzamientos sobre plano que se ajustan a tu presupuesto y a tu motivo de compra.',
    step3Title: 'Tu selección llega a WhatsApp',
    step3Desc: 'Planos, calendarios de pago, cargos de servicio y todos los costos de transferencia.',
    footer: 'Tus datos se usan solo para preparar y enviar tu selección de propiedades. Las cifras mostradas son indicadores de mercado, no una garantía de rentabilidad.',
    waIntro: 'Acabo de completar tu cuestionario de propiedades en Dubái.',
    waName: 'Nombre',
    waIntent: 'Intención',
    waTimeline: 'Plazo',
    waBudget: 'Presupuesto',
    waPayment: 'Pago',
    waGoal: 'Objetivo principal',
    waNationality: 'Nacionalidad',
    waAsk: 'Por favor, envíame mi selección.',
  },
} as const

type Answers = Record<string, string>
const langNames: Record<Lang, string> = { en: 'English', pt: 'Português', es: 'Español' }

function Flag({ lang }: { lang: string }) {
  const flags = { en: ['us', 'United States flag'], pt: ['br', 'Brazil flag'], es: ['es', 'Spain flag'] } as const
  const [country, alt] = flags[lang as keyof typeof flags] ?? flags.en
  return <img className="country-flag" src={`https://flagcdn.com/w40/${country}.png`} alt={alt} width="24" height="16" />
}
function Mark() { return <div className="mark"><b>Real Estate</b><i>Dubai</i></div> }

export default function Page() {
  const [lang, setLang] = useState<Lang>('en')
  const [gate, setGate] = useState(true)
  const [menu, setMenu] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [tier, setTier] = useState('Nurture')
  const [seconds, setSeconds] = useState(config.redirectSeconds)
  const langWrapRef = useRef<HTMLDivElement>(null)
  const questions = questionSets[lang]
  const q = questions[step]
  const copy = useMemo(() => copies[lang], [lang])

  useEffect(() => { document.documentElement.lang = lang }, [lang])
  useEffect(() => {
    if (!menu) return
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (langWrapRef.current && !langWrapRef.current.contains(e.target as Node)) setMenu(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
    }
  }, [menu])
  useEffect(() => { if (!done || seconds <= 0) return; const t = setTimeout(() => setSeconds(seconds - 1), 1000); return () => clearTimeout(t) }, [done, seconds])
  const setAnswer = (id: string, value: string) => setAnswers(a => ({ ...a, [id]: value }))
  const changeLang = (code: Lang) => {
    setMenu(false)
    if (code === lang) return
    setLang(code)
    setError('')
    if (!done) { setAnswers({}); setStep(0) }
  }
  const advance = () => { setError(''); setStep(s => Math.min(s + 1, questions.length - 1)) }
  const collect = () => {
    if (q.type === 'text' && (answers[q.id] || '').trim().length < 2) return setError(copy.errNationality), false
    if (q.type === 'contact') {
      if ((answers.first || '').trim().length < 2) return setError(copy.errName), false
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(answers.email || '')) return setError(copy.errEmail), false
      if ((answers.phone || '').replace(/\D/g, '').length < 6) return setError(copy.errPhone), false
    }
    return true
  }
  const submit = async () => {
    if (!collect() || submitting) return
    setSubmitting(true)
    setError('')

    try {
      const t = score >= 10 ? 'Priority' : score >= 7 ? 'Warm' : 'Nurture'
      setTier(t)
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'dubai-property-questionnaire',
          language: lang,
          submittedAt: new Date().toISOString(),
          answers,
          score,
          tier: t,
        }),
      })

      if (!response.ok) throw new Error('Lead delivery failed')
      setDone(true)
    } catch {
      setError(copy.errSubmit)
    } finally {
      setSubmitting(false)
    }
  }
  const score = (['budget', 'timeline', 'payment'] as const).reduce((n, key) => {
    const question = questions.find(qq => qq.id === key)
    if (!question) return n
    const idx = (question.options ?? []).indexOf(answers[key])
    if (idx < 0) return n
    const weights = { budget: [1, 2, 3, 4], timeline: [4, 3, 2, 1], payment: [4, 2, 3, 1] } as const
    return n + weights[key][idx]
  }, 0)
  const wa = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(`Hi ${config.agentName}, ${copy.waIntro}\n\n${copy.waName}: ${(answers.first || '') + ' ' + (answers.last || '')}\n${copy.waIntent}: ${answers.intent || ''}\n${copy.waTimeline}: ${answers.timeline || ''}\n${copy.waBudget}: ${answers.budget || ''}\n${copy.waPayment}: ${answers.payment || ''}\n${copy.waGoal}: ${answers.goal || ''}\n${copy.waNationality}: ${answers.nationality || ''}\n${copy.waAsk}`)}`

  return <>
    <div className="rail" aria-hidden="true"><span style={{ width: done ? '100%' : `${step / questions.length * 100}%` }} /></div>
    {gate && <div className="gate" role="dialog" aria-modal="true"><div className="gate-card"><Mark /><h2>Choose your language<br />Escolha seu idioma<br />Elige tu idioma</h2><div className="gate-opts">{(['en', 'pt', 'es'] as Lang[]).map(code => <button className="lang-btn" key={code} onClick={() => { setLang(code); setGate(false) }}><Flag lang={code} /><span><b>{langNames[code]}</b><em>{code === 'en' ? 'United States · Canada' : code === 'pt' ? 'Brasil' : 'España · América Latina'}</em></span></button>)}</div></div></div>}
    <header className="masthead"><div className="wrap"><Mark /><div className="mast-right"><div className="cert"><svg className="cert-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 3.5 19 6v5.2c0 4.4-2.9 7.8-7 9.3-4.1-1.5-7-4.9-7-9.3V6l7-2.5Z" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round"/><path d="m8.7 12.1 2.1 2.1 4.5-4.6" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg><span>{copy.cert}</span></div><div className="lang-wrap" ref={langWrapRef}><button className="lang-switch" aria-expanded={menu} aria-label={copy.langAria} onClick={() => setMenu(!menu)}><Flag lang={lang} /><span>{langNames[lang]}</span><svg className="caret" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2.25 4.25 6 8l3.75-3.75" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>{menu && <ul className="lang-menu">{(['en', 'pt', 'es'] as Lang[]).map(code => <li key={code}><button onClick={() => changeLang(code)}><Flag lang={code} />{langNames[code]}</button></li>)}</ul>}</div></div></div></header>
    <main className="stage"><svg className="skyline" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true"><g fill="#1B2B42"><rect x="0" y="150" width="78" height="70" /><rect x="84" y="128" width="44" height="92" /><rect x="134" y="162" width="62" height="58" /><rect x="202" y="104" width="38" height="116" /><rect x="246" y="140" width="70" height="80" /><polygon points="640,220 620,220 626,126 634,58 640,30 643,0 646,30 652,58 660,126 666,220" /><rect x="800" y="120" width="36" height="100" /><rect x="920" y="100" width="44" height="120" /><rect x="1086" y="156" width="78" height="64" /><rect x="1288" y="116" width="40" height="104" /></g></svg><div className="wrap"><div className="split"><div><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.hero} <em>{copy.seconds}</em></h1><p className="lede">{copy.lede}</p><div className="agent"><div className="shot"><img src="/agent.jpeg" alt="Property consultant" /></div><dl><dt>{config.agentName}</dt><dd>{copy.role}</dd></dl></div><ul className="chips"><li>{copy.locations}</li><li>{copy.reply}</li></ul></div><section className="card" aria-label={copy.cardAria}><div className="card-head"><span className="step-of">{done ? copy.complete : `${copy.question} ${step + 1} ${copy.of} ${questions.length}`}</span><div className="pips">{questions.map((_, i) => <i className={i <= step || done ? 'on' : ''} key={i} />)}</div></div><div className="card-body">{done ? <div className="done"><div className="seal">✓</div><h2>{copy.thanks}, {answers.first}. {copy.doneTitle}</h2><p>{copy.doneBody}</p><dl className="recap">{[[copy.recapIntent, answers.intent], [copy.recapTimeline, answers.timeline], [copy.recapBudget, answers.budget], [copy.recapGoal, answers.goal]].map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}<div><dt>{copy.recapPriority}</dt><dd><span className="tier">{tier}</span></dd></div></dl><a className="btn wa" href={wa} rel="noopener">{copy.wa}</a><p className="countdown">{seconds ? `${copy.countdownOpen} ${seconds}s…` : copy.countdownFallback}</p></div> : <><h2 className="q">{q.q}</h2>{q.note && <p className="q-note">{q.note}</p>}{q.type === 'choice' && <ul className="opts">{(q.options ?? []).map((o, i) => <li key={o}><button className={`opt ${answers[q.id] === o ? 'sel' : ''}`} onClick={() => { setAnswer(q.id, o); setTimeout(advance, 190) }}><span className="key">{i + 1}</span><span className="txt">{o}{q.id === 'budget' && copy.subs[i] && <span className="sub">{copy.subs[i]}</span>}</span></button></li>)}</ul>}{q.type === 'text' && <><label className="field"><span>{copy.nationality}</span><input value={answers.nationality || ''} onChange={e => setAnswer('nationality', e.target.value)} placeholder={copy.phNationality} /></label><span className="err" hidden={!error}>{error}</span><div className="actions"><button className="btn" onClick={() => collect() && advance()}>{copy.next}</button></div></>}{q.type === 'textarea' && <><label className="field"><span>{copy.message}</span><textarea value={answers.notes || ''} onChange={e => setAnswer('notes', e.target.value)} placeholder={copy.phNotes} /></label><div className="actions"><button className="btn ghost" onClick={() => advance()}>{copy.skip}</button><button className="btn" onClick={advance}>{copy.next}</button></div></>}{q.type === 'contact' && <><div className="row2"><label className="field"><span>{copy.firstName}</span><input value={answers.first || ''} onChange={e => setAnswer('first', e.target.value)} /></label><label className="field"><span>{copy.lastName}</span><input value={answers.last || ''} onChange={e => setAnswer('last', e.target.value)} /></label></div><label className="field"><span>{copy.email}</span><input type="email" value={answers.email || ''} onChange={e => setAnswer('email', e.target.value)} placeholder="you@example.com" /></label><label className="field"><span>{copy.waNumber}</span><input type="tel" value={answers.phone || ''} onChange={e => setAnswer('phone', e.target.value)} placeholder="50 123 4567" /></label><span className="err" hidden={!error}>{error}</span><div className="actions"><button className="btn ghost" onClick={() => setStep(step - 1)}>{copy.back}</button><button className="btn" onClick={submit}>{copy.submit}</button></div><p className="consent">{copy.consent}</p></>}</>}</div></section></div></div></main>
    <section className="proof"><div className="wrap"><p className="sec-label">{copy.whyTitle}</p><div className="stats"><div className="stat"><b>0%</b><span>{copy.stat1Label}</span><small>{copy.stat1Desc}</small></div><div className="stat"><b>5–8%</b><span>{copy.stat2Label}</span><small>{copy.stat2Desc}</small></div><div className="stat"><b>AED 2M</b><span>{copy.stat3Label}</span><small>{copy.stat3Desc}</small></div></div><ol className="steps"><li><h3>{copy.step1Title}</h3><p>{copy.step1Desc}</p></li><li><h3>{copy.step2Title}</h3><p>{copy.step2Desc}</p></li><li><h3>{copy.step3Title}</h3><p>{copy.step3Desc}</p></li></ol></div></section>
    <footer><div className="wrap"><Mark /><p>{copy.footer}</p></div></footer>
  </>
}
