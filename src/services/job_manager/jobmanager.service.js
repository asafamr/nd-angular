(function (){
	'use strict';
	//var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular
		.module('ndAngular')
		.factory('ndJobManager', NDJobManager );

	NDJobManager.$inject=['ndEvents','ndLogger','$rootScope','ndAngular'];
	function NDJobManager(ndEvents,ndLogger,$rootScope,ndAngular)
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
				ndLogger.debug(jobName +' already in job queue');
				return;
			}
			ndAngular.uiActions.startJob(jobName);
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
			if(!ndAngualr.persistentData.hasOwnProperty('jobs'))
			{
				ndAngualr.persistentData.jobs={};
			}
			jobsData=ndAngualr.persistentData.jobs;
			$rootScope.$on('JobProgress',function(event,data){
				updateJobProgress(data);
			});

			$rootScope.$on('JobDone',function(event,data){
				updateJobDone(data);
			});
		}


	}
})();
