module("nl.moori.router.Pattern");

test("nameIsSet", function() {
	var name = "patterName";
	var regExp = /page/;
	var pattern = new Pattern(name, regExp);
	
	equal(name, pattern.name, "name is not set");
});

test("regularExpressionIsSet", function() {
	var name = "patterName";
	var regExp = /page/;
	var pattern = new Pattern(name, regExp);
	
	equal(regExp, pattern.regularExpression, "regularExpression is not set");
});

test("isMatchedWithRegularExpressionSet", function() {
	var name = "patterName";
	var regExp = /^page$/;
	var pattern = new Pattern(name, regExp);
	
	equal(true, pattern.match("page"), "pattern is not matched");
	equal(false, pattern.match("no-page"), "pattern is matched");
});

test("isMatchedWithNoRegularExpressionSet", function() {
	var name = "patterName";
	var pattern = new Pattern(name);
	
	equal(false, pattern.match(), "pattern is matched");
	equal(true, pattern.match("page"), "pattern is not matched");
});

test("valueIsSetWithRegularExpressionSet", function() {
	var name = "patterName";
	var regExp = /^page$/;
	var pattern = new Pattern(name, regExp);
	
	pattern.match("page");
	
	equal("page", pattern.value, "value is not set");
	
	pattern.match("no-page");
	
	equal(null, pattern.value, "value is set");
});

test("valueIsSetWithNoRegularExpressionSet", function() {
	var name = "patterName";
	var pattern = new Pattern(name);
	
	pattern.match();
	
	equal(null, pattern.value, "value is set");
	
	pattern.match("page");
	
	equal("page", pattern.value, "value is not set");
});