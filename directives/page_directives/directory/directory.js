/* global angular document */
'use strict';

(function (){
	var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular.module('duck-angular').directive('duckDirectory', function() {

		return {
			scope: {settings:'='},
			bindToController: true,
			controllerAs:'vm',
			controller: 'DirectoryController',
			templateUrl: myUrl.replace('.js','.html')
		};});})();
																												