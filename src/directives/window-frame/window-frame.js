

(function (){
	'use strict';
	var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular.module('ndAngular').directive('ndWindowFrame', function() {
		return {
			scope: {
				showMin:'=',
				showToggleFullscreen:'=',
				showClose:'='
			},
			bindToController:true,
			controllerAs:'vm',
			controller: 'NDWindowFrameController',
			templateUrl: myUrl.replace('.js','.html')
		};});})();
