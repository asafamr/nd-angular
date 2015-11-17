/*jshint -W082 */

(function() {
	'use strict';
	angular.module('ndAngular')
		.controller('ndFolderSelectController',NDFolderSelect);

	NDFolderSelect.$inject=['ndAngular','$log','$scope'];
	function NDFolderSelect(ndAngular,$log,$scope)
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
			//element.show();
			//element.focus();
			event.target.children[0].click();
			//element.hide();
		}
		function activate ()
		{
			ndAngular.uiActions.fsGetWorkingDir().
				then(function(baseDir)
				{
					vm.dir=baseDir;
					//return ndAngular.uiActions.fsGetDirTree(baseDir);
				});


		}


	}

})();
