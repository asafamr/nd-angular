(function (){
	'use strict';
	var myUrl = document.currentScript.src;
	angular.module('ndAngular')
		.directive('ndPageProgress', NDProgressDirective);

	NDProgressDirective.$inject=[];
	function NDProgressDirective()
	{
		return {
			scope: {settings:'='},
			bindToController: true,
			controllerAs:'vm',
			controller:'NDProgressController',
			templateUrl: myUrl.replace('.js','.html')
		};

	}

})();
