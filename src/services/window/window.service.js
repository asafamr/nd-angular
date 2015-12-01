/**
Window service
@name ndWindow service
@description handles winodow minimization, maximization and close
**/
(function (){
	'use strict';
	//var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular
		.module('ndAngular')
		.factory('ndWindow', NDEvents );

	NDEvents.$inject=[];
	function NDEvents()
	{
		activate();
		return {
      close:close,
      minimize:minimize,
      toggleFullscreen:toggleFullscreen
		};
    function activate()
		{
		}

		/**
		* @description closes the window. on browser debug mode does nothing
		**/
		function close()
    {
      if(typeof require !== 'undefined'){
			var gui = require('nw.gui');
				var win = gui.Window.get();
				win.close();
			}
			else {
				window.alert('close disabled in browser debug mode');
			}
    }
		/**
		* @description minimize the window. on browser debug mode does nothing
		**/
    function minimize()
		{
			if(typeof require !== 'undefined')
				{
				var gui = require('nw.gui');
				var win = gui.Window.get();
				win.minimize();
			}
			else {
				window.alert('minimize disabled in browser debug mode');
			}
		}
		/**
		* @description toggle window maximization. on browser debug mode does nothing
		**/
		function toggleFullscreen()
		{
			if(typeof require !== 'undefined'){
			var gui = require('nw.gui');
				var win = gui.Window.get();
				win.toggleFullscreen();
			}
			else {
				window.alert('fullscreen toggle disabled in browser debug mode');
			}
		}

	}
})();
