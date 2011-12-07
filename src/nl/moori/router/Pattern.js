/**
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