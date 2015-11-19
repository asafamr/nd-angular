/*jshint -W082 */

(function() {
	'use strict';
	angular.module('ndAngular')
		.controller('NDDirSelectController',NDDirSelectController);

	NDDirSelectController.$inject=['ndAngular','$log','$scope'];
	function NDDirSelectController(ndAngular,$log,$scope)
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
		function startChoose(event)
		{
			event.target.children[0].click();
		}
		function activate ()
		{
			ndAngular.uiActions.getWorkingDir().
				then(function(baseDir)
				{
					vm.dir=baseDir;
				});


		}


	}

})();
