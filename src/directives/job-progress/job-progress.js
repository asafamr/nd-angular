

(function (){
	'use strict';
	var myUrl = document.currentScript.src;
	angular.module('ndAngular').directive('ndJobProgress', function() {
		return {
			scope: {
				dir: '=',
				inputClass:'@',
				buttonClass:'@',
				buttonText:'@'
			},
			bindToController:true,
      transclude: true,
			controllerAs:'vm',
			controller: 'NDJobProgressController',
			template: '<ng-transclude></ng-transclude>'
		};});})();
