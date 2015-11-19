

(function() {
	'use strict';
	angular.module('ndAngular')
		.controller('NDPageDirController',DirectoryController);

	DirectoryController.$inject=['ndAngular','$scope','$q'];
	function DirectoryController(ndAngular,$scope,$q)
	{
		var vm = this;
		vm.dir='';
		vm.caption="Installation path:";
		var settingName=vm.settings.hasOwnProperty('sets')? vm.settings.sets:'installDir';
		var sendingSettingPromise=$q.when();//so we don't send before we finished last

		activate();


		function activate ()
		{

			$scope.$watch(function () {
				return vm.dir;
			},function(){
				sendingSettingPromise=sendingSettingPromise.then(function(){ndAngular.uiActions.setUserSettings(settingName,vm.dir);});
										});

		}

	}

})();
