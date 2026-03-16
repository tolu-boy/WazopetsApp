export default function PrivacyPolicy() {
    return (
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-green-900 px-6 py-16 text-center">
          <span className="inline-block bg-green-100 text-green-900 text-xs font-medium tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-green-300 text-base font-light max-w-md mx-auto leading-relaxed">
            We respect your privacy and are committed to protecting your personal information.
          </p>
        </div>
  
        <div className="max-w-2xl mx-auto px-4 py-14 space-y-5">
  
          {/* What we collect */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-5">📋</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What We Collect</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <p className="text-gray-500 text-sm font-light leading-relaxed mb-4">
              When you place an order or create an account on WazoPets, we collect the following information:
            </p>
            <div className="space-y-3">
              {[
                { icon: "👤", label: "Full name" },
                { icon: "📍", label: "Delivery address" },
                { icon: "📞", label: "Phone number" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-lg">{icon}</span>
                  <p className="text-gray-700 text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* How we use it */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-5">✅</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">How We Use Your Information</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <div className="space-y-3">
              {[
                "To process and deliver your orders to the correct address.",
                "To contact you via WhatsApp or phone with delivery updates.",
                "To resolve any issues with your order such as damages or incorrect items.",
                "To improve our service and product offerings.",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* We do not */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-2xl mb-5">🚫</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What We Never Do</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <div className="space-y-3">
              {[
                "We never sell your personal information to third parties.",
                "We never share your details with advertisers or marketing companies.",
                "We never contact you for reasons unrelated to your order without your consent.",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* Third parties */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-5">🤝</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Third Party Services</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              We use trusted third-party services to operate our store, including payment processors and delivery partners. 
              These services only receive the information they need to complete their specific function — for example, 
              a delivery partner only receives your name, phone number, and address. They are not permitted to use 
              your data for any other purpose.
            </p>
          </div>
  
          {/* Data security */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-5">🔒</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Your Data is Safe</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              We take reasonable steps to protect your personal information from unauthorised access, loss, or misuse. 
              Your data is stored securely and only accessible to WazoPets staff who need it to fulfil your order.
            </p>
          </div>
  
          {/* Your rights */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-5">👤</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Your Rights</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              You have the right to request access to the personal information we hold about you, 
              ask us to correct any inaccurate information, or request that we delete your data. 
              To make any of these requests, simply contact us on WhatsApp.
            </p>
          </div>
  
          {/* CTA */}
          <div className="bg-green-900 rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Questions About Your Privacy? 🐾</h2>
            <p className="text-green-400 text-sm font-light mb-8">We're happy to explain anything — reach us on WhatsApp</p>
            <a
              href="https://wa.me/2347031365734"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-medium text-sm px-8 py-4 rounded-full transition-colors"
            >
              <span>💬</span> WhatsApp Us
            </a>
          </div>
  
          <p className="text-center text-gray-400 text-xs pt-2">
            Last updated 2024 · WazoPets Nigeria
          </p>
  
        </div>
      </main>
    );
  }
  