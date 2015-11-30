(function (){
	'use strict';
	//var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular
		.module('ndAngular')
		.factory('ndJobManager', NDJobManager );

	NDJobManager.$inject=['ndEvents','ndLogger','$rootScope','ndActions'];
	function NDJobManager(ndEvents,ndLogger,$rootScope,ndActions)
	{
		var jobsProgress={};

		activate();
		return {
			getJobProgress:	getJobProgress,
			startJob: startJob
		};
		function startJob(jobName,force)
		{
			if(typeof force === 'undefined'){force=false;}
			if(jobsProgress.hasOwnProperty(jobName))
			{
				ndLogger.warn(jobName +' already in job queue');
				return;
			}
			ndActions.startNamedJob(jobName,force);
		}
		function getJobProgress(jobName)
		{
			if(jobsProgress.hasOwnProperty(jobName))
			{
				return jobsProgress[jobName];
			}
			return 0;
		}
		function updateJobProgress(data)
		{
			var jobName=data.value.jobName;

			if(jobsProgress.hasOwnProperty(jobName) && jobsProgress[jobName].progress===1)
			{
				return;
			}
			else
			{
				jobsProgress[jobName]=data.value.progress;
			}
		}
		function jobRetry(data)
		{
			window.alert('job asked retry - we could retry,ignore or abort'+JSON.stringify(data));
		}
		function jobError(data)
		{
			window.alert('job unknown error'+JSON.stringify(data));
		}


		function activate()
		{
			if(!ndjs.getPersistent('jobs'))
			{
				ndjs.setPersistent('jobs',{});
			}
			//jobsData=ndjs.getPersistent('jobs');
			$rootScope.$on('jobstatus',function(event,data){
				updateJobProgress(data);
			});

			$rootScope.$on('jobretry',function(event,data){
				jobRetry(data);
			});

			$rootScope.$on('joberror',function(event,data){
				jobError(data);
			});

		}


	}
})();
