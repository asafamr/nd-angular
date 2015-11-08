/* global angular */
'use strict';

(function() {
	angular.module('duck-angular')
		.controller('duckFolderSelectController',DuckFolderSelect);

	DuckFolderSelect.$inject=['duckClient','$log','$scope'];
	function DuckFolderSelect(duckClient,$log,$scope)
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
			duckClient.uiActions.fsGetWorkingDir().
			then(function(baseDir)
				{
					vm.dir=baseDir;
					//return duckClient.uiActions.fsGetDirTree(baseDir);
				});
			
			
		}


	}

})();