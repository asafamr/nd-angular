/* global angular */
'use strict';
(function (){
	var myUrl = document.currentScript.src;
	angular.module('duck-angular')
		.directive('duckLoader', DuckLoaderDirective);

	DuckLoaderDirective.$inject=['duckClient'];
	function DuckLoaderDirective(duckClient)
	{
		return {
			scope: {},
			controller:LoaderController,
			templateUrl: myUrl.replace('.js','.html')
		};


	}

	LoaderController.$inject=['duckPager','duckClient'];
	function LoaderController(duckPager,duckClient)
	{
		duckPager.show();
		duckClient.goNextPage(); 
	}
})();