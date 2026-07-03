import Main from "com/sap/a11yworkshop/controller/Main.controller";

QUnit.module("Sample Main controller test");

QUnit.test("The Main controller class has an onCategorySelect method", function (assert) {
	assert.strictEqual(typeof Main.prototype.onCategorySelect, "function");
});
