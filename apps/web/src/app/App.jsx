export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">
              CarryGo
            </p>
            <h1 className="mt-1 text-2xl font-bold">Operations</h1>
          </div>
          <button className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">
            New request
          </button>
        </header>

        <div className="grid flex-1 gap-6 py-8 lg:grid-cols-[220px_1fr]">
          <nav className="flex gap-2 lg:flex-col">
            {['Requests', 'Trips', 'Deals', 'Messages'].map((item) => (
              <button
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700"
                key={item}
              >
                {item}
              </button>
            ))}
          </nav>

          <section className="rounded-md border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-semibold">Active requests</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                ['Berlin to Lisbon', '2 bags', 'Awaiting traveler match'],
                ['Paris to Accra', '1 suitcase', 'Deal in review'],
                ['Madrid to Lagos', 'Documents', 'Message pending']
              ].map(([route, cargo, status]) => (
                <article
                  className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                  key={route}
                >
                  <h3 className="font-semibold">{route}</h3>
                  <p className="text-sm text-slate-600">{cargo}</p>
                  <span className="rounded-md bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    {status}
                  </span>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
