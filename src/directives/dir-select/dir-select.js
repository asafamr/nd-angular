

(function (){
	'use strict';
	var myUrl = document.currentScript.src;
	angular.module('ndAngular').directive('ndDirSelect', function() {
		return {
			scope: {
				dir: '=',
				inputClass:'@',
				buttonClass:'@',
				buttonText:'@'
			},
			bindToController:true,
			controllerAs:'vm',
			controller: 'NDDirSelectController',
			templateUrl: myUrl.replace('.js','.html')
		};});})();
