/* global angular document */
'use strict';

(function (){
	var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular.module('duck-angular').directive('duckModal', duckModal );

duckModal.$inject=[];
function duckModal()
{
		return {
			scope: {title:'@',flags:'@'},
			controllerAs:'modalVm',
			bindToController:true,
			controller: 'ModalController',
			transclude: true,
			templateUrl: myUrl.replace('.js','.html')
		};
}
})();
								