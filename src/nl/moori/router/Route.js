/**
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
};