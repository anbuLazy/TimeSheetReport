/**
 * Created by sksharma.
 * 
 * This is application services file.
 */

var testDataSerMasterURI =  configData.apiBaseUrl + "/testdatamaster";
var testDataSerURI =  configData.apiBaseUrl + "/testdata";
var resultDataSerURI =  configData.apiBaseUrl + "/result";
var downloadSerURI =  configData.apiBaseUrl + "/download";
var serviceHealthSerURI =  configData.apiBaseUrl + "/healthcheck";
var wptDashboardURI = configData.apiBaseUrl + "/wptdashboard";
var appDDashboardURI = configData.apiBaseUrl + "/eurt";
var invUpdateURI = configData.apiBaseUrl + "/inventory/update";
var supplyChainSerURI =  configData.apiBaseUrl + "/supplychain";
var scoreCardSerURI =  configData.apiBaseUrl + "/scorecard";
var fontExtractURI = configData.apiFontUrl;

var app = angular.module('autoMotoApp.services',[]);
app.factory('TestDataMaster',function($resource){
    return $resource(testDataSerMasterURI + '/getAllMasterData', 
    		{ method: 'getAllMasterData', q: '*' }, // Query parameters
    		{'query': {method: 'GET', isArray: false }}
    );
});

app.factory('FontTestDataMaster',function($http, $q){
	return({
		getMasterFontGroup: getMasterFontGroup
		 
    });
	
	function getMasterFontGroup(url) {
        var response = $http({
            method: "GET",
            url: fontExtractURI +"?parenturl="+url
        });
        return response;
    }
});

app.factory('FilterTestDataMaster',function($http, $q){
	return({
		getMasterDataGroup: getMasterDataGroup,
		getMasterDataLocale: getMasterDataLocale,
		getMasterDataScenario: getMasterDataScenario
    });
	
	function getMasterDataGroup(envName) {
        var request = $http({
            method: "GET",
            url: testDataSerMasterURI + "/getMasterData?envName=" + envName
        });
        return( request.then( handleSuccess, handleError ) );
    }
	
	function getMasterDataLocale(groupName) {
        var request = $http({
            method: "GET",
            url: testDataSerMasterURI + "/getMasterData?groupName=" + groupName
        });
        return( request.then( handleSuccess, handleError ) );
    }
	
	function getMasterDataScenario(locale) {
        var request = $http({
            method: "GET",
            url: testDataSerMasterURI + "/getMasterData?locale=" + locale
        });
        return( request.then( handleSuccess, handleError ) );
    }
	
	function handleError( response ) {
        // Handle error
        if (! angular.isObject( response.data ) || ! response.data.message) {
            return( $q.reject( "An unknown error occurred." ) );
        }

        // use expected error message.
        return( $q.reject( response.data.message ) );
    }

    function handleSuccess( response ) {
        return( response.data);
    }
});

app.service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    };
});

app.service('downloadService', function($window, $q, $timeout){ 
	return {
	    download: function(fileName) {
	
	        var defer = $q.defer();
	        $timeout(function() {
	        		$window.open(downloadSerURI + '/' + fileName + '/file', fileName, 'about:blank', '_blank');
	            }, 1000)
	            .then(function() {
	                defer.resolve('success');
	            }, function() {
	                defer.reject('error');
	            });
	        
	        return defer.promise;
	    },
	    resourceSrc: function(fileName) {
	    	var src = "";
	    	if(fileName){
	    		src = downloadSerURI + '/' + fileName + '/file';
	    	}
	    	
	    	return src;
	    }
	};
});

app.service('dateDiffService', function($window, $q, $timeout){ 
	return {
		dateDiffInMonths: function(sDate, eDate){
		    
		    var dt1 = sDate.split('/'),
		        dt2 = eDate.split('/'),
		        one = new Date(dt1[2], (dt1[0]-1), dt1[1]),
		        two = new Date(dt2[2], (dt2[0]-1), dt2[1]);
		    
		    var millisecondsPerDay = 1000 * 60 * 60 * 24;
		    var millisBetween = two.getTime() - one.getTime();
		    var days = millisBetween / millisecondsPerDay;
		    var months = days/30;

		    return Math.floor(months);      
		}
	};
});

/*app.service('serviceHealthCheck', function($http, $q){
    return({
    	setServiceHealthCheck: setServiceHealthCheck,
    	getEnvNames: getEnvNames,
    	getServiceHealthCheckMap: getServiceHealthCheckMap
    });
    
    function setServiceHealthCheck(formTestDataReqDto) {
        var request = $http({
            method: "POST",
            url: serviceHealthSerURI + "/setServiceHealthCheck",
            data: formTestDataReqDto
        });
        return(request.then(handleSuccess, handleError));
    }
    
    function getEnvNames() {
        var request = $http({
            method: "GET",
            url: serviceHealthSerURI + "/getEnvNames"
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function getServiceHealthCheckMap(env) {
        var request = $http({
            method: "GET",
            url: serviceHealthSerURI + "/getServiceHealthCheckMap?envName=" + env
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function handleError( response ) {
        // Handle error
        if (! angular.isObject( response.data ) || ! response.data.message) {
            return( $q.reject( "An unknown error occurred." ) );
        }

        // use expected error message.
        return( $q.reject( response.data.message ) );
    }

    function handleSuccess( response ) {
        return( response.data);
    }
});*/

/*app.service('serviceHealthCheckTest', function($http, $q){
    return({
    	setServiceHealthCheck: setServiceHealthCheck,
    	getEnvNames: getEnvNames,
    	getServiceHealthCheckMap: getServiceHealthCheckMap
    });

    function setServiceHealthCheck(formTestDataReqDto) {
        var request = $http({
            method: "POST",
            url: serviceHealthSerURI + "/setServiceHealthCheckTest",
            data: formTestDataReqDto
        });
        return(request.then(handleSuccess, handleError));
    }
    
    function getEnvNames() {
        var request = $http({
            method: "GET",
            url: serviceHealthSerURI + "/getEnvNames"
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function getServiceHealthCheckMap(env) {
        var request = $http({
            method: "GET",
            url: serviceHealthSerURI + "/getServiceHealthCheckMapTest?envName=" + env
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function handleError( response ) {
        // Handle error
        if (! angular.isObject( response.data ) || ! response.data.message) {
            return( $q.reject( "An unknown error occurred." ) );
        }

        // use expected error message.
        return( $q.reject( response.data.message ) );
    }

    function handleSuccess( response ) {
        return( response.data);
    }
});*/

app.service('serviceHealthCheck', function($http, $q){
	// Return public API.
    return({
    	getEnvNames: getEnvNames,
    	getGrpNames: getGrpNames,
    	getServiceHealthCheckMap: getServiceHealthCheckMap
    });
    
    function getEnvNames() {
        var request = $http({
            method: "GET",
            url: serviceHealthSerURI + "/getEnvNames"
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function getGrpNames(env) {
        var request = $http({
            method: "GET",
            url: serviceHealthSerURI + "/getGrpNames?envName=" + env
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function getServiceHealthCheckMap(env, group) {
        var request = $http({
            method: "GET",
            url: serviceHealthSerURI + "/getServiceHealthCheckMap?envName=" + env + "&group=" + group
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function handleError( response ) {
        // Handle error
        if (! angular.isObject( response.data ) || ! response.data.message) {
            return( $q.reject( "An unknown error occurred." ) );
        }

        // use expected error message.
        return( $q.reject( response.data.message ) );
    }

    function handleSuccess( response ) {
        return( response.data);
    }
});

app.service('wptDashboardTestservice', function($http, $q){
	// Return public API.
    return({
    	//getServiceHealthCheck: getServiceHealthCheck,
    	getWptDashboardData: getWptDashboardData,
    	getLineChartDashboardData: getLineChartDashboardData,
    	getWptPageData:getWptPageData
    	
    });
    
    function getWptDashboardData() {
        var request = $http({
            method: "GET",
            url: wptDashboardURI + "/getWptDashboardData"
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function getLineChartDashboardData() {
        var request = $http({
            method: "GET",
            url: wptDashboardURI + "/getLineChartDashboardData"
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    
    function getWptPageData(pageName) {
        var request = $http({
            method: "GET",
            url: wptDashboardURI + "/getWptDashboardData?pageName="+pageName
        });
        return( request.then( handleSuccess, handleError ) );
    }
    function handleError( response ) {
        // Handle error
        if (! angular.isObject( response.data ) || ! response.data.message) {
            return( $q.reject( "An unknown error occurred." ) );
        }

        // use expected error message.
        return( $q.reject( response.data.message ) );
    }

    function handleSuccess( response ) {
    	console.log(response.data);
        return( response.data);
    }
});


app.service('testDataService', function($http, $q){
	// Return public API.
    return({
    	getTestData: getTestData,
    	setTestData: setTestData,
    	getResultData: getResultData,
    	getResultMasterData: getResultMasterData,
    	setEnableDisable: setEnableDisable,
    	getOrderData: getOrderData,
    	replaceTestData: replaceTestData
    });
	
    // ---
    // PUBLIC METHODS.
    // ---
    function getTestData( testDataReqDto ) {

        var request = $http({
            method: "POST",
            url: testDataSerURI + "/getTestData",
            data: prepareData(testDataReqDto)
        });

        return( request.then( handleSuccess, handleError ) );
    }
    
    function setTestData( formTestDataReqDto ) {

        var request = $http({
            method: "POST",
            url: testDataSerURI + "/setTestData",
            data: formTestDataReqDto
        });

        return( request.then( handleSuccess, handleError ) );
    }
    
    function getResultData( resultReqDto ) {

        var request = $http({
            method: "POST",
            url: resultDataSerURI + "/getResultData",
            data: resultReqDto
        });

        return( request.then( handleSuccess, handleError ) );
    }
    
    function getResultMasterData( resultReqDto ) {

        var request = $http({
            method: "POST",
            url: resultDataSerURI + "/getResultMasterData",
            data: resultReqDto
        });

        return( request.then( handleSuccess, handleError ) );
    }
    
    function setEnableDisable( formTestDataReqDto ) {

        var request = $http({
            method: "POST",
            url: testDataSerURI + "/setEnableDisable",
            data: formTestDataReqDto
        });

        return( request.then( handleSuccess, handleError ) );
    }
    
    function getOrderData( resultReqDto ) {

        var request = $http({
            method: "POST",
            url: resultDataSerURI + "/getResultOrderData",
            data: resultReqDto
        });

        return( request.then( handleSuccess, handleError ) );
    }
    
    function replaceTestData( testDataReqDto ) {

        var request = $http({
            method: "POST",
            url: testDataSerURI + "/replaceTestData",
            data: prepareData(testDataReqDto)
        });

        return( request.then( handleSuccess, handleError ) );
    }
    
    // --- 
    // PRIVATE METHODS.
    // ---
    function prepareData(testDataReqDto){
    	var obj = {};
    	
    	if(angular.isDefined(testDataReqDto.testId)){
    		obj['testId']= testDataReqDto.testId;
    	}
    	if(angular.isDefined(testDataReqDto.testEnv) && angular.isDefined(testDataReqDto.testEnv.env)){
    		obj['env'] = testDataReqDto.testEnv.env;
    	}
    	if(angular.isDefined(testDataReqDto.testLocale) && angular.isDefined(testDataReqDto.testLocale.locale)){
    		obj['locale']= testDataReqDto.testLocale.locale;
    	}
    	if(angular.isDefined(testDataReqDto.testScenario) && angular.isDefined(testDataReqDto.testScenario.scenarioName)){
    		obj['scenarioName']= testDataReqDto.testScenario.scenarioName;
    	}
    	if(angular.isDefined(testDataReqDto.testScenario) && angular.isDefined(testDataReqDto.testScenario.testScenarioName)){
    		obj['testScenarioName']= testDataReqDto.testScenario.testScenarioName;
    	}
    	if(angular.isDefined(testDataReqDto.testGroup) && angular.isDefined(testDataReqDto.testGroup.groupName)){
    		obj['groupName']= testDataReqDto.testGroup.groupName;
    	}
    	if(angular.isDefined(testDataReqDto.pageNumber)){
    		obj['pageNumber']= testDataReqDto.pageNumber;
    	}
    	if(angular.isDefined(testDataReqDto.maxRecords)){
    		obj['maxRecords']= testDataReqDto.maxRecords;
    	}
    	
    	if(angular.isDefined(testDataReqDto.searchTestData)){
    		obj['searchTestData']= testDataReqDto.searchTestData;
    	}
    	
    	if(angular.isDefined(testDataReqDto.replaceTestData)){
    		obj['replaceTestData']= testDataReqDto.replaceTestData;
    	}
        
    	return obj;
    }

    function handleError( response ) {
        // Handle error
        if (! angular.isObject( response.data ) || ! response.data.message) {
            return( $q.reject( "An unknown error occurred." ) );
        }

        // use expected error message.
        return( $q.reject( response.data.message ) );
    }

    function handleSuccess( response ) {
        
    	return( response.data);
        
    }

});

app.factory('Scopes', function ($rootScope) {
    var mem = {};

    return {
        set: function (key, value) {
            $rootScope.$emit('scope.stored', key);
            mem[key] = value;
        },
        get: function (key) {
            return mem[key];
        }
    };
});

app.factory('JsonValidation', function ($rootScope) {    
    var isValid = false;
    return {
        isJsonValid: function (value) {
        	try {
	    		JSON.parse(value);
	    		isValid = true;
	    	} catch(e) {
	    		console.log("Invalid JSON");
	    		isValid = false;
	    	}
	    	
	    	return isValid;
    	}
    }; 
});

app.service('wptResponseService', function($http, $q){
	// Return public API.
    return({
    	getWptResponseDataFromService: getWptResponseDataFromService
    });
    
    function getWptResponseDataFromService(env) {
        var request = $http({
            method: "GET",
            url: wptDashboardURI + "/getWptPageDataTab?envName=" + env
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function handleError( response ) {
        // Handle error
        if (! angular.isObject( response.data ) || ! response.data.message) {
            return( $q.reject( "An unknown error occurred." ) );
        }

        // use expected error message.
        return( $q.reject( response.data.message ) );
    }

    function handleSuccess( response ) {
        return( response.data);
    }
});
app.service('appdDashboardTestservice', function($http, $q){
	// Return public API.
    return({
    	    getAppdPageData: getAppdPageData
        });
    
    function getAppdPageData(env) {
        var request = $http({
            method: "GET",
            url: appDDashboardURI + "/getAppdPageData?envName=" + env
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function handleError( response ) {
        // Handle error
        if (! angular.isObject( response.data ) || ! response.data.message) {
            return( $q.reject( "An unknown error occurred." ) );
        }

        // use expected error message.
        return( $q.reject( response.data.message ) );
    }

    function handleSuccess( response ) {
        return( response.data);
    
    }
  
});
/*Inventory update Changes Start*/
app.service('invUpdateService', function($http, $q){
	// Return public API.
    return({
    	updateInventory: updateInventory    	
    });
    
    function updateInventory(formdata) {
        var request = $http({
            method: "POST",
            url:invUpdateURI,
            data:formdata
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function handleError( response ) {
        // Handle error
        if (! angular.isObject( response.data ) || ! response.data.message) {
            return( $q.reject( "An unknown error occurred." ) );
        }

        // use expected error message.
        return( $q.reject( response.data.message ) );
    }

    function handleSuccess( response ) {
        return( response.data);
    }
});
/*Inventory update Changes End*/
/*Supply chain changes start*/
app.service('supplyChainService', function($http, $q){
    return({
    	getEnvNames: getEnvNames,
    	getSupplyChainResult: getSupplyChainResult
    });
    
    function getEnvNames() {
        var request = $http({
            method: "GET",
            url: supplyChainSerURI + "/getEnvNames"
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function getSupplyChainResult(env) {
        var request = $http({
            method: "GET",
            url: supplyChainSerURI + "/getSupplyChainResultData?envName=" + env
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function handleError( response ) {
        // Handle error
        if (! angular.isObject( response.data ) || ! response.data.message) {
            return( $q.reject( "An unknown error occurred." ) );
        }

        // use expected error message.
        return( $q.reject( response.data.message ) );
    }

    function handleSuccess( response ) {
        return( response.data);
    }
});
/*Supply chain changes end*/
/*Score Card Reports changes start*/
app.factory('scoreCardMasterService',function($resource){
    return $resource(scoreCardSerURI + '/getScoreCardMaster', 
    		{ method: 'getScoreCardMaster', q: '*' }, // Query parameters
    		{'query': {method: 'GET', isArray: false }}
    );
});

app.service('scoreCardReportService', function($http, $q){
    return({
    	getEnvNames: getEnvNames,
    	getProjectsByEnv: getProjectsByEnv,
    	getScoreCardReportData: getScoreCardReportData,
    	addScoreCardReportData: addScoreCardReportData,
    	updateScoreCardReportData: updateScoreCardReportData,
    	deleteScoreCardData: deleteScoreCardData,
    	cloneProjectData: cloneProjectData,
    	emailScoreCardData: emailScoreCardData
    });
    
    function getEnvNames() {
        var request = $http({
            method: "GET",
            url: scoreCardSerURI + "/getEnvNames"
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function getProjectsByEnv(env) {
        var request = $http({
            method: "GET",
            url: scoreCardSerURI + "/getProjectsByEnv?envName=" + env
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function getScoreCardReportData(scoreCardReqDto) {
        var request = $http({
            method: "POST",
            url: scoreCardSerURI + "/getScoreCardReportData",
            data: scoreCardReqDto
        });
        return( request.then( handleSuccess, handleError ) );
    }
    
    function addScoreCardReportData(formScoreCardReqDto) {

        var request = $http({
            method: "POST",
            url: scoreCardSerURI + "/addScoreCardReportData",
            data: formScoreCardReqDto
        });

        return( request.then( handleSuccess, handleError ) );
    }
    
    function updateScoreCardReportData(formScoreCardReqDto) {

        var request = $http({
            method: "POST",
            url: scoreCardSerURI + "/updateScoreCardReportData",
            data: formScoreCardReqDto
        });

        return( request.then( handleSuccess, handleError ) );
    }
    
    function deleteScoreCardData(scoreCardReportId) {

        var request = $http({
            method: "DELETE",
            url: scoreCardSerURI + "/deleteScoreCardData?scoreCardReportId=" + scoreCardReportId
        });

        return( request.then( handleSuccess, handleError ) );
    }
    
    function cloneProjectData(formScoreCardReqDto) {

        var request = $http({
            method: "POST",
            url: scoreCardSerURI + "/cloneProjectData",
            data: formScoreCardReqDto
        });

        return( request.then( handleSuccess, handleError ) );
    }
    
    function emailScoreCardData(scoreCardReqDto) {

        var request = $http({
            method: "POST",
            url: scoreCardSerURI + "/emailScoreCardData",
            data: scoreCardReqDto
        });

        return( request.then( handleSuccess, handleError ) );
    }
    
    function handleError( response ) {
        // Handle error
        if (! angular.isObject( response.data ) || ! response.data.message) {
            return( $q.reject( "An unknown error occurred." ) );
        }

        // use expected error message.
        return( $q.reject( response.data.message ) );
    }

    function handleSuccess( response ) {
        return( response.data);
    }
});
/*Score Card Reports changes end*/