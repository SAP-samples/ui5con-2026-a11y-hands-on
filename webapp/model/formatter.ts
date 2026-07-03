export default {
	/**
	 * Currency formatter — formats a number as €X,XXX with thousands grouping.
	 */
	formatPrice: (value: number | null | undefined): string => {
		if (value == null) {
			return "";
		}
		return "€" + value.toLocaleString();
	},

	/**
	 * Returns "was €X,XXX" for the original price when a sale price is present.
	 * Returns "" when there's no sale (so the row hides).
	 */
	formatWasPrice: (price: number, salePrice: number | null): string => {
		if (!salePrice) {
			return "";
		}
		return "was €" + price.toLocaleString();
	},

	/**
	 * Visible price = salePrice when present, otherwise the regular price.
	 */
	formatVisiblePrice: (price: number, salePrice: number | null): string => {
		return "€" + (salePrice ?? price).toLocaleString();
	},

	/**
	 * Stock → sap.ui.core.ValueState. NOTE: state-only — text/icon intentionally
	 * left out on the ObjectStatus (planted defect #7).
	 */
	formatStockState: (inStock: boolean): string => {
		return inStock ? "Success" : "Error";
	},

	/**
	 * Filters products by selected category. "All" → all products.
	 * Used to bind catalog grid items.
	 */
	filterByCategory: (products: Array<{ category: string }>, selected: string): unknown[] => {
		if (!products) {
			return [];
		}
		if (selected === "All") {
			return products;
		}
		return products.filter((p) => p.category === selected);
	},

	/**
	 * Count of items in a category. "All" → total length.
	 */
	categoryCount: (products: Array<{ category: string }>, category: string): string => {
		if (!products) {
			return "0";
		}
		if (category === "All") {
			return String(products.length);
		}
		return String(products.filter((p) => p.category === category).length);
	},

	/**
	 * "{n} products" pluralised count for the sort toolbar.
	 */
	productCountText: (products: Array<{ category: string }>, selected: string): string => {
		if (!products) {
			return "0 products";
		}
		const n = selected === "All" ? products.length : products.filter((p) => p.category === selected).length;
		return n + " products";
	}
};
