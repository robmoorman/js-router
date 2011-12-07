module("nl.moori.router.Route");

test("callbackIsSet", function() {
	var callback = function() {};
	var route = new Route(callback);
	
	equal(callback, route.callback, "callback is not set");
});

test("pathIsAdded", function() {
	var callback = function() {};
	var route = new Route(callback);
	
	var validator = /^page$/;
	var name = "page";
	
	route.addPath(validator, name);
	
	equal(validator, route.patterns[0].regularExpression, "regularExpression is not set");
	equal(name, route.patterns[0].name, "name is not set");
	
	route.addPath(validator);
	
	equal("path1", route.patterns[1].name, "default name is not set");
});

test("routeIsMatched", function() {
	var callback = function() {};
	var route = new Route(callback);
	
	equal(true, route.match(["path", "to", "page"]), "route is not matched with no paths added");
	
	route.addPath(/^page$/);
	
	equal(true, route.match(["page"]), "route is not matched with one path added");
	equal(false, route.match(["no-page"]), "route is matched with one path added");
	
	route.addPath();
	
	equal(false, route.match(["page"]), "route is matched with one path added and matched with more pathNames");
});

test("payloadIsValid", function() {
	var callback = function() {};
	var route = new Route(callback);
	
	route.addPath(null, "page").addPath();
	route.match(["one", "two"]);
	
	var payload = route.getPayload();
	
	equal("one", payload.page, "page is not set");
	equal("two", payload.path1, "default name path1 is not set");
});