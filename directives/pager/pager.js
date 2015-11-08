'use strict';
(function (){
	var myUrl = document.currentScript.src;
angular.module('duck-angular').directive('duckPager', ['duckClient',function(duck) {
	
  return {

		scope: {},
		controller:'PagerController',
		controllerAs:'vm',
    templateUrl: myUrl.replace('.js','.html')
  };
}]);
})();