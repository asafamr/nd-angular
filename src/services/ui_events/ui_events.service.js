(function (){
	'use strict';
	//var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular
		.module('ndAngular')
		.factory('ndEvents', NDEvents );

	NDEvents.$inject=['$rootScope','$interval','ndLogger','ndAngular'];
	function NDEvents($rootScope,$interval,ndLogger,ndAngular)
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
			ndAngular.uiActions.getNotificationsFromIdx(lastIdx).then(
				function(notificationsArray)
				{
					lastIdx+=notificationsArray.length;
					angular.forEach(notificationsArray,function(val,idx)
													{
						void idx;
						$rootScope.$emit(val.name,val);
						ndLogger.debug('sending event ' +angular.toJson(val));
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
