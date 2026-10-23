// Checkout form → validated OrderInput, or a map of field errors for the form to show next to each field.
import { get } from './db';
import type { CartLineInput } from './cart';
import { normalisePhone, validNipt, type OrderInput } from './orders';
import type { Lang } from './i18n';
import { paymentMode } from './payments';
import { pickupAvailable } from './checkout-view';

export type CheckoutValues = {
  customerType: 'individual' | 'business';
  name: string;
  phone: string;
  email: string;
  company: string;
  nipt: string;
  city: string;
  address: string;
  notes: string;
  delivery: 'courier' | 'pickup';
  payment: 'cod' | 'bank' | 'card';
  terms: boolean;
};

export type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;

const MSG = {
  sq: {
    name: 'Shkruani emrin dhe mbiemrin.',
    phone: 'Shkruani një numër telefoni shqiptar, p.sh. 069 123 4567.',
    email: 'Kontrolloni adresën e emailit, p.sh. emri@shembull.al.',
    emailNeeded: 'Për faturën e biznesit duhet një adresë emaili.',
    company: 'Shkruani emrin e shoqërisë.',
    nipt: 'NIPT-i ka 10 shenja: një shkronjë, 8 shifra dhe një shkronjë në fund, p.sh. L12345678A.',
    city: 'Zgjidhni qytetin.',
    address: 'Shkruani adresën: rrugën, numrin e pallatit ose të shtëpisë dhe një pikë referimi.',
    terms: 'Pranoni kushtet e blerjes për të vazhduar.',
    payment: 'Zgjidhni mënyrën e pagesës.',
    cardOff: 'Pagesa me kartë nuk është e disponueshme tani. Zgjidhni pagesën në dorëzim ose transfertën bankare.',
    pickupOff: 'Tërheqja te shitësi nuk është e disponueshme tani. Zgjidhni dorëzimin në adresë.',
  },
  en: {
    name: 'Enter your full name.',
    phone: 'Enter an Albanian phone number, e.g. 069 123 4567.',
    email: 'Check the email address, e.g. name@example.al.',
    emailNeeded: 'A business invoice needs an email address.',
    company: 'Enter the company name.',
    nipt: 'A NIPT is one letter, 8 digits and one letter, e.g. L12345678A.',
    city: 'Choose your city.',
    address: 'Enter the address: street, number, building or landmark.',
    terms: 'Accept the terms of sale to continue.',
    payment: 'Choose a payment method.',
    cardOff: 'Card payment is not available right now. Choose cash on delivery or bank transfer.',
    pickupOff: 'Pickup from the seller is not available right now. Choose home delivery.',
  },
} as const;

export function emptyCheckout(): CheckoutValues {
  return { customerType: 'individual', name: '', phone: '', email: '', company: '', nipt: '', city: '', address: '', notes: '', delivery: 'courier', payment: 'cod', terms: false };
}

export function readCheckout(form: FormData): CheckoutValues {
  const s = (k: string) => String(form.get(k) ?? '').trim();
  const pick = <T extends string>(k: string, allowed: readonly T[], d: T): T => (allowed.includes(s(k) as T) ? (s(k) as T) : d);
  return {
    customerType: pick('customerType', ['individual', 'business'] as const, 'individual'),
    name: s('name').slice(0, 120),
    phone: s('phone').slice(0, 30),
    email: s('email').slice(0, 160).toLowerCase(),
    company: s('company').slice(0, 160),
    nipt: s('nipt').toUpperCase().replace(/\s/g, '').slice(0, 10),
    city: s('city'),
    address: s('address').slice(0, 300),
    notes: s('notes').slice(0, 1000),
    delivery: pick('delivery', ['courier', 'pickup'] as const, 'courier'),
    payment: pick('payment', ['cod', 'bank', 'card'] as const, 'cod'),
    terms: form.get('terms') === 'on' || form.get('terms') === '1',
  };
}

export async function validateCheckout(v: CheckoutValues, lines: CartLineInput[], lang: Lang, source?: string | null): Promise<{ input?: OrderInput; errors: CheckoutErrors }> {
  const m = MSG[lang];
  const errors: CheckoutErrors = {};
  if (v.name.length < 3 || !/\s/.test(v.name)) errors.name = m.name;
  const phone = normalisePhone(v.phone);
  if (!phone) errors.phone = m.phone;
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) errors.email = m.email;
  if (v.customerType === 'business') {
    if (v.company.length < 2) errors.company = m.company;
    if (!validNipt(v.nipt)) errors.nipt = m.nipt;
    if (!v.email) errors.email = m.emailNeeded;
  }
  const city = await get<{ id: number }>('SELECT id FROM cities WHERE slug = ?', v.city);
  if (!city) errors.city = m.city;
  // The form hides these when they are off; a hand-made post must not get around that.
  if (v.payment === 'card' && paymentMode() === 'off') errors.payment = m.cardOff;
  if (v.delivery === 'pickup' && !(await pickupAvailable())) errors.delivery = m.pickupOff;
  if (v.delivery === 'courier' && v.address.length < 6) errors.address = m.address;
  if (!v.terms) errors.terms = m.terms;
  if (Object.keys(errors).length || !city || !phone) return { errors };
  return {
    errors,
    input: {
      lines,
      customerType: v.customerType,
      name: v.name,
      phone,
      email: v.email || null,
      company: v.customerType === 'business' ? v.company : null,
      nipt: v.customerType === 'business' ? v.nipt : null,
      cityId: city.id,
      address: v.delivery === 'pickup' ? (lang === 'sq' ? 'Tërheqje te shitësi' : 'Collect from seller') : v.address,
      notes: v.notes || null,
      delivery: v.delivery,
      payment: v.payment,
      lang,
      source: source ?? null,
    },
  };
}
