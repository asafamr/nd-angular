(function (){
	'use strict';
	//var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular
		.module('ndAngular')
		.factory('ndEvents', NDEvents );

	NDEvents.$inject=['$rootScope','$interval','ndLogger','ndActions'];
	function NDEvents($rootScope,$interval,ndLogger,ndActions)
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
			ndActions.getNotificationsFromIdx(lastIdx).then(
				function(notificationsArray)
				{
					if(notificationsArray.length===0)return;
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
			$interval(checkForEvents,200,0,false);
		}
	}
})();
