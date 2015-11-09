/* global angular  */
'use strict';

(function (){
	//var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular
		.module('duck-angular')
		.factory('duckEvents', duckEvents );

	duckEvents.$inject=['$rootScope','$interval','duckLogger','duckClient'];
	function duckEvents($rootScope,$interval,duckLogger,duckClient)
	{
		var lastIdx=0;
		var readyForCall=true;
		activate();
		return {
			
		};
		 
		function checkForEvents()
		{
			if(readyForCall)
			{
				readyForCall=false;
			duckClient.uiActions.getNotificationsFromIdx(lastIdx).then(
				function(notificationsArray)
				{
					lastIdx+=notificationsArray.length;
					angular.forEach(notificationsArray,function(val,idx)
													{
						void idx;
						$rootScope.$emit(val.name,val);
						duckLogger.debug('sending event ' +angular.toJson(val));
					});
					readyForCall=true;
				});
			}
			 
		}
		function activate()
		{
			$interval(checkForEvents,200);
		}
	}
})();
