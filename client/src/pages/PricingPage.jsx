import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  { name: 'Free', price: 0, features: ['Free courses', 'Community access', 'Daily quizzes'], cta: 'Get Started', popular: false },
  { name: 'Pro Monthly', price: 999, features: ['All courses', 'Live classes', 'Mock tests', 'AI tutor', 'Certificates'], cta: 'Subscribe', popular: true },
  { name: 'Pro Yearly', price: 7999, features: ['Everything in Pro', '2 months free', 'Mentorship sessions', 'Priority support'], cta: 'Best Value', popular: false },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold">Simple Pricing</h1>
        <p className="mt-4 text-slate-600">Start free, upgrade when you&apos;re ready</p>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className={`card relative ${plan.popular ? 'border-primary-500 ring-2 ring-primary-500' : ''}`}>
            {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-3 py-1 text-xs font-bold text-white">Most Popular</span>}
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="mt-4"><span className="text-4xl font-bold">₹{plan.price}</span>{plan.price > 0 && <span className="text-slate-500">/mo</span>}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" />{f}</li>
              ))}
            </ul>
            <Link to="/register" className={`mt-8 block w-full text-center ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>{plan.cta}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
