(function(){
'use strict';

	//var ndCoreReq=process.mainModule.exports.ndCoreReq;

	angular.module('ndAngular',['ui.router','ui.bootstrap'])
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
		ndPages=pages;
		ndLogger.debug('bootstrapping angular');
		angular.module('ndAngular')
			.constant('ndPages',ndPages)
			.constant('ndLogger',ndLogger);
			angular.resumeBootstrap();
	});


	}




	NDAngularProvider.$inject=['$stateProvider','$urlRouterProvider'];
	function NDAngularProvider($stateProvider,$urlRouterProvider)
	{
		var thisProvider=this;

		thisProvider.$get=NDAngular;
		activate();

		ndAngular.$inject=['$state','ndUIActionsRegister','$interval','$injector'];
		function NDAngular($state,ndUIActionsRegister,$timeout,$injector)
		{
			var me=this;
			ndLogger.debug('creating ndjs client provider service');
			me.uiActions={};
			ndUIActionsRegister.registerUiActions(ndUiActions,ndjs.callUiAction,me.uiActions);
			$timeout(function(){$injector.get('ndEvents');});
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
					dat.template = '<div nd-'+type+' settings="pageVm.settings"/>';
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
