

(function() {
	'use strict';
	angular.module('duck-angular')
		.controller('duckFolderSelectController',DuckFolderSelect);

	DuckFolderSelect.$inject=['duckClient','$log','$scope'];
	function DuckFolderSelect(duckClient,$log,$scope)
	{
		var vm = this;
		vm.dir=vm.dir;//bound outside
		vm.dialogPicked=dialogPicked;
		vm.startChoose=startChoose;

		activate();

		function dialogPicked(element)//from DOM - not angular
		{
			if(element && element.files && element.files[0])
			{
				vm.dir=element.files[0].path;
				$scope.$apply();// eslint-disable-line angular/ng_controller_as
			}
		}
		function startChoose(event)
		{
			//element.show();
			//element.focus();
			event.target.children[0].click();
			//element.hide();
		}
		function activate ()
		{
			duckClient.uiActions.fsGetWorkingDir().
			then(function(baseDir)
				{
					vm.dir=baseDir;
					//return duckClient.uiActions.fsGetDirTree(baseDir);
				});


		}


	}

})();



(function (){
	'use strict';
	var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular.module('duck-angular').directive('duckFolderSelect', function() {
		return {
			scope: {
				dir: '=dir'
			},
			bindToController:true,
			controllerAs:'vm',
			controller: 'duckFolderSelectController',
			templateUrl: myUrl.replace('.js','.html')
		};});})();

/* global angular */
'use strict';


(function() {
	angular.module('duck-angular')
		.controller('ModalController',ModalController);

	ModalController.$inject=['duckClient','duckModal'];
	function ModalController(duckClient,duckModal)
	{
		var vm = this;
		
		vm.resolve=duckModal.resolve;
		vm.cancel=duckModal.cancel;
		
		//vm.showAndReport=showAndReport;
	
		activate();
		function activate ()
		{
			
		}

	}

})();
/* global angular document */
'use strict';

(function (){
	var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular.module('duck-angular').directive('duckModal', duckModal );

duckModal.$inject=[];
function duckModal()
{
		return {
			scope: {title:'@',flags:'@'},
			controllerAs:'modalVm',
			bindToController:true,
			controller: 'ModalController',
			transclude: true,
			templateUrl: myUrl.replace('.js','.html')
		};
}
})();
								
/* global angular */
'use strict';


(function() {
	angular.module('duck-angular')
		.controller('DirectoryController',DirectoryController);

	DirectoryController.$inject=['duckClient','$scope','$q'];
	function DirectoryController(duckClient,$scope,$q)
	{
		var vm = this;



		vm.dir='';

		var settingName=vm.settings.hasOwnProperty('sets')? vm.settings.sets:'installDir';
		var sendingSettingPromise=$q.when();

		activate();


		function activate ()
		{

			$scope.$watch(function () {
				return vm.dir;
			},function(){
				var toSend={};
				toSend[settingName]=vm.dir;
				sendingSettingPromise.then(function(){duckClient.uiActions.setUserSettings(toSend);});
										});
			/*then(function(tree){
					var getUniqueId=
							(function (){
								var uniqueIdCounter=-1;
								return function(){
									uniqueIdCounter+=1;
									return uniqueIdCounter;
								};})();


					function treeWalk(treeNode,myName,parent)
					{
						var treejsNode={};
						var myIdNum=getUniqueId();
						var myId='ajson'+myIdNum;
						treejsNode.id=myId;
						treejsNode.parent=parent;
						treejsNode.text=myName;
						//treejsNode.__uiNodeId=myIdNum;
						treejsNode.state={ opened: false };
						vm.treeData.push(treejsNode);
						for(var key in treeNode)
						{
							treeWalk(treeNode[key],key,myId);
						}


					}

					var firstKey;
					for(firstKey in tree){break;}
					vm.treeData=[];
					treeWalk(tree[firstKey],firstKey,'#');


					$timeout(function initTree()
									 {
						//vm.treeData=vm.dirTree;
						vm.treeConfig.version++;
						vm.applyModelChanges();
					},100);
				}).done();*/
		}
		/*
		function dialogPicked()
		{
			vm.selectedDir=vm.selectedDirDialog;
		}
		function askDir()
		{
			duckModal.showModal().then(function(result){console.log(result);});
		}*/
		/*
		function getTreeConfig() 
		{
			return {
				core: {
					multiple : false,
					animation: true,
					error: function(error) {
						$log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
					},
					check_callback : true,// eslint-disable-line camelcase
					worker : true
				},
				types : {
					default : {
						icon : 'glyphicon glyphicon-flash'
					},
					star : {
						icon : 'glyphicon glyphicon-star'
					},
					cloud : {
						icon : 'glyphicon glyphicon-cloud'
					}
				},
				version : 1,
				plugins : ['types','checkbox']
			};
		}*/

	}

})();
/* global angular document */
'use strict';

(function (){
	var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular.module('duck-angular').directive('duckDirectory', function() {

		return {
			scope: {settings:'='},
			bindToController: true,
			controllerAs:'vm',
			controller: 'DirectoryController',
			templateUrl: myUrl.replace('.js','.html')
		};});})();
																												
/* global angular */
'use strict';
(function (){
	var myUrl = document.currentScript.src;
	angular.module('duck-angular')
		.directive('duckLoader', DuckLoaderDirective);

	DuckLoaderDirective.$inject=['duckClient'];
	function DuckLoaderDirective(duckClient)
	{
		return {
			scope: {},
			controller:LoaderController,
			templateUrl: myUrl.replace('.js','.html')
		};


	}

	LoaderController.$inject=['duckPager','duckClient'];
	function LoaderController(duckPager,duckClient)
	{
		duckPager.show();
		duckClient.goNextPage(); 
	}
})();
/*global angular*/
'use strict';

(function() {
	angular.module('duck-angular')
		.controller('DuckProgressController',DuckProgressController);

	DuckProgressController.$inject=['duckJobManager','duckPager','$scope'];
	function DuckProgressController(duckJobManager,duckPager,$scope)
	{
		var vm=this;

		vm.estimate='';
		vm.title=0;
		vm.progress=0;
		activate();

		function updateJobProgress(progress)
		{
			if(progress===null)
			{
				return;
			}
			vm.progress=progress.progress;
			vm.title=''+progress.progress + ' % done';
			if(progress.progress===100)
			{
				vm.estimate='';
				duckPager.setNextEnabled=true;
			}
			else
			{
				vm.estimate=''+ progress.estimate + ' seconds remaining';

			}

		}
		function activate()
		{
			duckPager.setNextEnabled=false;
			duckPager.setBackEnabled=false;
			$scope.$watch(function(){return duckJobManager.getJobProgress(vm.settings.job);},updateJobProgress);
			duckJobManager.startJob(vm.settings.job);
		}

	}

})();
/* global angular */
'use strict';
(function (){
	var myUrl = document.currentScript.src;
	angular.module('duck-angular')
		.directive('duckProgress', DuckProgressDirective);

	DuckProgressDirective.$inject=[];
	function DuckProgressDirective()
	{
		return {
			scope: {settings:'='},
			bindToController: true,
			controllerAs:'vm',
			controller:'DuckProgressController',
			templateUrl: myUrl.replace('.js','.html')
		};

	}

})();
/* global angular */
'use strict';


(function() {
	angular.module('duck-angular')
		.controller('PagerController',PagerController);

	PagerController.$inject=['duckClient','duckPager'];
	function PagerController(duckClient,duckPager)
	{
		var vm = this;
		
		
		
		vm.isBackEnabled=function(){return duckPager.isBackEnabled();};
		vm.isNextEnabled=function(){return duckPager.isNextEnabled();};
		vm.goBackPage=function(){return duckPager.goBackPage();};
		vm.goNextPage=function(){return duckPager.goNextPage();};
		
		vm.showPager=function(){return duckPager.isVisble();};
		activate();

		function activate ()
		{
			//duckPager.registerChangeCallback(updateVisibilty);
		}
		function updateVisibilty(isVis)
		{
			//vm.showPager=isVis;
		}


	}

})();
'use strict';
(function (){
	var myUrl = document.currentScript.src;
angular.module('duck-angular').directive('duckPager', ['duckClient',function(duck) {
	
  return {

		scope: {},
		controller:'PagerController',
		controllerAs:'vm',
    templateUrl: myUrl.replace('.js','.html')
  };
}]);
})();
/* global angular*/
'use strict';

(function (){
	//var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular
		.module('duck-angular')
		.factory('duckJobManager', duckJobManager );

	duckJobManager.$inject=['duckEvents','duckLogger','$rootScope','duckClient'];
	function duckJobManager(duckEvents,duckLogger,$rootScope,duckClient)
	{
		var jobsData;

		activate();
		return {
			getJobProgress:	getJobProgress,
			startJob: startJob
		};
		function startJob(jobName)
		{
			if(jobsData.hasOwnProperty(jobName))
			{
				duckLogger.debug(jobName +' already in job queue');
				return;
			}
			duckClient.uiActions.startJob(jobName);
		}
		function getJobProgress(jobName)
		{
			if(jobsData.hasOwnProperty(jobName))
			{
				return jobsData[jobName];
			}
			return null;
		}
		function updateJobProgress(data)
		{
			var jobName=data.value.jobName;

			if(jobsData.hasOwnProperty(jobName) && jobsData[jobName].progress===100)
			{
				return;
			}
			else
			{
				jobsData[jobName]={progress:parseInt(data.value.progress*100),
													 estimate:parseInt(data.value.estimateLeft)};
			}
		}
		function updateJobDone(data)
		{
			var jobName=data.value.jobName;
			jobsData[jobName]={progress:100,
												 estimate:0};
		}
		function activate()
		{
			if(!duckClient.persistentData.hasOwnProperty('jobs'))
			{
				duckClient.persistentData.jobs={};
			}
			jobsData=duckClient.persistentData.jobs;
			$rootScope.$on('JobProgress',function(event,data){
				updateJobProgress(data);
			});

			$rootScope.$on('JobDone',function(event,data){
				updateJobDone(data);
			});
		}


	}
})();
/* global angular  */
'use strict';

(function (){
	//var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular
		.module('duck-angular')
		.factory('duckModal', duckModal );
	
duckModal.$inject=['$modal','$q'];
function duckModal($modal,$q)
{
		var currentModalInstance;
		return {
			showModal	:	showModal,
			resolve:resolve,
			cancel: cancel
		};
	
	function resolve(out)
	{
		currentModalInstance.close(out);
	}
	function cancel(out)
	{
		currentModalInstance.dismiss(out);
	}
	function showModal(params)
	{
		if(currentModalInstance)
		{
			return $q.reject( 'already open' );
		}
		if(!params.hasOwnProperty('size'))
		{
			params.size='sm';
		}
		if(!params.hasOwnProperty('animation'))
		{
			params.animation=false;
		}
		if(!params.hasOwnProperty('windowClass'))
		{
			params.windowClass='modal duck-modal modal-show';
		}
		
		/*
		if(params.hasOwnProperty('id'))
		{
			var elem=$document.find(params.id);
			debugger;
			params.template=elem.html();
			delete params.id;
		}*/
		
		currentModalInstance= $modal.open(params);
		return currentModalInstance.result.finally(function(){currentModalInstance=null;});
	}
}
})();
								
/* global angular*/
'use strict';

(function (){
	//var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular
		.module('duck-angular')
		.factory('duckPager', duckPager );

	duckPager.$inject=['duckPages','duckLogger','$state'];
	function duckPager(duckPages,duckLogger,$state)
	{
		var currenPageIdx=0;
		var isVisible=false;
		var nextEnabled=true;
		
		var changeCallbacks=[];
		return {
			show:	show,
			hide: hide,
			getVisible: function(){return isVisible;},
			getPageIdx:function(){return currenPageIdx;},
			isBackEnabled:isBackEnabled,
			isNextEnabled:isNextEnabled,
			gotoPageNumber:gotoPageNumber,
			goNextPage:goNextPage,
			goBackPage:goBackPage,
			setNextEnabled:setNextEnabled,
			registerChangeCallback: registerChangeCallback
		};
		
		function setNextEnabled(isNextEnabled)
		{
			nextEnabled=isNextEnabled;
		}
		
		function gotoPageNumber(pageNum)
		{
			if(pageNum>=0 && pageNum <duckPages.length)
			{
				duckLogger.debug('going to page '+pageNum);
				$state.go(duckPages[pageNum].name);
				emitChange();
			}

		}
		function isBackEnabled()
		{
			return currenPageIdx>0;
		}
		
		function isNextEnabled()
		{
			return nextEnabled && currenPageIdx+1<duckPages.length;
		}

		function goNextPage()
		{ 
			if(isNextEnabled())
			{
				currenPageIdx+=1;
				gotoPageNumber(currenPageIdx);
			}
		}
		
		function goBackPage()
		{ 
			if(this.isBackEnabled())
			{
				currenPageIdx-=1;
				gotoPageNumber(currenPageIdx);
			}
		}

		function emitChange()
		{
			angular.forEach(changeCallbacks, function(callback, idx) {
				void idx;
				callback(isVisible,currenPageIdx);
			});
		}
		function show()
		{
			isVisible=true;
			emitChange();
		}
		function hide()
		{
			isVisible=false;
			emitChange();
		}
		function registerChangeCallback(callback)
		{
			changeCallbacks.push(callback);
		}


	}
})();
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

/* global angular  */
'use strict';

(function (){
	//var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular
		.module('duck-angular')
		.factory('duckEvents', duckEvents );

	duckEvents.$inject=['$rootScope','$interval','duckLogger','duckClient'];
	function duckEvents($rootScope,$interval,duckLogger,duckClient)
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
			duckClient.uiActions.getNotificationsFromIdx(lastIdx).then(
				function(notificationsArray)
				{
					lastIdx+=notificationsArray.length;
					angular.forEach(notificationsArray,function(val,idx)
													{
						void idx;
						$rootScope.$emit(val.name,val);
						duckLogger.debug('sending event ' +angular.toJson(val));
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

angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('src/directives/folder_select/folder_select.html',
    "<input ng-model=\"vm.dir\" ng-model-options=\"{ debounce: 1000 }\" />\r" +
    "\n" +
    "<div onclick=\"this.children[0].click()\">Choose\r" +
    "\n" +
    "\t<input type=\"file\" nwdirectory onchange=\"angular.element(this).scope().vm.dialogPicked(this)\" ng-hide=\"true\" />\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('src/directives/modal/modal.html',
    "<div>\r" +
    "\n" +
    "\t<div class=\"modal-header\">\r" +
    "\n" +
    "\t\t<h3 class=\"modal-title\">{{modalVm.title}}</h3>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"modal-body\">\r" +
    "\n" +
    "\t\t<ng-transclude></ng-transclude>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "\t<div class=\"modal-footer\">\r" +
    "\n" +
    "\t\t<button class=\"btn\" ng-click=\"modalVm.resolve('ok')\">OK</button>\r" +
    "\n" +
    "\t\t<button class=\"btn\" ng-click=\"modalVm.resolve('cancel')\">Cancel</button>\r" +
    "\n" +
    "\t</div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('src/directives/page_directives/directory/directory.html',
    "Installation Dir:\r" +
    "\n" +
    "\r" +
    "\n" +
    "<!--div js-tree=\"vm.treeConfig\" should-apply=\"vm.applyModelChanges()\" ng-model=\"vm.treeData\" ></div-->\r" +
    "\n" +
    "<duck-folder-select dir='vm.dir'></duck-folder-select>\r" +
    "\n"
  );


  $templateCache.put('src/directives/page_directives/loader/loader.html',
    "loading installer...\r" +
    "\n" +
    "<div class=\"loading-wheel\"></div>"
  );


  $templateCache.put('src/directives/page_directives/progress/progress.html',
    "\r" +
    "\n" +
    "<progressbar max=\"100\" value=\"vm.progress\"><span style=\"color:black; white-space:nowrap;\">{{vm.title}}</span></progressbar>\r" +
    "\n" +
    "{{vm.estimate}}"
  );


  $templateCache.put('src/directives/pager/pager.html',
    "<div class=\"pager\" ng-show=\"vm.showPager\"><ul class=\"pager\">\r" +
    "\n" +
    "\t<li class=\"previous\" ng-class=\"{disabled:!vm.isBackEnabled()}\" ng-click=\"vm.goBackPage()\">\r" +
    "\n" +
    "\t\t<a href=\"javascript:void(0);\"><span aria-hidden=\"true\">&larr;</span> Back</a>\r" +
    "\n" +
    "\t</li>\r" +
    "\n" +
    "\t<li class=\"next\" ng-class=\"{disabled:!vm.isNextEnabled()}\" ng-click=\"vm.goNextPage()\">\r" +
    "\n" +
    "\t\t<a href=\"javascript:void(0);\">Next <span aria-hidden=\"true\">&rarr;</span></a>\r" +
    "\n" +
    "\t</li>\r" +
    "\n" +
    "\t</ul> \r" +
    "\n" +
    "</div>"
  );

}]);
