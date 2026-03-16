// "use client";

// import { useSearchParams } from "next/navigation";
// import { CheckCircle2 } from "lucide-react";
// import Link from "next/link";

// export default function OrderSuccessPage() {
//   const searchParams = useSearchParams();

//   // Retrieve order ID from URL query (optional)
//   const orderId = searchParams?.get("orderId") || "";

//   return (

//     <div className="flex py-20 justify-center  bg-gray-50 px-4">
//       <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
//         <div className="flex justify-center mb-4">
//           <CheckCircle2 className="text-green-500 w-16 h-16" />
//         </div>

//         <h1 className="text-2xl font-semibold mb-2 text-gray-900">
//           Thank You for Your Order!
//         </h1>
//         <p className="text-gray-600 mb-6">
//           Your order <span className="font-medium text-gray-800">#{orderId}</span> has been
//           placed successfully and will be processed shortly.
//         </p>

//         <div className="flex justify-center gap-3">
//           <Link
//             href="/products"
//             className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
//           >
//             🛒 Continue Shopping
//           </Link>

//           <Link
//             href="/orders"
//             className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
//           >
//             📦 View All Orders
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId") || "";

  return (
    <div className="flex py-20 justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="text-green-500 w-16 h-16" />
        </div>

        <h1 className="text-2xl font-semibold mb-2 text-gray-900">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 mb-6">
          Your order{" "}
          <span className="font-medium text-gray-800">#{orderId}</span> has been
          placed successfully and will be processed shortly.
        </p>

        <div className="flex justify-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            🛒 Continue Shopping
          </Link>

          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            📦 View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex py-20 justify-center bg-gray-50 px-4">
          <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
            <div className="animate-pulse">
              <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-6"></div>
            </div>
          </div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
