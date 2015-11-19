(function(){
'use strict';

	//var ndCoreReq=process.mainModule.exports.ndCoreReq;

	angular.module('ndAngular',['ui.router','ui.bootstrap','ngSanitize','ngAnimate'])
	/*.factory('$exceptionHandler', function() {
  return function(exception, cause) {
    exception.message += ' (caused by "' + cause + '")';
    throw exception;
  };
})*/
		.provider('ndAngular', NDAngularProvider);

	var ndLogger=ndjs.getLogger();
	//lazy injection of resumeBootstrap in this tick - wait for it
	//setTimeout(recheckLoaded,0);// eslint-disable-line angular/ng_timeout_service
	var finishedLoadingNdjs=false;
	var pageRendered=false;
	var gotUiActions=false;
	recheckLoaded();

	function recheckLoaded()//maybe promisify...
	{
		if(!pageRendered )
		{
			if(document.readyState !== 'complete')
			{
					ndLogger.debug('page rendered');
					pageRendered=true;
					setTimeout(recheckLoaded);
			}
			else {
				setTimeout(recheckLoaded,100);
			}
		}
		else if(!finishedLoadingNdjs)
		{
			ndjs.hasFinishedLoading().then(function(response)
			{
				if(response)
				{
						ndLogger.debug('ndjs finished loading');
						finishedLoadingNdjs=true;
						setTimeout(recheckLoaded);
				}
				else {
					setTimeout(recheckLoaded,100);
				}
			}).fail(function(err)
			{
				ndLogger.error('ajax hasFinishedLoading failed '+JSON.stringify(arguments));
			});
		}
		else if(!gotUiActions)
		{
			ndjs.getUiActions().then(function(response)
			{
				if(response)
				{
						ndLogger.debug('ndjs loaded actions');
						bootstrapNdjs(response);
				}
				else {
					setTimeout(recheckLoaded,100);
				}
			}).fail(function(err)
			{
				ndLogger.error('ajax getUiActions failed '+JSON.stringify(err.responseText));
			});
		}

	}
	function bootstrapNdjs(actions)
	{
		ndjs.callUiAction('getPages')
		.fail(function(err){ndLogger.error('getPages failed '+JSON.stringify(err.responseText));})
		.then(function(pages)
	{
		ndLogger.debug('bootstrapping angular');
		angular.module('ndAngular')
			.constant('ndPages',pages)
			.constant('ndLogger',ndLogger)
			.constant('ndUiActions',actions);
			angular.resumeBootstrap();
	});


	}




	NDAngularProvider.$inject=['$stateProvider','$urlRouterProvider','ndPages','ndUiActions'];
	function NDAngularProvider($stateProvider,$urlRouterProvider,ndPages,ndUiActions)
	{
		var thisProvider=this;

		thisProvider.$get=NDAngular;
		activate();

		NDAngular.$inject=['$state','ndUIActionsRegister','$timeout','$injector'];
		function NDAngular($state,ndUIActionsRegister,$timeout,$injector)
		{
			var me=this;

			me.uiActions={};
			me.window={minimize:minimize,close:close};
			activate();


			function activate()
			{
				ndLogger.debug('creating ndjs client provider service');
				if(typeof require !== 'undefined')	setTimeout(function(){require('nw.gui').Window.get().show();},0);
				$timeout(function(){$injector.get('ndEvents');});
				ndUIActionsRegister.registerUiActions(ndUiActions,ndjs.callUiAction,me.uiActions);
			}
	    function minimize()
	    {

	    }
	    function close()
	    {

	    }
			return me;
		}

		function activate()
		{
			ndLogger.debug('activating ndjs client provider');
			function addPage(name,type,settings)
			{
				var dat={url:'/page/' + name,controllerAs:'pageVm'};
				if(type === 'custom')
				{
					dat.templateUrl = 'views/' + name + '/'+name + '.html';
				}
				else
				{
					dat.template = '<div nd-page-'+type+' settings="pageVm.settings"/>';
				}
				dat.controller=function ()
				{
					this.settings=settings;
				};
				$stateProvider.state(name,dat);

			}

			angular.forEach(ndPages, function(value, idx){
				void idx;
				addPage(value.name,value.type,value.settings);
			});
			$urlRouterProvider.otherwise('/page/'+ndPages[0].name);
			ndLogger.debug('pages set');

		}





	}
})();
