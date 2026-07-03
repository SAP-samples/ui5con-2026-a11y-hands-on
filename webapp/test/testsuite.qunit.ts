import type {SuiteConfiguration} from "sap/ui/test/starter/config";
export default {
	name: "QUnit test suite for the UI5 Application: com.sap.a11yworkshop",
	defaults: {
		page: "ui5://test-resources/com/sap/a11yworkshop/Test.qunit.html?testsuite={suite}&test={name}",
		qunit: {
			version: 2
		},
		sinon: {
			version: 4
		},
		ui5: {
			language: "EN",
			theme: "sap_horizon"
		},
		coverage: {
			only: ["com/sap/a11yworkshop/"],
			never: ["test-resources/com/sap/a11yworkshop/"]
		},
		loader: {
			paths: {
				"com/sap/a11yworkshop": "../"
			}
		}
	},
	tests: {
		"unit/unitTests": {
			title: "Unit tests for com.sap.a11yworkshop"
		},
		"integration/opaTests": {
			title: "Integration tests for com.sap.a11yworkshop"
		}
	}
} satisfies SuiteConfiguration;
