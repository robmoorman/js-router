/**
 * 
 * 
 * @author	r.moorman
 * @since 	06.12.2011
 */
var Router = function(routeHandler, errorHandler)
{
	/**
	 * Determine if the routes is active.
	 */
	this.isActive = false;
	
	/**
	 * Array collection of all added routes.
	 */
	this.routeMap = [];
	
	/**
	 * Optional callback function to set as default route callback.
	 */
	this.routeHandler = routeHandler;
	
	/**
	 * Optional callback function to apply when there is no route to match.
	 */
	this.errorHandler = errorHandler;
	
	/**
	 * The history of all matched routes.
	 */
	this.history = [];
	
	/**
	 * Active the router.
	 */
	this.activate = function()
	{
		this.isActive = true;
	};
	
	/**
	 * Deactive the router, no callbacks are applied.
	 */
	this.deactivate = function()
	{
		this.isActive = false;
	};
	
	/**
	 * 
	 * 
	 * @param callback
	 */
	this.addRoute = function(callback)
	{
		callback = callback || this.routeHandler;
		
		if(!callback)
		{
			throw("No callback argument provided and no default routeHandler set!");
		}
		
		var route = new Route(callback);
		
		this.routeMap.push(route);
		
		return route;
	};
	
	/**
	 * 
	 */
	this.sortRoutes = function(a, b)
	{
		if(a.patterns.length > b.patterns.length)
		{
			return -1;
		}
		else if(a.patterns.length == b.patterns.length)
		{
			return 0;
		}
		else
		{
			return 1;
		}
	};
	
	this.triggerRoutes = function(pathNames)
	{
		// cancel operation if the router is deactivated
		if( !this.isActive )
		{
			return;
		}
		
		this.routeMap.sort(this.sortRoutes);
		
		var matchedRoute = this.getMatchedRoute(pathNames);
		
		if(!matchedRoute || !pathNames || !pathNames.length)
		{
			if(this.errorHandler)
			{
				this.errorHandler.apply(this);
			}
		}
		else
		{
			this.history.push("/" + pathNames.join("/") + "/");
			
			matchedRoute.callback.apply(this, [matchedRoute.getPayload()]);
		}
	}
	
	this.getMatchedRoute = function(pathNames)
	{
		var i;
		var route;
		
		// iterated routes and try to match them
		for(i in this.routeMap)
		{
			route = this.routeMap[i];
			
			// match route and continue the operation
			if(route.match(pathNames))
			{
				return route;
			}
		}
		
		return null;
	};
};