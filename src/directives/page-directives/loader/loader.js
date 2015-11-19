(function (){
	'use strict';
	var myUrl = document.currentScript.src;
	angular.module('ndAngular')
		.directive('ndLoader', NDLoaderDirective);

	NDLoaderDirective.$inject=['ndAngular'];
	function NDLoaderDirective(ndAngular)
	{
		return {
			scope: {},
			controller:LoaderController,
			templateUrl: myUrl.replace('.js','.html')
		};


	}

	LoaderController.$inject=['ndPager','ndAngular'];
	function LoaderController(ndPager,ndAngular)
	{
		ndPager.show();
		ndAngular.goNextPage();
	}
})();
