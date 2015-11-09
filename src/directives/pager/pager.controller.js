/* global angular */
'use strict';


(function() {
	angular.module('duck-angular')
		.controller('PagerController',PagerController);

	PagerController.$inject=['duckClient','duckPager'];
	function PagerController(duckClient,duckPager)
	{
		var vm = this;
		
		
		
		vm.isBackEnabled=function(){return duckPager.isBackEnabled();};
		vm.isNextEnabled=function(){return duckPager.isNextEnabled();};
		vm.goBackPage=function(){return duckPager.goBackPage();};
		vm.goNextPage=function(){return duckPager.goNextPage();};
		
		vm.showPager=function(){return duckPager.isVisble();};
		activate();

		function activate ()
		{
			//duckPager.registerChangeCallback(updateVisibilty);
		}
		function updateVisibilty(isVis)
		{
			//vm.showPager=isVis;
		}


	}

})();