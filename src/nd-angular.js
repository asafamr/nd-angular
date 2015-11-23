(function(){
'use strict';


	angular.module('ndAngular',['ui.router','ui.bootstrap','ngSanitize','ngAnimate'])
		.config( NDAngularConfig)
		.run(NDAngularRun);
		/*.factory('$exceptionHandler', function() {
	  return function(exception, cause) {
	    exception.message += ' (caused by "' + cause + '")';
	    throw exception;
	  };
	})*/
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
			.constant('ndUiActionsMeta',actions);
			angular.resumeBootstrap();
	});


	}




	NDAngularConfig.$inject=['$stateProvider','$urlRouterProvider','ndPages'];
	function NDAngularConfig($stateProvider,$urlRouterProvider,ndPages)
	{

		activate();

		function activate()
		{
			ndLogger.debug('activating ndjs client provider');
			function addPage(name)
			{
				var dat={url:'/page/' + name};
				dat.templateUrl = 'views/' + name + '/'+name + '.html';
				$stateProvider.state(name,dat);
			}
			angular.forEach(ndPages, function(value, idx){
				void idx;
				addPage(value);
			});
			$urlRouterProvider.otherwise('/page/'+ndPages[0]);
			ndLogger.debug('pages set');

		}
	}
NDAngularRun.$inject=['ndEvents'];
	function NDAngularRun(ndEvents)
	{
		//just initilize ijected modules
	}
})();
