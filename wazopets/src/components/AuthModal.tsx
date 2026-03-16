import { X } from "lucide-react";
import { SignInForm } from "../SignInForm";

// interface AuthModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

export function AuthModal() {
// { isOpen, onClose }: AuthModalProps
  // if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        // onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* Modal Content */}
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Welcome Back!{" "}
              </h3>
              <p className="text-gray-600 mt-1">
                Sign in to start shopping for your pets
              </p>
            </div>
            <button
              // onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <SignInForm />

          <div className="mt-6 pt-6 ">
            <p className="text-center text-sm text-gray-600">
              New to WazoPets?{" "}
              <span className="text-green-600 font-semibold">
                Create an account to get started
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
