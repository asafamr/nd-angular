'use strict';
/*global angular document */

(function(){

    
	var duckCoreReq=process.mainModule.exports.duckCoreReq;
	var duckUiActions={};
	var duckCallUiAction=null;
	var duckPages=[];
	var duckLogger=null;

	duckCoreReq.load();

	angular.module('duck-angular',['ui.router','ui.bootstrap'])
		.provider('duckClient', DuckClientProvider);

	//lazy injection of resumeBootstrap in this tick - wait for it
	//setTimeout(recheckLoaded,0);// eslint-disable-line angular/ng_timeout_service
	recheckLoaded();
	function recheckLoaded()
	{
		if(duckCoreReq.isLoaded() !== true || document.readyState !== 'complete')// eslint-disable-line angular/ng_document_service
		{
			setTimeout(recheckLoaded,100); //eslint-disable-line angular/ng_timeout_service
		}
		else
		{
			//over http these should be ajax call (isLoaded too)
			duckUiActions=duckCoreReq.getUiActions();
			duckCallUiAction=duckCoreReq.getCallUiAction();
			duckLogger=duckCoreReq.getLogger();
			duckCallUiAction('getPages',[],function(err,pages)
											 {
				if(err)
				{
					throw new Error(err);
				}
				duckPages=pages;
				duckLogger.debug('bootstrapping angular');
				angular.module('duck-angular')
					.constant('duckPages',duckPages)
					.constant('duckLogger',duckLogger);

				angular.resumeBootstrap();
			});


		}
	}

	

	DuckClientProvider.$inject=['$stateProvider','$urlRouterProvider'];
	function DuckClientProvider($stateProvider,$urlRouterProvider)
	{
		var thisProvider=this;

		thisProvider.$get=DuckClient;
		activate();

		DuckClient.$inject=['$state','duckUIActionsRegister','$interval','$injector'];
		function DuckClient($state,duckUIActionsRegister,$timeout,$injector)
		{
			duckLogger.debug('creating duck client provider service');
			var duckClient=this;
			
			
			duckClient.uiActions={};
			duckUIActionsRegister.registerUiActions(duckUiActions,duckCallUiAction,duckClient.uiActions);

			duckClient.persistentData=process.mainModule.exports.duckPersistentData;
			
			
			$timeout(function(){$injector.get('duckEvents');},100);
			return duckClient;
		}

		function activate()
		{
			duckLogger.debug('activating duck client provider');
			function addPage(name,type,settings)
			{
				var dat={url:'/page/' + name,controllerAs:'pageVm'};
				if(type === 'custom')
				{
					dat.templateUrl = 'views/' + name + '/'+name + '.html';
				}
				else
				{
					dat.template = '<div duck-'+type+' settings="pageVm.settings"/>';
				}
				dat.controller=function ()
				{
					this.settings=settings;
				};
				$stateProvider.state(name,dat);
		
			}

			//addPage('_loaderPage','loader');
			angular.forEach(duckPages, function(value, idx){
				void idx;
				addPage(value.name,value.type,value.settings);
			});
			$urlRouterProvider.otherwise('/page/'+duckPages[0].name);
			duckLogger.debug('pages set');

		}





	}
})();