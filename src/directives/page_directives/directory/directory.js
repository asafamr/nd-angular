(function (){
	'use strict';

	var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular.module('ndAngular').directive('ndDirectory', function() {

		return {
			scope: {settings:'='},
			bindToController: true,
			controllerAs:'vm',
			controller: 'ndDirectoryController',
			templateUrl: myUrl.replace('.js','.html')
		};});})();
