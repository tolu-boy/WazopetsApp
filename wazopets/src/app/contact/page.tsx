export default function Contact() {
    return (
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-green-900 px-6 py-16 text-center">
          <span className="inline-block bg-green-100 text-green-900 text-xs font-medium tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-green-300 text-base font-light max-w-md mx-auto leading-relaxed">
            Have a question about an order or product? We're here to help — and we respond fast.
          </p>
        </div>
  
        <div className="max-w-2xl mx-auto px-4 py-14 space-y-5">
  
          {/* WhatsApp — primary */}
          <a
            href="https://wa.me/2347031365734"
            className="flex items-center gap-5 bg-green-500 hover:bg-green-400 transition-colors rounded-2xl p-8 group"
          >
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
              💬
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-lg">WhatsApp Us</p>
              <p className="text-green-100 text-sm font-light">+234 7031365734 · Fastest way to reach us</p>
            </div>
            <span className="text-white/60 group-hover:text-white text-xl transition-colors">→</span>
          </a>
  
          {/* Phone */}
          <a
            href="tel:+2347031365734"
            className="flex items-center gap-5 bg-white hover:shadow-md transition-shadow rounded-2xl p-8 border border-gray-100 group"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
              📞
            </div>
            <div className="flex-1">
              <p className="text-gray-900 font-semibold text-lg">Call Us</p>
              <p className="text-gray-400 text-sm font-light">+234 7031365734</p>
            </div>
            <span className="text-gray-300 group-hover:text-gray-600 text-xl transition-colors">→</span>
          </a>
  
          {/* Business hours */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-5">🕐</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Business Hours</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">Monday – Friday</p>
                <span className="text-green-800 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">9:00am – 6:00pm</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">Saturday</p>
                <span className="text-gray-400 text-sm font-medium bg-gray-50 px-3 py-1 rounded-full">Closed</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">Sunday</p>
                <span className="text-gray-400 text-sm font-medium bg-gray-50 px-3 py-1 rounded-full">Closed</span>
              </div>
            </div>
            <div className="mt-5 bg-green-50 rounded-xl px-5 py-4">
              <p className="text-green-800 text-sm font-light">
                💡 WhatsApp messages outside business hours will be replied to first thing the next working day.
              </p>
            </div>
          </div>
  
          {/* Location */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-5">📍</div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Location</h2>
            <div className="h-px bg-gray-100 mb-5" />
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              We are based in <span className="text-green-800 font-medium">Lagos, Nigeria</span> and deliver across Lagos State. 
              We do not currently have a walk-in store — all orders are placed online and delivered to your door.
            </p>
          </div>
  
        </div>
      </main>
    );
  }