'use client';

import React, { useEffect, useMemo, useRef, useState, FormEvent } from 'react';

type Msg = { type: 'success' | 'error'; text: string } | null;

type Services =
  | 'kitchen'
  | 'bathroom'
  | 'flooring'
  | 'painting'
  | 'electrical'
  | 'plumbing'
  | 'carpentry'
  | 'insulation'
  | 'windows'
  | 'outdoor'
  | 'other';

type FormState = {
  // Step 1 – Projeto & Serviços
  projectTitle: string;
  services: Services[];
  otherServiceText: string;
  propertyType: 'apartment' | 'house' | 'commercial' | 'other';
  propertyOtherText: string;
  projectDescription: string;

  // Step 2 – Imóvel & Escopo
  address: string;
  city: string;
  postalCode: string;
  areaM2: string;
  bedrooms: string;
  bathrooms: string;
  budgetRange: 'under10k' | '10to25' | '25to50' | '50to100' | 'over100';
  timeline: 'asap' | '1to3' | '3to6' | '6plus';
  siteAccess: 'occupied' | 'empty' | 'undecided';
  files: FileList | null;

  // Step 3 – Contacto
  name: string;
  email: string;
  phone: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  howHeard: 'google' | 'instagram' | 'friend' | 'repeat' | 'other';
  howHeardOtherText: string;
  consent: boolean;

  // Anti-spam
  company_honeypot?: string;
};

const EMPTY: FormState = {
  projectTitle: '',
  services: [],
  otherServiceText: '',
  propertyType: 'apartment',
  propertyOtherText: '',
  projectDescription: '',

  address: '',
  city: '',
  postalCode: '',
  areaM2: '',
  bedrooms: '',
  bathrooms: '',
  budgetRange: '10to25',
  timeline: '1to3',
  siteAccess: 'occupied',
  files: null,

  name: '',
  email: '',
  phone: '',
  preferredContact: 'email',
  howHeard: 'google',
  howHeardOtherText: '',
  consent: false,

  company_honeypot: '',
};

const STORAGE_KEY = 'renohome_multistep_quote_v1';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/manbpywd';

export default function MultiStepQuoteForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<FormState>(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Msg>(null);

  const formRef = useRef<HTMLFormElement | null>(null);

  // ---------- Autosave / Restore ----------
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FormState>;
        setData((d) => ({ ...d, ...parsed }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    // Serializar sem FileList (não é serializável)
    const { files, ...rest } = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  }, [data]);

  // ---------- Helpers ----------
  const toggleService = (svc: Services) => {
    setData((d) => {
      const exists = d.services.includes(svc);
      return { ...d, services: exists ? d.services.filter((s) => s !== svc) : [...d.services, svc] };
    });
  };

  const canGoNext = useMemo(() => {
    if (step === 1) {
      const hasServices = data.services.length > 0 || (data.services.includes('other') && !!data.otherServiceText.trim());
      const projectOk = data.projectDescription.trim().length >= 10;
      const titleOk = data.projectTitle.trim().length >= 3;
      const propertyOk =
        data.propertyType !== 'other' || (data.propertyType === 'other' && data.propertyOtherText.trim().length >= 2);
      return hasServices && projectOk && titleOk && propertyOk;
    }
    if (step === 2) {
      const addressOk = data.address.trim().length >= 5 && data.city.trim().length >= 2 && data.postalCode.trim().length >= 4;
      const areaOk = data.areaM2 === '' || Number.isFinite(Number(data.areaM2));
      const roomsOk =
        (data.bedrooms === '' || Number.isFinite(Number(data.bedrooms))) &&
        (data.bathrooms === '' || Number.isFinite(Number(data.bathrooms)));
      return addressOk && areaOk && roomsOk;
    }
    if (step === 3) {
      const nameOk = data.name.trim().length >= 2;
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
      const phoneOk = data.phone.trim().length >= 6;
      const consentOk = data.consent === true;
      return nameOk && emailOk && phoneOk && consentOk;
    }
    return false;
  }, [step, data]);

  const progressPct = step === 1 ? 33 : step === 2 ? 66 : 100;

  // ---------- Submit ----------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    // Honeypot
    if (data.company_honeypot && data.company_honeypot.trim().length > 0) {
      setMessage({ type: 'error', text: 'Submission blocked.' });
      return;
    }

    // Bloquear múltiplos cliques
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Mapear campos legíveis no email do Formspree
      formData.append('projectTitle', data.projectTitle);
      formData.append('services', data.services.join(', '));
      if (data.otherServiceText) formData.append('otherService', data.otherServiceText);

      formData.append('propertyType', data.propertyType);
      if (data.propertyType === 'other' && data.propertyOtherText) {
        formData.append('propertyOther', data.propertyOtherText);
      }
      formData.append('projectDescription', data.projectDescription);

      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('postalCode', data.postalCode);
      if (data.areaM2) formData.append('areaM2', data.areaM2);
      if (data.bedrooms) formData.append('bedrooms', data.bedrooms);
      if (data.bathrooms) formData.append('bathrooms', data.bathrooms);
      formData.append('budgetRange', data.budgetRange);
      formData.append('timeline', data.timeline);
      formData.append('siteAccess', data.siteAccess);

      if (data.files && data.files.length > 0) {
        Array.from(data.files).forEach((file, idx) => {
          // Formspree aceita múltiplos com o mesmo nome
          formData.append('attachments', file, file.name || `file_${idx + 1}`);
        });
      }

      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('preferredContact', data.preferredContact);
      formData.append('howHeard', data.howHeard);
      if (data.howHeard === 'other' && data.howHeardOtherText) {
        formData.append('howHeardOther', data.howHeardOtherText);
      }
      formData.append('consent', data.consent ? 'yes' : 'no');

      // Metadados úteis
      formData.append('_subject', `Novo pedido de orçamento: ${data.projectTitle}`);
      formData.append('_replyto', data.email);
      formData.append('_template', 'table'); // Formspree: render bonito

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Obrigado! Recebemos o seu pedido. A nossa equipa entrará em contacto em breve.',
        });
        // GA4 opcional
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'generate_lead', {
            event_category: 'Form',
            event_label: 'RenoHome MultiStep Quote',
            value: 1,
          });
        }
        // Limpar
        setData(EMPTY);
        localStorage.removeItem(STORAGE_KEY);
        // Reset do form para limpar input file
        formRef.current?.reset();
        setStep(1);
      } else {
        setMessage({ type: 'error', text: 'Ocorreu um erro ao enviar. Por favor, tente novamente.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro de rede. Verifique a ligação e tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- UI ----------
  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {/* Stepper */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm font-medium text-slate-700">
          <span className={step >= 1 ? 'text-blue-700' : ''}>1. Projeto & Serviços</span>
          <span className={step >= 2 ? 'text-blue-700' : ''}>2. Imóvel & Escopo</span>
          <span className={step >= 3 ? 'text-blue-700' : ''}>3. Contacto & Envio</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all"
            style={{ width: `${progressPct}%` }}
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* PASSO 1 */}
      {step === 1 && (
        <section className="space-y-6">
          <div>
            <label htmlFor="projectTitle" className="block text-sm font-semibold mb-2">
              Título do projeto *
            </label>
            <input
              id="projectTitle"
              name="projectTitle"
              type="text"
              required
              value={data.projectTitle}
              onChange={(e) => setData((d) => ({ ...d, projectTitle: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Ex.: Renovação integral T2 em Sintra"
            />
          </div>

          <fieldset className="space-y-3">
            <legend className="block text-sm font-semibold">Serviços pretendidos *</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(
                [
                  ['kitchen', 'Cozinha'],
                  ['bathroom', 'Casa de banho'],
                  ['flooring', 'Pavimentos'],
                  ['painting', 'Pintura'],
                  ['electrical', 'Elétrica'],
                  ['plumbing', 'Canalização'],
                  ['carpentry', 'Carpintaria'],
                  ['insulation', 'Isolamento'],
                  ['windows', 'Janelas/Portas'],
                  ['outdoor', 'Exterior (terraço/jardim)'],
                  ['other', 'Outro'],
                ] as [Services, string][]
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-lg border border-slate-300 p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={data.services.includes(key)}
                    onChange={() => toggleService(key)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>

            {data.services.includes('other') && (
              <div>
                <label htmlFor="otherServiceText" className="block text-sm font-semibold mb-2">
                  Descreva o serviço
                </label>
                <input
                  id="otherServiceText"
                  type="text"
                  value={data.otherServiceText}
                  onChange={(e) => setData((d) => ({ ...d, otherServiceText: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ex.: demolição de parede, teto falso, AVAC, etc."
                />
              </div>
            )}
          </fieldset>

          <fieldset className="space-y-3">
  <legend className="block text-sm font-semibold">Tipo de imóvel *</legend>

  <div className="flex flex-wrap gap-3">
    {(
      [
        ['apartment', 'Apartamento'],
        ['house', 'Moradia'],
        ['commercial', 'Comercial'],
        ['other', 'Outro'],
      ] as [FormState['propertyType'], string][]
    ).map(([val, label]) => (
      <label key={val} className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="propertyType"
          value={val}
          checked={data.propertyType === val}
          onChange={() => setData(d => ({ ...d, propertyType: val }))}
        />
        <span className="text-sm">{label}</span>
      </label>
    ))}
  </div>

  {data.propertyType === 'other' && (
    <div className="mt-3">
      <label htmlFor="propertyOtherText" className="block text-sm font-semibold mb-2">
        Qual?
      </label>
      <input
        id="propertyOtherText"
        type="text"
        value={data.propertyOtherText}
        onChange={(e) => setData(d => ({ ...d, propertyOtherText: e.target.value }))}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  )}
</fieldset>

          <div>
            <label htmlFor="projectDescription" className="block text-sm font-semibold mb-2">
              Descrição do projeto (o mais detalhado possível) *
            </label>
            <textarea
              id="projectDescription"
              rows={5}
              required
              value={data.projectDescription}
              onChange={(e) => setData((d) => ({ ...d, projectDescription: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Ex.: Remodelação da cozinha (móveis, bancadas, canalização e elétrica), pintura integral, substituição de pavimento para vinílico..."
            />
            <p className="mt-2 text-xs text-slate-500">Mínimo de 10 caracteres.</p>
          </div>
        </section>
      )}

      {/* PASSO 2 */}
      {step === 2 && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="address" className="block text-sm font-semibold mb-2">
                Morada da obra *
              </label>
              <input
                id="address"
                type="text"
                required
                value={data.address}
                onChange={(e) => setData((d) => ({ ...d, address: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Rua/Av., nº, andar"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-semibold mb-2">
                Cidade *
              </label>
              <input
                id="city"
                type="text"
                required
                value={data.city}
                onChange={(e) => setData((d) => ({ ...d, city: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-semibold mb-2">
                Código Postal *
              </label>
              <input
                id="postalCode"
                type="text"
                required
                value={data.postalCode}
                onChange={(e) => setData((d) => ({ ...d, postalCode: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="xxxx-xxx"
              />
            </div>
            <div>
              <label htmlFor="areaM2" className="block text-sm font-semibold mb-2">
                Área (m²)
              </label>
              <input
                id="areaM2"
                type="number"
                min={0}
                value={data.areaM2}
                onChange={(e) => setData((d) => ({ ...d, areaM2: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ex.: 85"
              />
            </div>
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-semibold mb-2">
                Quartos (nº)
              </label>
              <input
                id="bedrooms"
                type="number"
                min={0}
                value={data.bedrooms}
                onChange={(e) => setData((d) => ({ ...d, bedrooms: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ex.: 2"
              />
            </div>
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-semibold mb-2">
                Casas de banho (nº)
              </label>
              <input
                id="bathrooms"
                type="number"
                min={0}
                value={data.bathrooms}
                onChange={(e) => setData((d) => ({ ...d, bathrooms: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ex.: 1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Orçamento estimado *</label>
              <select
                value={data.budgetRange}
                onChange={(e) => setData((d) => ({ ...d, budgetRange: e.target.value as FormState['budgetRange'] }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="under10k">Abaixo de 10.000€</option>
                <option value="10to25">10.000€ – 25.000€</option>
                <option value="25to50">25.000€ – 50.000€</option>
                <option value="50to100">50.000€ – 100.000€</option>
                <option value="over100">Acima de 100.000€</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Prazo desejado *</label>
              <select
                value={data.timeline}
                onChange={(e) => setData((d) => ({ ...d, timeline: e.target.value as FormState['timeline'] }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="asap">O mais rápido possível</option>
                <option value="1to3">1–3 meses</option>
                <option value="3to6">3–6 meses</option>
                <option value="6plus">6+ meses</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Acesso ao local *</label>
              <select
                value={data.siteAccess}
                onChange={(e) => setData((d) => ({ ...d, siteAccess: e.target.value as FormState['siteAccess'] }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="occupied">Imóvel habitado</option>
                <option value="empty">Imóvel vazio</option>
                <option value="undecided">Por decidir</option>
              </select>
            </div>
          </div>

          {/* <div>
            <label className="block text-sm font-semibold mb-2">Anexos (plantas, fotos, medições)</label>
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              multiple
              onChange={(e) => setData((d) => ({ ...d, files: e.target.files }))}
              className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="mt-2 text-xs text-slate-500">Máx. ~10MB por ficheiro (limites dependem do plano Formspree).</p>
          </div> */}
        </section>
      )}

      {/* PASSO 3 */}
      {step === 3 && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Nome *
              </label>
              <input
                id="name"
                type="text"
                required
                value={data.name}
                onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={data.email}
                onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                Telemóvel/WhatsApp *
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={data.phone}
                onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Preferência de contacto *</label>
              <select
                value={data.preferredContact}
                onChange={(e) =>
                  setData((d) => ({ ...d, preferredContact: e.target.value as FormState['preferredContact'] }))
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="email">Email</option>
                <option value="phone">Chamada</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Como nos conheceu?</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  ['google', 'Google'],
                  ['instagram', 'Instagram'],
                  ['friend', 'Amigo/Referência'],
                  ['repeat', 'Cliente recorrente'],
                  ['other', 'Outro'],
                ] as [FormState['howHeard'], string][]
              ).map(([val, label]) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="howHeard"
                    checked={data.howHeard === val}
                    onChange={() => setData((d) => ({ ...d, howHeard: val }))}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
            {data.howHeard === 'other' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={data.howHeardOtherText}
                  onChange={(e) => setData((d) => ({ ...d, howHeardOtherText: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ex.: Feira, Outdoor, YouTube, etc."
                />
              </div>
            )}
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="consent"
              required
              checked={data.consent}
              onChange={(e) => setData((d) => ({ ...d, consent: e.target.checked }))}
              className="mt-1"
            />
            <label htmlFor="consent" className="text-sm text-slate-700">
              Concordo em ser contactado relativamente ao meu pedido. *
              <br />
              <span className="text-xs text-slate-500">
                Os seus dados serão tratados conforme a nossa{' '}
                <a href="/privacy" className="underline hover:text-blue-700">
                  Política de Privacidade
                </a>
                .
              </span>
            </label>
          </div>

          {/* Honeypot (não mostrar a humanos) */}
          <div aria-hidden className="hidden">
            <label htmlFor="company_honeypot">Company</label>
            <input
              id="company_honeypot"
              type="text"
              autoComplete="off"
              value={data.company_honeypot || ''}
              onChange={(e) => setData((d) => ({ ...d, company_honeypot: e.target.value }))}
            />
          </div>
        </section>
      )}

      {/* Mensagens */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Botões de navegação */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <div className="flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => ((s - 1) as 1 | 2 | 3))}
              className="px-5 py-3 rounded-lg border border-slate-300 font-semibold hover:bg-slate-50"
            >
              Anterior
            </button>
          )}
          {step < 3 && (
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => setStep((s) => ((s + 1) as 1 | 2 | 3))}
              className="px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          )}
        </div>

        {step === 3 && (
          <button
            type="submit"
            disabled={!canGoNext || isSubmitting}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'A enviar…' : 'Enviar pedido'}
          </button>
        )}
      </div>

      {/* Rodapé de confiança */}
      <p className="text-xs text-slate-500">
        Guardamos automaticamente o seu progresso neste dispositivo. Ao enviar, aceita os nossos termos e política de privacidade.
      </p>
    </form>
  );
}
