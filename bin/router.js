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
};/**
 * 
 * 
 * @param callback
 * 
 * @author	r.moorman
 * @since 	06.12.2011
 */
var Route = function(callback)
{
	this.callback = callback;
	this.patterns = [];
	
	/**
	 * 
	 * 
	 * @param validator
	 * @param name
	 */
	this.addPath = function(validator, name)
	{
		var pattern;
		
		name = name || "path" + this.patterns.length.toString();
		
		if(validator instanceof RegExp)
		{
			pattern = new Pattern(name, validator);
		}
		else if((typeof validator) == "string")
		{
			pattern = new Pattern(name, new RegExp("^" + validator + "$"));
		}
		else
		{
			pattern = new Pattern(name);
		}
		
		this.patterns.push(pattern);
		
		// return route for chaining paths
		return this;
	};
	
	/**
	 * 
	 * 
	 * @param pathNames
	 */
	this.match = function(pathNames)
	{
		var i;
		var pattern;
		
		for(i in this.patterns)
		{
			pattern = this.patterns[i];
			
			if(!pattern.match(pathNames[i] ? pathNames[i].toString() : null))
			{
				return false;
			}
		}
		
		return pathNames.length ? true : false;
	};
	
	/**
	 * Get an Object with all values set per pattern.
	 */
	this.getPayload = function()
	{
		var i;
		var pattern;
		var payload = {};
		
		for(i in this.patterns)
		{
			pattern = this.patterns[i];
			
			payload[pattern.name] = pattern.value;
		}
		
		return payload;
	};
};/**
 * 
 * 
 * @author	r.moorman
 * @since 	06.12.2011
 */
var Pattern = function(name, regularExpression)
{
	/**
	 * The name of the pattern, used to retrieve it's value from the payload.
	 */
	this.name = name;
	
	/**
	 * The value of the pattern.
	 */
	this.value = null;
	
	/**
	 * The optional regular expression, used to match the pathName with.
	 */
	this.regularExpression = regularExpression;
	
	/**
	 * Determine if the pattern matches with the provided pathName.
	 * 
	 * @param pathName The pathName to match the pattern with.
	 */
	this.match = function(pathName)
	{
		if(this.regularExpression)
		{
			if(this.regularExpression.test(pathName))
			{
				this.value = pathName;
				
				return true;
			}
			else
			{
				this.value = null;
				
				return false;
			}
		}
		
		if(!pathName)
		{
			this.value = null;
			
			return false;
		}
		else
		{
			this.value = pathName;
			
			return true;
		}
	};
};