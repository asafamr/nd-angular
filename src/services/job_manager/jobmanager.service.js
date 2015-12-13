/**
@name ndJobManager service
@description starts, queries ndjs jobs progress
**/

(function (){
	'use strict';
	//var myUrl = document.currentScript.src;//eslint-disable-line angular/ng_document_service
	angular
		.module('ndAngular')
		.factory('ndJobManager', NDJobManager );

	NDJobManager.$inject=['ndLogger','$rootScope','ndActions'];
	function NDJobManager(ndLogger,$rootScope,ndActions)
	{
		var jobsProgress={};
		var jobPendingCallbacks={};
		activate();
		return {
			getJobProgress:	getJobProgress,
			startJob: startJob
		};
		/**
		* @description start a job by name
		* @param {String} jobName name of the job to start
		* @param {Boolean} force start even it has already started before
		* @param {Function} pendingCallback called when job is waiting for user decision on error - pendingCallback(err,details,options,answerCallback) example in https://github.com/asafamr/nd-proj/blob/master/front/views/extract/extract.controller.js
		**/
		function startJob(jobName,force,pendingCallback)
		{
			if(typeof force === 'undefined'){force=false;}
			if(jobsProgress.hasOwnProperty(jobName))
			{
				ndLogger.warn(jobName +' already in job queue');
				return;
			}
			if(typeof pendingCallback !== 'undefined'){
				jobPendingCallbacks[jobName]=pendingCallback;
			}
			ndActions.job_startNamedJob(jobName,force).catch(function(err)
			{
				ndLogger.error('Job '+jobName+' failed to start: '+err);
			});
		}
		/**
		* @name getJobProgress
		* @description gets a job progress
		* @param {String} jobName name of the job to query
		* @return {Number} job progress between 0 and 1 (1=completed)
		**/
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




		function activate()
		{
			if(!ndjs.getPersistent('jobs'))
			{
				ndjs.setPersistent('jobs',{});
			}
			//jobsData=ndjs.getPersistent('jobs');
			$rootScope.$on('job_status',function(event,data){
				updateJobProgress(data);
			});

			$rootScope.$on('job_pending',function(event,data){

				var jobName=data.value.jobName;
				if(jobPendingCallbacks.hasOwnProperty(jobName))
				{
					ndLogger.debug('Job '+jobName+' pending');
					jobPendingCallbacks[jobName](data.value.message,data.value.detailed,data.value.options,function(answer)
						{
							ndLogger.debug('Job '+jobName+' realeasing from pending status:'+answer);
							ndActions.job_releasePendingJob(data.value.pendingId,answer);
						});
					//delete jobPendingCallbacks[jobName];
				}
				else
				{
					ndLogger.warn('Job '+ jobName+' pending but no pending callback specified');
				}
			});

			$rootScope.$on('job_failed',function(event,data){
					ndLogger.error('Job '+data.value.jobName+' failed: '+data.value.details);
			});

			$rootScope.$on('job_aborted',function(event,data){
					ndLogger.debug('Job '+data.value.jobName+' aborted');
			});

		}


	}
})();
