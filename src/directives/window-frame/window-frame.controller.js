/*jshint -W082 */

(function() {
	'use strict';
	angular.module('ndAngular')
		.controller('NDWindowFrameController',NDWindowFrame);

	NDWindowFrame.$inject=['$log','$scope','ndWindow'];
	function NDWindowFrame($log,$scope,ndWindow)
	{
		var vm = this;
		vm.close=ndWindow.close;
		//these 3 come from directive:
		vm.showMin=vm.showMin;
		vm.showToggleFullscreen=vm.showToggleFullscreen;
		vm.showClose=	vm.showClose;
		vm.minimize=ndWindow.minimize;
		vm.fullscreenToggle=ndWindow.fullscreenToggle;
		activate();


		function activate ()
		{
			if(typeof vm.showMin === 'undefined')vm.showMin=true;
			if(typeof vm.showToggleFullscreen === 'undefined')vm.showToggleFullscreen=true;
			if(typeof vm.showClose === 'undefined')vm.showClose=true;
		}


	}

})();
