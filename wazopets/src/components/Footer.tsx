import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🐾</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">WazoPets</h3>
                <p className="text-xs text-gray-400">Your Animal Needs Store</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for all animal needs across Nigeria. Premium nutrition, supplies, and care products for pets, livestock, poultry, and exotic animals. Quality products, fast delivery, and expert advice.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/about" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  All Products
                </a>
              </li>
             
              <li>
                <a href="#" className="hover:text-white">
                  Livestock Feed
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Health & Care
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Accessories & Toys
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/shipping-info" className="hover:text-white">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/refund-policy" className="hover:text-white">
                  Returns & Exchanges
                </a>
              </li>
              
              <li>
                <a href="#" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/orders" className="hover:text-white">
                  Track Your Order
                </a>
              </li>

              <li>
                <a href="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span>+234 7031365734</span>
              </div>
              {/* <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span>support@wazopets.com</span>
              </div> */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-1" />
                <div>
                  <p>Lagos: Fadeyi,Yaba </p>
                  {/* <p>Abuja: Wuse 2</p> */}
                  
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="font-medium mb-2">Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-green-600"
                />
                <button className="bg-green-600 px-4 py-2 rounded-r-lg hover:bg-green-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 WazoPets Nigeria. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
