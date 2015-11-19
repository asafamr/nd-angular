(function (){
	'use strict';
	var myUrl = document.currentScript.src;
	angular.module('ndAngular').directive('ndPager', ['ndAngular',function(ndAngular) {
  return {
		scope: {nextText:'@',backText:'@'},
		controller:'PagerController',
		controllerAs:'vm',
		bindToController: true,
    templateUrl: myUrl.replace('.js','.html')
  };
}]);
})();
