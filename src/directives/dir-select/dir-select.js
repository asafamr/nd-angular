/**
directory selection input
@name ndDirSelect directive
@description directory selection <input> - consists of a text input and a button that opens a pick dialog
@param {Object} dir two way bound to dir selected
@param {String} inputClass css class for the <input> text field
@param {String} buttonClass css class for the select button
@param {String} buttonText button text

@example <nd-dir-select dir="vm.selectedDir" input-class="dir-sel-text-1" button-class="dir-sel-text-1" button-text="Choose...">
**/

(function (){
	'use strict';
	var myUrl = document.currentScript.src;
	angular.module('ndAngular').directive('ndDirSelect', function() {
		return {
			scope: {
				dir: '=',
				inputClass:'@',
				buttonClass:'@',
				buttonText:'@'
			},
			bindToController:true,
			controllerAs:'vm',
			controller: 'NDDirSelectController',
			templateUrl: myUrl.replace('.js','.html')
		};});})();
