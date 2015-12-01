/**
window frame - css styling not included
@name ndWindowFrame directive
@description has 3 buttons that sends events to the window service - minimize, maximize toggleand close
@param {Boolean} showMin ng-show for minimize button (defualt true)
@param {Boolean} showToggleFullscreen ng-show for toggle maximize button (defualt true)
@param {Boolean} showClose ng-show for toggle maximize button (defualt true)
@example <nd-window-frame show-toggle-fullscreen="false">
**/

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
