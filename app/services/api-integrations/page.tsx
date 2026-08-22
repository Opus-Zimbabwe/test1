import ServicePageTemplate, { ServicePageData } from '@/components/ServicePageTemplate'

const data: ServicePageData = {
  eyebrow:       'API & System Integrations',
  headline:      'Connect the systems your business already uses.',
  intro:         'Stop switching between tools and re-entering data. We connect your payment gateways, CRMs, ERPs and APIs so information flows automatically.',
  cta:           'Discuss an Integration',
  sectionTitle:  'Connect your digital ecosystem',
  body:          'We integrate payment gateways, APIs and business platforms so information can move between systems without manual effort — reducing errors and saving your team hours every week.',
  items:         ['Paynow Integration', 'EcoCash Integration', 'Stripe Integration', 'Google APIs', 'Microsoft APIs', 'CRM Integrations', 'ERP Integrations', 'Custom Multi-System Integration'],
  price:         'From $100',
  process:       'Understand → Connect → Configure → Test → Secure → Deploy → Monitor',
  who:           'Businesses with multiple digital tools that should talk to each other',
  image:         '/images/hero-api-integrations.png',
  showIntegrations: true,
}

export default function Page() {
  return <ServicePageTemplate data={data} />
}
