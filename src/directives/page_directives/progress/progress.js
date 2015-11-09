/* global angular */
'use strict';
(function (){
	var myUrl = document.currentScript.src;
	angular.module('duck-angular')
		.directive('duckProgress', DuckProgressDirective);

	DuckProgressDirective.$inject=[];
	function DuckProgressDirective()
	{
		return {
			scope: {settings:'='},
			bindToController: true,
			controllerAs:'vm',
			controller:'DuckProgressController',
			templateUrl: myUrl.replace('.js','.html')
		};

	}

})();