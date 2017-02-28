/**
 * Created by sksharma.
 */
angular.module('autoMotoApp.filters', []).filter('split', function() {
        return function(input, splitChar, splitIndex) {
            // do some bounds checking here to ensure it has that index
            return input.split(splitChar)[splitIndex];
        };
    }).filter('unique', function () {

    	  return function (items, filterOn) {

    	    if (filterOn === false) {
    	      return items;
    	    }

    	    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
    	      var hashCheck = {}, newItems = [];

    	      var extractValueToCompare = function (item) {
    	        if (angular.isObject(item) && angular.isString(filterOn)) {
    	          return item[filterOn];
    	        } else {
    	          return item;
    	        }
    	      };

    	      angular.forEach(items, function (item) {
    	        var valueToCheck, isDuplicate = false;

    	        for (var i = 0; i < newItems.length; i++) {
    	          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
    	            isDuplicate = true;
    	            break;
    	          }
    	        }
    	        if (!isDuplicate) {
    	          newItems.push(item);
    	        }

    	      });
    	      items = newItems;
    	    }
    	    return items;
    	  };
}).filter('capitalize', function() {
    return function(input, all) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    };
}).filter('camelCaseString', function() {
    return function(input, all) {
        return (!!input) ? input.replace(/^[a-z]|[A-Z]/g, function(v, i) {return i === 0 ? v.toUpperCase() : " " + v.toUpperCase();}) : '';
      };
 }).filter('orderObjectBy', function(){
	 return function(input, attribute) {
		    if (!angular.isObject(input)) return input;

		    var array = [];
		    for(var objectKey in input) {
		        array.push(input[objectKey]);
		    }

		    array.sort(function(a, b){
		        a = parseInt(a[attribute]);
		        b = parseInt(b[attribute]);
		        return a - b;
		    });
		    return array;
		 };
});
