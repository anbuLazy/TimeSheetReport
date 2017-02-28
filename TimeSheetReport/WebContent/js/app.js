/**
 * Created by sksharma.
 * 
 * This is basic application configuration file.
 */

angular.module('autoMotoApp',['ui.router', 'ui.bootstrap', 'ngResource', 'ngSanitize', 'autoMotoApp.controllers', 'autoMotoApp.services', 'autoMotoApp.directives', 'autoMotoApp.filters', 'tc.chartjs','ngCsv']);

angular.module('autoMotoApp').config(function($stateProvider, $httpProvider){
	
    $stateProvider.state('testdatamaster',{
        url:'/testdatamaster',
        templateUrl:'partials/testdatamaster.html',
        controller:'TestDataMasterController'
    }).state('newTestData',{
        url:'/testdata/new',
        templateUrl:'partials/testdata-add.html',
        controller:'TestDataCreateController'
    }).state('editTestData',{
        url:'/testdata/:id/edit',
        templateUrl:'partials/testdata-edit.html',
        controller:'TestDataEditController'
    }).state('result',{
        url:'/result',
        templateUrl:'partials/result.html',
        controller:'ResultController'
    }).state('resultTabs',{
        url:'/result/:env',
        templateUrl:'partials/result.html',
        controller:'ResultController'
    }).state('chart',{
        url:'/chart',
        templateUrl:'partials/chart.html',
        controller:'ChartController'
    }).state('getResultSuitData',{
        url:'/result/:groupName/:suitId/:env',
        templateUrl:'partials/result.html',
        controller:'ResultController'
    }).state('media',{
        url:'/media',
        templateUrl:'partials/media.html',
        controller:'MediaController'
    }).state('serviceHealth',{
        url:'/serviceHealth',
        templateUrl:'partials/serviceHealth.html',
        controller:'ServiceHealthCheckController'
    /*}).state('serviceHealthPerf',{
        url:'/serviceHealthPerf',
        templateUrl:'partials/serviceHealthPerf.html',
        controller:'ServiceHealthCheckPerfController'
    }).state('serviceHealthTest',{
        url:'/serviceHealthTest',
        templateUrl:'partials/serviceHealth-test.html',
        controller:'ServiceHealthCheckControllerTest'*/
    }).state('wptDashboard',{
        url:'/wptDashboard',
        templateUrl:'partials/wptDashboard.html',
        controller:'WptDashboardControllerTest'
    }).state('PerfDashboardChart',{
        url:'/PerfDashboardChart',
        templateUrl:'partials/PerfDashboardChart.html',
        controller:'PerfDashboardChart'
    }).state('syntheticMonitoring',{
        url:'/syntheticMonitoring',
        templateUrl:'partials/wptEndUserResponse.html',
        controller:'WPTServiceController'
    }).state('searchOrReplace',{
        url:'/searchOrReplace',
        templateUrl:'partials/testdata-search-replace.html',
        controller:'TestDataSearchReplaceController'
    }).state('realUserMonitoring',{
        url:'/realUserMonitoring',
        templateUrl:'partials/AppdDashboardChart.html',
        controller:'AppdServiceController'
    }).state('inventoryUpdate',{
        url:'/inventoryUpdate',
        templateUrl:'partials/inventoryupdate.html',
        controller:'InventoryUpdateController'
    }).state('fontAutomation',{
        url:'/fontAutomation',
        templateUrl:'partials/fontTesting.html',
        controller:'FontTestingController'
    }).state('supplyChain',{
        url:'/supplyChain',
        templateUrl:'partials/supplyChain.html',
        controller:'SupplyChainController'
    }).state('scoreCardReport',{
        url:'/scoreCardReport',
        templateUrl:'partials/scoreCardReport.html',
        controller:'ScoreCardReportController'
    });
}).run(function($state){
   $state.go('testdatamaster');
});