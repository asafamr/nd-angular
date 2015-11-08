/* global angular  */
'use strict';

(function (){
	//var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular
		.module('duck-angular')
		.factory('duckModal', duckModal );
	
duckModal.$inject=['$modal','$q'];
function duckModal($modal,$q)
{
		var currentModalInstance;
		return {
			showModal	:	showModal,
			resolve:resolve,
			cancel: cancel
		};
	
	function resolve(out)
	{
		currentModalInstance.close(out);
	}
	function cancel(out)
	{
		currentModalInstance.dismiss(out);
	}
	function showModal(params)
	{
		if(currentModalInstance)
		{
			return $q.reject( 'already open' );
		}
		if(!params.hasOwnProperty('size'))
		{
			params.size='sm';
		}
		if(!params.hasOwnProperty('animation'))
		{
			params.animation=false;
		}
		if(!params.hasOwnProperty('windowClass'))
		{
			params.windowClass='modal duck-modal modal-show';
		}
		
		/*
		if(params.hasOwnProperty('id'))
		{
			var elem=$document.find(params.id);
			debugger;
			params.template=elem.html();
			delete params.id;
		}*/
		
		currentModalInstance= $modal.open(params);
		return currentModalInstance.result.finally(function(){currentModalInstance=null;});
	}
}
})();
								