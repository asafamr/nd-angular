/**
simple pager
@name ndPager directive
@description pager with next and back button - sends commands to the pager service
@param {String} nextText html for the next button content
@param {String} backText html for the back button content
@example <nd-pager next-text="continue" back-text="back">
**/

(function (){
	'use strict';
	var myUrl = document.currentScript.src;
	angular.module('ndAngular').directive('ndPager', [function() {
  return {
		scope: {nextText:'@',backText:'@'},
		controller:'PagerController',
		controllerAs:'vm',
		bindToController: true,
    templateUrl: myUrl.replace('.js','.html')
  };
}]);
})();
