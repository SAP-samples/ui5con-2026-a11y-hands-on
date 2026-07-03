import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Sorter from "sap/ui/model/Sorter";
import JSONModel from "sap/ui/model/json/JSONModel";
import Dialog from "sap/m/Dialog";
import Fragment from "sap/ui/core/Fragment";
import Event from "sap/ui/base/Event";
import Button from "sap/m/Button";
import Link from "sap/m/Link";
import VBox from "sap/m/VBox";
import ListBinding from "sap/ui/model/ListBinding";

type Product = {
	id: number;
	name: string;
	category: string;
	price: number;
	salePrice: number | null;
	rating: number;
	inStock: boolean;
	visiblePrice?: number;
};

// Brand → name-substring matchers. Products don't carry an explicit brand
// field today; we infer brand from the marketing name.
const BRAND_NEEDLES: Record<string, ReadonlyArray<string>> = {
	Lenovo: ["ThinkPad", "Lenovo"],
	Apple: ["MacBook", "iMac", "iPad", "Apple"],
	Dell: ["Dell"],
	HP: ["HP "],
	Samsung: ["Samsung"]
};

/**
 * @namespace com.sap.a11yworkshop.controller
 */
export default class Main extends BaseController {

	private _pOrderDialog: Promise<Dialog> | null = null;

	public onInit(): void {
		// Apply initial filter once the catalog JSON model has finished loading.
		// (Component.ts calls loadData async, so /selectedCategory may not be set yet.)
		const oCatalog = this._getCatalog();
		const init = (): void => {
			// Stamp a derived `visiblePrice` on each product so the price-range
			// filter can use a normal FilterOperator.BT against a real field
			// instead of relying on a custom test fn (more portable across
			// UI5 versions, plays nicely with all FilterOperators).
			const aProducts = oCatalog.getProperty("/products") as Product[] | undefined;
			if (aProducts) {
				for (const p of aProducts) {
					p.visiblePrice = p.salePrice ?? p.price;
				}
				oCatalog.setProperty("/products", aProducts);
			}
			this._applyFiltersAndSort();
		};
		if (oCatalog && oCatalog.getProperty("/products")) {
			init();
		} else if (oCatalog) {
			oCatalog.attachRequestCompleted(init);
		}

		/*
			GAP — Exercise 7 (keyboard shortcut): Fast keyboard shortcut (Alt+O) NOT IMPLEMENTED.

			Today there is no keyboard shortcut to "Order the focused card".
			Power users want Alt+O to open the order dialog for the card that
			currently has focus, without having to tab to the button.

			FIX TODO during the workshop — pick ONE of these and wire it:

			A) DOM level (vanilla):
			   document.addEventListener("keydown", function (e) {
			       if (e.altKey && e.key.toLowerCase() === "o") {
			           e.preventDefault();
			           var card = document.activeElement.closest(".workshop-card");
			           // ... look up product id and call this.openOrderDialog(id)
			       }
			   });

			B) UI5 level (preferred when inside a UI5 control):
			   sap.ui.require(["sap/ui/core/Shortcut"], function (Shortcut) {
			       Shortcut.register(oView, "Alt+O", function () { ... });
			   });

			Talking points:
			  - DON'T attach to `keypress` (deprecated, doesn't fire for Alt combos)
			  - DO `preventDefault()` so the browser doesn't run its own Alt+O
			  - DO scope the listener (page/view) so it dies with the screen
			  - DO update visible affordance (button tooltip "Order (Alt+O)")
			    so sighted keyboard users can discover the shortcut
		*/
	}

	// ============================================================
	// Category breadcrumbs (sub-header)
	// ============================================================

	public onCategorySelect(event: Event): void {
		const oLink = event.getSource() as Link;
		// Each Link carries its category key in a core:CustomData entry
		// (see the Breadcrumbs block in Main.view.xml).
		const oData = oLink.getCustomData().find((d) => d.getKey() === "categoryKey");
		const sKey = (oData?.getValue() as string) || "All";
		this._getCatalog().setProperty("/selectedCategory", sKey);
		this._applyFiltersAndSort();
	}

	// ============================================================
	// Sidebar filters (Brand / Price / Availability)
	// ============================================================

	public onFilterChange(): void {
		// CheckBox `selected` is bound two-way to /filters/*; nothing to read
		// from the event — just rebuild the combined filter from model state.
		// If the user picks a sidebar filter while a narrow category tab is
		// active, snap back to "All" so a single-match brand (e.g. Lenovo only
		// has one ThinkPad, in Laptops) doesn't appear empty under "Monitors".
		const oCatalog = this._getCatalog();
		const oFilters = oCatalog.getProperty("/filters") as {
			brand: Record<string, boolean>;
			price: Record<string, boolean>;
			stock: Record<string, boolean>;
		};
		const bAnyFilterActive =
			Object.values(oFilters.brand).some(Boolean) ||
			Object.values(oFilters.price).some(Boolean) ||
			Object.values(oFilters.stock).some(Boolean);
		if (bAnyFilterActive && oCatalog.getProperty("/selectedCategory") !== "All") {
			oCatalog.setProperty("/selectedCategory", "All");
		}
		this._applyFiltersAndSort();
	}

	public onSortChange(): void {
		this._applyFiltersAndSort();
	}

	private _applyFiltersAndSort(): void {
		const oGrid = this.byId("idProductGrid") as VBox;
		const oBinding = oGrid.getBinding("items") as ListBinding | undefined;
		if (!oBinding) {
			return;
		}

		const oCatalog = this._getCatalog();
		const sCategory = (oCatalog.getProperty("/selectedCategory") as string) || "All";
		const oFilters = (oCatalog.getProperty("/filters") as {
			brand: Record<string, boolean>;
			price: Record<string, boolean>;
			stock: Record<string, boolean>;
		}) || { brand: {}, price: {}, stock: {} };

		const aFilters: Filter[] = [];

		// Category — single value, AND.
		if (sCategory !== "All") {
			aFilters.push(new Filter("category", FilterOperator.EQ, sCategory));
		}

		// Brand — multi-select OR within group. Products don't carry an explicit
		// `brand` field; each brand maps to a set of name substrings (e.g. Apple
		// → "MacBook", "iMac", "iPad", "Apple"). We expand the selected brands
		// into a flat OR of `Contains` filters against the product name.
		const aBrandKeys = Object.keys(oFilters.brand).filter((b) => oFilters.brand[b]);
		if (aBrandKeys.length > 0) {
			const aNameFilters: Filter[] = [];
			for (const sBrand of aBrandKeys) {
				const aNeedles = BRAND_NEEDLES[sBrand] || [];
				for (const sNeedle of aNeedles) {
					aNameFilters.push(new Filter("name", FilterOperator.Contains, sNeedle));
				}
			}
			if (aNameFilters.length > 0) {
				aFilters.push(new Filter({ filters: aNameFilters, and: false }));
			}
		}

		// Price ranges — multi-select OR within group. We OR `BT` filters on
		// the derived `visiblePrice` field (stamped at load time in onInit).
		const PRICE_RANGES: Record<string, [number, number]> = {
			"under100": [0, 99.999_999],
			"100to500": [100, 500],
			"500to1000": [500.000_001, 1000],
			"over1000": [1000.000_001, Number.MAX_SAFE_INTEGER]
		};
		const aPriceKeys = Object.keys(oFilters.price).filter((k) => oFilters.price[k]);
		if (aPriceKeys.length > 0) {
			const aPriceFilters: Filter[] = aPriceKeys.map((k) => {
				const [min, max] = PRICE_RANGES[k];
				return new Filter("visiblePrice", FilterOperator.BT, min, max);
			});
			aFilters.push(new Filter({ filters: aPriceFilters, and: false }));
		}

		// Availability — In Stock / Out of Stock are mutually OR within group;
		// selecting both is equivalent to neither (and we just skip the filter).
		const bInStock = !!oFilters.stock.in;
		const bOutStock = !!oFilters.stock.out;
		if (bInStock !== bOutStock) {
			aFilters.push(new Filter("inStock", FilterOperator.EQ, bInStock));
		}

		oBinding.filter(aFilters);

		// ---- Sort ----------------------------------------------------------
		const sSortKey = (oCatalog.getProperty("/sortKey") as string) || "relevance";
		switch (sSortKey) {
			case "price-asc":
				oBinding.sort(new Sorter("visiblePrice", false));
				break;
			case "price-desc":
				oBinding.sort(new Sorter("visiblePrice", true));
				break;
			case "rating":
				oBinding.sort(new Sorter("rating", true));
				break;
			case "relevance":
			default:
				// Original JSON order = relevance.
				oBinding.sort([]);
				break;
		}
	}

	// Per-category count formatters (kept on the controller to avoid passing
	// hard-coded values through the binding string).
	public formatLaptopCount(products: { category: string }[]): string {
		return this._countCategory(products, "Laptops");
	}
	public formatMonitorCount(products: { category: string }[]): string {
		return this._countCategory(products, "Monitors");
	}
	public formatPeripheralsCount(products: { category: string }[]): string {
		return this._countCategory(products, "Peripherals");
	}
	private _countCategory(products: { category: string }[], cat: string): string {
		if (!products) {
			return "0";
		}
		return String(products.filter((p) => p.category === cat).length);
	}

	// ============================================================
	// Card actions
	// ============================================================

	public onWishlistPress(): void {
		// no-op for the workshop
	}

	public onSharePress(): void {
		// no-op for the workshop
	}

	public onOrderPress(event: Event): void {
		const oBtn = event.getSource() as Button;
		const sProductId = oBtn.data("productId") as string;
		const oCatalog = this._getCatalog();
		oCatalog.setProperty("/lastFocusedProductId", Number(sProductId));
		void this.openOrderDialog(Number(sProductId));
	}

	// ============================================================
	// Order dialog (fragment, lazy-loaded)
	// ============================================================

	public async openOrderDialog(productId: number): Promise<void> {
		if (!this._pOrderDialog) {
			this._pOrderDialog = (Fragment.load({
				id: this.getView().getId(),
				name: "com.sap.a11yworkshop.view.OrderDialog",
				controller: this
			}) as Promise<Dialog>).then((oDialog) => {
				this.getView().addDependent(oDialog);
				return oDialog;
			});
		}
		const oDialog = await this._pOrderDialog;
		// Expose the product to the dialog via the catalog model so the
		// confirmation Text in OrderDialog.fragment.xml can bind to it.
		const oCatalog = this._getCatalog();
		const aProducts = oCatalog.getProperty("/products") as { id: number; name: string }[];
		const oProduct = aProducts.find((p) => p.id === productId);
		oCatalog.setProperty("/pendingOrder", {
			productId: productId,
			productName: oProduct ? oProduct.name : ""
		});
		oDialog.data("productId", productId);
		oDialog.open();
	}

	public onSubmitOrder(): void {
		const oDialog = this.byId("idOrderDialog") as Dialog;
		const iProductId = oDialog.data("productId") as number;
		const oCatalog = this._getCatalog();
		const aProducts = oCatalog.getProperty("/products") as { id: number; name: string }[];
		const oProduct = aProducts.find((p) => p.id === iProductId);
		if (oProduct) {
			const aOrders = oCatalog.getProperty("/orderList") as unknown[];
			aOrders.push(oProduct);
			oCatalog.setProperty("/orderList", aOrders);
			this.showOrderToast(`Added ${oProduct.name} to your order list`);
		}
		oDialog.close();
	}

	public onCancelOrder(): void {
		(this.byId("idOrderDialog") as Dialog).close();
	}

	public onOrderDialogAfterClose(): void {
		// Restore focus to the originating product card's Order button.
		const iLastId = this._getCatalog().getProperty("/lastFocusedProductId") as number | null;
		if (iLastId != null) {
			const oBtn = document.querySelector(
				`.sapMBtn[data-productId="${iLastId}"] button`
			) as HTMLElement | null;
			oBtn?.focus();
		}
	}

	// ============================================================
	// Toast / status messaging
	// ============================================================

	public showOrderToast(text: string): void {
		/*
			GAP — Exercise 6 (skill sweep): Invisible message (WCAG 4.1.3 Status Messages):
			The MessageToast below is visual only. UI5 has a dedicated control
			for SR announcement: sap.ui.core.InvisibleMessage. Handed off to the
			ui5-accessibility skill in Exercise 6 rather than hand-taught.
			Reference fix — implement announceOrderAdded:

			   sap.ui.require(["sap/ui/core/InvisibleMessage", "sap/ui/core/library"],
			     function (InvisibleMessage, coreLib) {
			         InvisibleMessage.getInstance().announce(
			             text, coreLib.InvisibleMessageMode.Polite);
			     });
		*/
		MessageToast.show(text);
		this.announceOrderAdded(text);
	}

	// Workshop FIX TODO body — left empty so attendees implement it.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public announceOrderAdded(_text: string): void {
		// TODO (Invisible message): announce to screen readers via
		// sap.ui.core.InvisibleMessage.
	}

	// ============================================================
	// Helpers
	// ============================================================

	private _getCatalog(): JSONModel {
		return this.getModel("catalog") as JSONModel;
	}
}
