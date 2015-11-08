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