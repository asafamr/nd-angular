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

	NDPager.$inject=['ndPages','ndLogger','$state'];
	function NDPager(ndPages,ndLogger,$state)
	{
		var currenPageNumber=0;
		var minimalPageNumber=0;
		var nextIsEnabled=true;
		var backIsEnabled=true;

		var changeCallbacks=[];
		activate();
		return {
			nextEnabled:nextEnabled,
			backEnabled:backEnabled,
			getPageNumber:getPageNumber,
			gotoPageNumber:gotoPageNumber,
			goNextPage:goNextPage,
			goBackPage:goBackPage,
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
						currenPageNumber=idx;
					}

			});

		}


		/**
		* @description goto to page number
		* @param {Number} pageNum target page number
		* @example gotoPageNumber(5)
		**/
		function gotoPageNumber(pageNum)
		{
			if(pageNum>=0 && pageNum <ndPages.length)
			{
				ndLogger.debug('going to page '+pageNum);
				nextIsEnabled=backIsEnabled=true;
				$state.go(ndPages[pageNum]);
			}
			else {
				ndLogger.error('could not go to page '+pageNum);
			}

		}
		/**
		* @description queries or sets if back option enabled
		* @param {Boolean} setEnabled (optional) enables/disables go back option
		* @return returns true if back option is enabled
		* @example backEnabled() backEnabled(false)
		**/
		function backEnabled(setEnabled)
		{
			if(currenPageNumber<=minimalPageNumber)
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
			if(currenPageNumber+1>ndPages.length)
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
				currenPageNumber+=1;
				gotoPageNumber(currenPageNumber);
		}

		/**
		* @description go back to the last page
		**/
		function goBackPage()
		{

				currenPageNumber-=1;
				gotoPageNumber(currenPageNumber);
		}

		/**
		* @name getPageNumber
		* @description get page number
		* @return {Number} page number
		**/
		function getPageNumber()
		{
			return currenPageNumber;
		}

		/**
		* @name preventBackFromHere
		* @description set back disabled from this page (for example, if you finished a job and want to prevent going back to its configuration page)
		**/
		function preventBackFromHere()
		{
			minimalPageNumber=currenPageNumber;
		}


	}
})();
