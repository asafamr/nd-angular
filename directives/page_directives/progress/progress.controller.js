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