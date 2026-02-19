import Link from 'next/link';
import {
  Shield,
  CheckCircle,
  ArrowRight,
  Lock,
  TrendingUp,
  Users,
  Zap,
  Star,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-gray-900 text-lg">ZZP Compliance</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
            >
              Inloggen
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              Gratis starten
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-8">
          <Zap className="w-4 h-4" />
          Nieuw: Geautomatiseerde risicobeoordeling
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6 max-w-4xl mx-auto">
          ZZP Compliance{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            eenvoudig gemaakt
          </span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Beoordeel het risico op schijnzelfstandigheid voor uw ZZP&apos;ers en opdrachten.
          Gratis invullen, direct resultaat na indiening.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02]"
          >
            Gratis account aanmaken
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold text-lg transition-colors"
          >
            Al een account? Inloggen
          </Link>
        </div>

        <p className="text-gray-400 text-sm mt-6">
          Gratis aanmaken • Betaling alleen bij indiening • Direct resultaat
        </p>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Hoe werkt het?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              In drie stappen weet u of uw ZZP&apos;er voldoet aan de compliance vereisten.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: Users,
                title: 'Maak een account aan',
                desc: "Registreer gratis als ZZP'er of als bedrijf. Geen creditcard nodig.",
                color: 'from-blue-500 to-indigo-600',
              },
              {
                step: '2',
                icon: CheckCircle,
                title: 'Vul de vragenlijst in',
                desc: 'Beantwoord een paar korte vragen over de arbeidsrelatie. Volledig gratis.',
                color: 'from-indigo-500 to-purple-600',
              },
              {
                step: '3',
                icon: TrendingUp,
                title: 'Ontvang uw beoordeling',
                desc: 'Na eenmalige betaling van €29,99 ziet u direct uw volledige risicobeoordeling.',
                color: 'from-purple-500 to-pink-600',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Stap {item.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-6 leading-tight">
              Alles wat u nodig heeft voor ZZP compliance
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Automatische risicobeoordeling',
                  desc: 'Ons systeem analyseert de arbeidsrelatie op basis van actuele wet- en regelgeving.',
                },
                {
                  title: 'Eigen omgeving per gebruiker',
                  desc: "Zowel ZZP'ers als bedrijven krijgen hun eigen beveiligde omgeving.",
                },
                {
                  title: 'Kleurgecodeerd resultaat',
                  desc: 'Direct inzicht: groen (laag), oranje (gemiddeld) of rood (hoog) risico.',
                },
                {
                  title: 'Veilig en privé',
                  desc: 'Uw gegevens worden versleuteld opgeslagen en nooit gedeeld.',
                },
              ].map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{feature.title}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/30">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span className="font-semibold text-blue-200 text-sm">Transparante prijzen</span>
            </div>

            <div className="mb-8">
              <p className="text-white/70 text-sm mb-1">Per beoordeling</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black">€29</span>
                <span className="text-2xl font-bold text-white/80">,99</span>
              </div>
              <p className="text-blue-200 text-sm mt-2">eenmalig, direct resultaat</p>
            </div>

            <div className="space-y-3 mb-8">
              {[
                'Account aanmaken is gratis',
                'Vragenlijst invullen is gratis',
                'Betaling alleen bij indiening',
                'Direct toegang tot resultaten',
                'Onbeperkt beoordelingen bewaren',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-300 flex-shrink-0" />
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href="/register"
              className="flex items-center justify-center gap-2 bg-white text-blue-700 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all hover:scale-[1.02] shadow-lg"
            >
              Gratis starten
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Security section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Lock className="w-10 h-10 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Veiligheid en privacy voorop
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Uw gegevens worden beveiligd opgeslagen. Betalingen verlopen veilig via Stripe.
            Wij voldoen aan de AVG en verwerken uw gegevens uitsluitend voor het leveren van
            onze dienst.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-black text-gray-900 mb-4">
          Klaar om te starten?
        </h2>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">
          Maak vandaag nog gratis een account aan en zet uw eerste stap naar volledige
          ZZP compliance.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02]"
        >
          Gratis account aanmaken
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">ZZP Compliance</span>
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} ZZP Compliance. Alle rechten voorbehouden.
          </p>
        </div>
      </footer>
    </div>
  );
}
