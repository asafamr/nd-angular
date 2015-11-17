/* global angular */
'use strict';


(function() {
	angular.module('ndAngular')
		.controller('DirectoryController',DirectoryController);

	DirectoryController.$inject=['ndAngular','$scope','$q'];
	function DirectoryController(ndAngular,$scope,$q)
	{
		var vm = this;



		vm.dir='';

		var settingName=vm.settings.hasOwnProperty('sets')? vm.settings.sets:'installDir';
		var sendingSettingPromise=$q.when();

		activate();


		function activate ()
		{

			$scope.$watch(function () {
				return vm.dir;
			},function(){
				var toSend={};
				toSend[settingName]=vm.dir;
				sendingSettingPromise.then(function(){ndAngular.uiActions.setUserSettings(toSend);});
										});
			/*then(function(tree){
					var getUniqueId=
							(function (){
								var uniqueIdCounter=-1;
								return function(){
									uniqueIdCounter+=1;
									return uniqueIdCounter;
								};})();


					function treeWalk(treeNode,myName,parent)
					{
						var treejsNode={};
						var myIdNum=getUniqueId();
						var myId='ajson'+myIdNum;
						treejsNode.id=myId;
						treejsNode.parent=parent;
						treejsNode.text=myName;
						//treejsNode.__uiNodeId=myIdNum;
						treejsNode.state={ opened: false };
						vm.treeData.push(treejsNode);
						for(var key in treeNode)
						{
							treeWalk(treeNode[key],key,myId);
						}


					}

					var firstKey;
					for(firstKey in tree){break;}
					vm.treeData=[];
					treeWalk(tree[firstKey],firstKey,'#');


					$timeout(function initTree()
									 {
						//vm.treeData=vm.dirTree;
						vm.treeConfig.version++;
						vm.applyModelChanges();
					},100);
				}).done();*/
		}
		/*
		function dialogPicked()
		{
			vm.selectedDir=vm.selectedDirDialog;
		}
		function askDir()
		{
			ndModal.showModal().then(function(result){console.log(result);});
		}*/
		/*
		function getTreeConfig()
		{
			return {
				core: {
					multiple : false,
					animation: true,
					error: function(error) {
						$log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
					},
					check_callback : true,// eslint-disable-line camelcase
					worker : true
				},
				types : {
					default : {
						icon : 'glyphicon glyphicon-flash'
					},
					star : {
						icon : 'glyphicon glyphicon-star'
					},
					cloud : {
						icon : 'glyphicon glyphicon-cloud'
					}
				},
				version : 1,
				plugins : ['types','checkbox']
			};
		}*/

	}

})();
