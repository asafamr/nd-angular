(function (){
	'use strict';
	//var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular
		.module('ndAngular')
		.factory('ndUIActionsRegister', NDUIActionsRegister );

	NDUIActionsRegister.$inject=['$q','ndLogger'];
	function NDUIActionsRegister($q,ndLogger)
	{

		return {
			registerUiActions	:	registerUiActions
		};


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
