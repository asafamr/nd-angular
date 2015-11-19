(function() {
	'use strict';
	angular.module('ndAngular')
		.controller('NDEulaController',NDEulaController);

	NDEulaController.$inject=['$scope','ndPager'];
	function NDEulaController($scope,ndPager)
	{
		var vm=this;
		vm.settings=vm.settings;//available from config
		vm.eulaPath='etc/eula.pdf';
		vm.agreeText='I agree to these terms and conditions';
		vm.agreed=false;
		activate();


		function activate()
		{
			$scope.$watch(function(){return vm.agreed;},ndPager.nextEnabled);
		}

	}

})();
