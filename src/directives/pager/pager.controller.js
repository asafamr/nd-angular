(function() {
	'use strict';
	angular.module('ndAngular')
		.controller('PagerController',PagerController);

	PagerController.$inject=['ndAngular','ndPager'];
	function PagerController(ndAngular,ndPager)
	{
		var vm = this;



		vm.isBackEnabled=function(){return ndPager.isBackEnabled();};
		vm.isNextEnabled=function(){return ndPager.isNextEnabled();};
		vm.goBackPage=function(){return ndPager.goBackPage();};
		vm.goNextPage=function(){return ndPager.goNextPage();};

		vm.showPager=function(){return ndPager.isVisble();};
		activate();

		function activate ()
		{
			//ndPager.registerChangeCallback(updateVisibilty);
		}
		function updateVisibilty(isVis)
		{
			//vm.showPager=isVis;
		}


	}

})();
