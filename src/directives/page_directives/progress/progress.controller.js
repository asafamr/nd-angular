(function() {
	'use strict';
	angular.module('ndAngular')
		.controller('NDProgressController',NDProgressController);

	NDProgressController.$inject=['ndJobManager','ndPager','$scope'];
	function NDProgressController(ndJobManager,ndPager,$scope)
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
				ndPager.setNextEnabled=true;
			}
			else
			{
				vm.estimate=''+ progress.estimate + ' seconds remaining';

			}

		}
		function activate()
		{
			ndPager.setNextEnabled=false;
			ndPager.setBackEnabled=false;
			$scope.$watch(function(){return ndJobManager.getJobProgress(vm.settings.job);},updateJobProgress);
			ndJobManager.startJob(vm.settings.job);
		}

	}

})();
