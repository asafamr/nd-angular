(function (){
	'use strict';
	var myUrl = document.currentScript.src;
	angular.module('ndAngular')
		.directive('ndPageEula', NDEulaDirective);

	NDEulaDirective.$inject=[];
	function NDEulaDirective()
	{
		return {
			scope: {settings:'='},
			bindToController: true,
			controllerAs:'vm',
			controller:'NDEulaController',
			templateUrl: myUrl.replace('.js','.html')
		};


	}

})();
