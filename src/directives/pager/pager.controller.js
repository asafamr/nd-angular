(function() {
	'use strict';
	angular.module('ndAngular')
		.controller('PagerController',PagerController);

	PagerController.$inject=['ndPager','$scope'];
	function PagerController(ndPager,$scope)
	{
		var vm = this;
		vm.a=0;
		vm.showNext=function(){return ndPager.nextEnabled();};
		vm.showBack=function(){return ndPager.backEnabled();};
		vm.goBackPage=function(){return ndPager.goBackPage();};
		vm.goNextPage=function(){return ndPager.goNextPage();};

		$scope.$watch('ndPager.getPageNumber',function(){vm.a++;});
		activate();

		function activate ()
		{
			//ndPager.registerChangeCallback(updateVisibilty);
		}



	}

})();
