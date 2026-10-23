'use client'

import { useEffect, useMemo, useState } from 'react'

const config = { agentName: 'Isadora Mello', whatsappNumber: '971500000000', redirectSeconds: 6 }
const questionSets = {
  en: [
    { id: 'intent', q: 'What are you looking to do?', options: ['Buy', 'Invest', 'Sell'] },
    { id: 'timeline', q: 'When are you planning to move forward?', options: ['Immediately', 'Within 1–3 months', 'Within 3–6 months', 'Just exploring for now'] },
    { id: 'budget', q: "What's your budget?", options: ['Under AED 1M', 'AED 1M – 2M', 'AED 2M – 5M', 'AED 5M+'] },
    { id: 'payment', q: 'How are you planning to pay?', options: ['Cash', 'Mortgage', 'Payment plan (off-plan)', 'Not sure yet'] },
    { id: 'goal', q: "What's the main goal for this property?", options: ['Live in it', 'Rental income', 'Long-term investment / capital growth', 'Golden Visa'] },
    { id: 'nationality', q: "What's your nationality?", type: 'text', note: 'Some communities and payment plans depend on it.' },
    { id: 'notes', q: 'Anything else I should know?', type: 'textarea', note: 'Optional. A preferred area, bedroom count, or anything specific you are after.' },
    { id: 'contact', q: 'Where should I send your shortlist?', type: 'contact', note: "I'll prepare it and send it over on WhatsApp." },
  ],
  pt: [
    { id: 'intent', q: 'O que você procura fazer?', options: ['Comprar', 'Investir', 'Vender'] },
    { id: 'timeline', q: 'Quando pretende avançar?', options: ['Imediatamente', 'Dentro de 1–3 meses', 'Dentro de 3–6 meses', 'Apenas pesquisando'] },
    { id: 'budget', q: 'Qual é o seu orçamento?', options: ['Menos de AED 1M', 'AED 1M – 2M', 'AED 2M – 5M', 'AED 5M+'] },
    { id: 'payment', q: 'Como pretende pagar?', options: ['À vista', 'Financiamento', 'Plano de pagamento (lançamento)', 'Ainda não sei'] },
    { id: 'goal', q: 'Qual é o principal objetivo deste imóvel?', options: ['Morar nele', 'Renda de aluguel', 'Investimento de longo prazo', 'Golden Visa'] },
    { id: 'nationality', q: 'Qual é a sua nacionalidade?', type: 'text', note: 'Algumas comunidades e planos de pagamento dependem disso.' },
    { id: 'notes', q: 'Há mais alguma coisa que eu deva saber?', type: 'textarea', note: 'Opcional. Região, número de quartos ou algo específico que procura.' },
    { id: 'contact', q: 'Para onde devo enviar sua seleção?', type: 'contact', note: 'Vou preparar tudo e enviar pelo WhatsApp.' },
  ],
  es: [
    { id: 'intent', q: '¿Qué te gustaría hacer?', options: ['Comprar', 'Invertir', 'Vender'] },
    { id: 'timeline', q: '¿Cuándo piensas avanzar?', options: ['Inmediatamente', 'En 1–3 meses', 'En 3–6 meses', 'Solo estoy explorando'] },
    { id: 'budget', q: '¿Cuál es tu presupuesto?', options: ['Menos de AED 1M', 'AED 1M – 2M', 'AED 2M – 5M', 'AED 5M+'] },
    { id: 'payment', q: '¿Cómo piensas pagar?', options: ['Al contado', 'Hipoteca', 'Plan de pagos (sobre plano)', 'Aún no lo sé'] },
    { id: 'goal', q: '¿Cuál es el objetivo principal de esta propiedad?', options: ['Vivir en ella', 'Ingresos por alquiler', 'Inversión a largo plazo', 'Golden Visa'] },
    { id: 'nationality', q: '¿Cuál es tu nacionalidad?', type: 'text', note: 'Algunas comunidades y planes de pago dependen de ella.' },
    { id: 'notes', q: '¿Hay algo más que deba saber?', type: 'textarea', note: 'Opcional. Zona preferida, número de habitaciones o algo específico.' },
    { id: 'contact', q: '¿Dónde envío tu selección?', type: 'contact', note: 'La prepararé y te la enviaré por WhatsApp.' },
  ],
} as const

type Answers = Record<string, string>
const sub: Record<string, string> = { 'Under AED 1M': 'approx. $270K', 'AED 1M – 2M': 'approx. $270K – $545K', 'AED 2M – 5M': 'approx. $545K – $1.36M', 'AED 5M+': 'approx. $1.36M+' }

function Flag({ lang }: { lang: string }) {
  const flags = { en: ['us', 'United States flag'], pt: ['br', 'Brazil flag'], es: ['es', 'Spain flag'] } as const
  const [country, alt] = flags[lang as keyof typeof flags] ?? flags.en
  return <img className="country-flag" src={`https://flagcdn.com/w40/${country}.png`} alt={alt} width="24" height="16" />
}
function Mark() { return <div className="mark"><b>Real Estate</b><i>Dubai</i></div> }

export default function Page() {
  const [lang, setLang] = useState('en')
  const [gate, setGate] = useState(true)
  const [menu, setMenu] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [seconds, setSeconds] = useState(config.redirectSeconds)
  const questions = questionSets[lang as keyof typeof questionSets]
  const q = questions[step]
  const copy = useMemo(() => lang === 'pt' ? { eyebrow: 'Na planta e pronto para morar', hero: 'Encontre o imóvel certo em Dubai em', seconds: '60 segundos', role: 'Consultora Imobiliária', reply: 'Responde em até uma hora', lede: 'Oito perguntas rápidas e envio uma seleção personalizada direto para seu WhatsApp, com planos de pagamento e custos completos. Sem ligações indesejadas.', locations: 'Downtown · Marina · Palm Jumeirah', question: 'Pergunta', next: 'Continuar', back: 'Voltar', submit: 'Quero minha seleção', skip: 'Pular esta', complete: 'Concluído', thanks: 'Obrigada', wa: 'Continuar no WhatsApp' } : lang === 'es' ? { eyebrow: 'Sobre plano y listo para entrar', hero: 'Encuentra la propiedad ideal en Dubái en', seconds: '60 segundos', role: 'Consultora Inmobiliaria', reply: 'Respondo en menos de una hora', lede: 'Ocho preguntas rápidas y te envío una selección personalizada directamente a WhatsApp, con planes de pago y costes completos. Sin llamadas no deseadas.', locations: 'Downtown · Marina · Palm Jumeirah', question: 'Pregunta', next: 'Continuar', back: 'Atrás', submit: 'Quiero mi selección', skip: 'Saltar esta', complete: 'Completado', thanks: 'Gracias', wa: 'Continuar en WhatsApp' } : { eyebrow: 'Off-plan & ready property', hero: 'Find the right Dubai property in', seconds: '60 seconds', role: 'Property Consultant', reply: 'Replies within the hour', lede: 'Eight quick questions, then I send a hand-picked shortlist straight to your WhatsApp, with payment plans and full costs included. No cold calls.', locations: 'Downtown · Marina · Palm Jumeirah', question: 'Question', next: 'Continue', back: 'Back', submit: 'Get my shortlist', skip: 'Skip this', complete: 'Complete', thanks: 'Thanks', wa: 'Continue on WhatsApp' }, [lang])

  useEffect(() => { if (!done || seconds <= 0) return; const t = setTimeout(() => setSeconds(seconds - 1), 1000); return () => clearTimeout(t) }, [done, seconds])
  const setAnswer = (id: string, value: string) => setAnswers(a => ({ ...a, [id]: value }))
  const advance = () => { setError(''); setStep(s => Math.min(s + 1, questions.length - 1)) }
  const collect = () => {
    if (q.type === 'text' && (answers[q.id] || '').trim().length < 2) return setError(lang === 'pt' ? 'Informe sua nacionalidade.' : lang === 'es' ? 'Indica tu nacionalidad.' : 'Please enter your nationality.'), false
    if (q.type === 'contact') {
      if ((answers.first || '').trim().length < 2) return setError(lang === 'pt' ? 'Informe seu nome.' : lang === 'es' ? 'Indica tu nombre.' : 'Please enter your first name.'), false
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(answers.email || '')) return setError(lang === 'pt' ? 'Verifique seu e-mail.' : lang === 'es' ? 'Revisa tu correo electrónico.' : 'Please check your email address.'), false
      if ((answers.phone || '').replace(/\D/g, '').length < 6) return setError(lang === 'pt' ? 'Informe um WhatsApp válido.' : lang === 'es' ? 'Indica un número de WhatsApp válido.' : 'Please enter a valid WhatsApp number.'), false
    }
    return true
  }
  const submit = async () => {
    if (!collect() || submitting) return
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'dubai-property-questionnaire',
          language: lang,
          submittedAt: new Date().toISOString(),
          answers,
          score,
          tier,
        }),
      })

      if (!response.ok) throw new Error('Lead delivery failed')
      setDone(true)
    } catch {
      setError(lang === 'pt' ? 'Não foi possível enviar. Tente novamente.' : lang === 'es' ? 'No se pudo enviar. Inténtalo de nuevo.' : 'We could not submit your details. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  const score = (['budget', 'timeline', 'payment'] as const).reduce((n, key) => n + ({ 'Under AED 1M': 1, 'AED 1M – 2M': 2, 'AED 2M – 5M': 3, 'AED 5M+': 4, Immediately: 4, 'Within 1–3 months': 3, 'Within 3–6 months': 2, 'Just exploring for now': 1, Cash: 4, Mortgage: 2, 'Payment plan (off-plan)': 3, 'Not sure yet': 1 }[answers[key]] || 0), 0)
  const tier = score >= 10 ? 'Priority' : score >= 7 ? 'Warm' : 'Nurture'
  const wa = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(`Hi ${config.agentName}, I just finished your Dubai property questionnaire.\n\nName: ${(answers.first || '') + ' ' + (answers.last || '')}\nLooking to: ${answers.intent || ''}\nTimeline: ${answers.timeline || ''}\nBudget: ${answers.budget || ''}\nPayment: ${answers.payment || ''}\nMain goal: ${answers.goal || ''}\nNationality: ${answers.nationality || ''}\nPlease send my shortlist.`)}`

  return <>
    <div className="rail" aria-hidden="true"><span style={{ width: done ? '100%' : `${step / questions.length * 100}%` }} /></div>
    {gate && <div className="gate" role="dialog" aria-modal="true"><div className="gate-card"><Mark /><h2>Choose your language<br />Escolha seu idioma<br />Elige tu idioma</h2><div className="gate-opts">{[['en', 'English', 'United States · Canada'], ['pt', 'Português', 'Brasil'], ['es', 'Español', 'España · América Latina']].map(([code, name, region]) => <button className="lang-btn" key={code} onClick={() => { setLang(code); setGate(false) }}><Flag lang={code} /><span><b>{name}</b><em>{region}</em></span></button>)}</div></div></div>}
    <header className="masthead"><div className="wrap"><Mark /><div className="mast-right"><div className="cert"><svg className="cert-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 3.5 19 6v5.2c0 4.4-2.9 7.8-7 9.3-4.1-1.5-7-4.9-7-9.3V6l7-2.5Z" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round"/><path d="m8.7 12.1 2.1 2.1 4.5-4.6" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg><span>RERA-certified broker</span></div><div className="lang-wrap"><button className="lang-switch" aria-expanded={menu} aria-label="Choose language" onClick={() => setMenu(!menu)}><Flag lang={lang} /><span>{lang === 'en' ? 'English' : lang === 'pt' ? 'Português' : 'Español'}</span><svg className="caret" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2.25 4.25 6 8l3.75-3.75" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>{menu && <ul className="lang-menu">{['en', 'pt', 'es'].map(code => <li key={code}><button onClick={() => { setLang(code); setMenu(false) }}><Flag lang={code} />{code === 'en' ? 'English' : code === 'pt' ? 'Português' : 'Español'}</button></li>)}</ul>}</div></div></div></header>
    <main className="stage"><svg className="skyline" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true"><g fill="#1B2B42"><rect x="0" y="150" width="78" height="70" /><rect x="84" y="128" width="44" height="92" /><rect x="134" y="162" width="62" height="58" /><rect x="202" y="104" width="38" height="116" /><rect x="246" y="140" width="70" height="80" /><polygon points="640,220 620,220 626,126 634,58 640,30 643,0 646,30 652,58 660,126 666,220" /><rect x="800" y="120" width="36" height="100" /><rect x="920" y="100" width="44" height="120" /><rect x="1086" y="156" width="78" height="64" /><rect x="1288" y="116" width="40" height="104" /></g></svg><div className="wrap"><div className="split"><div><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.hero} <em>{copy.seconds}</em></h1><p className="lede">{copy.lede}</p><div className="agent"><div className="shot"><img src="/agent.jpeg" alt="Property consultant" /></div><dl><dt>{config.agentName}</dt><dd>{copy.role}</dd></dl></div><ul className="chips"><li>{copy.locations}</li><li>{copy.reply}</li></ul></div><section className="card" aria-label="Property matching questions"><div className="card-head"><span className="step-of">{done ? copy.complete : `Question ${step + 1} of ${questions.length}`}</span><div className="pips">{questions.map((_, i) => <i className={i <= step || done ? 'on' : ''} key={i} />)}</div></div><div className="card-body">{done ? <div className="done"><div className="seal">✓</div><h2>{copy.thanks}, {answers.first}. I have everything I need.</h2><p>Open WhatsApp and your answers come through with you, so we can start from the shortlist.</p><dl className="recap">{[['Looking to', answers.intent], ['Timeline', answers.timeline], ['Budget', answers.budget], ['Main goal', answers.goal]].map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}<div><dt>Priority</dt><dd><span className="tier">{tier}</span></dd></div></dl><a className="btn wa" href={wa} rel="noopener">{copy.wa}</a><p className="countdown">{seconds ? `Opening WhatsApp in ${seconds}s…` : 'If WhatsApp did not open, use the button above.'}</p></div> : <><h2 className="q">{q.q}</h2>{q.note && <p className="q-note">{q.note}</p>}{!q.type && <ul className="opts">{q.options.map((o, i) => <li key={o}><button className={`opt ${answers[q.id] === o ? 'sel' : ''}`} onClick={() => { setAnswer(q.id, o); setTimeout(advance, 190) }}><span className="key">{i + 1}</span><span className="txt">{o}{sub[o] && <span className="sub">{sub[o]}</span>}</span></button></li>)}</ul>}{q.type === 'text' && <><label className="field"><span>Nationality</span><input value={answers.nationality || ''} onChange={e => setAnswer('nationality', e.target.value)} placeholder="e.g. Brazilian" /></label><span className="err" hidden={!error}>{error}</span><div className="actions"><button className="btn" onClick={() => collect() && advance()}>{copy.next}</button></div></>}{q.type === 'textarea' && <><label className="field"><span>Your message</span><textarea value={answers.notes || ''} onChange={e => setAnswer('notes', e.target.value)} placeholder="e.g. 2-bed in Dubai Marina with a sea view" /></label><div className="actions"><button className="btn ghost" onClick={() => advance()}>{copy.skip}</button><button className="btn" onClick={advance}>{copy.next}</button></div></>}{q.type === 'contact' && <><div className="row2"><label className="field"><span>First name</span><input value={answers.first || ''} onChange={e => setAnswer('first', e.target.value)} /></label><label className="field"><span>Last name</span><input value={answers.last || ''} onChange={e => setAnswer('last', e.target.value)} /></label></div><label className="field"><span>Email</span><input type="email" value={answers.email || ''} onChange={e => setAnswer('email', e.target.value)} placeholder="you@example.com" /></label><label className="field"><span>WhatsApp number</span><input type="tel" value={answers.phone || ''} onChange={e => setAnswer('phone', e.target.value)} placeholder="50 123 4567" /></label><span className="err" hidden={!error}>{error}</span><div className="actions"><button className="btn ghost" onClick={() => setStep(step - 1)}>{copy.back}</button><button className="btn" onClick={submit}>{copy.submit}</button></div><p className="consent">✓ Used only to prepare and send your shortlist. No cold calls, never shared with third parties.</p></>}</>}</div></section></div></div></main>
    <section className="proof"><div className="wrap"><p className="sec-label">Why buyers choose Dubai</p><div className="stats"><div className="stat"><b>0%</b><span>Annual property tax</span><small>No recurring property tax and no tax on rental income for individuals.</small></div><div className="stat"><b>5–8%</b><span>Typical gross rental yield</span><small>Across established communities, ahead of London, Singapore and Hong Kong.</small></div><div className="stat"><b>AED 2M</b><span>Golden Visa threshold</span><small>Property at or above this value can qualify you for the 10-year residency visa.</small></div></div><ol className="steps"><li><h3>You answer 8 short questions</h3><p>Budget, timeline, payment method and goal. It takes about a minute and there is nothing to download.</p></li><li><h3>I match you against live stock</h3><p>Ready units and off-plan launches that fit your budget and your reason for buying.</p></li><li><h3>Your shortlist lands on WhatsApp</h3><p>Floor plans, payment schedules, service charges and every transfer cost.</p></li></ol></div></section>
    <footer><div className="wrap"><Mark /><p>Your details are used only to prepare and send your property shortlist. Figures shown are market indicators, not a guarantee of return.</p></div></footer>
  </>
}
