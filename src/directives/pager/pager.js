(function (){
	'use strict';
	var myUrl = document.currentScript.src;
	angular.module('ndAngular').directive('ndPager', ['ndAngular',function(ndAngular) {
  return {

		scope: {},
		controller:'PagerController',
		controllerAs:'vm',
    templateUrl: myUrl.replace('.js','.html')
  };
}]);
})();
