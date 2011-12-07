module("nl.moori.router.Router");

test("routeHandlerIsSet", function() {
	var routeHandler = function() {};
	var router = new Router(routeHandler, null);
	
	equal(router.routeHandler, routeHandler, "routeHandler is not set");
});

test("errorHandlerIsSet", function() {
	var errorHandler = function() {};
	var router = new Router(null, errorHandler);
	
	equal(router.errorHandler, errorHandler, "errorHandler is not set");
});

test("routerIsNotActive", function() {
	var router = new Router(null, null);
	
	equal(router.isActive, false, "router is active");
});

test("routerIsActivated", function() {
	var router = new Router(null, null);
	
	router.deactivate();
	router.activate();
	
	equal(router.isActive, true, "router is not active");
});

test("routerIsDeactivated", function() {
	var router = new Router(null, null);
	
	router.deactivate();
	
	equal(router.isActive, false, "router is active");
});

test("addedRouteHasValidCallback", function() {
	var routeHandler = function() {};
	var router = new Router(routeHandler, null);
	var route = router.addRoute();
	
	equal(route.callback, routeHandler, "default callback is not set");
	
	var optionalCallback = function() {};
	
	route = router.addRoute(optionalCallback);
	
	equal(route.callback, optionalCallback, "optional callback is not set");
});

test("routesAreSorted", function() {
	var routeHandler = function() {};
	var router = new Router(routeHandler, null);
	var firstRoute = router.addRoute().addPath("one").addPath("two").addPath("three");
	var secondRoute = router.addRoute().addPath("one").addPath("two");
	var thirdRoute = router.addRoute().addPath("one");
	var fourthRoute = router.addRoute();
	
	router.triggerRoutes([]);
	
	equal(router.routeMap[0], firstRoute, "first route is not in right order");
	equal(router.routeMap[1], secondRoute, "second route is not in right order");
	equal(router.routeMap[2], thirdRoute, "third route is not in right order");
	equal(router.routeMap[3], fourthRoute, "fourth route is not in right order");
});

test("routesAreTriggered", function() {
	Triggered = { router: false, error: false, optional: false };
	var routeHandler = function() { Triggered.router = true; };
	var errorHandler = function() { Triggered.error = true; };
	var optionalCallback = function() { Triggered.optional = true; };
	var router = new Router(routeHandler, errorHandler);
	
	router.activate();
	router.addRoute().addPath("router");
	router.addRoute(optionalCallback).addPath("optional");
	
	router.triggerRoutes([]);
	
	equal(Triggered.error, true, "triggerRoutes does not apply errorHandler");
	
	router.triggerRoutes(["router"]);
	
	equal(Triggered.router, true, "triggerRoutes does not apply routeHandler");
	
	router.triggerRoutes(["optional"]);
	
	equal(Triggered.optional, true, "triggerRoutes does not apply optionalCallback");
});

test("historyIsSet", function() {
	var routeHandler = function() {};
	var router = new Router(routeHandler, null);
	
	router.activate();
	router.addRoute().addPath("page");
	
	router.triggerRoutes([]);
	
	equal(router.history.length, 0, "history is set when no routes are triggered");
	
	router.triggerRoutes(["page"]);
	
	equal(router.history.length, 1, "history is not set");
});