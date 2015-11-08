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