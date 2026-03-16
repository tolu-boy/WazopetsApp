export default function About() {
    return (
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-green-900 px-6 py-16 text-center">
          <span className="inline-block bg-green-100 text-green-900 text-xs font-medium tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
            Our Story.
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About WazoPets
          </h1>
          <p className="text-green-300 text-base font-light max-w-md mx-auto leading-relaxed">
            Nigeria's one-stop store for pets and livestock — because your animals deserve better.
          </p>
        </div>
  
        <div className="max-w-2xl mx-auto px-4 py-14 space-y-5">
  
          {/* Story */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-5">🐾</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Why We Started..</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <div className="space-y-4 text-gray-500 text-sm font-light leading-relaxed">
              <p>
                We noticed something that didn't make sense in Nigeria. Pet owners were shopping in one place, 
                poultry farmers in another, and livestock keepers had nowhere reliable to go at all. 
                The market was fragmented, quality was inconsistent, and finding trusted supplies was a frustrating experience.
              </p>
              <p>
                So we built <span className="text-green-800 font-medium">WazoPets</span> — a single, trusted destination 
                for every Nigerian who keeps animals, whether that's a dog in a Lagos apartment, 
                a flock of chickens in Ogun State, or cattle on a farm.
              </p>
              <p>
                We source quality-verified products, deliver fast across Lagos, and treat every customer 
                the way we'd want to be treated — with honesty, speed, and no stress.
              </p>
            </div>
          </div>
  
          {/* Mission */}
          <div className="bg-green-900 rounded-2xl p-8 text-center">
            <p className="text-green-400 text-xs tracking-widest uppercase font-medium mb-4">Our Mission</p>
            <p className="text-white text-xl md:text-2xl font-light leading-relaxed max-w-lg mx-auto">
              "To make quality animal supplies accessible to every Nigerian — from pet owners to livestock farmers."
            </p>
          </div>
  
          {/* What we offer */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-5">🛒</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What We Offer</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🐕", label: "Dog Food & Care" },
                { icon: "🐈", label: "Cat Food & Supplies" },
                { icon: "🐓", label: "Poultry Supplies" },
                { icon: "🐄", label: "Livestock Feed" },
                { icon: "💊", label: "Health & Supplements" },
                { icon: "🦜", label: "Exotic Animal Care" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-xl">{icon}</span>
                  <p className="text-gray-700 text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* Values */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-5">💛</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What We Stand For</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <div className="space-y-5">
              {[
                { icon: "✅", title: "Quality You Can Trust", desc: "We only stock products we'd use for our own animals. No compromises." },
                { icon: "🚚", title: "Fast Lagos Delivery", desc: "Order today, receive within 1–2 days across Lagos State." },
                { icon: "💬", title: "Real Human Support", desc: "WhatsApp us anytime during business hours. A real person always responds." },
                { icon: "🤝", title: "Honest Pricing", desc: "No hidden fees. What you see is what you pay." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-4 items-start">
                  <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{title}</p>
                    <p className="text-gray-400 text-sm font-light leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* CTA */}
          <div className="bg-green-900 rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Ready to Shop? 🐾</h2>
            <p className="text-green-400 text-sm font-light mb-8">Quality supplies, fast Lagos delivery, no stress.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a
                href="/products"
                className="inline-flex items-center gap-2 bg-white text-green-900 hover:bg-green-50 font-medium text-sm px-8 py-4 rounded-full transition-colors"
              >
                Browse Products
              </a>
              <a
                href="https://wa.me/2347031365734"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-medium text-sm px-8 py-4 rounded-full transition-colors"
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>
  
        </div>
      </main>
    );
  }