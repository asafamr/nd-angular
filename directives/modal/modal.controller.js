/* global angular */
'use strict';


(function() {
	angular.module('duck-angular')
		.controller('ModalController',ModalController);

	ModalController.$inject=['duckClient','duckModal'];
	function ModalController(duckClient,duckModal)
	{
		var vm = this;
		
		vm.resolve=duckModal.resolve;
		vm.cancel=duckModal.cancel;
		
		//vm.showAndReport=showAndReport;
	
		activate();
		function activate ()
		{
			
		}

	}

})();