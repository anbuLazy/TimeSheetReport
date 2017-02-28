/**
 * Created by sksharma.
 * 
 * This is application controller file.
 */
angular.module('autoMotoApp.controllers',[]).controller('TestDataMasterController', function($scope, $rootScope, $state, $timeout, TestDataMaster, testDataService, FilterTestDataMaster, Scopes){
	$scope.testdatamasters = {};
	$scope.testDataReqDto = {};
	$scope.serviceError = {};
	$scope.checkboxes = {};
	$scope.testdatas = {};
	
	$scope.onChangeEnv = function(){
		$scope.testdatas = {};
		$scope.testdatamasters.testGroups = [];
		$scope.testdatamasters.testLocales = {};
		$scope.testdatamasters.testScenarios = {};
		$scope.testDataReqDto.testGroup = {};
		$scope.testDataReqDto.testLocale = {}; 
		$scope.testDataReqDto.testScenario = {};
		
		FilterTestDataMaster.getMasterDataGroup($scope.testDataReqDto.testEnv.env).then(function(data){
			$scope.testdatamasters.testGroups = data.testGroups;
			$rootScope.testdatamasters.testGroups = data.testGroups;
		});
	};
	
	$scope.onChangeGroup = function(){
		$scope.testdatas = {};
		$scope.testdatamasters.testLocales = {};
		$scope.testdatamasters.testScenarios = {};
		$scope.testDataReqDto.testScenario = {};
		$rootScope.testdatamasters.testLocales = {};
		
		FilterTestDataMaster.getMasterDataLocale($scope.testDataReqDto.testGroup.groupName).then(function(data){
			$scope.testdatamasters.testLocales = data.testLocales;
			$rootScope.testdatamasters.testLocales = data.testLocales;
		});
	};
	
	$scope.onChangeLocale = function(){
		$scope.testdatas = {};
		$scope.testdatamasters.testScenarios = {};
		$scope.testDataReqDto.testScenario = {};
		$rootScope.testdatamasters.testScenarios = {};
		
		FilterTestDataMaster.getMasterDataScenario($scope.testDataReqDto.testLocale.locale).then(function(data){
			$scope.testdatamasters.testScenarios = data.testScenarios;
			$rootScope.testdatamasters.testScenarios = data.testScenarios;
		});
	};
	
	$scope.onClickEdit = function(param){
		localStorage.setItem('editSourcePage',param);
	};
	
	$scope.onClickCheckbox = function($event, params){
		$event.preventDefault();
		var isDisabled = false;
		
		if($scope.checkboxes[params]){ 
			isDisabled = true;
	    }
		
		$scope.modalIsDisabled = isDisabled;
		$('#confirmModal').data('params', {key:params, disabled:isDisabled}).modal('show');
	};
	
	$scope.onClickBtnYes = function(){
		var params = $('#confirmModal').data('params');
		var testData = $scope.testdatas[params.key];
		$scope.formTestDataReqDto = {};
		$scope.formTestDataReqDto.testId = testData.testId;
		$scope.formTestDataReqDto.disabled = params.disabled;
		testDataService.setEnableDisable($scope.formTestDataReqDto).then(function(data) {
			if(params.disabled){ 
				$("#row-" + testData.testId).addClass('warning');
		    } else {
		    	$("#row-" + testData.testId).removeClass('warning');
		    }
		}, function(data){
    		$scope.serviceError = "An unknown error occurred.";
    	});
		
		testData.disabled = params.disabled;
		$scope.testdatas[params.key] = testData;
		$('#confirmModal').modal('hide');
		//alert("It's in progress. id : " + testData.testId + " isDisabled : " + params.disabled);
	};
		
	$scope.submitted = false;
	$scope.testDataReqDto.testEnv = {};
	$scope.testDataReqDto.testGroup = {};
	$scope.testDataReqDto.testLocale = {};
	$scope.testDataReqDto.testScenario = {};
	$scope.getTestData = function() {
	    if ($scope.testDataReqDto.testGroup.groupName && $scope.testDataReqDto.testLocale.locale && $scope.testDataReqDto.testEnv.env) {
	    	if(angular.isDefined($scope.testDataReqDto.testEnv)){
	    		localStorage.setItem('env', $scope.testDataReqDto.testEnv.env);
	    	}
	    	if(angular.isDefined($scope.testDataReqDto.testGroup)){
	    		localStorage.setItem('groupName', $scope.testDataReqDto.testGroup.groupName);
	    	}
	    	if(angular.isDefined($scope.testDataReqDto.testLocale)){
	    		localStorage.setItem('locale', $scope.testDataReqDto.testLocale.locale);
	    	}
	    	if(angular.isDefined($scope.testDataReqDto.testScenario)){
	    		if($scope.testDataReqDto.testScenario.scenarioName != undefined) {
	    			localStorage.setItem('scenarioName', $scope.testDataReqDto.testScenario.scenarioName);
	    		} else {
	    			localStorage.setItem('scenarioName', '');
	    		}
	    	}
	    	
	    	//$state.go('testdata');
	    	$scope.submitted = true;
	    	$scope.currentPage = configData.currentPage;
	    	$scope.itemsPerPage = configData.itemsPerPage;
	    	$scope.loadData($scope.currentPage, $scope.itemsPerPage, $scope.testDataReqDto);
	    }
	};
	
	$scope.testDataReqDto.testId = 0;
	$scope.stateParamsTemp = $scope.testDataReqDto;
	
	$scope.loadData = function(currentPage, itemsPerPage, reqInput){
		$scope.testDataReqDto.pageNumber = currentPage;
		$scope.testDataReqDto.maxRecords = itemsPerPage;
		
		testDataService.getTestData(reqInput).then(function(data) {
			$scope.testdatas = data.data;
			$scope.maxIndexSize = data.maxIndexSize;
		}, function(data){
			$scope.testdatas = {};
		});
	};
    
	//Pagination attributes
	$scope.currentPage = configData.currentPage;
	$scope.itemsPerPage = configData.itemsPerPage;
	$scope.boundaryLinks = configData.boundaryLinks;
	$scope.directionLinks = configData.directionLinks;
	$scope.rotate = configData.rotate;
	$scope.maxSize = configData.maxSize;

	//get another portions of data on page changed
	$scope.pageChanged = function() {
	  $scope.loadData($scope.currentPage, $scope.itemsPerPage, $scope.testDataReqDto); 
	};
	
	$scope.success = {};
	$scope.redirect = false;
	if(angular.isDefined(Scopes.get('editSuccess'))){
		$scope.success = Scopes.get('editSuccess');
		$scope.redirect = true;
		$timeout(function(){
			$scope.success = {};
			Scopes.set('editSuccess', "");
        }, 5000);
	}
	if(angular.isDefined(Scopes.get('addSuccess'))){
		$scope.success = Scopes.get('addSuccess');
		$scope.redirect = true;
		$timeout(function(){
			$scope.success = {};
			Scopes.set('addSuccess', "");
        }, 5000);
	}
	if(angular.isDefined(Scopes.get('redirect'))){
		$scope.redirect = true;
	}
	if($scope.redirect){
		$scope.testDataReqDto.testEnv = {};
		$scope.testDataReqDto.testGroup = {};
		$scope.testDataReqDto.testLocale = {};
		$scope.testDataReqDto.testScenario = {};
		
		if(angular.isDefined(localStorage.getItem('env')) && localStorage.getItem('env')){
			$scope.testDataReqDto.testEnv.env = {};
			$scope.testDataReqDto.testEnv.env = localStorage.getItem('env');
		}
		if(angular.isDefined(localStorage.getItem('groupName')) && localStorage.getItem('groupName')){
			$scope.testDataReqDto.testGroup = {};
			$scope.testDataReqDto.testGroup.groupName = localStorage.getItem('groupName');
		}
		if(angular.isDefined(localStorage.getItem('locale')) && localStorage.getItem('locale')){
			$scope.testDataReqDto.testLocale = {};
			$scope.testDataReqDto.testLocale.locale = localStorage.getItem('locale');
		}
		if(angular.isDefined(localStorage.getItem('scenarioName'))){
			$scope.testDataReqDto.testScenario = {};
			$scope.testDataReqDto.testScenario.scenarioName = localStorage.getItem('scenarioName');
		}
		
		if($rootScope.hasOwnProperty('testdatamasters.testGroups')) {
			$scope.testdatamasters.testGroups = $rootScope.testdatamasters.testGroups;
		} else {
			FilterTestDataMaster.getMasterDataGroup($scope.testDataReqDto.testEnv.env).then(function(data){
				$scope.testdatamasters.testGroups = data.testGroups;
				$rootScope.testdatamasters.testGroups = {};
				$rootScope.testdatamasters.testGroups = data.testGroups;
			});
		}
		if($rootScope.hasOwnProperty('testdatamasters.testLocales')) {
			$scope.testdatamasters.testLocales = $rootScope.testdatamasters.testLocales;
		} else {
			FilterTestDataMaster.getMasterDataLocale($scope.testDataReqDto.testGroup.groupName).then(function(data){
				$scope.testdatamasters.testLocales = data.testLocales;
				$rootScope.testdatamasters.testLocales = {};
				$rootScope.testdatamasters.testLocales = data.testLocales;
			});
		}
		if($rootScope.hasOwnProperty('testdatamasters.testScenarios')) {
			$scope.testdatamasters.testScenarios = $rootScope.testdatamasters.testScenarios;
		} else {
			FilterTestDataMaster.getMasterDataScenario($scope.testDataReqDto.testLocale.locale).then(function(data){
				$scope.testdatamasters.testScenarios = data.testScenarios;
				$rootScope.testdatamasters.testLocales = {};
				$rootScope.testdatamasters.testScenarios = data.testScenarios;
			});
		}
		
		Scopes.set('redirect', false);		
		$scope.loadData($scope.currentPage, $scope.itemsPerPage, $scope.testDataReqDto);
	}
	
	TestDataMaster.query().$promise.then(function(data){
		$rootScope.testdatamasters = {};
		$scope.testdatamasters.testEnvs = data.testEnvs;
		$rootScope.testdatamasters.testEnvs = data.testEnvs;
	}, function(data){
		$scope.serviceError = "An unknown error occurred.";
	});
	
	var $eventSelect1 = $('#env');
	$eventSelect1.select2();
	if($scope.testDataReqDto.testEnv != undefined && $scope.testDataReqDto.testEnv.env != undefined){
		$eventSelect1.select2().select2('val', $scope.testDataReqDto.testEnv.env);
		$('#select2-env-container').html($scope.testDataReqDto.testEnv.env);
	}
	$eventSelect1.on("change", function (e) { 
		$scope.testDataReqDto.testEnv = {};
		if(this.value){
			$scope.testDataReqDto.testEnv.env = this.value; 
		};
		$('#select2-Group-container').html('Select Group');
		$('#select2-Country-container').html('Select Country');
		$('#select2-Scenario-container').html('Select Scenario');
		$scope.onChangeEnv(); 
	});
	
	var $eventSelect2 = $('#Group');
	$eventSelect2.select2();
	if($scope.testDataReqDto.testGroup != undefined && $scope.testDataReqDto.testGroup.groupName != undefined){
		$eventSelect2.select2().select2('val', $scope.testDataReqDto.testGroup.groupName);
		$('#select2-Group-container').html($scope.testDataReqDto.testGroup.groupName);
	}
	$eventSelect2.on("change", function (e) {
		$scope.testDataReqDto.testGroup = {};
		if(this.value){
			$scope.testDataReqDto.testGroup.groupName = this.value; 
		};
		$('#select2-Country-container').html('Select Country');
		$('#select2-Scenario-container').html('Select Scenario');
		$scope.onChangeGroup(); 
	});
	var $eventSelect3 = $('#Country');
	$eventSelect3.select2();
	if($scope.testDataReqDto.testLocale != undefined && $scope.testDataReqDto.testLocale.locale != undefined){
		$eventSelect3.select2().select2('val', $scope.testDataReqDto.testLocale.locale);
		$('#select2-Country-container').html($scope.testDataReqDto.testLocale.locale);
		$('#select2-Scenario-container').html('Select Scenario');
	}
	$eventSelect3.on("change", function (e) { 
		$scope.testDataReqDto.testLocale = {};
		if(this.value){
			$scope.testDataReqDto.testLocale.locale = this.value; 
		};
		$('#select2-Scenario-container').html('Select Scenario');
		$scope.onChangeLocale(); 
	});
	var $eventSelect4 = $('#Scenario');
	$eventSelect4.select2();
	if($scope.testDataReqDto.testScenario != undefined && $scope.testDataReqDto.testScenario.scenarioName != undefined){
		if($scope.testDataReqDto.testScenario.scenarioName){
			$eventSelect4.select2().select2('val', $scope.testDataReqDto.testScenario.scenarioName);
			$('#select2-Scenario-container').html($scope.testDataReqDto.testScenario.scenarioName);
		}
	}
	$eventSelect4.on("change", function (e) { 
		$scope.testDataReqDto.testScenario = {};
		$scope.testDataReqDto.testScenario.scenarioName = this.value; 
	});
}).controller('TestDataCreateController',function($scope, $state, $stateParams, $window, $filter, TestDataMaster, testDataService, Scopes, JsonValidation){
	$scope.serviceError = {};
	$scope.formTestDataReqDto = {};
	$scope.testDataReqDto = {};
	var queryParam = {};
	
	$scope.testdatamasters = TestDataMaster.query().$promise.then(function(data){
		$scope.testdatamasters = data;
	}, function(data){
		$scope.serviceError = "An unknown error occurred.";
	});

    $scope.addTestData=function(){
    	$scope.formTestDataReqDto.env = $scope.testDataReqDto.testEnv.env;
		$scope.formTestDataReqDto.groupName = $scope.testDataReqDto.testGroup.groupName;
		$scope.formTestDataReqDto.locale = $scope.testDataReqDto.testLocale.locale;
		$scope.formTestDataReqDto.scenarioName = $scope.testDataReqDto.testScenario.scenarioName;
		$scope.formTestDataReqDto.scenarioPriority = $scope.testDataReqDto.testScenario.scenarioPriority;
		$scope.formTestDataReqDto.scenarioDescription = $scope.testDataReqDto.testScenario.scenarioDescription;
		
		localStorage.setItem('env', $scope.testDataReqDto.testEnv.env);
    	localStorage.setItem('groupName', $scope.testDataReqDto.testGroup.groupName);
    	localStorage.setItem('locale', $scope.testDataReqDto.testLocale.locale);
    	localStorage.setItem('scenarioName', $scope.testDataReqDto.testScenario.scenarioName);
		
    	//$scope.formTestDataReqDto.updatedDate = new Date();
    	//Set default value 
    	// Remove once data recieve from UI
    	$scope.formTestDataReqDto.testDataType = 'json';
    	$scope.formTestDataReqDto.updatedBy = 'Web UI';
    	
    	if(JsonValidation.isJsonValid($scope.formTestDataReqDto.testData)){
	    	testDataService.setTestData($scope.formTestDataReqDto).then(function(data) {
	    		//$window.alert("Test data added.");
	    		Scopes.set('addSuccess', 'Test data added.');
	    		$state.go('testdatamaster', queryParam);
	    	}, function(data){
	    		$scope.serviceError = "An unknown error occurred.";
	    	});
    	} else {
    		$scope.formTestDataReqDto.invalidJson = true;
    	}
    };
    
    var $eventSelect1 = $('#env');
	$eventSelect1.select2({
		tags: true
	});
	$eventSelect1.on("change", function (e) { 
		$scope.testDataReqDto.testEnv = {};
		if(this.value){
			$scope.testdatamasters.testEnvs.push({env: this.value}); 
			$scope.testDataReqDto.testEnv.env = this.value; 
		};
	});
	
	var $eventSelect2 = $('#Group');
	$eventSelect2.select2({
		tags: true
	});
	$eventSelect2.on("change", function (e) { 
		$scope.testDataReqDto.testGroup = {};
		if(this.value){
			$scope.testdatamasters.testGroups.push({groupName: this.value});
			$scope.testDataReqDto.testGroup.groupName = this.value; 
		};
	});
	
	var $eventSelect3 = $('#Locale');
	$eventSelect3.select2({
		tags: true
	});
	$eventSelect3.on("change", function (e) { 
		$scope.testDataReqDto.testLocale = {};
		if(this.value){
			$scope.testdatamasters.testLocales.push({locale: this.value}); 
			$scope.testDataReqDto.testLocale.locale = this.value; 
		};
	});
	
	var $eventSelect4 = $('#Scenario');
	var $eventSelect5 = $('#Priority');
	var $eventSelect6 = $('#ScenarioDescription');
	
	$eventSelect4.select2({
		tags: true
	});
	$eventSelect4.on("change", function (e) { 
		$scope.testDataReqDto.testScenario = {};
		if(this.value){
			$scope.testdatamasters.testScenarios.push({scenarioName: this.value});
			$scope.testDataReqDto.testScenario.scenarioName = this.value;
			var found = $filter('filter')($scope.testdatamasters.testScenarios, {scenarioName: this.value}, true);
			
			$eventSelect5.val(found[0].scenarioPriority);
			$eventSelect6.val(found[0].scenarioDescription);
			if(found[0].scenarioPriority != undefined){
				$eventSelect5.attr('disabled', true);
				$eventSelect6.attr('disabled', true);
				$scope.testDataReqDto.testScenario.scenarioPriority = found[0].scenarioPriority;
				$scope.testDataReqDto.testScenario.scenarioDescription = found[0].scenarioDescription;
			}else{
				$eventSelect5.removeAttr('disabled');
				$eventSelect6.removeAttr('disabled');
			}
		};
	});
	
}).controller('TestDataEditController',function($scope, $state, $stateParams, $window, $filter, testDataService, Scopes, JsonValidation){
	$scope.serviceError = {};
	$scope.formTestDataReqDto = {};

    $scope.updateTestData=function(param){
    	if(JsonValidation.isJsonValid($scope.formTestDataReqDto.testData)){
	    	$scope.formTestDataReqDto.env = $scope.formTestDataReqDto.env;
	    	//$scope.formTestDataReqDto.updatedDate = new Date();
	    	testDataService.setTestData($scope.formTestDataReqDto).then(function(data) {
	    		// $window.alert("Test data updated.");
	    		Scopes.set('editSuccess', 'Test data updated.');
	    		if("searchOrReplace" == localStorage.getItem('editSourcePage')){
	    			localStorage.removeItem('editSourcePage');
	        		$state.go('searchOrReplace');
	        	}else{
	        		$state.go('testdatamaster');
	        	}
	    	}, function(data){
	    		$scope.formTestDataReqDto.env = $scope.formTestDataReqDto.env
	    		$scope.serviceError = "Test data update error.";
	    	});
    	} else {
    		$scope.formTestDataReqDto.invalidJson = true;
    	}
    };

    $scope.loadTestData=function(){
    	var testDataReqDto = {};
        testDataReqDto.testId = parseInt($stateParams.id);
        testDataReqDto.testGroup = {};
        testDataReqDto.testGroup.groupName = localStorage.getItem('groupName');
        testDataReqDto.testEnv = {};
        testDataReqDto.testEnv.env = {};
        testDataReqDto.testEnv.env = localStorage.getItem('env');
    	
    	testDataService.getTestData(testDataReqDto).then(function(data) {
    		angular.forEach(data.data, function(value, key) {
    			$scope.formTestDataReqDto.env = value.env;
    			$scope.formTestDataReqDto.groupName = value.groupName;
    			$scope.formTestDataReqDto.locale = value.locale;
    			$scope.formTestDataReqDto.scenarioName = value.scenarioName;
    			$scope.formTestDataReqDto.scenarioPriority = value.scenarioPriority;
    			$scope.formTestDataReqDto.testScenarioName = value.testScenarioName;
    			$scope.formTestDataReqDto.testId = value.testId;
    			$scope.formTestDataReqDto.testDataType = value.testDataType;
    			//$scope.formTestDataReqDto.testData = value.testData;
    			var jsonData = null;
    			try {
    				jsonData = JSON.parse(value.testData);
    				$scope.formTestDataReqDto.testData = $filter('json')(jsonData, 4);
    			} catch(e) {
    				console.log("Invalid JSON");
    			}
    			 
    			if(jsonData === null) {
    				$scope.formTestDataReqDto.testData = value.testData;
    			}
    			
    			$scope.formTestDataReqDto.updatedBy = value.updatedBy;
			});
    	}, function(data){
    		$scope.serviceError = "An unknown error occurred.";
    	});
    };

    $scope.loadTestData();
    $scope.back = function(){
    	Scopes.set('redirect', true);
    	if("searchOrReplace" == localStorage.getItem('editSourcePage')){
    		$state.go('searchOrReplace');
    	}else{
    		$state.go('testdatamaster');
		}
    };
}).controller('ResultController',function($scope, $state, $stateParams, $window, $filter, $modal, $sce, $timeout, testDataService, TestDataMaster, downloadService, dateDiffService){
    console.log("Log -- groupName : " + $stateParams.groupName + " suitId : " + $stateParams.suitId + " envd : " + $stateParams.env);
    /*
    * Remove local storage
    */
    localStorage.removeItem('env');
    localStorage.removeItem('groupName');
    localStorage.removeItem('locale');
    localStorage.removeItem('scenarioName');
    
    $scope.testdatamasters = {};
    $scope.serviceError = {};
    $scope.activeValue;
    $scope.resultReqDto = {};
    $scope.resultMasterDatas = {};
    $scope.resultDatas = {};
    $scope.resultReqDto.env = {};
    $scope.param = {};
    $scope.otherActiveTab = false;
    $scope.reportVisibility = false;
    $scope.scope = {};
    
    $scope.pci_compliance = false;
    
    
    
    $scope.togglePciComplianceReport = function() {
    	$scope.pci_compliance = !$scope.pci_compliance;
    };
    
    
     var pcidata = function(resultData){
    	
    	var group = [];
    	 
    	var results = resultData[0].resultTestCases;
    	console.log(results);
    	var datas = [];
    	for( var i =0;i<results.length;i++){
    		var result = results[i];
    		var testData = result.testData;
        	var record = {
        			locale : testData.locale,
        			scenarioName :testData.testScenarioName,
        			testscenario : testData.scenarioName,
        			blc :false,
        			ops :false
        	};
        	datas.push(record);
    	}
    	
    	var groupMapping = [];
    	for( var i=0; i< datas.length; i++){
    		var groupKey = datas[i].locale+"-"+datas[i].scenarioName; 
    		console.log(groupKey+"TEST");
    		if (groupMapping[groupKey]){
    			var data = groupMapping[groupKey];
    			if ( !data.blc )
    				data.blc = datas[i].testscenario.toLowerCase().indexOf("blc") > 0;
    			if ( !data.ops)
        			data.ops = datas[i].testscenario.toLowerCase().indexOf("ops") > 0;
    		}else{
    			var data =  datas[i];
    			data.blc = data.testscenario.toLowerCase().indexOf("blc") > 0;
        		data.ops = data.testscenario.toLowerCase().indexOf("ops") > 0;
        		groupMapping[groupKey] = data;
    		}
    	}
    	
    	for( key in groupMapping){
    		group.push(groupMapping[key]);
    	}
    	
    	return group;
    	
    };
    
    $scope.loadResultData = function(resultReqDto){
	    testDataService.getResultData(resultReqDto).then(function(data) {
	           $scope.resultDatas = data.resultData;
	           $scope.pciDatas = pcidata(data.resultData);
	           
	           
	           console.log("pci data",$scope.pciDatas)
	           
	           $scope.serviceError = "";
	           modalInstance.dismiss('cancel');
	    }, function(data){
	           $scope.serviceError = "No data found.";
	    });
    };
    
    var modalInstance = {};
	$scope.getResultSuitData = function(param) {
	    modalInstance = $modal.open({
	         templateUrl: 'spinnermodal.html',
	         size: 0,
	         resolve: {}
	    });
	    
	    $scope.resultMasterDatas = {};
	    console.log(param.groupName + "-" + param.suitId);
	    $scope.resultReqDto.pageNumber = configData.currentPage;
	           $scope.resultReqDto.maxRecords = configData.maxResultSuitPerJob;
	           $scope.resultReqDto.groupName = param.groupName;
	           $scope.resultReqDto.suitId = param.suitId;
	           $scope.resultReqDto.env = param.env
	    $scope.loadResultData($scope.resultReqDto);
	          
	 };
	    
	    if($stateParams.groupName != undefined && $stateParams.suitId != undefined){
	           $scope.getResultSuitData($stateParams);
	    }
	    	TestDataMaster.query().$promise.then(function(data){
		           $scope.testdatamasters = data;
		           
		           if($stateParams.groupName == undefined || $stateParams.suitId == undefined){
		        	   
			           $scope.resultReqDto.env = data.testEnvs[0].env;
			           $scope.resultReqDto.pageNumber = configData.currentPage;
			           $scope.resultReqDto.maxRecords = configData.maxResultSuitPerJob;
			           $scope.param.env = data.testEnvs[0].env;
			           $scope.param.index = 0;
			           $scope.otherActiveTab = false;
			           
			           $scope.loadResultMasterData($scope.resultReqDto); 
		           }else{
		        	   $scope.activeValue = $stateParams.env;
		        	   $scope.otherActiveTab = true;
		        	   
		           }
		    }, function(data){
		           $scope.serviceError = "An unknown error occurred.";
		    });
	    
	    $scope.sortType     = 'testData.testScenarioName'; // set the default sort type
	    $scope.sortReverse  = false;  // set the default sort order
	    
	    
	    
	    $scope.getResultSuit = function(param) {
	           $scope.resultDatas = {};
	           $scope.resultReqDto = {};
	           if(param.env == undefined && $stateParams.env != undefined && $stateParams.env){
	        	   param.env = $stateParams.env;
	        	   $scope.otherActiveTab = true;
	           }/*else{
	        	   $scope.otherActiveTab = false;
	           }*/
	           $scope.activeValue = param.env;
	           $scope.resultReqDto.env = param.env;
	           $scope.param.env = param.env;
	           $scope.param.index = param.index;
	           
	           if(param.index != 0){
	                  document.getElementById("0").className = 'ng-scope';
	           } else {
	                  document.getElementById("0").className = 'ng-scope active';
	           }
	           
	           $scope.loadResultMasterData($scope.resultReqDto); 
	    };
	    

	    $scope.downloadResultData = function() {

			console.log("Start downloading")
			var uri = 'data:application/vnd.ms-excel;base64,', template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table1}</table><br><br><table>{table2}</table></body></html>', base64 = function(
					s) {
				return $window
						.btoa(unescape(encodeURIComponent(s)));
			}, format = function(s, c) {
				return s.replace(/{(\w+)}/g, function(m, p) {
					return c[p];
				})
			};
			var table1 = $('#mytbl2'), table2 = $('#mytbl');

			var ctx = {
				worksheet : 'Result Data',
				table1 : table1.html(),
				table2 : table2.html()
			}, exportHref = uri + base64(format(template, ctx));
			$timeout(function() {
				location.href = exportHref;
			}, 100);
		};
	        
	    
	    $scope.loadResultMasterData = function(resultReqDto){
	           resultReqDto.pageNumber = configData.currentPage;
	           resultReqDto.maxRecords = configData.maxResultSuitPerJob;
	    testDataService.getResultMasterData(resultReqDto).then(function(data) {
	           $scope.resultMasterDatas = data.resultMasterData;
	           $scope.serviceError = "";
	    }, function(data){
	           $scope.serviceError = "No data found.";
	    });
	 };
	 
	 $scope.downloadFile = function(file){
	    downloadService.download(file.fileName)
	     .then(function(success) {
	         console.log('success : ' + success);
	     }, function(error) {
	         console.log('error : ' + error);
	     });
	 };
	 
	 $scope.dateDiff = function(dates){
	    var endDate = $filter('date')(new Date(), "MM/dd/yyyy");
	    var startDate = $filter('date')(new Date(dates.startDate), "MM/dd/yyyy");
	    return dateDiffService.dateDiffInMonths(startDate, endDate);
	 };
	 
	 $scope.srcTitle = {};
	 $scope.imageSrc = {};
	 $scope.videoSrc = {};
	 $scope.logData = {};
	 $scope.testDataModal = {};
	 $scope.isImage = false;
	 $scope.isVideo = false;
	 $scope.isMp4 = true;
	 
	 $scope.newWindow = function(params){
		 if(params.video !== undefined &&  params.video.length){
			 $window.open(params.video, '_blank');
		 }
	 };

	 
	 $scope.setData = function(params){
	    jQuery('#myModal video').attr("src", "");
	    if(params.image !== undefined &&  params.image.length){
	           $scope.isImage = true;
	           $scope.srcTitle = "Image";
	           //$scope.imageSrc = downloadService.resourceSrc(params.image);
	           $scope.imageSrc = $sce.trustAsResourceUrl(params.image);
	        $scope.videoSrc = {};
	        $scope.logData = {};
	        $scope.testDataModal = {};
	    }
	    if(params.video !== undefined &&  params.video.length){
	           $scope.isVideo = true;
	           $scope.srcTitle = "Video";
	           $scope.videoSrc = {};
	           var videoType = params.video.substr(params.video.length - 4);
	           if(videoType == '.flv'){
	                  $scope.isMp4 = false;
	           } else {
	                  $scope.isMp4 = true;
	           }
	           //$scope.videoSrc = downloadService.resourceSrc(params.video);
	           $scope.videoSrc = $sce.trustAsResourceUrl(params.video);
	        $scope.imageSrc = {};
	        $scope.logData = {};
	        $scope.testDataModal = {};
	        jQuery('#myModal video').attr("src", $scope.videoSrc);
	    }
	    if(params.logData !== undefined &&  params.logData.length){
	           $scope.srcTitle = "Log";
	           $scope.logData = params.logData;
	        $scope.imageSrc = {};
	        $scope.videoSrc = {};
	        $scope.testDataModal = {};
	    }
	    if(params.testData !== undefined){
	           $scope.srcTitle = "Test Data";
	           var jsonData = null;
	                  try {
	                        jsonData = JSON.parse(params.testData.testData);
	                        $scope.testDataModal = params.testData;
	                        $scope.testDataModal.testData = $filter('json')(jsonData, 4);
	                  } catch(e) {
	                        console.log("Invalid JSON");
	                  }
	                  
	                  if(jsonData === null) {
	                        $scope.testDataModal = params.testData;
	                  }
	        $scope.imageSrc = {};
	        $scope.videoSrc = {};
	        $scope.logData = {};
	    }
	 };
	 
	 $scope.playOrPause = function(ele){
	         var video = angular.element(document.querySelector('#video'));
	         if(video[0] !== undefined){
	                if(ele === 1){
	                   video[0].play();
	                } else {
	                   video[0].pause();
	                }
	         }
	    };
	    
	     $scope.isODRefreshed = false;
	    $scope.ordRefreshMsg = "Getting order data...";
	    $scope.orderDatas = {};
	    $scope.loadOrderData = function(reqDto){
	    testDataService.getOrderData(reqDto).then(function(data) {
	           $scope.orderDatas = data.resultOrderData;
	           $scope.serviceError = "";
	           if($scope.isODRefreshed){
	                  var timer = false;
	                  var refresh = angular.element(document.querySelector("#iconRefresh"));
	           if(timer){
	                 $timeout.cancel(timer);
	             }  
	             timer= $timeout(function(){
	                    refresh.removeClass("glyphicon-refresh-animate");
	                    $scope.isODRefreshed = false;
	              }, 500);
	           }
	    }, function(data){
	           $scope.serviceError = "No data found.";
	    });
	 };
	 
	 $scope.reqOrderData = {};
	 $scope.setOrderData = function(params){
	    var reqDto = {};
	    reqDto.suitId = params.suitId;
	    $scope.reqOrderData = reqDto;
	    $scope.loadOrderData($scope.reqOrderData);
	 };
	 
	 $scope.refreshOrderData = function(){
	    $scope.isODRefreshed = true;
	    var refresh = angular.element(document.querySelector("#iconRefresh"));
	    refresh.addClass("glyphicon-refresh-animate");
	    $scope.loadOrderData($scope.reqOrderData);
	 };
}).controller('NavbarController',function($scope, $location){
	$scope.getClass = function(path) {
	    if ($location.path().substr(0, path.length) == path) {
	      return "active";
	    } else {
	      return "";
	    }
	};
}).controller('ChartController',function($scope){
	/*
	 * Remove local storage
	 */
	localStorage.removeItem('env');
	localStorage.removeItem('groupName');
	localStorage.removeItem('locale');
	localStorage.removeItem('scenarioName');
	
	// Chart.js Data    
     $scope.lineChartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','Aug','January', 'February', 'March', 'April', 'May', 'June', 'July','Aug','January', 'February', 'March', 'April', 'May', 'June', 'July','Aug','January', 'February', 'March', 'April', 'May', 'June', 'July','Aug'],
      datasets: [
        {
          label: 'First dataset',
          fillColor: 'rgba(220,220,220,0.2)',
          strokeColor: 'rgba(220,220,220,1)',
          pointColor: 'rgba(220,220,220,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: [65, 59, 80, 81, 56, 55, 40, 10, 65, 59, 80, 81, 56, 55, 40, 10, 65, 59, 80, 81, 56, 55, 40, 10, 65, 59, 80, 81, 56, 55, 40, 10]
        },
        {
          label: 'Second dataset',
          fillColor: 'rgba(151,187,205,0.2)',
          strokeColor: 'rgba(151,187,205,1)',
          pointColor: 'rgba(151,187,205,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(151,187,205,1)',
          data: [28, 48, 40, 19, 86, 27, 90, 20, 65, 59, 80, 81, 56, 55, 40, 10, 65, 59, 80, 81, 56, 55, 40, 10, 65, 59, 80, 81, 56, 55, 40, 10]
        },
        {
            label: 'Third dataset',
            fillColor: 'rgba(300,197,105,0.2)',
            strokeColor: 'rgba(300,197,105,1)',
            pointColor: 'rgba(300,197,105,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(151,187,205,1)',
            data: [19, 35, 37, 11, 3, 93, 87, 80]
          }
      ]
    };
     $scope.lineChartData1 = {
    	      labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July','Aug'],
    	      datasets: [
    	        {
    	          label: 'First dataset',
    	          fillColor: 'rgba(220,220,220,0.2)',
    	          strokeColor: 'rgba(220,220,220,1)',
    	          pointColor: 'rgba(220,220,220,1)',
    	          pointStrokeColor: '#fff',
    	          pointHighlightFill: '#fff',
    	          pointHighlightStroke: 'rgba(220,220,220,1)',
    	          data: [65, 59, 80, 81, 56, 55, 40, 10]
    	        },
    	        {
    	          label: 'Second dataset',
    	          fillColor: 'rgba(151,187,205,0.2)',
    	          strokeColor: 'rgba(151,187,205,1)',
    	          pointColor: 'rgba(151,187,205,1)',
    	          pointStrokeColor: '#fff',
    	          pointHighlightFill: '#fff',
    	          pointHighlightStroke: 'rgba(151,187,205,1)',
    	          data: [28, 48, 40, 19, 86, 27, 90, 20]
    	        },
    	        {
    	            label: 'Third dataset',
    	            fillColor: 'rgba(300,197,105,0.2)',
    	            strokeColor: 'rgba(300,197,105,1)',
    	            pointColor: 'rgba(300,197,105,1)',
    	            pointStrokeColor: '#fff',
    	            pointHighlightFill: '#fff',
    	            pointHighlightStroke: 'rgba(151,187,205,1)',
    	            data: [19, 35, 37, 11, 3, 93, 87, 80]
    	          }
    	      ]
    	    };
    // Chart.js Options
    $scope.lineChartOptions =  {
      // Sets the chart to be responsive
      responsive: true,

      ///Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines : true,

      //String - Colour of the grid lines
      scaleGridLineColor : "rgba(0,0,0,.05)",

      //Number - Width of the grid lines
      scaleGridLineWidth : 1,

      //Boolean - Whether the line is curved between points
      bezierCurve : false,

      //Number - Tension of the bezier curve between points
      bezierCurveTension : 0.4,

      //Boolean - Whether to show a dot for each point
      pointDot : true,

      //Number - Radius of each point dot in pixels
      pointDotRadius : 4,

      //Number - Pixel width of point dot stroke
      pointDotStrokeWidth : 1,

      //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      pointHitDetectionRadius : 20,

      //Boolean - Whether to show a stroke for datasets
      datasetStroke : true,

      //Number - Pixel width of dataset stroke
      datasetStrokeWidth : 2,

      //Boolean - Whether to fill the dataset with a colour
      datasetFill : true,

      // Function - on animation progress
      onAnimationProgress: function(){},

      // Function - on animation complete
      onAnimationComplete: function(){},

      //String - A legend template
      legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };
 }).controller('MediaController',function($scope){
	 
 /*}).controller('ServiceHealthCheckController',function($scope, $state, $stateParams, $filter, $modal, serviceHealthCheck){
	localStorage.removeItem('env');
	localStorage.removeItem('groupName');
	localStorage.removeItem('locale');
	localStorage.removeItem('scenarioName');
	
	 $scope.serviceHealthCheckData = {};
	 $scope.envMaster = {};
	 $scope.param = {};
	 
	 serviceHealthCheck.getEnvNames().then(function(data){
			$scope.envMaster = data;
			$scope.param.env = data[0];
			$scope.param.index = 0;
			
			$scope.loadServiceHealthData($scope.param.env);
		}, function(data){
			$scope.serviceError = "An unknown error occurred.";
		});
	 
	 var modalInstance = {};
	 $scope.getServiceHealthData = function(param) {
		$scope.serviceHealthCheckData = {};
		$scope.activeValue = param.env;
		$scope.param.env = param.env;
		$scope.param.index = param.index;
		
		if(param.index != 0){
			document.getElementById("0").className = 'ng-scope';
		} else {
			document.getElementById("0").className = 'ng-scope active';
		}
		$scope.loadServiceHealthData(param.env);
	};
	
	$scope.serviceData = {};
	$scope.grpDateMap = {};
	$scope.serviceBaseUri = {};
	$scope.loadServiceHealthData = function(env){
		console.log('loadServiceHealthData Timer 2 : ');
		var startAt = new Date();
		
		modalInstance = $modal.open({
            templateUrl: 'spinnermodal.html',
            size: 0,
            resolve: {}
    	});
		
		serviceHealthCheck.getServiceHealthCheckMap(env).then(function(data) {
			$scope.serviceHealthCheckData = data;
			console.log("Data: " + JSON.stringify(data));
			var endAt1 = new Date();
			console.log('Time in service call at controller : ' + (endAt1 - startAt));
			
			angular.forEach(data, function(value, key) {
				var listDate = [];
				var listService = {};
				var listBaseUri = {};
				
				angular.forEach(value, function(valueInr, keyInr) {
					listDate.push(keyInr);
					
					angular.forEach(valueInr, function(dataInr) {
						if(listService[dataInr.serviceHealthCheckMasterDTO.envBaseURL + dataInr.serviceHealthCheckMasterDTO.serviceEndPoint + '_' + dataInr.serviceHealthCheckMasterDTO.serviceMethod] !== dataInr.serviceHealthCheckMasterDTO.envBaseURL + dataInr.serviceHealthCheckMasterDTO.serviceEndPoint + '_' + dataInr.serviceHealthCheckMasterDTO.serviceMethod){
							listService[dataInr.serviceHealthCheckMasterDTO.envBaseURL + dataInr.serviceHealthCheckMasterDTO.serviceEndPoint + '_' + dataInr.serviceHealthCheckMasterDTO.serviceMethod] = dataInr;
						}
						
						if(listBaseUri[dataInr.serviceHealthCheckMasterDTO.envBaseURL] !== dataInr.serviceHealthCheckMasterDTO.envBaseURL){
							$scope.serviceBaseUri[key] = dataInr.serviceHealthCheckMasterDTO.envBaseURL;
						}
					});
				});
				
				$scope.serviceData[key] = listService;
				$scope.grpDateMap[key] = listDate;
				modalInstance.dismiss('cancel');
			});
			var endAt2 = new Date();
			console.log('Total time at controller : ' + (endAt2 - startAt));
			
    		$scope.serviceError = "";
    	}, function(data){
    		$scope.serviceError = "No data found.";
    	});
    };
    
    $scope.isAutoTogle = function() {
    	function toggleChevron(e) {
    		$('.indicator').removeClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign').addClass('glyphicon-plus-sign');
    		
    		var ele = $(e.target);
    		var flag = ele.hasClass('in');
    		
    		if(flag) {
	    		ele.prev('.panel-heading')
	    	        .find("i.indicator")
	    	        .toggleClass('glyphicon-minus-sign glyphicon-plus-sign');
    		}
    	}
    	$('#accordion').on('hidden.bs.collapse', toggleChevron);
    	$('#accordion').on('shown.bs.collapse', toggleChevron);
    };
 }).controller('ServiceHealthCheckControllerTest',function($scope, $state, $stateParams, $filter, $modal, serviceHealthCheckTest){
		localStorage.removeItem('env');
		localStorage.removeItem('groupName');
		localStorage.removeItem('locale');
		localStorage.removeItem('scenarioName');
		
		 $scope.serviceHealthCheckData = {};
		 $scope.envMaster = {};
		 $scope.param = {};
		 
		 serviceHealthCheckTest.getEnvNames().then(function(data){
				$scope.envMaster = data;
				$scope.param.env = data[0];
				$scope.param.index = 0;
				
				$scope.loadServiceHealthData($scope.param.env);
			}, function(data){
				$scope.serviceError = "An unknown error occurred.";
			});
		 
		 var modalInstance = {};
		 $scope.getServiceHealthData = function(param) {
			$scope.serviceHealthCheckData = {};
			$scope.activeValue = param.env;
			$scope.param.env = param.env;
			$scope.param.index = param.index;
			
			if(param.index != 0){
				document.getElementById("0").className = 'ng-scope';
			} else {
				document.getElementById("0").className = 'ng-scope active';
			}
			
			$scope.loadServiceHealthData(param.env); 
		};
		
		$scope.serviceData = {};
		$scope.grpDateMap = {};
		$scope.serviceBaseUri = {};
		$scope.loadServiceHealthData = function(env){
			var startAt = new Date();
			
			modalInstance = $modal.open({
	            templateUrl: 'spinnermodal.html',
	            size: 0,
	            resolve: {}
	    	});
			
			serviceHealthCheckTest.getServiceHealthCheckMap(env).then(function(data) {
				$scope.serviceHealthCheckData = data;
				var endAt1 = new Date();
				console.log('Time in service call at controller : ' + (endAt1 - startAt));
				
				modalInstance.dismiss('cancel');
				
				var endAt2 = new Date();
				console.log('Total time at controller : ' + (endAt2 - startAt));
				
	    		$scope.serviceError = "";
	    	}, function(data){
	    		$scope.serviceError = "No data found.";
	    	});
	    };
	    
	    $scope.isAutoTogle = function() {
	    	function toggleChevron(e) {
	    		$('.indicator').removeClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign').addClass('glyphicon-plus-sign');
	    		
	    		var ele = $(e.target);
	    		var flag = ele.hasClass('in');
	    		
	    		if(flag) {
		    		ele.prev('.panel-heading')
		    	        .find("i.indicator")
		    	        .toggleClass('glyphicon-minus-sign glyphicon-plus-sign');
	    		}
	    	}
	    	$('#accordion').on('hidden.bs.collapse', toggleChevron);
	    	$('#accordion').on('shown.bs.collapse', toggleChevron);
	    };
*/
 }).controller('ServiceHealthCheckController',function($scope, $state, $stateParams, $filter, $modal, serviceHealthCheck){
		/*
		 * Remove local storage
		 */
		localStorage.removeItem('env');
		localStorage.removeItem('groupName');
		localStorage.removeItem('locale');
		localStorage.removeItem('scenarioName');
		
		 $scope.serviceHealthCheckData = {};
		 $scope.envMaster = {};
		 $scope.param = {};
		 $scope.groupMaster = {};
		 var oldKey = "";
		 
		 serviceHealthCheck.getEnvNames().then(function(data){
			 	$scope.groupMaster = [];
			 	$scope.serviceHealthCheckData = {};
			 	$scope.envMaster = data;
				$scope.param.env = data[0];
				$scope.param.index = 0;
				
				$scope.getGrpNames($scope.param.env);
			}, function(data){
				$scope.serviceError = "An unknown error occurred.";
			});
		 
		 	$scope.getGrpNames = function(env){
		 		$scope.serviceHealthCheckData = {};
		 		
		 		serviceHealthCheck.getGrpNames(env).then(function(data) {
		 			$scope.groupMaster = data;
		 			$scope.loadServiceHealthData(env, data[0]);
		    	}, function(data){
		    		$scope.serviceError = "No data found.";
		    	});
			};
		 
		 //var modalInstance = {};
		 $scope.getServiceHealthData = function(param) {
			$scope.groupMaster = []; 
			$scope.serviceHealthCheckData = {};
			$scope.activeValue = param.env;
			$scope.param.env = param.env;
			$scope.param.index = param.index;
			
			if(param.index != 0){
				document.getElementById("0").className = 'ng-scope';
			} else {
				document.getElementById("0").className = 'ng-scope active';
			}
			
			$scope.getGrpNames(param.env);
		};
		
		$scope.serviceData = {};
		$scope.grpDateMap = {};
		$scope.serviceBaseUri = {};
		
		$scope.loadServiceHealthData = function(env, group){
			$scope.serviceHealthCheckData = {};
			var startAt = new Date();
			oldKey = group;
			
			/*modalInstance = $modal.open({
	            templateUrl: 'spinnermodal.html',
	            size: 0,
	            resolve: {}
	    	});*/
			
			serviceHealthCheck.getServiceHealthCheckMap(env, group).then(function(data) {
				$scope.serviceHealthCheckData = data[group];
				var endAt1 = new Date();
				console.log('Time in service call at controller : ' + (endAt1 - startAt));
				
				//modalInstance.dismiss('cancel');
				
				console.log('Total time at controller : ' + (new Date() - startAt));
				
	    		$scope.serviceError = "";
	    	}, function(data){
	    		//modalInstance.dismiss('cancel');
	    		$scope.serviceError = "No data found.";
	    	});
	    };
	    
	    $scope.isAutoTogle = function(key) {
	    	if(oldKey != key){
	    		$scope.loadServiceHealthData($scope.param.env, key);
	    	}
	    	function toggleChevron(e) {
	    		$('.indicator').removeClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign').addClass('glyphicon-plus-sign');
	    		
	    		var ele = $(e.target);
	    		var flag = ele.hasClass('in');
	    		
	    		if(flag) {
		    		ele.prev('.panel-heading')
		    	        .find("i.indicator")
		    	        .toggleClass('glyphicon-minus-sign glyphicon-plus-sign');
	    		}
	    	}
	    	$('#accordion').on('hidden.bs.collapse', toggleChevron);
	    	$('#accordion').on('shown.bs.collapse', toggleChevron);
	    };
}).controller('WptDashboardControllerTest',function($scope, $state, $stateParams, $filter, $modal, wptDashboardTestservice){
			/*
			 * Remove local storage
			 */
			localStorage.removeItem('env');
			localStorage.removeItem('groupName');
			localStorage.removeItem('locale');
			localStorage.removeItem('scenarioName');
			
			 $scope.wptDashboardTestDatas = {};
              
			 
			 wptDashboardTestservice.getWptDashboardData().then(function(data){
					$scope.wptDashboardTestDatas = data;
                 	
					//$scope.loadServiceHealthData($scope.param.env);
				}, function(data){
					$scope.serviceError = "An unknown error occurred.";
				});
			 
			 wptDashboardTestservice.getWptPageData("USHomePage").then(function(data){
					$scope.wptDashboardTestDatas = data;
                   
				}, function(data){
					$scope.serviceError = "An unknown error occurred.";
				});
			$scope.isAutoTogle = function() {
		    	function toggleChevron(e) {
		    		$('.indicator').removeClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign').addClass('glyphicon-plus-sign');
		    		
		    		var ele = $(e.target);
		    		var flag = ele.hasClass('in');
		    		
		    		if(flag) {
			    		ele.prev('.panel-heading')
			    	        .find("i.indicator")
			    	        .toggleClass('glyphicon-minus-sign glyphicon-plus-sign');
		    		}
		    	}
		    	$('#accordion').on('hidden.bs.collapse', toggleChevron);
		    	$('#accordion').on('shown.bs.collapse', toggleChevron);
		    };
}).controller('PerfDashboardChart',function($scope, $state, $stateParams, $filter, $modal, wptDashboardTestservice){
				
				// Chart.js Data    
				$scope.lineChartDatas = {};
				 
				 wptDashboardTestservice.getLineChartDashboardData().then(function(data){

			     $scope.lineChartDatas = data;
			                 	
				 //$scope.loadServiceHealthData($scope.param.env);
				 }, function(data){
					$scope.serviceError = "An unknown error occurred.";
				});
			     
			    // Chart.js Options
			    $scope.lineChartOptions =  {
			      // Sets the chart to be responsive
			      responsive: true,

			      ///Boolean - Whether grid lines are shown across the chart
			      scaleShowGridLines : true,

			      //String - Colour of the grid lines
			      scaleGridLineColor : "rgba(0,0,0,.05)",

			      //Number - Width of the grid lines
			      scaleGridLineWidth : 1,

			      //Boolean - Whether the line is curved between points
			      bezierCurve : false,

			      //Number - Tension of the bezier curve between points
			      bezierCurveTension : 0.4,

			      //Boolean - Whether to show a dot for each point
			      pointDot : true,

			      //Number - Radius of each point dot in pixels
			      pointDotRadius : 4,

			      //Number - Pixel width of point dot stroke
			      pointDotStrokeWidth : 1,

			      //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
			      pointHitDetectionRadius : 20,

			      //Boolean - Whether to show a stroke for datasets
			      datasetStroke : true,

			      //Number - Pixel width of dataset stroke
			      datasetStrokeWidth : 2,

			      //Boolean - Whether to fill the dataset with a colour
			      datasetFill : true,

			      // Function - on animation progress
			      onAnimationProgress: function(){},

			      // Function - on animation complete
			      onAnimationComplete: function(){},

			      //String - A legend template
			      legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
			    };
			 })
			 
	/* Changes for WPT Dashboard Tab - starts */		 
	.controller('WPTServiceController',function($scope, $state, $stateParams, $filter, $modal, wptResponseService){

	 $scope.serviceResponseData = {};
	 $scope.param = {};
	 
	 var modalInstance = {};
	 $scope.getWptResponseData = function(param) {
		$scope.wptResponseData = {};
		$scope.activeValue = param.env;
		$scope.param.env = param.env;
		$scope.param.index = param.index;
		
		if(param.index != 0){
			document.getElementById("0").className = 'ng-scope';
		} else {
			document.getElementById("0").className = 'ng-scope active';
		}

		loadWptServiceRespData(param.env); 
	};
	
	loadWptServiceRespData = function(env){
		
		if(typeof env == 'undefined')	{
			env = 'US'; 
		}
		var startAt = new Date();
		
		modalInstance = $modal.open({
            templateUrl: 'spinnermodal.html',
            size: 0,
            resolve: {}
    	});
		
		wptResponseService.getWptResponseDataFromService(env).then(function(data) {
			$scope.wptResponseData = data; 
			var endAt1 = new Date();
			console.log('Time in service call at controller : ' + (endAt1 - startAt));
			
			$scope.wptDates = $scope.wptResponseData.dates;
			$scope.wptServiceRespData = $scope.wptResponseData.deviceData;
			
			$scope.wptLocales = $scope.wptResponseData.locales; 
			$scope.param.env = $scope.wptLocales[0];
			$scope.param.index = 0;
			
			modalInstance.dismiss('cancel');
			
			modalInstance.dismiss('cancel');
			var endAt2 = new Date();
			console.log('Total time at controller : ' + (endAt2 - startAt));
			
    		$scope.serviceError = "";
    	}, function(data){
    		$scope.serviceError = "No data found.";
    	});
		//var rawData = '{"locales": ["US", "BR", "CN"],"dates": ["03/16", "03/17", "03/18", "03/19"],"data":{"computer": [{	"page": "home","03/16": {"fb": "10","vc": "11","lt": "12"},"03/17": {"fb": "33","vc": "33","lt": "445"},"03/18": {"fb": "6y5","vc": "64y4","lt": "34r3r"}}, {"page": "Pdp",	"03/16": {"fb": "4r3r","vc": "dgs","lt": "sdsf"	},"03/17": {"fb": "5545","vc": "345y","lt": "y54y"},"03/18": {"fb": "45y","vc": "y4","lt": "4y4y"}}],"mobile": [{"page": "home","03/16": {"fb": "r656",	"vc": "64","lt": "767"},"03/17": {"fb": "5764",	"vc": "4574","lt": "8759"},"03/18": {"fb": "8588","vc": "96798","lt": "78i"	}}]}}';
		
    };
    loadWptServiceRespData();
    
    $scope.isAutoTogle = function() {
    	function toggleChevron(e) {
    		$('.indicator').removeClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign').addClass('glyphicon-plus-sign');
    		
    		var ele = $(e.target);
    		var flag = ele.hasClass('in');
    		
    		if(flag) {
	    		ele.prev('.panel-heading')
	    	        .find("i.indicator")
	    	        .toggleClass('glyphicon-minus-sign glyphicon-plus-sign');
    		}
    	}
    	$('#accordion').on('hidden.bs.collapse', toggleChevron);
    	$('#accordion').on('shown.bs.collapse', toggleChevron);
    };
    
	/* Changes for WPT Dashboard Tab - ends */
	 }).controller('TestDataSearchReplaceController', function($scope, $state, $timeout, TestDataMaster, testDataService, FilterTestDataMaster, Scopes){
			$scope.testDataReqDto = {};
			$scope.serviceError = {};
			$scope.success = {};
			$scope.testdatas = {};
			
			$scope.replaceSearchData = function(){
				
				$scope.serviceError = {};
		    	
				if($scope.testDataReqDto.searchTestData != undefined && $scope.testDataReqDto.replaceTestData != undefined && $scope.testDataReqDto.replaceTestData){
					$("#ReplaceData").removeAttr('required');
					localStorage.setItem('searchTestData', $scope.testDataReqDto.searchTestData)
					localStorage.setItem('replaceTestData', $scope.testDataReqDto.replaceTestData)
					$scope.testDataReqDto.testDataType = 'json';
			    	$scope.testDataReqDto.updatedBy = 'Web UI';
			    	testDataService.replaceTestData($scope.testDataReqDto).then(function(data) {
						if(data.data){
							$scope.success = 'Search test data updated.';
							$scope.testdatas = data.data;
							$scope.maxIndexSize = data.maxIndexSize;
							$timeout(function(){
								$scope.success = {};
					        }, 5000);
						}else{
							$scope.testdatas = {};
							$scope.submitted = true;
						}
			    		
			    	}, function(data){
			    		$scope.serviceError = "Test data update error.";
			    		$scope.submitted = false;
			    	});
		    	} else {
		    		$("#ReplaceData").attr('required', true);
		    		//$scope.testdatas = {};
		    		$scope.submitted = false;
		    	}
			};
			
			$scope.getSearchData = function() {
				$("#ReplaceData").removeAttr('required');
				$scope.serviceError = {};
				$scope.success = {};
				$scope.testdatas = {};
				
				if($scope.testDataReqDto.searchTestData != undefined && $scope.testDataReqDto.searchTestData){
					localStorage.setItem('searchTestData', $scope.testDataReqDto.searchTestData)
					if($scope.testDataReqDto.replaceTestData != undefined && $scope.testDataReqDto.replaceTestData){
						localStorage.setItem('replaceTestData', $scope.testDataReqDto.replaceTestData)
					} else {
		    			localStorage.removeItem('replaceTestData');
		    		}
					$scope.submitted = true;
					$scope.testdatas = {};
			    	$scope.currentPage = configData.currentPage;
			    	$scope.itemsPerPage = configData.itemsPerPage;
			    	$scope.loadData($scope.currentPage, $scope.itemsPerPage, $scope.testDataReqDto);
			    	
				}else{
					$scope.testdatas = {};
					$scope.submitted = false;
				}
			};
			
			$scope.loadData = function(currentPage, itemsPerPage, reqInput){
				$scope.testDataReqDto.pageNumber = currentPage;
				$scope.testDataReqDto.maxRecords = itemsPerPage;
				
				testDataService.getTestData(reqInput).then(function(data) {
					$scope.testdatas = data.data;
					$scope.maxIndexSize = data.maxIndexSize;
				}, function(data){
					$scope.testdatas = {};
				});
			};
		    
			//Pagination attributes
			$scope.currentPage = configData.currentPage;
			$scope.itemsPerPage = configData.itemsPerPage;
			$scope.boundaryLinks = configData.boundaryLinks;
			$scope.directionLinks = configData.directionLinks;
			$scope.rotate = configData.rotate;
			$scope.maxSize = configData.maxSize;
			
			$scope.pageChanged = function() {
			  $scope.loadData($scope.currentPage, $scope.itemsPerPage, $scope.testDataReqDto); 
			};
			
			$scope.onClickEdit = function(param){
				localStorage.setItem('editSourcePage',param);
			};
		    
		    $scope.onClickCheckbox = function($event, params){
				$event.preventDefault();
				var isDisabled = false;
				
				if($scope.checkboxes[params]){ 
					isDisabled = true;
			    }
				
				$scope.modalIsDisabled = isDisabled;
				$('#confirmModal').data('params', {key:params, disabled:isDisabled}).modal('show');
			};
		    
			$scope.redirect = false;
			if(angular.isDefined(Scopes.get('redirect'))){
				$scope.redirect = Scopes.get('redirect');
			};
			
			if(angular.isDefined(Scopes.get('editSuccess'))){
				$scope.success = Scopes.get('editSuccess');
				$scope.redirect = true;
				$timeout(function(){
					$scope.success = {};
					Scopes.set('editSuccess', "");
		        }, 5000);
			}
			
			
			if($scope.redirect){
				
				if(angular.isDefined(localStorage.getItem('searchTestData')) && localStorage.getItem('searchTestData')){
					$scope.testDataReqDto.searchTestData = {};
					$scope.testDataReqDto.searchTestData = localStorage.getItem('searchTestData');
				};
				
				if(angular.isDefined(localStorage.getItem('replaceTestData')) && localStorage.getItem('replaceTestData') != undefined){
					$scope.testDataReqDto.replaceTestData = {};
					$scope.testDataReqDto.replaceTestData = localStorage.getItem('replaceTestData');
				};
				
				if($scope.testDataReqDto.searchTestData != undefined){
					$scope.testDataReqDto.testEnv = {};
					$scope.testDataReqDto.testGroup = {};
					$scope.testDataReqDto.testLocale = {};
					$scope.testDataReqDto.testScenario = {};
					$scope.loadData($scope.currentPage, $scope.itemsPerPage, $scope.testDataReqDto);
				};
			};
				    
		}).controller('AppdServiceController',function($scope, $state, $stateParams, $filter, $modal, appdDashboardTestservice){
			/* Changes for App D Dashboard Tab - starts */
			
			 $scope.serviceResponseData = {};
			 $scope.param = {};
			 $scope.filename = "AppDStatictics";
			 $scope.getArray = [];
		 
			 var modalInstance = {};
			 $scope.getAppdResponseData = function(param) {
				$scope.appdResponseData = {};
				$scope.activeValue = param.env;
				$scope.param.env = param.env;
				$scope.param.index = param.index;
				
				if(param.index != 0){
					document.getElementById("0").className = 'ng-scope';
				} else {
					document.getElementById("0").className = 'ng-scope active';
				}

				loadAppdServiceRespData(param.env); 
			};
			
			loadAppdServiceRespData = function(env){
				
				if(typeof env == 'undefined')	{
					env = 'US'; 
				}
				var startAt = new Date();
				
				modalInstance = $modal.open({
		            templateUrl: 'spinnermodal.html',
		            size: 0,
		            resolve: {}
		    	});
				
				appdDashboardTestservice.getAppdPageData(env).then(function(data) {
					$scope.appdResponseData = data; 
					 $scope.getArray = [];
					var endAt1 = new Date();
					console.log('Time in service call at controller : ' + (endAt1 - startAt));
					
					$scope.wptDates = $scope.appdResponseData.dates;
					$scope.wptServiceRespData = $scope.appdResponseData.deviceData;
					$scope.wptLocales = $scope.appdResponseData.locales; 
					$scope.param.env = $scope.wptLocales[0];
					$scope.param.index = 0;
					var mainData=data;
                   //added CSV  download changes
					
					var dates=mainData.dates;
					//Format csv file
					 formatCSVFileName(dates[1], env);
					  $scope.getArray.push({a:"Computer"});
					  //Push headers to array
					  addCSVHeadersToArray();
					 					  
					var computerDataMap = {};
					var computerPageNumber = [];
					  var computerData = mainData.deviceData["Computer"];
					  for(var index=0; index<computerData.length; index++)	{
						  //TODO
							if(computerData[index].appdDateResp.length > 1)	{	
								computerDataMap[computerData[index].pageNumber] = [computerData[index].page, computerData[index].appdDateResp[0].numberOfRequests,computerData[index].appdDateResp[0].fbTime,computerData[index].appdDateResp[0].domTime,computerData[index].appdDateResp[0].avgEndUserResponseTime, computerData[index].appdDateResp[1].numberOfRequests,computerData[index].appdDateResp[1].fbTime,computerData[index].appdDateResp[1].domTime,computerData[index].appdDateResp[1].avgEndUserResponseTime, computerData[index].appdDateResp[2].numberOfRequests,computerData[index].appdDateResp[2].fbTime,computerData[index].appdDateResp[2].domTime,computerData[index].appdDateResp[2].avgEndUserResponseTime];
								computerPageNumber.push(computerData[index].pageNumber);
							} else	{
								computerDataMap[computerData[index].pageNumber] = [computerData[index].page, computerData[index].appdDateResp[0].numberOfRequests,computerData[index].appdDateResp[0].fbTime,computerData[index].appdDateResp[0].domTime,computerData[index].appdDateResp[0].avgEndUserResponseTime];
								computerPageNumber.push(computerData[index].pageNumber);
							}
					  }
					  computerPageNumber.sort(function(a, b){return a - b});
					  for(var index=0; index<computerPageNumber.length; index++)	{
						  //TODO
						  if(computerData[index].appdDateResp.length > 1)	{
								var tempData = computerDataMap[computerPageNumber[index]];
								$scope.getArray.push({a:tempData[0], b:tempData[1],c:tempData[2],d:tempData[3],e:tempData[4], f:tempData[5],g:tempData[6],h:tempData[7],i:tempData[8], j:tempData[9],k:tempData[10],l:tempData[11],m:tempData[12]})
							} else	{
								var tempData = computerDataMap[computerPageNumber[index]];
								$scope.getArray.push({a:tempData[0], b:tempData[1],c:tempData[2],d:tempData[3],e:tempData[4]});
							}
					  }
					  $scope.getArray.push({a:"Mobile & Tablets"});
					  //Push headers to array
					  addCSVHeadersToArray();

					var mobilePageNumber = [];	
					var mobileDataMap = {};
					  var mobileData = mainData.deviceData["Mobile & Tablets"];
					  for(var index=0; index<mobileData.length; index++)	{
						  if(mobileData[index].appdDateResp.length > 1)	{
								mobileDataMap[mobileData[index].pageNumber] = [mobileData[index].page, mobileData[index].appdDateResp[0].numberOfRequests,mobileData[index].appdDateResp[0].fbTime,mobileData[index].appdDateResp[0].domTime,mobileData[index].appdDateResp[0].avgEndUserResponseTime, mobileData[index].appdDateResp[1].numberOfRequests,mobileData[index].appdDateResp[1].fbTime,mobileData[index].appdDateResp[1].domTime,mobileData[index].appdDateResp[1].avgEndUserResponseTime, mobileData[index].appdDateResp[2].numberOfRequests,mobileData[index].appdDateResp[2].fbTime,mobileData[index].appdDateResp[2].domTime,mobileData[index].appdDateResp[2].avgEndUserResponseTime];
								mobilePageNumber.push(mobileData[index].pageNumber);
							} else	{
								mobileDataMap[mobileData[index].pageNumber] = [mobileData[index].page, mobileData[index].appdDateResp[0].numberOfRequests,mobileData[index].appdDateResp[0].fbTime,mobileData[index].appdDateResp[0].domTime,mobileData[index].appdDateResp[0].avgEndUserResponseTime];
								mobilePageNumber.push(mobileData[index].pageNumber);
							}
					  }
					mobilePageNumber.sort(function(a, b){return a - b});
					  for(var index=0; index<mobilePageNumber.length; index++)	{
						  if(mobileData[index].appdDateResp.length > 1)	{
							  var tempData = mobileDataMap[mobilePageNumber[index]];
							  $scope.getArray.push({a:tempData[0], b:tempData[1],c:tempData[2],d:tempData[3],e:tempData[4], f:tempData[5],g:tempData[6],h:tempData[7],i:tempData[8], j:tempData[9],k:tempData[10],l:tempData[11],m:tempData[12]});
						  } else	{
							  var tempData = mobileDataMap[mobilePageNumber[index]];
							  $scope.getArray.push({a:tempData[0], b:tempData[1],c:tempData[2],d:tempData[3],e:tempData[4]});
						  }
					  }
					  
					  function addCSVHeadersToArray() {
							if(dates.length>=2){
							  $scope.getArray.push({a:"Page", b:dates[0],c:"",d:"",e:"", f:dates[1],g:"",h:"",i:"", j:dates[2],k:"",l:"",m:""});
							  $scope.getArray.push({a:"",b:"Requests", c:"First Byte Time", d:"Dom Time", e:"End User Response Time", f:"Requests", g:"First Byte Time", h:"Dom Time", i:"End User Response Time", j:"Comparison", k:"First Byte Time", l:"Dom Time", m:"End User Response Time"});
							  } 
						 else{
							 $scope.getArray.push({a:"Page", b:dates[0],c:"",d:"",e:""});
							 $scope.getArray.push({a:"",b:"Requests", c:"First Byte Time", d:"Dom Time", e:"End User Response Time"});
							}
												
					};
					  function formatCSVFileName(data, locale){
						  	/*var dateReplace= data;
							dateReplace=dateReplace.replace("From ","");
							dateReplace=dateReplace.replace(" To ","");
							dateReplace=dateReplace.replace("2016","8PM");
		      				dateReplace = dateReplace.replace(new RegExp('/', 'g'),  "_");*/
							 
							 $scope.filename = locale+"_Appd";	
					  };

				      $scope.clickFn = function() {
				        console.log("click click click");
				      };
				  //End of CSV download changes
					
					modalInstance.dismiss('cancel');
					
					modalInstance.dismiss('cancel');
					var endAt2 = new Date();
					console.log('Total time at controller : ' + (endAt2 - startAt));
					
		    		$scope.serviceError = "";
		    	}, function(data){
		    		$scope.serviceError = "No data found.";
		    	});
				//var rawData = '{"locales": ["US", "BR", "CN"],"dates": ["03/16", "03/17", "03/18", "03/19"],"data":{"computer": [{	"page": "home","03/16": {"fb": "10","vc": "11","lt": "12"},"03/17": {"fb": "33","vc": "33","lt": "445"},"03/18": {"fb": "6y5","vc": "64y4","lt": "34r3r"}}, {"page": "Pdp",	"03/16": {"fb": "4r3r","vc": "dgs","lt": "sdsf"	},"03/17": {"fb": "5545","vc": "345y","lt": "y54y"},"03/18": {"fb": "45y","vc": "y4","lt": "4y4y"}}],"mobile": [{"page": "home","03/16": {"fb": "r656",	"vc": "64","lt": "767"},"03/17": {"fb": "5764",	"vc": "4574","lt": "8759"},"03/18": {"fb": "8588","vc": "96798","lt": "78i"	}}]}}';
				
		    };
		    loadAppdServiceRespData();
		    
		    $scope.isAutoTogle = function() {
		    	function toggleChevron(e) {
		    		$('.indicator').removeClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign').addClass('glyphicon-plus-sign');
		    		
		    		var ele = $(e.target);
		    		var flag = ele.hasClass('in');
		    		
		    		if(flag) {
			    		ele.prev('.panel-heading')
			    	        .find("i.indicator")
			    	        .toggleClass('glyphicon-minus-sign glyphicon-plus-sign');
		    		}
		    	}
		    	$('#accordion').on('hidden.bs.collapse', toggleChevron);
		    	$('#accordion').on('shown.bs.collapse', toggleChevron);
		    };
		    
			/* Changes for App D Dashboard Tab - ends */
		 })
		 /*Inventory Update Changes Start*/
		 .controller('InventoryUpdateController',function($scope, $state, $stateParams, $filter, $modal, invUpdateService,$window){
				
			 $scope.formData = {};
				// populate Dropdown for Env   
			 	$scope.invupdateEnv = ["Performance", "Afx-Test"];
				// populate Dropdown for Locale
			 	$scope.invupdateLocale = ["Brazil", "China","US & Other Regions"];
			 	
				 
				$scope.updateInv= function() {
					$scope.loader.loading = true ;
					$scope.status="";
				    if ($scope.invupdate.env && $scope.invupdate.locale) {
				    	if(angular.isDefined($scope.invupdate.env)){
				    		$scope.formData.environment =$scope.invupdate.env;
				    	}
				    	
				    	if(angular.isDefined($scope.invupdate.locale)){
				    		 if(angular.equals($scope.invupdate.locale, "US & Other Regions"))
				    		 $scope.formData.locale= "ML";
				    		  if(angular.equals($scope.invupdate.locale, "Brazil"))
				    		$scope.formData.locale= "BR";
				    		  if(angular.equals($scope.invupdate.locale, "China"))
				    			  $scope.formData.locale= "CN";	  
				    	}
				    	
				    	
				    	invUpdateService.updateInventory($scope.formData).then(function(data) {
				    		   $scope.loader.loading = false ;
				    		if(angular.equals(data.status,"success"))
				    			$scope.status= "OPS Inventory & Capacity Updated ";
				    		else
				    		$scope.status= "Failure to Update OPS Inventory, An unknown error occurred.";	
				    	}, function(data){
				    		   $scope.loader.loading = false ;
				    		$scope.serviceError = "Failure to Update OPS Inventory, An unknown error occurred.";
				    	});
				    	
				  }
				};
				 $scope.loader = {
					      loading: false,
				};
			     
				
				$scope.spreadsheetBR=function() {
					$window.open('https://docs.google.com/spreadsheets/d/1PIdLt1eu4CqPF6xvlhCrU7Jn_3wueA4vnyE8k5JcsJY/edit#gid=0', 'C-Sharpcorner', 'width=500,height=400');
				}
				$scope.spreadsheetCN=function() {
					$window.open('https://docs.google.com/spreadsheets/d/19wMnLjPOWcusSvBUG-6jQyzoUbRzmdvea2R-Hy8FTGw/edit#gid=0', 'C-Sharpcorner', 'width=500,height=400');
				}
				$scope.spreadsheetUS=function() {
					$window.open('https://docs.google.com/spreadsheets/d/1-R0md0QfI3MdRetdAep9LEzHmgzF66dX-hzyYa65qIo/edit#gid=0', 'C-Sharpcorner', 'width=500,height=400');
				}
			   
			    /*Inventory Update Changes End*/
}).controller('FontTestingController',function($scope,$modal,FontTestDataMaster){
	 $scope.validateURL = false;
	 $scope.pleaseWait = false;
	 $scope.single = false;
	 var modalInstance = {}
	 
	 
	 
	 $scope.Resetbtn = function() {
		 $scope.testdatas = null;
		 $scope.validateURL = false;
		 $scope.pleaseWait = false;
		 
		 
	 };
	    
	    $scope.ValidateURLfn = function() {
	    	$scope.Resetbtn();
	    	var urlval = $scope.testDataReqDto;
	    	var testBln = urlval.urlData.toLowerCase().indexOf("motorola")>0;
	    	if(!testBln){
	    		$scope.validateURL = true;
	    	}else{
	    		false;
	    	}
	    	
	    };
	    $scope.getSingleWebPage = function() {
		 
			$scope.ValidateURLfn();
			 $scope.single = true;
			if(!$scope.validateURL){
			$scope.loadData($scope.testDataReqDto);
			}
			  
		};
	 
	$scope.getWholesite = function() {
	 
		
		$scope.ValidateURLfn();
		$scope.single = false;
		if(!$scope.validateURL){
		$scope.loadData($scope.testDataReqDto);
		}
	};
	$scope.loadData = function($stateParams){
		//ANBU
		
		 console.log($scope.single);
		 var inputData ="";
		 if($scope.single){
		   inputData = $stateParams.urlData+'~true';
		 }else{
			 inputData = $stateParams.urlData; 
		 }
		 $scope.pleaseWait = true;
		 modalInstance = $modal.open({
	            templateUrl: 'spinnermodal.html',
	            size: 0,
	            resolve: {}
	    	});
		FontTestDataMaster.getMasterFontGroup(inputData).then(function(response) {
			$scope.testdatas = response.data;
			$scope.maxIndexSize = response.maxIndexSize;
				$scope.pleaseWait = false;
				modalInstance.dismiss('cancel');
		}, function(data){
			$scope.testdatas = {};
			modalInstance.dismiss('cancel');
		});
		 
	 
	};
	 
	
}).controller('SupplyChainController',function($scope, $state, $stateParams, $filter, $modal, supplyChainService){
	/*
	 * Remove local storage
	 */
	localStorage.removeItem('env');
	localStorage.removeItem('group');
	
	 $scope.supplyChainData = {};
	 $scope.envMasterSC = {};
	 $scope.param = {};
	 $scope.activeValue = {};
	 $scope.serviceError = {};
	 
	 supplyChainService.getEnvNames().then(function(data){
			$scope.envMasterSC = data;
			$scope.param.env = data[0];
			$scope.param.index = 0;
			
			$scope.loadSupplyChainData($scope.param.env);
		}, function(data){
			$scope.serviceError = "An unknown error occurred.";
		});
	 
	 
	 $scope.getSupplyChainResult = function(param) {
		$scope.supplyChainData = {};
		$scope.activeValue = param.env;
		$scope.param.env = param.env;
		$scope.param.index = param.index;
		
		if(param.index != 0){
			document.getElementById("0").className = 'ng-scope';
		} else {
			document.getElementById("0").className = 'ng-scope active';
		}
		
		$scope.loadSupplyChainData(param.env); 
	};
	
	$scope.serviceData = {};
	$scope.grpDateMap = {};
	$scope.serviceBaseUri = {};
	var modalInstance = {};
	$scope.loadSupplyChainData = function(env){
		
		modalInstance = $modal.open({
            templateUrl: 'spinnermodal.html',
            size: 0,
            resolve: {}
    	});
		
		supplyChainService.getSupplyChainResult(env).then(function(data) {
			$scope.supplyChainDatas = data.supplyChainData;
			
    		$scope.serviceError = "";
    		modalInstance.dismiss('cancel');
    	}, function(data){
    		$scope.serviceError = "No data found.";
    		modalInstance.dismiss('cancel');
    	});
    };
    
    $scope.viewResultLog = function(params){
	    
	    if(params.resLog != undefined &&  params.resLog.length){
	        $scope.srcTitle = "Log";
	        $scope.resLog = params.resLog;
	    }
	    
	 };
	 
	 $scope.playOrPause = function(ele){
         var video = angular.element(document.querySelector('#video'));
         if(video[0] !== undefined){
                if(ele === 1){
                   video[0].play();
                } else {
                   video[0].pause();
                }
         }
    };
	 
}).controller('ScoreCardReportController',function($scope, $state, $timeout, $stateParams, $window,$location, $filter, $modal, scoreCardMasterService, scoreCardReportService) {
		/*
		 * Remove local storage
		 */

		$scope.scoreCardData = {};
		$scope.scoreCardDatasCopy = {};
		$scope.param = {};
		$scope.activeValue = {};
		$scope.serviceError = {};
		$scope.formScoreCardReqDto = {};
		$scope.scoreCardReqDto = {};
		$scope.success = {};
		$scope.previousAction = {};
		$scope.editingData = {};
		$scope.addData = {};
		$scope.cloneSelected = false;
		$scope.loadMasterData = false;
		$scope.submitted = false;
		$scope.inputReport = {};
		$scope.inputReportFocus = {};

		$scope.envMasterSCR = {};
		scoreCardReportService.getEnvNames().then(function(data) {
			$scope.envMasterSCR = data;
			$scope.param.env = data[0];
			$scope.param.index = 0;

			$scope.loadProjectsByEnv(data[0]);

		}, function(data) {
			$scope.serviceError = "An unknown error occurred.";
		});

		$scope.envProjects = {};
		$scope.loadProjectsByEnv = function(env) {

			scoreCardReportService.getProjectsByEnv(env).then(
					function(projectdata) {
						$scope.envProjects = projectdata;
						$scope.serviceError = "";
					}, function(projectdata) {
						$scope.serviceError = "No data found.";
					});
		}

		$scope.getScoreCardData = function(param) {
			$scope.scoreCardDatas = {};
			$scope.success = {};
			$scope.activeValue = param.env;
			$scope.param.index = param.index;
			$scope.submitted = false;
			$scope.cloneSelected = false;

			if (param.index != 0) {
				document.getElementById("0").className = 'ng-scope';
			} else {
				document.getElementById("0").className = 'ng-scope active';
			}

			if ($scope.param.env != param.env) {
				$scope.envProjects = {};
				$scope.scoreCardReqDto.project = {};
				$scope.loadProjectsByEnv(param.env);

			} else {

				if ($scope.scoreCardReqDto.project != undefined
						&& $scope.scoreCardReqDto.project) {
					$scope.param.project = $scope.scoreCardReqDto.project;
					$scope.currentPage = configData.currentPage;
					$scope.itemsPerPage = configData.itemsPerPage;
					$scope.scoreCardReqDto.env = param.env;
					$scope.loadScoreCardReportData(
							$scope.currentPage,
							$scope.itemsPerPage,
							$scope.scoreCardReqDto);
				}
			}
			$scope.param.env = param.env;
		};

		$scope.serviceData = {};
		$scope.grpDateMap = {};
		$scope.serviceBaseUri = {};
		var modalInstance = {};

		$scope.loadScoreCardReportData = function(currentPage,
				itemsPerPage, reqInput) {
			$scope.scoreCardDatas = {};
			if (!$scope.loadMasterData) {
				modalInstance = $modal.open({
					templateUrl : 'spinnermodal.html',
					size : 0,
					resolve : {}
				});
			}

			$scope.scoreCardReqDto.pageNumber = currentPage;
			$scope.scoreCardReqDto.maxRecords = itemsPerPage;

			scoreCardReportService
					.getScoreCardReportData(reqInput)
					.then(
							function(data) {
								$scope.scoreCardDatas = data.scoreCardReportData;
								$scope.scoreCardDatasCopy = data.scoreCardReportData;
								$scope.maxIndexSize = data.maxIndexSize;
								console.log($scope.scoreCardDatas);
								for (var i = 0, length = $scope.scoreCardDatas.length; i < length; i++) {
									$scope.editingData[$scope.scoreCardDatas[i]] = false;
									$scope.addData[i] = false;
								}
								//console.log($scope.formScoreCardReqDto[j].targetDate);
								/*var timeZoneChina = moment(
										$scope.scoreCardDatas[0].targetDate).utcOffset(
										'+0800').format(
										'YYYY-MM-DD');
								$scope.scoreCardDatas[0].targetDate = timeZoneChina;
								console.log("yes - "+timeZoneChina);*/
								
								modalInstance.dismiss('cancel');
								$scope.serviceError = "";
								$timeout(function() {
									$scope.success = {};
								}, 5000);
							},
							function(data) {
								$scope.envProjects = $scope.envProjects;
								$scope.submitted = true;
								modalInstance.dismiss('cancel');
							});
		};
		
		$scope.updateScoreCardData = function(param) {
			$scope.editingData = {};
			$scope.addData = {};
			$scope.success = {};

			if (param.action == 'Edit') {
				$scope.scoreCardDatasCopy = $scope.scoreCardDatas;
				for (var i = 0, length = $scope.scoreCardDatas.length; i < length; i++) {
					$scope.editingData[$scope.scoreCardDatas[i]] = false;
				}

				if ($scope.previousAction == 'Add') {
					$scope.scoreCardDatas.splice(
							$scope.param.index + 1, 1);
				}
				$scope.success = {};
				$scope.editingData[param.scoreCardData] = true;
				$scope.cancelClone();
			}

			if (param.action == 'Update') {
				var isInputSuccess = true;
				
				$scope.formScoreCardReqDto = $scope.scoreCardDatas;
				var lengthTemp = $scope.formScoreCardReqDto.length;
				for (var i = 0; i < $scope.scoreCardDataDelete.length; i++) {
					$scope.formScoreCardReqDto[lengthTemp] = $scope.scoreCardDataDelete[i];
					$scope.formScoreCardReqDto[lengthTemp].pageNumber = $scope.currentPage;
					$scope.formScoreCardReqDto[lengthTemp].maxRecords = $scope.itemsPerPage;
					lengthTemp++;
				}
				var j = 0;
				for (; j < $scope.formScoreCardReqDto.length; j++) {
					$scope.formScoreCardReqDto[j].env = $scope.param.env;
					$scope.formScoreCardReqDto[j].project = $scope.scoreCardReqDto.project;
					$scope.formScoreCardReqDto[j].pageNumber = $scope.currentPage;
					$scope.formScoreCardReqDto[j].maxRecords = $scope.itemsPerPage;
					if($scope.formScoreCardReqDto[j].itemNo == undefined || $scope.formScoreCardReqDto[j].keyMilestone == undefined || $scope.formScoreCardReqDto[j].targetDate == undefined){
						isInputSuccess = false;
						break;
					}
					
					/*console.log($scope.formScoreCardReqDto[j].targetDate);
					var timeZoneChina = moment(
							$scope.formScoreCardReqDto[j].targetDate).utcOffset(
							'+0800').format(
							'YYYY-MM-DD');
					$scope.formScoreCardReqDto[j].targetDate = timeZoneChina;
					console.log("yes - "+timeZoneChina);*/
					
				}
				
				if(!isInputSuccess){
					$scope.inputReport = "Some of the fields are empty. Please enter data to continue."
						$timeout(function() {
							$scope.inputReport = {};
						}, 7000);
					for (var i = 0, length = $scope.scoreCardDatas.length; i < length; i++) {
						$scope.editingData[$scope.scoreCardDatas[i]] = true;
					}
					$scope.inputReportFocus[$scope.scoreCardDatas[j].itemNo] = true;
				}else{
				
					var modalInstance = {};
					modalInstance = $modal.open({
						templateUrl : 'spinnermodal.html',
						size : 0,
						resolve : {}
					});
					
					$scope.scoreCardDatas = {};
					scoreCardReportService
							.updateScoreCardReportData(
									$scope.formScoreCardReqDto)
							.then(
									function(data) {
										$scope.success = 'Report data updated.';
										$scope.scoreCardDatas = data.scoreCardReportData;
										console.log($scope.scoreCardDatas);
										$scope.serviceError = "";
										modalInstance.dismiss('cancel');
										$timeout(function() {
											$scope.success = {};
										}, 5000);
	
									},
									function(data) {
										$scope.serviceError = "Score Card report data update error.";
										modalInstance.dismiss('cancel');
									});
	
					$scope.editingData[param.scoreCardData] = false;
					$scope.scoreCardDataDelete = [];
	
					for (var i = 0, length = $scope.scoreCardDatas.length; i < length; i++) {
						$scope.editingData[$scope.scoreCardDatas[i]] = false;
					}
				
				}
			}

			$scope.previousAction = param.action;
		}

		$scope.addScoreCardData = function(param) {

			$scope.addData = {};

			if ($scope.previousAction == 'Edit') {
				for (var i = 0, length = $scope.scoreCardDatas.length; i < length; i++) {
					$scope.addData[$scope.scoreCardDatas[i]] = false;
				}
			}

			if (param.action == 'Add') {
				if ($scope.scoreCardDatas != undefined
						&& $scope.scoreCardDatas.length > 15) {
					$scope.success = "No. of rows are not allowed more than "
							+ configData.maxSCAddItems
							+ ". Please click Update and proceed.";
					$timeout(function() {
						$scope.success = {};
					}, 7000);
				} else {

					$scope.param.index = param.index;
					$scope.success = {};
					var rowSCRId = param.scoreCardData.scoreCardReportId;
					var scoreCardDatasTemp = $scope.scoreCardDatas, rowClicked;
					$scope.scoreCardDatas = [];

					for (var i = 0, length = scoreCardDatasTemp.length; i < length; i++) {
						$scope.scoreCardDatas
								.push(scoreCardDatasTemp[i]);
						if (scoreCardDatasTemp[i].scoreCardReportId == rowSCRId) {

							rowClicked = i;
							$scope.scoreCardDatas.push({
								scoreCardReportId : "",
								itemNo : "",
								keyMilestone : "",
								status : "",
								owner : "",
								targetDate : "",
								remarks : "",
								userAction : "Add"
							});

						}
					}
					var rowNo = param.index + 1;
					$scope.addData[rowNo] = true;
					$scope.cancelClone();
				}

			}

			if (param.action == 'Save') {

				$scope.formScoreCardReqDto = param.scoreCardData;
				var reqItemNo = param.scoreCardData.itemNo;
				if (reqItemNo.indexOf(".") > 0) {
					reqItemNo = reqItemNo.substr(0, reqItemNo
							.lastIndexOf("."));
					$scope.formScoreCardReqDto.parentItemNo = reqItemNo;
				}
				$scope.formScoreCardReqDto.env = $scope.param.env;
				$scope.formScoreCardReqDto.project = $scope.scoreCardReqDto.project;
				$scope.formScoreCardReqDto.pageNumber = $scope.currentPage;
				$scope.formScoreCardReqDto.maxRecords = $scope.itemsPerPage;

				$scope.scoreCardDatas = {};
				var modalInstance = {};
				modalInstance = $modal.open({
					templateUrl : 'spinnermodal.html',
					size : 0,
					resolve : {}
				});

				scoreCardReportService
						.addScoreCardReportData(
								$scope.formScoreCardReqDto)
						.then(
								function(data) {
									$scope.success = 'Report data added.';
									$scope.scoreCardDatas = data.scoreCardReportData;
									$scope.serviceError = "";
									modalInstance.dismiss('cancel');
									$timeout(function() {
										$scope.success = {};
									}, 5000);

								},
								function(data) {
									$scope.serviceError = "Score Card report data add error.";
									modalInstance.dismiss('cancel');
								});

				for (var i = 0, length = $scope.scoreCardDatas.length; i < length; i++) {
					$scope.addData[$scope.scoreCardDatas[i]] = false;
				}
			}

			$scope.previousAction = param.action;

		};

		$scope.deleteScoreCardData = function($event, param) {
			$event.preventDefault();
			$scope.deleteItem = param.scoreCardData.itemNo ? "Item# -"
					+ param.scoreCardData.itemNo
					: "a new row added";
			$('#confirmModal').data('params', {
				index : param.index,
				scoreCardData : param.scoreCardData,
				action : param.action
			}).modal('show');
		};

		$scope.scoreCardDataDelete = [];

		$scope.onClickYes = function() {
			var params = $('#confirmModal').data('params');

			var deleteItem = params.scoreCardData;

			for (var i = 0; i < $scope.scoreCardDatas.length; i++) {
				if (deleteItem.scoreCardReportId == $scope.scoreCardDatas[i].scoreCardReportId) {
					deleteItem.userAction = "Delete";
					$scope.scoreCardDataDelete.push(deleteItem);
				}
			}

			var scoreCardDatasModifyTemp = $scope.scoreCardDatas;
			$scope.scoreCardDatas = [];
			scoreCardDatasModifyTemp.splice(params.index, 1);

			for (var i = 0; i < scoreCardDatasModifyTemp.length; i++) {
				$scope.scoreCardDatas
						.push(scoreCardDatasModifyTemp[i]);
			}

			$scope.addData[params.index] = false;

			$('#confirmModal').modal('hide');
			$scope.previousAction = params.action;
		};

		$scope.downloadedData = {};

		$scope.downloadScoreCardData = function() {

			var modalInstance = {};
			modalInstance = $modal.open({
				templateUrl : 'spinnermodal.html',
				size : 0,
				resolve : {}
			});

			// /New one
			$scope.formScoreCardReqDto = {};
			$scope.formScoreCardReqDto.env = $scope.param.env;
			$scope.formScoreCardReqDto.project = $scope.scoreCardReqDto.project;

			scoreCardReportService
					.getScoreCardReportData(
							$scope.formScoreCardReqDto)
					.then(
							function(data) {
								$scope.downloadedData = data.scoreCardReportData;

								$scope.exportData = [];
								// Headers:
								$scope.exportData.push([ "Item#",
										"Key Milestones", "Status",
										"Owner", "Target Date",
										"Remark" ]);
								// Data:
								angular
										.forEach(
												$scope.downloadedData,
												function(value, key) {
													var remarksStr = value.remarks ? value.remarks
															: "";
													$scope.exportData
															.push([
																	value.itemNo,
																	value.keyMilestone,
																	value.status,
																	value.owner,
																	value.targetDate,
																	remarksStr ]);
												});
								modalInstance.dismiss('cancel');

								var timeZoneChina = moment(
										new Date()).utcOffset(
										'+0800').format(
										'DDMMYYYY_HHmmss');
								var fileName = "ScoreCardReport_"
										+ timeZoneChina
										+ "_BJT.xlsx";

								var mystyle = {
									headers : false,
									sheetid : "ScoreCardReport"
								};

								alasql('SELECT * INTO XLSX("'
										+ String(fileName)
										+ '",?) FROM ?', [ mystyle,
										$scope.exportData ]);

								$scope.success = 'Report data downloaded.';
								$scope.serviceError = "";
								$timeout(function() {
									$scope.success = {};
								}, 7000);

							},
							function(data) {
								$scope.serviceError = "Score Card report download error.";
								modalInstance.dismiss('cancel');
							});

		};

		$scope.cancelEdit = function() {

			$scope.scoreCardDatas = $scope.scoreCardDatasCopy;
			for (var i = 0, length = $scope.scoreCardDatas.length; i < length; i++) {
				$scope.editingData[$scope.scoreCardDatas[i]] = false;
				$scope.addData[i] = false;
			}
			$scope.scoreCardDataDelete = [];
		}

		/*
		 * $scope.emailScoreCardData = function(){
		 * 
		 * window.URL = window.URL || window.webkitURL;
		 * //window.open(window.URL.createObjectURL(screenshotPage()));
		 * var timeZoneChina = moment(new
		 * Date()).utcOffset('+0800').format('DDMMYYYYHHmmss'); var
		 * fileName = "Score Card Report - "+timeZoneChina;
		 * location.href = "mailto:"+ "" + "?subject="
		 * +fileName+"&body=Click here for snapshot -
		 * "+window.URL.createObjectURL(screenshotPage()); }
		 */

		function screenshotPage() {
			// urlsToAbsolute(document.images);
			// urlsToAbsolute(document.querySelectorAll("link[rel='stylesheet']"));
			// var screenshot =
			// document.documentElement.cloneNode(true);

			var mainTable = document.getElementById("scTbl")
					.cloneNode(true);
			var existingData = mainTable.innerHTML;
			var tableTrs = mainTable.getElementsByTagName("tr");
			var buttonTHs = tableTrs[0].getElementsByTagName('th');
			tableTrs[0].removeChild(buttonTHs[6]);
			for (var i = 1; i < tableTrs.length; i++) {
				var tableTds = tableTrs[i]
						.getElementsByTagName('td');
				// Remove last TD for buttons
				tableTrs[i]
						.removeChild(tableTds[tableTds.length - 1]);

				// Remove last textbox div
				for (var j = 0; j < tableTds.length; j++) {
					var element = tableTds[j]
							.getElementsByTagName('div')[1];
					tableTds[j].removeChild(element);
				}
			}

			// mainTable = mainTable.replace("<th width=\"25%\"
			// ng-hide=\"!editingData[scoreCardData]\">Add/Delete</th>",
			// "");

			var screenshot = mainTable;// document.getElementById("scTbl").cloneNode(true);
			/*
			 * var b = document.createElement('base'); b.href =
			 * document.location.protocol + '//' + location.host;
			 * var head = screenshot.querySelector('head');
			 * head.insertBefore(b, head.firstChild);
			 * screenshot.style.pointerEvents = 'none';
			 * screenshot.style.overflow = 'hidden';
			 * screenshot.style.webkitUserSelect = 'none';
			 * screenshot.style.mozUserSelect = 'none';
			 * screenshot.style.msUserSelect = 'none';
			 * screenshot.style.oUserSelect = 'none';
			 * screenshot.style.userSelect = 'none';
			 * screenshot.dataset.scrollX = window.scrollX;
			 * screenshot.dataset.scrollY = window.scrollY; var
			 * script = document.createElement('script');
			 * script.textContent = '(' + addOnPageLoad_.toString() +
			 * ')();';
			 * screenshot.querySelector('body').appendChild(script);
			 */

			var blob = new Blob([ screenshot.outerHTML ], {
				type : 'text/html'
			});
			return blob;
		}

		function addOnPageLoad_() {
			window
					.addEventListener(
							'DOMContentLoaded',
							function(e) {
								var scrollX = document.documentElement.dataset.scrollX || 0;
								var scrollY = document.documentElement.dataset.scrollY || 0;
								window.scrollTo(scrollX, scrollY);
							});
		}

		/*
		 * $scope.emailScoreCardData = function(){
		 * 
		 * var mainTable = document.getElementById("scTbl"); var
		 * existingData = mainTable.innerHTML; var tableTrs =
		 * mainTable.getElementsByTagName("tr"); for(var i = 1; i <
		 * tableTrs.length; i++){ var tableTds =
		 * tableTrs[i].getElementsByTagName('td'); //Remove last TD
		 * for buttons
		 * tableTrs[i].removeChild(tableTds[tableTds.length - 1]);
		 * 
		 * //Remove last textbox div for(var j = 0; j <
		 * tableTds.length; j++){ var element =
		 * tableTds[j].getElementsByTagName('div')[1];
		 * tableTds[j].removeChild(element); } }
		 * 
		 * var tableData = mainTable.innerHTML; tableData =
		 * tableData.replace("<th>Add/Delete</th>", "");
		 * //tableData = String(tableData).replace(/<[^>]+>/gm,
		 * ''); console.log("tableData - "+tableData)
		 * 
		 * location.href = "mailto:"+ "" + "?subject=" + "Score Card
		 * Report Data"+"&body="+encodeURIComponent("<table
		 * border=1> <tr><td>blabla</td></tr>
		 * </table>");//encodeURIComponent(mainTable.innerHTML);//+"_self";
		 * var outlookApp = new
		 * ActiveXObject("Outlook.Application"); var nameSpace =
		 * outlookApp.getNameSpace("MAPI"); mailFolder =
		 * nameSpace.getDefaultFolder(6); mailItem =
		 * mailFolder.Items.add('IPM.Note.FormA');
		 * mailItem.Subject="Score Card Report Data"; mailItem.To =
		 * ""; mailItem.HTMLBody = "<b>bold</b>"; mailItem.display
		 * (0);
		 * 
		 * //Reset the htmlData to UI
		 * $("#scTbl").html(existingData); };
		 */

		$scope.cloneScoreCardData = function() {
			$scope.cloneSelected = true;
			$scope.success = {};
			$scope.cancelEdit();
			if ($scope.previousAction == 'Add') {
				$scope.scoreCardDatas.splice(
						$scope.param.index + 1, 1);
				$scope.addData[$scope.param.index + 1] = false;
			}
			$scope.previousAction = 'Clone';
		};

		$scope.saveCloneScoreCardData = function() {
			$scope.formScoreCardReqDto = {};
			$("#cloneProject").attr('required', true);
			if ($scope.scoreCardReqDto.cloneProject != undefined
					&& $scope.scoreCardReqDto.cloneProject) {

				$scope.isNewProjectExist = false;
				if ($scope.envProjects.length == 5) {
					$scope.isNewProjectExist = true;
					$scope.serviceError = "Clone Project is not allowed as no. of projects in "
							+ $scope.param.env
							+ " is already "
							+ configData.maxSCCloneProjects;
				} else {
					for (var i = 0; i < $scope.envProjects.length; i++) {
						if ($scope.scoreCardReqDto.cloneProject == $scope.envProjects[i]) {
							$scope.isNewProjectExist = true;
							$scope.serviceError = "New Project entered is already existing";
						}
					}
				}
				if (!$scope.isNewProjectExist) {
					var modalInstance = {};
					modalInstance = $modal.open({
						templateUrl : 'spinnermodal.html',
						size : 0,
						resolve : {}
					});

					$scope.formScoreCardReqDto.env = $scope.param.env;
					$scope.formScoreCardReqDto.project = $scope.scoreCardReqDto.project;
					$scope.formScoreCardReqDto.cloneProject = $scope.scoreCardReqDto.cloneProject;

					scoreCardReportService
							.cloneProjectData(
									$scope.formScoreCardReqDto)
							.then(
									function(data) {
										$scope.serviceError = "";
										$scope.envProjects[$scope.envProjects.length] = $scope.scoreCardReqDto.cloneProject;
										$scope.scoreCardReqDto.project = $scope.scoreCardReqDto.cloneProject;
										$scope.scoreCardReqDto.currentPage = 1;

										$scope.scoreCardDatas = data.scoreCardReportData;

										$scope.cloneSelected = false;
										$scope.success = 'Project report cloned.';
										modalInstance
												.dismiss('cancel');
										$timeout(function() {
											$scope.success = {};
										}, 5000);
									},
									function(data) {
										modalInstance
												.dismiss('cancel');
										$scope.serviceError = "Project report data clone error.";
									});

				}
				;
				$scope.isNewProjectExist = false;
				$("#cloneProject").removeAttr('required');
			}

		};

		$scope.cancelClone = function() {
			$scope.cloneSelected = false;
			localStorage.removeItem('cloneProject');
			$scope.scoreCardReqDto.cloneProject = "";
			$scope.serviceError = "";
			$("#cloneProject").removeAttr('required');
		};

		$scope.currentPage = configData.currentPage;
		$scope.itemsPerPage = configData.itemsPerPage;
		$scope.boundaryLinks = configData.boundaryLinks;
		$scope.directionLinks = configData.directionLinks;
		$scope.rotate = configData.rotate;
		$scope.maxSize = configData.maxSize;

		$scope.pageChanged = function() {
			$scope.scoreCardReqDto.env = $scope.param.env;
			$scope.loadScoreCardReportData($scope.currentPage,
					$scope.itemsPerPage, $scope.scoreCardReqDto);
		};

		$scope.emailScoreCardData = function($event, param) {
			$event.preventDefault();
			$scope.scoreCardReqDto.mailTo = "";
			$scope.scoreCardReqDto.mailCC = "";
			$('#emailModal').data('params', {
				scoreCardData : param.scoreCardData,
				action : param.action
			}).modal('show');
		};

		$scope.emailErrMsg = {};
		$scope.onClickMailYes = function() {
			var params = $('#emailModal').data('params');
			console.log($scope.scoreCardReqDto.mailTo);
			if ($scope.scoreCardReqDto.mailTo == undefined || $scope.scoreCardReqDto.mailTo == "") {
				$scope.emailErrMsg = "Please enter input to continue";
				$timeout(function() {
					$scope.emailErrMsg = {};
				}, 5000);
			} else {
				var modalInstance = {};
				modalInstance = $modal.open({
					templateUrl : 'spinnermodal.html',
					size : 0,
					resolve : {}
				});

				scoreCardReportService
						.emailScoreCardData($scope.scoreCardReqDto)
						.then(
								function(data) {
									$scope.serviceError = "";
									$scope.success = 'Project report email sent.';
									modalInstance.dismiss('cancel');
									$timeout(function() {
										$scope.success = {};
									}, 5000);
								},
								function(data) {
									modalInstance.dismiss('cancel');
									$scope.serviceError = "Project report email error.";
								});

				$('#emailModal').modal('hide');
				$scope.previousAction = params.action;
			}
			;
		};

});
