/**
paging service
@name ndPager service
@description manages ndjs pages changes
**/
(function (){
	'use strict';
	//var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular
		.module('ndAngular')
		.factory('ndPager', NDPager );

	NDPager.$inject=['ndPages','ndLogger','$state','$q'];
	function NDPager(ndPages,ndLogger,$state,$q)
	{
		var currentPageNumber=0;
		var minimalPageNumber=0;
		var nextIsEnabled=true;
		var backIsEnabled=true;


		var beforeLeaveCallbacks=[];
		activate();
		return {
			nextEnabled:nextEnabled,
			backEnabled:backEnabled,
			getPageNumber:getPageNumber,
			gotoPageNumber:gotoPageNumber,
			gotoPageName:gotoPageName,
			goNextPage:goNextPage,
			goBackPage:goBackPage,
			registerBeforeLeaveCallback:registerBeforeLeaveCallback,
			preventBackFromHere:preventBackFromHere
		};

		function activate()
		{
				angular.forEach(ndPages,function(page,idx)
				{
					var pageAddress='#/page/'+page;
					//if windows location ends with this page name
					//$state is async and problematic so we use window.location
					if(window.location.hash.indexOf(pageAddress) === 0)
					{
						currentPageNumber=idx;
					}
			});
		}


		/**
		* @description goto to page named {pageName}.
		* @param {String} pageName target page name
		* @example gotoPageName('abort')
		**/
		function gotoPageName(pageName)
		{
			var pageIndex=-1;
			angular.forEach(ndPages,function(page,idx)
			{
				if(page===pageName)
				{
					pageIndex=idx;
				}
			});
			if(pageIndex===-1)
			{
				ndLogger.error('Could not find paged named '+pageName);
			}
			else {
				gotoPageNumber(pageIndex);
			}
		}

		/**
		* @description goto to page number {pageNum}. out of boundries index generate error - does not enforce next enabled,disabled etc...
		* @param {Number} pageNum target page number
		* @example gotoPageNumber(5)
		**/
		function gotoPageNumber(pageNum)
		{//TODO:this deserve a unit test
			if(pageNum>=0 && pageNum <ndPages.length)
			{
				var currentPromise=$q.when(true);
				if(beforeLeaveCallbacks.length>0)
				{
					beforeLeaveCallbacks.forEach(function(callback)
					{
						currentPromise=currentPromise.then(function(ret)
						{
							if(!ret)
							{
								//if one of the callback function retruned falsy - cancel page leave
								return false;
							}
							else {
								//chain this callback function return value
								return $q.when(callback(pageNum));
							}
						});
					});
				}
				currentPromise.then(function(ret)
			{
				if(ret===undefined)
				{
					ndLogger.warn('leave callback returned undefined, is this intentional?');
				}
				if(ret)
					{
						beforeLeaveCallbacks=[];
						ndLogger.debug('going to page '+pageNum);
						nextIsEnabled=backIsEnabled=true;
						currentPageNumber=pageNum;
						$state.go(ndPages[pageNum]);
					}
				});
			}
			else {//going to invalid page requested
				ndLogger.error('could not go to page '+pageNum);
			}

		}
		/**
		* @description register a function to be called before leaving current page. The function will get as param the next page number. Promises are resolved and then if the callback function return a falsy value, the page leave is aborted
		* @param {callback} function to call when page leave is required
		* @example registerBeforeLeaveCallback(myFunc) with function myFunc(nextPageNumber)
		**/
		function registerBeforeLeaveCallback(callback)
		{
			beforeLeaveCallbacks.push(callback);
		}
		/**
		* @description queries or sets if back option enabled
		* @param {Boolean} setEnabled (optional) enables/disables go back option
		* @return returns true if back option is enabled
		* @example backEnabled() backEnabled(false)
		**/
		function backEnabled(setEnabled)
		{
			if(currentPageNumber<=minimalPageNumber)
			{
				return false;
			}
			if(angular.isDefined(setEnabled))
			{
				backIsEnabled=setEnabled;
			}
			return backIsEnabled;
		}
		/**
		* @description queries or sets if next option enabled
		* @param {Boolean} setEnabled (optional) enables/disables go next option
		* @return returns true if back next is enabled
		* @example nextEnabled() nextEnabled(false)
		**/
		function nextEnabled(setEnabled)
		{
			if(currentPageNumber+1>ndPages.length)
			{
				return false;
			}
			if(angular.isDefined(setEnabled))
			{
				nextIsEnabled=setEnabled;
			}
			return nextIsEnabled;
		}

		/**
		* @description go to the next page
		**/
		function goNextPage()
		{
				gotoPageNumber(currentPageNumber+1);
		}

		/**
		* @description go back to the previous page
		**/
		function goBackPage()
		{

				gotoPageNumber(currentPageNumber-1);
		}

		/**
		* @name getPageNumber
		* @description get current page index
		* @return {Number} page number
		**/
		function getPageNumber()
		{
			return currentPageNumber;
		}

		/**
		* @name preventBackFromHere
		* @description set back disabled from this page (for example, if you finished a job and want to prevent going back to its configuration page)
		**/
		function preventBackFromHere()
		{
			minimalPageNumber=currentPageNumber;
		}


	}
})();
