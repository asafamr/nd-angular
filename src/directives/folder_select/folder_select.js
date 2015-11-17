

(function (){
	'use strict';
	var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular.module('ndAngular').directive('NDFolderSelect', function() {
		return {
			scope: {
				dir: '=dir'
			},
			bindToController:true,
			controllerAs:'vm',
			controller: 'NDFolderSelectController',
			templateUrl: myUrl.replace('.js','.html')
		};});})();
