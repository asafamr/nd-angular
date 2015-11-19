/*jshint -W082 */

(function() {
	'use strict';
	angular.module('ndAngular')
		.controller('NDWindowFrameController',NDWindowFrame);

	NDWindowFrame.$inject=['ndAngular','$log','$scope'];
	function NDWindowFrame(ndAngular,$log,$scope)
	{
		var vm = this;
		vm.close=close;//bound outside
		vm.showMin=typeof vm.showMin === 'undefined' || vm.showMin;
		vm.showToggleFullscreen=typeof vm.showToggleFullscreen === 'undefined' || vm.showToggleFullscreen;
		vm.showClose=typeof vm.showClose === 'undefined' || vm.showClose;
		vm.minimize=minimize;
		vm.fullscreenToggle=fullscreenToggle;
		activate();
		function minimize()
		{
			if(typeof require !== 'undefined')
				{
				var gui = require('nw.gui');
				var win = gui.Window.get();
				win.minimize();
			}
		}
		function fullscreenToggle()
		{
			if(typeof require !== 'undefined'){
			var gui = require('nw.gui');
				var win = gui.Window.get();
				win.toggleFullscreen();
			}
		}
		function close()
		{
			if(typeof require !== 'undefined'){
			var gui = require('nw.gui');
				var win = gui.Window.get();
				win.close();
			}
		}
		function activate ()
		{



		}


	}

})();
