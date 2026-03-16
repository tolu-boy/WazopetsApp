export default function ShippingInfo() {
    return (
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-green-900 px-6 py-16 text-center">
          <span className="inline-block bg-green-100 text-green-900 text-xs font-medium tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
            Delivery Information
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Shipping & Delivery
          </h1>
          <p className="text-green-300 text-base font-light max-w-md mx-auto leading-relaxed">
            We deliver your animal supplies safely across Lagos — by rider or vehicle depending on your order.
          </p>
        </div>
  
        <div className="max-w-2xl mx-auto px-4 py-14 space-y-5">
  
          {/* Delivery time */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-5">⏱️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Delivery Time</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <div className="bg-green-50 rounded-xl px-6 py-5 text-center mb-5">
              <p className="text-green-900 text-3xl font-bold">5 – 7</p>
              <p className="text-green-700 text-sm font-medium">Working Days</p>
            </div>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              Orders are processed and dispatched within <span className="text-green-800 font-medium">1 business day</span> of confirmed payment.
              Delivery takes <span className="text-green-800 font-medium">5–7 working days</span> depending on your location within Lagos.
              You will receive a WhatsApp update once your order is on its way.
            </p>
          </div>
  
          {/* How we deliver */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-5">🚚</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">How We Deliver</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🏍️</div>
                <div>
                  <p className="text-gray-800 text-sm font-medium">Rider Delivery</p>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">
                    Smaller orders like pet accessories, supplements, and light supplies are delivered by our dispatch riders.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🚐</div>
                <div>
                  <p className="text-gray-800 text-sm font-medium">Vehicle Delivery</p>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">
                    Heavier or bulkier items like livestock feed, large bags of animal food, and multiple-item orders are delivered by vehicle.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 bg-gray-50 rounded-xl px-5 py-4">
              <p className="text-gray-500 text-sm font-light">
                💡 We choose the delivery method automatically based on your order. No action needed from you.
              </p>
            </div>
          </div>
  
          {/* Delivery fees */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-5">💳</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Delivery Fees</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <p className="text-gray-500 text-sm font-light leading-relaxed mb-5">
              Delivery fees vary depending on your location within Lagos and the size of your order.
              The exact fee will be calculated and shown at checkout before you pay.
            </p>
            <div className="bg-green-50 rounded-xl px-5 py-4">
              <p className="text-green-800 text-sm font-medium">Not sure about the fee for your area?</p>
              <p className="text-green-700 text-xs font-light mt-1">WhatsApp us with your location and we'll give you an estimate before you order.</p>
            </div>
          </div>
  
          {/* Where we deliver */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-5">📍</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Where We Deliver</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <p className="text-gray-500 text-sm font-light leading-relaxed mb-4">
              We currently deliver <span className="text-green-800 font-medium">across Lagos State</span> including
              Victoria Island, Lekki, Ikeja, Surulere, Yaba, Ajah, Ikorodu, and surrounding areas.
            </p>
            <div className="bg-green-50 rounded-xl px-5 py-4">
              <p className="text-green-800 text-sm font-medium">🚀 Expanding soon</p>
              <p className="text-green-700 text-xs font-light mt-1">Abuja and Port Harcourt delivery coming soon. WhatsApp us to be notified.</p>
            </div>
          </div>
  
          {/* Important notes */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-2xl mb-5">📌</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Important Notes</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <div className="space-y-3">
              {[
                "Delivery days are mostly working days — but weekends and public holidays are included.",
                "You will receive a WhatsApp message with your delivery update once your order is dispatched.",
                "Please ensure someone is available to receive the order at your delivery address.",
                "For perishable items like animal feed, please inspect before the rider or driver leaves.",
                "Delivery times may be longer during peak periods or bad weather.",
              ].map((note, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* CTA */}
          <div className="bg-green-900 rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Questions About Delivery? 🐾</h2>
            <p className="text-green-400 text-sm font-light mb-8">We respond fast on WhatsApp</p>
            <a
              href="https://wa.me/2347031365734"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-medium text-sm px-8 py-4 rounded-full transition-colors"
            >
              <span>💬</span> WhatsApp Us
            </a>
          </div>
  
          <p className="text-center text-gray-400 text-xs pt-2">
            Delivery times are estimates and may vary during peak periods or public holidays.
          </p>
  
        </div>
      </main>
    );
  }