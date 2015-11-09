/* global angular  */
'use strict';

(function (){
	//var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular
		.module('duck-angular')
		.factory('duckUIActionsRegister', duckUIActionsRegister );

	duckUIActionsRegister.$inject=['$q'];
	function duckUIActionsRegister($q)
	{

		return {
			registerUiActions	:	registerUiActions
		};


		function getCallUiActionClosure(uiActionName,callUiActionCallback)
		{
			return function(args)
			{
				return $q(function(resolve, reject) {
					callUiActionCallback(
						uiActionName,args,function(err,succ)
						{
							if(err)
							{
								//TODO:log error
								reject(err);
								return;
							}
							resolve(succ);
							return;
						});
				});
			};
		}
		
		

		function registerUiActions(uiActionsMeta,callUiActionCallback,to)
		{
			for(var actionName in uiActionsMeta){
				(function(){//create a unique scope for each iteration 
					var action = uiActionsMeta[actionName];
					var actionFunc = getCallUiActionClosure(action.name,callUiActionCallback);
					var paramArrayStr = action.paramNames.join(',');
					var functionStr = '(function ui_action_'+action.name+'('+paramArrayStr+
							'){return actionFunc(arguments);})';
					/*eslint evil: true */
					to[action.name]=eval(functionStr); // eslint-disable-line no-eval
					/*jslint evil: false */
				})();}
		}
	}
})();
