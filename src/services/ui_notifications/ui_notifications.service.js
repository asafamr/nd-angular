/**
Events service
@name ndNotifications service
@description Handles notification pushed from the backend to the UI.
Uses angular broadcast to send notifications. check the job manager for notifications handling
**/
(function (){
	'use strict';
	angular
		.module('ndAngular')
		.factory('ndNotifications', NdNotifications );

	NdNotifications.$inject=['$rootScope','$interval','ndLogger','ndActions'];
	function NdNotifications($rootScope,$interval,ndLogger,ndActions)
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
			ndActions.notifications_getFromIdx(lastIdx).then(
				function(notificationsArray)
				{
					if(notificationsArray.length===0)return;
					lastIdx+=notificationsArray.length;
					angular.forEach(notificationsArray,function(val,idx)
					{
						void idx;
						$rootScope.$broadcast(val.name,val);
						//ndLogger.debug('sending notification ' +angular.toJson(val));
					});
				}).finally(function(){readyForCall=true;});
			}

		}
		function activate()
		{
			$interval(checkForEvents,200,0,false);
		}
	}
})();
