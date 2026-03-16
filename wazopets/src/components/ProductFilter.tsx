import { Filter, ChevronRight, Check } from "lucide-react";

const ProductFilter: React.FC<any> = ({
  showFilters,
  categories,
  pendingCategory,
  setPendingCategory,
  pendingPriceRange,
  setPendingPriceRange,
  onApply,
  onReset,
}) => {
  return (
    <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
      <div className="bg-white rounded-2xl p-7 sticky top-24 border border-green-50 shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-7">
          <Filter size={18} className="text-green-600" />
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Filters
          </h3>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Categories
          </p>

          {[{ _id: null, name: "All" }, ...(categories ?? [])].map(
            (cat: any) => {
              const isActive = pendingCategory === cat._id;
              return (
                <button
                  key={cat._id ?? "all"}
                  onClick={() => setPendingCategory(cat._id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl mb-1 transition-all duration-150 group
                  ${
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <span
                    className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}
                  >
                    {cat.name}
                  </span>
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded-full transition-all duration-150 flex-shrink-0
                    ${
                      isActive
                        ? "bg-green-600 text-white"
                        : "text-gray-300 group-hover:text-green-300"
                    }`}
                  >
                    {isActive ? (
                      <Check size={11} strokeWidth={3} />
                    ) : (
                      <ChevronRight size={12} />
                    )}
                  </span>
                </button>
              );
            },
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-gray-100 to-transparent my-5" />

        {/* Price Range */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
            Price Range
          </p>
          <div className="flex items-center gap-2.5">
            <input
              type="number"
              value={pendingPriceRange[0]}
              onChange={(e) =>
                setPendingPriceRange([
                  Number(e.target.value),
                  pendingPriceRange[1],
                ])
              }
              placeholder="Min"
              className="w-full px-3 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-colors"
            />
            <span className="text-gray-300 font-light text-base flex-shrink-0">
              —
            </span>
            <input
              type="number"
              value={pendingPriceRange[1]}
              onChange={(e) =>
                setPendingPriceRange([
                  pendingPriceRange[0],
                  Number(e.target.value),
                ])
              }
              placeholder="Max"
              className="w-full px-3 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={onApply}
          className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 active:scale-95 text-white text-sm font-semibold tracking-wide transition-all duration-150"
        >
          Apply Filters
        </button>
        <button
          onClick={onReset}
          className="w-full py-2.5 mt-2.5 rounded-xl border border-gray-200 text-gray-400 text-sm font-medium hover:border-green-100 hover:text-gray-600 hover:bg-gray-50 transition-all duration-150"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
