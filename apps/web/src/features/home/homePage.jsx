import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Plane,
  PackageCheck,
  MessageCircle,
  Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-blue-50 to-white" />

        <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-4 py-16 md:grid-cols-2 sm:px-6 lg:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <ShieldCheck className="h-4 w-4" />
              Verified travelers. Safer deliveries.
            </div>

            <h1 className="max-w-xl text-5xl font-bold tracking-tight text-slate-950 md:text-6xl">
              Send packages with trusted travelers already going there.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              CarryGo connects senders with verified travelers who can carry
              baggage and packages securely, transparently, and fast.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/requests"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
              >
                Send a package
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                to="/trips"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-900 hover:bg-slate-50"
              >
                Find trips
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <Stat value="12k+" label="safe handovers" />
              <Stat value="4.8/5" label="avg rating" />
              <Stat value="92%" label="same-week matches" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <p className="font-medium">Available trip</p>
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300">
                  Verified
                </span>
              </div>

              <div className="mt-8 space-y-6">
                <RouteLine from="London" to="Lagos" />

                <div className="grid grid-cols-2 gap-3">
                  <MiniCard icon={Plane} label="Departs" value="May 18" />
                  <MiniCard icon={PackageCheck} label="Space" value="12 kg" />
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-3xl bg-blue-50 p-5">
              <p className="font-semibold text-slate-950">
                A sender wants to connect
              </p>
              <p className="mt-1 text-sm text-slate-600">
                “I need to send a laptop bag. Budget: $80.”
              </p>
              <button className="mt-4 w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white">
                Review request
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="A safer way to move items through people already traveling."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <FeatureCard
              icon={PackageCheck}
              title="Post a request"
              description="Tell travelers what you need moved, where it should go, and your budget."
            />
            <FeatureCard
              icon={Plane}
              title="Match with a traveler"
              description="Verified travelers can offer space, or senders can request an existing trip."
            />
            <FeatureCard
              icon={MessageCircle}
              title="Chat after acceptance"
              description="Private chat unlocks only after both sides agree to connect."
            />
          </div>
        </div>
      </section>

      <section id="safety" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 sm:px-6 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Safety first"
              title="Trust features designed for real-world handovers."
            />

            <div className="mt-8 space-y-4">
              {[
                "Identity verification before creating listings",
                "Connection approval before private chat",
                "Role-based evidence uploads",
                "Deal timeline from agreement to completion",
                "Ratings after completed deliveries",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="font-medium text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              <p className="text-lg font-semibold">Trusted by senders</p>
            </div>

            <blockquote className="mt-8 text-2xl font-semibold leading-relaxed">
              “I found a verified traveler in less than a day and tracked every
              handover step through the deal timeline.”
            </blockquote>

            <p className="mt-6 text-slate-400">— Amara, sender</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="text-xl font-bold text-slate-950">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function RouteLine({ from, to }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>{from}</span>
        <span>{to}</span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-3 w-3 rounded-full bg-blue-400" />
        <div className="h-0.5 flex-1 bg-slate-700" />
        <div className="h-3 w-3 rounded-full bg-green-400" />
      </div>
    </div>
  );
}

function MiniCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <Icon className="h-5 w-5 text-blue-300" />
      <p className="mt-3 text-xs text-slate-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        {eyebrow}
      </p>
      <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
