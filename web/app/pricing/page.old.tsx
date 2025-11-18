import { Suspense } from 'react';

const TIERS = [
  {
    key: 'STARTER',
    name: 'Starter',
    price: '$25 / mo',
    role: process.env.NEXT_PUBLIC_ROLE_STARTER,
    features: [
      'Core signals (selected pairs)',
      'Discord role: Starter',
    ],
  },
  {
    key: 'PRO',
    name: 'Pro',
    price: '$49 / mo',
    role: process.env.NEXT_PUBLIC_ROLE_PRO,
    features: [
      'All signals + advanced metrics',
      'Discord role: Pro',
    ],
  },
  {
    key: 'TEAM',
    name: 'Team',
    price: '$149 / mo',
    role: process.env.NEXT_PUBLIC_ROLE_TEAM,
    features: [
      'Team seats + priority support',
      'Discord role: Team',
    ],
  },
  {
    key: 'LIFETIME',
    name: 'Lifetime Access',
    price: '$999 one-time',
    role: process.env.NEXT_PUBLIC_ROLE_FOUNDER,
    features: [
      'Lifetime updates',
      'Discord role: Founder',
    ],
  },
] as const;

async function createCheckout(plan: string) {
  'use server';
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/checkout`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Checkout failed: ${res.status} ${text}`);
  }
  const { url } = await res.json();
  return url as string;
}

function TierCard({ t }: { t: typeof TIERS[number] }) {
  return (
    <form action={async () => {
      'use server';
      const url = await createCheckout(t.key);
      return Response.redirect(url);
    }}>
      <div className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur-sm">
        <h3 className="text-xl font-semibold">{t.name}</h3>
        <p className="mt-2 text-2xl">{t.price}</p>
        <p className="mt-1 text-sm text-white/60">Discord Role: {t.role}</p>
        <ul className="mt-4 space-y-2 text-sm">
          {t.features.map((f) => <li key={f}>• {f}</li>)}
        </ul>
        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-400 py-2 font-medium text-black"
        >
          Continue with Stripe
        </button>
      </div>
    </form>
  );
}

export default function PricingPage() {
  return (
    <main className="container mx-auto px-4 py-14">
      <h1 className="text-4xl font-bold">Pricing</h1>
      <p className="text-white/70 mt-2">Choose a plan, get the matching Discord role instantly after purchase (webhooks in Phase 2).</p>
      <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((t) => <TierCard key={t.key} t={t} />)}
      </div>
    </main>
  );
}
