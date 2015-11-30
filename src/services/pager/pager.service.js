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
			getPageNumber:function(){return currenPageNumber;},
			gotoPageNumber:gotoPageNumber,
			goNextPage:goNextPage,
			goBackPage:goBackPage,
			preventBackFromHere:function(){minimalPageNumber=currenPageNumber;}
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
		function setNextEnabled(isNextEnabled)
		{
			nextEnabled=isNextEnabled;
		}

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


		function goNextPage()
		{
				currenPageNumber+=1;
				gotoPageNumber(currenPageNumber);
		}

		function goBackPage()
		{
				currenPageNumber-=1;
				gotoPageNumber(currenPageNumber);
		}



	}
})();
