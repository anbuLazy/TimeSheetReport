/**
 * Created by sksharma.
 */

angular.module('autoMotoApp.directives', [])
    .directive('helloWorld', [function () {
        return {
        	restrict: 'AE',
            replace: 'true',
            template: '<h3>Hello World!!</h3>'
        };
    }]).directive("sks", function(){
    	// requires an isolated model
	    return {
	     // restrict to an attribute type.
	     restrict: 'A',
	    // element must have ng-model attribute.
	     require: 'ngModel',
	     link: function($scope, $element, $attrs, ngModel) {
             $scope.$watch($attrs.ngModel, function(value) {
                 var isValid = false;
                 try {
 					JSON.parse(value);
 					isValid = true;
 				} catch(e) {
 					console.log("Invalid JSON");
 				}
                 
                ngModel.$setValidity($attrs.ngModel, isValid);
             });
         }
    };
  });
