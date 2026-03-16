export default function RefundPolicy() {
    return (
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-green-900 px-6 py-16 text-center">
          <span className="inline-block bg-green-100 text-green-900 text-xs font-medium tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
            WazoPets Policy
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Returns & Refund Policy
          </h1>
          <p className="text-green-300 text-base font-light max-w-md mx-auto leading-relaxed">
            We stand behind every product. Your satisfaction — and your animal's happiness — is our priority.
          </p>
        </div>
  
        <div className="max-w-2xl mx-auto px-4 py-14 space-y-5">
  
          {/* Our Promise */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-5">✅</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Our Promise to You</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              We want you to be <span className="text-green-800 font-medium">completely happy with your order</span>. 
              If your product arrives damaged or incorrect, contact us within{" "}
              <span className="text-green-600 font-medium">24 hours of delivery</span> with a photo of the item. 
              We will arrange a replacement or full refund —{" "}
              <span className="text-green-600 font-medium">no stress</span>.
            </p>
          </div>
  
          {/* Perishables */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-5">🌾</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Animal Feed & Perishables</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              For perishable items like animal feed, supplements, and fresh products —{" "}
              <span className="text-green-600 font-medium">please inspect your order before the rider leaves</span>. 
              Once the rider departs, we are unable to process claims for perishable items.
            </p>
          </div>
  
          {/* How it works */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-5">📋</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">How to Make a Claim</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <div className="space-y-5">
              {[
                { step: "1", title: "Take a photo", desc: "Photograph the damaged or incorrect item clearly" },
                { step: "2", title: "Contact us within 24 hours", desc: "Send us the photo via WhatsApp with your order details" },
                { step: "3", title: "We sort it out", desc: "We'll arrange a replacement or full refund within 24–48 hours" },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4 items-start">
                  <div className="w-7 h-7 rounded-full bg-green-900 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {step}
                  </div>
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{title}</p>
                    <p className="text-gray-400 text-sm font-light">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Contact CTA */}
          <div className="bg-green-900 rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Need Help? We're Here 🐾</h2>
            <p className="text-green-400 text-sm font-light mb-8">Reach us directly — we respond fast +234 7031365734</p>
            <a
              href="https://wa.me/2347031365734"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-medium text-sm px-8 py-4 rounded-full transition-colors"
            >
              <span>💬</span> WhatsApp Us
            </a>
            
          </div>
  
          <p className="text-center text-gray-400 text-xs pt-2">
            This policy applies to all orders placed on wazopets.com · Last updated 2024
          </p>
  
        </div>
      </main>
    );
  }