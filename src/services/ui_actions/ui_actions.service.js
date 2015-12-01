/**
UI actions service
@name ndActions service
@description interface for ui actions registered from the NDJS backend. Actions are injected to this service as native functions that return a promise
**/
(function (){
	'use strict';
	angular
		.module('ndAngular')
		.factory('ndActions', NDActions );

	NDActions.$inject=['$q','ndLogger','ndUiActionsMeta'];
	function NDActions($q,ndLogger,ndUiActionsMeta)
	{
    var ndActionsModule={};
    activate();
		return ndActionsModule;

    function activate()
    {
      registerUiActions(ndUiActionsMeta,ndjs.callUiAction,ndActionsModule);
    }

		function getCallUiActionClosure(uiActionName,callUiActionCallback)
		{
			return function(args)
			{
				return $q.when(callUiActionCallback(uiActionName,args)).
				catch(function(err)
			{
				ndLogger.error(uiActionName+' failed: '+err.responseText);
				return $q.reject();
			});
			};
		}



		function registerUiActions(uiActionsMeta,callUiActionCallback,to)
		{
			for(var actionName in uiActionsMeta){
				(function(){//create a unique scope for each iteration
					var action = uiActionsMeta[actionName];
					var actionFunc = getCallUiActionClosure(actionName,callUiActionCallback);
					var paramArrayStr = action.join(',');
					var functionStr = '(function ui_action_'+actionName+'('+paramArrayStr+
							'){return actionFunc(arguments);})';
					to[actionName]=eval(functionStr); // jshint ignore:line
				})();}// jshint ignore:line
		}
	}
})();
