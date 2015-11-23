/*jshint -W082 */

(function() {
	'use strict';
	angular.module('ndAngular')
		.controller('NDDirSelectController',NDDirSelectController);

	NDDirSelectController.$inject=['ndActions','$log','$scope'];
	function NDDirSelectController(ndActions,$log,$scope)
	{
		var vm = this;
		vm.dir=vm.dir;//bound outside
		vm.dialogPicked=dialogPicked;
		vm.startChoose=startChoose;

		activate();

		function dialogPicked(element)//from DOM - not angular
		{

			if(element && element.files && element.files[0])
			{
				vm.dir=element.files[0].path;
				$scope.$apply();// eslint-disable-line angular/ng_controller_as
			}
		}
		function startChoose(toClick)
		{
			if(typeof require ==='undefined')
			{
				window.alert('directory selection disabled in browser debug mode');
				return;
			}
			toClick.click();
		}
		function activate ()
		{



		}


	}

})();
