/* global angular document */
'use strict';

(function (){
	var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular.module('duck-angular').directive('duckFolderSelect', function() {
		return {
			scope: {
				dir: '=dir'
			},
			bindToController:true,
			controllerAs:'vm',
			controller: 'duckFolderSelectController',
			templateUrl: myUrl.replace('.js','.html')
		};});})();
																												