'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

const config = { agentName: 'Isadora Melo', whatsappNumber: '971500000000', redirectSeconds: 6 }
type Lang = 'en' | 'pt' | 'es'
type Question = { id: string; q: string; type: 'choice' | 'text' | 'textarea' | 'contact'; options?: readonly string[]; note?: string }
const questionSets: Record<Lang, Question[]> = {
  en: [
    { id: 'intent', q: 'What are you looking to do?', type: 'choice', options: ['Buy', 'Invest', 'Sell'] },
    { id: 'timeline', q: 'When are you planning to move forward?', type: 'choice', options: ['Immediately', 'Within the next 6 to 12 months', 'In one year', 'Just exploring for now'] },
    { id: 'budget', q: "What's your budget?", type: 'choice', options: ['Under AED 1M', 'AED 1M – 2M', 'AED 2M – 5M', 'AED 5M+'] },
    { id: 'payment', q: 'How are you planning to pay?', type: 'choice', options: ['Cash', 'Payment plan (off-plan)', 'Not sure yet'] },
    { id: 'goal', q: "What's the main goal for this property?", type: 'choice', options: ['Live in it', 'Rental income', 'Short term rental / Airbnb', 'Long-term investment / capital growth', 'Golden Visa'] },
    { id: 'nationality', q: "What's your nationality?", type: 'text', note: 'Some communities and payment plans depend on it.' },
    { id: 'notes', q: 'Anything else I should know?', type: 'textarea', note: 'Optional. A preferred area, bedroom count, or anything specific you are after.' },
    { id: 'contact', q: 'Where should I send your shortlist?', type: 'contact', note: "I'll prepare it and send it over on WhatsApp." },
  ],
  pt: [
    { id: 'intent', q: 'O que você procura fazer?', type: 'choice', options: ['Comprar', 'Investir', 'Vender'] },
    { id: 'timeline', q: 'Quando pretende avançar?', type: 'choice', options: ['Imediatamente', 'Nos próximos 6 a 12 meses', 'Em um ano', 'Apenas pesquisando'] },
    { id: 'budget', q: 'Qual é o seu orçamento?', type: 'choice', options: ['Menos de AED 1M', 'AED 1M – 2M', 'AED 2M – 5M', 'AED 5M+'] },
    { id: 'payment', q: 'Como pretende pagar?', type: 'choice', options: ['À vista', 'Plano de pagamento (lançamento)', 'Ainda não sei'] },
    { id: 'goal', q: 'Qual é o principal objetivo deste imóvel?', type: 'choice', options: ['Morar nele', 'Renda de aluguel', 'Aluguel de curto prazo / Airbnb', 'Investimento de longo prazo', 'Golden Visa'] },
    { id: 'nationality', q: 'Qual é a sua nacionalidade?', type: 'text', note: 'Algumas comunidades e planos de pagamento dependem disso.' },
    { id: 'notes', q: 'Há mais alguma coisa que eu deva saber?', type: 'textarea', note: 'Opcional. Região, número de quartos ou algo específico que procura.' },
    { id: 'contact', q: 'Para onde devo enviar sua seleção?', type: 'contact', note: 'Vou preparar tudo e enviar pelo WhatsApp.' },
  ],
  es: [
    { id: 'intent', q: '¿Qué te gustaría hacer?', type: 'choice', options: ['Comprar', 'Invertir', 'Vender'] },
    { id: 'timeline', q: '¿Cuándo piensas avanzar?', type: 'choice', options: ['Inmediatamente', 'En los próximos 6 a 12 meses', 'En un año', 'Solo estoy explorando'] },
    { id: 'budget', q: '¿Cuál es tu presupuesto?', type: 'choice', options: ['Menos de AED 1M', 'AED 1M – 2M', 'AED 2M – 5M', 'AED 5M+'] },
    { id: 'payment', q: '¿Cómo piensas pagar?', type: 'choice', options: ['Al contado', 'Plan de pagos (sobre plano)', 'Aún no lo sé'] },
    { id: 'goal', q: '¿Cuál es el objetivo principal de esta propiedad?', type: 'choice', options: ['Vivir en ella', 'Ingresos por alquiler', 'Alquiler a corto plazo / Airbnb', 'Inversión a largo plazo', 'Golden Visa'] },
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
    ledePre: 'Eight quick questions, then I send a hand-picked shortlist straight to your WhatsApp, ',
    ledeBold: 'with payment plans and full costs included',
    ledePost: '. No cold calls.',
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
    step3Desc: 'Floor plans, payment schedules, service charges and every cost with full transparency.',
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
    faqTitle: 'Frequently asked questions',
    faqs: [
      { q: 'What does it cost to buy property in Dubai?', a: 'On top of the purchase price, allow around 4% for the Dubai Land Department fee and about 2% for agency fees. There is no annual property tax and no tax on rental income for individuals.' },
      { q: 'Can foreigners buy property in Dubai?', a: 'Yes. Foreign nationals can own freehold property in designated communities such as Downtown Dubai, Dubai Marina and Palm Jumeirah.' },
      { q: 'What budget qualifies for the Golden Visa?', a: 'A property worth AED 2M or more can qualify you for the 10-year UAE residency visa, covering you and your family.' },
      { q: 'Do you cover off-plan and ready properties?', a: 'Yes. The shortlist includes both off-plan launches with flexible payment plans and ready-to-move-in units.' },
      { q: 'How do I receive my property shortlist?', a: 'Answer the eight quick questions and your shortlist arrives on WhatsApp within the hour, with floor plans, payment schedules and full costs.' },
      { q: 'Are rental yields in Dubai still attractive?', a: 'Established communities typically deliver 5 - 8% gross rental yield, ahead of London, Singapore and Hong Kong.' },
    ],
    footNav: 'Site links',
    guideTitle: 'Dubai property buying guide',
    guideQs: [
      {
        q: 'How much does it cost to buy property in Dubai?',
        a: "Beyond the agreed purchase price, budget for the Dubai Land Department (DLD) transfer fee of roughly 4%, agency commission of about 2%, and a one-off registration fee on off-plan or mortgaged units. There is no annual property tax and no tax on rental income for individuals, which is one reason net returns in Dubai often outperform mature markets such as London or New York. Your shortlist breaks every one of these costs down line by line before you commit, so there are no surprises at transfer.",
      },
      {
        q: 'Should I buy off-plan or ready property in Dubai?',
        a: 'Off-plan launches typically unlock flexible payment plans, often 60/40 or 50/50 structures spread across construction milestones, with a smaller upfront commitment and the chance to capture early-launch pricing before handover. Ready units suit buyers who want immediate rental income, a mortgage from a UAE bank, or a quicker path to Golden Visa eligibility. The questionnaire asks about your timeline and payment preference specifically so your shortlist only includes stock that matches how you actually want to pay.',
      },
      {
        q: 'How does the Golden Visa work for property buyers?',
        a: 'Under current UAE rules, a property purchase at or above AED 2,000,000 can qualify the owner, and immediate family, for a renewable 10-year Golden Visa, granting long-term residency without a local sponsor. The visa is tied to the property, so investors typically favour ready units or near-handover off-plan stock to minimise the wait between purchase and application. Golden-Visa-eligible options are flagged directly inside your shortlist, along with the paperwork the application normally requires.',
      },
      {
        q: 'Are Dubai rental yields still competitive?',
        a: 'Established communities such as Dubai Marina, Downtown Dubai and Palm Jumeirah typically deliver 5 - 8% gross rental yield, ahead of comparable markets in London, Singapore and Hong Kong. Yields vary by unit type, service charges and occupancy, which is why every shortlist includes the service charge and expected rental range for each property, not just the headline price. If rental income is your main goal, ready units with an established rental history are prioritised over speculative off-plan stock.',
      },
    ],
    citeLabel: 'Sources',
    citeDld: 'Dubai Land Department',
    citeGov: 'UAE Government Portal',
    citeNote: 'Figures on fees, tax treatment and the Golden Visa threshold reflect published guidance; always confirm current rates before transacting.',
    howToName: 'How to get a Dubai property shortlist',
    howToDesc: 'Three steps to receive a hand-picked Dubai property shortlist on WhatsApp, matched to your budget, timeline and goal.',
  },
  pt: {
    eyebrow: 'Na planta e pronto para morar',
    hero: 'Encontre o imóvel certo em Dubai em',
    seconds: '60 segundos',
    role: 'Consultora Imobiliária',
    reply: 'Responde em até uma hora',
    ledePre: 'Oito perguntas rápidas e envio uma seleção personalizada direto para seu WhatsApp, ',
    ledeBold: 'com planos de pagamento e custos completos',
    ledePost: '. Sem ligações indesejadas.',
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
    step3Desc: 'Plantas, cronogramas de pagamento, taxas de condomínio e todos os custos com total transparência.',
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
    faqTitle: 'Perguntas frequentes',
    faqs: [
      { q: 'Quanto custa comprar um imóvel em Dubai?', a: 'Além do preço de compra, reserve cerca de 4% para a taxa do Dubai Land Department e 2% para corretagem. Não há imposto predial anual nem imposto sobre renda de aluguel para pessoas físicas.' },
      { q: 'Estrangeiros podem comprar imóveis em Dubai?', a: 'Sim. Estrangeiros podem ter propriedade freehold em comunidades designadas como Downtown Dubai, Dubai Marina e Palm Jumeirah.' },
      { q: 'Qual orçamento dá direito ao Golden Visa?', a: 'Um imóvel de AED 2M ou mais pode qualificar você para o visto de residência de 10 anos dos EAU, incluindo sua família.' },
      { q: 'Vocês trabalham com imóveis na planta e prontos?', a: 'Sim. A seleção inclui lançamentos na planta com planos de pagamento flexíveis e unidades prontas para morar.' },
      { q: 'Como recebo minha seleção de imóveis?', a: 'Responda as oito perguntas rápidas e sua seleção chega pelo WhatsApp em até uma hora, com plantas, cronogramas de pagamento e custos completos.' },
      { q: 'A rentabilidade de aluguel em Dubai ainda é boa?', a: 'Comunidades consolidadas costumam entregar 5 - 8% de rentabilidade bruta, à frente de Londres, Singapura e Hong Kong.' },
    ],
    navStart: 'Começar o questionário',
    navWhy: 'Por que Dubai',
    navGuide: 'Guia de compra',
    navFaq: 'Perguntas frequentes',
    footNav: 'Links do site',
    guideTitle: 'Guia de compra de imóveis em Dubai',
    guideQs: [
      {
        q: 'Quanto custa comprar um imóvel em Dubai?',
        a: 'Além do preço acordado, reserve cerca de 4% para a taxa de transferência do Dubai Land Department (DLD), cerca de 2% de comissão de corretagem e uma taxa única de registro em unidades na planta ou financiadas. Não há imposto predial anual nem imposto sobre renda de aluguel para pessoas físicas, uma das razões pelas quais o retorno líquido em Dubai costuma superar mercados maduros como Londres ou Nova York. Sua seleção detalha cada um desses custos antes de você se comprometer, sem surpresas na transferência.',
      },
      {
        q: 'Devo comprar na planta ou um imóvel pronto em Dubai?',
        a: 'Lançamentos na planta costumam liberar planos de pagamento flexíveis, frequentemente estruturas 60/40 ou 50/50 distribuídas pelos marcos da construção, com entrada menor e a chance de garantir o preço de lançamento antes da entrega. Unidades prontas atendem quem busca renda de aluguel imediata, financiamento de um banco dos EAU, ou um caminho mais rápido para o Golden Visa. O questionário pergunta sobre seu prazo e preferência de pagamento justamente para que sua seleção inclua apenas o estoque compatível com a forma como você quer pagar.',
      },
      {
        q: 'Como funciona o Golden Visa para quem compra imóveis?',
        a: 'Pelas regras atuais dos EAU, uma compra de imóvel a partir de AED 2.000.000 pode qualificar o proprietário, e a família imediata, para um Golden Visa renovável de 10 anos, com residência de longo prazo sem a necessidade de um patrocinador local. O visto está vinculado ao imóvel, por isso investidores costumam preferir unidades prontas ou lançamentos próximos da entrega para reduzir a espera entre a compra e o pedido. Opções elegíveis para o Golden Visa são sinalizadas diretamente na sua seleção, junto com a documentação normalmente exigida.',
      },
      {
        q: 'A rentabilidade de aluguel em Dubai ainda é competitiva?',
        a: 'Comunidades consolidadas como Dubai Marina, Downtown Dubai e Palm Jumeirah costumam entregar 5 - 8% de rentabilidade bruta, à frente de mercados comparáveis como Londres, Singapura e Hong Kong. A rentabilidade varia conforme o tipo de unidade, as taxas de condomínio e a ocupação, por isso cada seleção inclui a taxa de condomínio e a faixa de aluguel esperada para cada imóvel, não apenas o preço de destaque. Quando a renda de aluguel é o objetivo principal, unidades prontas com histórico de locação consolidado são priorizadas sobre estoque especulativo na planta.',
      },
    ],
    citeLabel: 'Fontes',
    citeDld: 'Dubai Land Department',
    citeGov: 'Portal do Governo dos EAU',
    citeNote: 'Os valores sobre taxas, tributação e o limite do Golden Visa refletem orientações publicadas; confirme sempre as taxas vigentes antes de transacionar.',
    howToName: 'Como receber uma seleção de imóveis em Dubai',
    howToDesc: 'Três passos para receber uma seleção de imóveis em Dubai personalizada no WhatsApp, de acordo com seu orçamento, prazo e objetivo.',
  },
  es: {
    eyebrow: 'Sobre plano y listo para entrar',
    hero: 'Encuentra la propiedad ideal en Dubái en',
    seconds: '60 segundos',
    role: 'Consultora Inmobiliaria',
    reply: 'Respondo en menos de una hora',
    ledePre: 'Ocho preguntas rápidas y te envío una selección personalizada directamente a WhatsApp, ',
    ledeBold: 'con planes de pago y costes completos',
    ledePost: '. Sin llamadas no deseadas.',
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
    step3Desc: 'Planos, calendarios de pago, cargos de servicio y todos los costos con total transparencia.',
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
    faqTitle: 'Preguntas frecuentes',
    faqs: [
      { q: '¿Cuánto cuesta comprar una propiedad en Dubái?', a: 'Además del precio de compra, reserva alrededor del 4% para la tasa del Dubai Land Department y un 2% para la agencia. No hay impuesto anual sobre la propiedad ni impuesto sobre ingresos por alquiler para particulares.' },
      { q: '¿Pueden los extranjeros comprar propiedades en Dubái?', a: 'Sí. Los extranjeros pueden ser propietarios freehold en comunidades designadas como Downtown Dubai, Dubai Marina y Palm Jumeirah.' },
      { q: '¿Qué presupuesto da derecho al Golden Visa?', a: 'Una propiedad de AED 2M o más puede calificarte para la visa de residencia de 10 años de EAU, incluida tu familia.' },
      { q: '¿Trabajan con propiedades sobre plano y listas?', a: 'Sí. La selección incluye lanzamientos sobre plano con planes de pago flexibles y unidades listas para entrar.' },
      { q: '¿Cómo recibo mi selección de propiedades?', a: 'Responde las ocho preguntas rápidas y tu selección llega por WhatsApp en menos de una hora, con planos, calendarios de pago y costos completos.' },
      { q: '¿Sigue siendo atractiva la rentabilidad del alquiler en Dubái?', a: 'Las comunidades consolidadas suelen ofrecer una rentabilidad bruta del 5 - 8%, por delante de Londres, Singapur y Hong Kong.' },
    ],
    navStart: 'Empezar el cuestionario',
    navWhy: 'Por qué Dubái',
    navGuide: 'Guía de compra',
    navFaq: 'Preguntas frecuentes',
    footNav: 'Enlaces del sitio',
    guideTitle: 'Guía para comprar propiedades en Dubái',
    guideQs: [
      {
        q: '¿Cuánto cuesta comprar una propiedad en Dubái?',
        a: 'Además del precio acordado, reserva alrededor del 4% para la tasa de transferencia del Dubai Land Department (DLD), cerca del 2% de comisión de la agencia y una tasa única de registro en unidades sobre plano o hipotecadas. No hay impuesto anual sobre la propiedad ni impuesto sobre ingresos por alquiler para particulares, una de las razones por las que el retorno neto en Dubái suele superar a mercados maduros como Londres o Nueva York. Tu selección detalla cada uno de estos costos antes de que te comprometas, sin sorpresas en la transferencia.',
      },
      {
        q: '¿Debería comprar sobre plano o una propiedad lista en Dubái?',
        a: 'Los lanzamientos sobre plano suelen ofrecer planes de pago flexibles, a menudo estructuras 60/40 o 50/50 distribuidas en los hitos de construcción, con un pago inicial menor y la posibilidad de asegurar el precio de lanzamiento antes de la entrega. Las unidades listas son ideales para quienes buscan ingresos por alquiler inmediatos, una hipoteca de un banco de los EAU, o un camino más rápido hacia el Golden Visa. El cuestionario pregunta por tu plazo y preferencia de pago precisamente para que tu selección incluya solo el inventario que coincide con cómo quieres pagar.',
      },
      {
        q: '¿Cómo funciona el Golden Visa para compradores de propiedades?',
        a: 'Según las normas vigentes de los EAU, una compra de propiedad desde AED 2.000.000 puede calificar al propietario, y a su familia inmediata, para un Golden Visa renovable de 10 años, con residencia a largo plazo sin necesidad de un patrocinador local. La visa está vinculada a la propiedad, por lo que los inversores suelen preferir unidades listas o lanzamientos cercanos a la entrega para reducir la espera entre la compra y la solicitud. Las opciones elegibles para el Golden Visa se señalan directamente en tu selección, junto con la documentación que suele exigir el trámite.',
      },
      {
        q: '¿Sigue siendo competitiva la rentabilidad del alquiler en Dubái?',
        a: 'Comunidades consolidadas como Dubai Marina, Downtown Dubai y Palm Jumeirah suelen ofrecer una rentabilidad bruta del 5 - 8%, por delante de mercados comparables como Londres, Singapur y Hong Kong. La rentabilidad varía según el tipo de unidad, las cuotas de servicio y la ocupación, por eso cada selección incluye la cuota de servicio y el rango de alquiler esperado para cada propiedad, no solo el precio destacado. Cuando el objetivo principal es el ingreso por alquiler, se priorizan las unidades listas con historial de alquiler consolidado frente al inventario especulativo sobre plano.',
      },
    ],
    citeLabel: 'Fuentes',
    citeDld: 'Dubai Land Department',
    citeGov: 'Portal del Gobierno de los EAU',
    citeNote: 'Las cifras sobre tasas, tributación y el umbral del Golden Visa reflejan directrices publicadas; confirma siempre las tasas vigentes antes de transaccionar.',
    howToName: 'Cómo obtener una selección de propiedades en Dubái',
    howToDesc: 'Tres pasos para recibir una selección de propiedades en Dubái personalizada por WhatsApp, según tu presupuesto, plazo y objetivo.',
  },
} as const

type Answers = Record<string, string>
const langNames: Record<Lang, string> = { en: 'English', pt: 'Português', es: 'Español' }
const LANG_KEY = 'isamelo-lang'
const GATE_KEY = 'isamelo-lang-chosen'
const isLang = (v: string | null): v is Lang => v === 'en' || v === 'pt' || v === 'es'

function Flag({ lang }: { lang: string }) {
  const flags = { en: ['us', 'United States flag'], pt: ['br', 'Brazil flag'], es: ['es', 'Spain flag'] } as const
  const [country, alt] = flags[lang as keyof typeof flags] ?? flags.en
  return <img className="country-flag" src={`https://flagcdn.com/w40/${country}.png`} alt={alt} width="24" height="16" />
}
function Mark() { return <div className="mark"><b>Real Estate</b><i>Dubai</i></div> }

export default function Page() {
  const [lang, setLang] = useState<Lang>('en')
  const [gate, setGate] = useState(false)
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
    try {
      const saved = localStorage.getItem(LANG_KEY)
      if (isLang(saved)) setLang(saved)
      setGate(localStorage.getItem(GATE_KEY) !== '1')
    } catch {
      setGate(true)
    }
  }, [])
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
    try { localStorage.setItem(LANG_KEY, code) } catch { /* storage unavailable */ }
    if (!done) { setAnswers({}); setStep(0) }
  }
  const advance = () => { setError(''); setStep(s => Math.min(s + 1, questions.length - 1)) }
  const back = () => { setError(''); setStep(s => Math.max(s - 1, 0)) }
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
    const weights = { budget: [1, 2, 3, 4], timeline: [4, 3, 2, 1], payment: [4, 3, 1] } as const
    return n + weights[key][idx]
  }, 0)
  const wa = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(`Hi ${config.agentName}, ${copy.waIntro}\n\n${copy.waName}: ${(answers.first || '') + ' ' + (answers.last || '')}\n${copy.waIntent}: ${answers.intent || ''}\n${copy.waTimeline}: ${answers.timeline || ''}\n${copy.waBudget}: ${answers.budget || ''}\n${copy.waPayment}: ${answers.payment || ''}\n${copy.waGoal}: ${answers.goal || ''}\n${copy.waNationality}: ${answers.nationality || ''}\n${copy.waAsk}`)}`

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [...copy.faqs, ...copy.guideQs].map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'HowTo', name: copy.howToName, description: copy.howToDesc, step: [{ '@type': 'HowToStep', name: copy.step1Title, text: copy.step1Desc }, { '@type': 'HowToStep', name: copy.step2Title, text: copy.step2Desc }, { '@type': 'HowToStep', name: copy.step3Title, text: copy.step3Desc }] }) }} />
    <div className="rail" aria-hidden="true"><span style={{ width: done ? '100%' : `${step / questions.length * 100}%` }} /></div>
    {gate && <div className="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title"><div className="gate-card"><Mark /><h2 id="gate-title">Choose your language<br />Escolha seu idioma<br />Elige tu idioma</h2><div className="gate-opts">{(['en', 'pt', 'es'] as Lang[]).map(code => <button className="lang-btn" key={code} onClick={() => { setLang(code); setGate(false); try { localStorage.setItem(LANG_KEY, code); localStorage.setItem(GATE_KEY, '1') } catch { /* storage unavailable */ } }}><Flag lang={code} /><span><b>{langNames[code]}</b><em>{code === 'en' ? 'United States · Canada' : code === 'pt' ? 'Brasil' : 'España · América Latina'}</em></span></button>)}</div></div></div>}
    <header className="masthead"><div className="wrap"><Mark /><div className="mast-right"><div className="cert"><svg className="cert-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 3.5 19 6v5.2c0 4.4-2.9 7.8-7 9.3-4.1-1.5-7-4.9-7-9.3V6l7-2.5Z" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round"/><path d="m8.7 12.1 2.1 2.1 4.5-4.6" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg><span>{copy.cert}</span></div><div className="lang-wrap" ref={langWrapRef}><button className="lang-switch" aria-expanded={menu} aria-label={copy.langAria} onClick={() => setMenu(!menu)}><Flag lang={lang} /><span>{langNames[lang]}</span><svg className="caret" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2.25 4.25 6 8l3.75-3.75" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>{menu && <ul className="lang-menu">{(['en', 'pt', 'es'] as Lang[]).map(code => <li key={code}><button onClick={() => changeLang(code)}><Flag lang={code} />{langNames[code]}</button></li>)}</ul>}</div></div></div></header>
    <main className="stage"><svg className="skyline" viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true"><g fill="#1B2B42"><rect x="0" y="150" width="78" height="70" /><rect x="84" y="128" width="44" height="92" /><rect x="134" y="162" width="62" height="58" /><rect x="202" y="104" width="38" height="116" /><rect x="246" y="140" width="70" height="80" /><polygon points="640,220 620,220 626,126 634,58 640,30 643,0 646,30 652,58 660,126 666,220" /><rect x="800" y="120" width="36" height="100" /><rect x="920" y="100" width="44" height="120" /><rect x="1086" y="156" width="78" height="64" /><rect x="1288" y="116" width="40" height="104" /></g></svg><div className="wrap"><div className="split"><div><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.hero} <em>{copy.seconds}</em></h1><p className="lede">{copy.ledePre}<strong>{copy.ledeBold}</strong>{copy.ledePost}</p><div className="agent"><div className="shot"><img src="/isa-melo-agent.jpg" alt="Property consultant" /></div><dl><dt>{config.agentName}</dt><dd>{copy.role}</dd></dl></div><ul className="chips"><li>{copy.locations}</li><li>{copy.reply}</li></ul></div><section className="card" id="get-started" aria-label={copy.cardAria}><div className="card-head"><span className="step-of">{done ? copy.complete : `${copy.question} ${step + 1} ${copy.of} ${questions.length}`}</span><div className="pips">{questions.map((_, i) => <i className={i <= step || done ? 'on' : ''} key={i} />)}</div></div><div className="card-body">{done ? <div className="done"><div className="seal">✓</div><h2>{copy.thanks}, {answers.first}. {copy.doneTitle}</h2><p>{copy.doneBody}</p><dl className="recap">{[[copy.recapIntent, answers.intent], [copy.recapTimeline, answers.timeline], [copy.recapBudget, answers.budget], [copy.recapGoal, answers.goal]].map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}<div><dt>{copy.recapPriority}</dt><dd><span className="tier">{tier}</span></dd></div></dl><a className="btn wa" href={wa} rel="noopener">{copy.wa}</a><p className="countdown">{seconds ? `${copy.countdownOpen} ${seconds}s…` : copy.countdownFallback}</p></div> : <><h2 className="q">{q.q}</h2>{q.note && <p className="q-note">{q.note}</p>}{q.type === 'choice' && <><ul className="opts">{(q.options ?? []).map((o, i) => <li key={o}><button className={`opt ${answers[q.id] === o ? 'sel' : ''}`} onClick={() => { setAnswer(q.id, o); setTimeout(advance, 190) }}><span className="key">{i + 1}</span><span className="txt">{o}{q.id === 'budget' && copy.subs[i] && <span className="sub">{copy.subs[i]}</span>}</span></button></li>)}</ul>{step > 0 && <div className="actions"><button className="btn ghost" onClick={back}>{copy.back}</button></div>}</>}{q.type === 'text' && <><label className="field"><span>{copy.nationality}</span><input value={answers.nationality || ''} onChange={e => setAnswer('nationality', e.target.value)} placeholder={copy.phNationality} /></label><span className="err" hidden={!error}>{error}</span><div className="actions">{step > 0 && <button className="btn ghost" onClick={back}>{copy.back}</button>}<button className="btn" onClick={() => collect() && advance()}>{copy.next}</button></div></>}{q.type === 'textarea' && <><label className="field"><span>{copy.message}</span><textarea value={answers.notes || ''} onChange={e => setAnswer('notes', e.target.value)} placeholder={copy.phNotes} /></label><div className="actions">{step > 0 && <button className="btn ghost" onClick={back}>{copy.back}</button>}<button className="btn ghost" onClick={() => advance()}>{copy.skip}</button><button className="btn" onClick={advance}>{copy.next}</button></div></>}{q.type === 'contact' && <><div className="row2"><label className="field"><span>{copy.firstName}</span><input value={answers.first || ''} onChange={e => setAnswer('first', e.target.value)} /></label><label className="field"><span>{copy.lastName}</span><input value={answers.last || ''} onChange={e => setAnswer('last', e.target.value)} /></label></div><label className="field"><span>{copy.email}</span><input type="email" value={answers.email || ''} onChange={e => setAnswer('email', e.target.value)} placeholder="you@example.com" /></label><label className="field"><span>{copy.waNumber}</span><input type="tel" value={answers.phone || ''} onChange={e => setAnswer('phone', e.target.value)} placeholder="50 123 4567" /></label><span className="err" hidden={!error}>{error}</span><div className="actions"><button className="btn ghost" onClick={back}>{copy.back}</button><button className="btn" onClick={submit}>{copy.submit}</button></div><p className="consent">{copy.consent}</p></>}</>}</div></section></div></div></main>
    <section className="proof" id="why-dubai"><div className="wrap"><p className="sec-label">{copy.whyTitle}</p><div className="stats"><div className="stat"><b>0%</b><span>{copy.stat1Label}</span><small>{copy.stat1Desc}</small></div><div className="stat"><b>5 - 8%</b><span>{copy.stat2Label}</span><small>{copy.stat2Desc}</small></div><div className="stat"><b>AED 2M</b><span>{copy.stat3Label}</span><small>{copy.stat3Desc}</small></div></div><ol className="steps"><li><h3>{copy.step1Title}</h3><p>{copy.step1Desc}</p></li><li><h3>{copy.step2Title}</h3><p>{copy.step2Desc}</p></li><li><h3>{copy.step3Title}</h3><p>{copy.step3Desc}</p></li></ol></div></section>
    {/* <section className="guide" id="guide"><div className="wrap"><p className="sec-label">{copy.guideTitle}</p><div className="guide-grid">{copy.guideQs.map(g => <div className="guide-item" key={g.q}><h3>{g.q}</h3><p>{g.a}</p></div>)}</div><p className="guide-cite">{copy.citeLabel}: <a href="https://dubailand.gov.ae/en/" target="_blank" rel="noopener noreferrer">{copy.citeDld}</a> · <a href="https://u.ae/en/" target="_blank" rel="noopener noreferrer">{copy.citeGov}</a>. {copy.citeNote}</p></div></section> */}
    {/* <section className="faq-sec" id="faq"><div className="wrap"><p className="sec-label">{copy.faqTitle}</p><ul className="faq-list">{copy.faqs.map(f => <li key={f.q}><details><summary>{f.q}</summary><p>{f.a}</p></details></li>)}</ul></div></section> */}
    <footer><div className="wrap"><Mark /><p>{copy.footer}</p></div></footer>
  </>
}
