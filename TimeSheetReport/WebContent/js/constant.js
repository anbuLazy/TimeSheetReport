/**
 * This is application constants file.
 * 
 * Created by sksharma.
 */

var configData = {};
configData['appVersion'] = 1.0;
configData['apiBaseUrl'] = "http://localhost:8080/auto-moto-services"; /* Change URL with service deployed server URL */
configData['apiFontUrl'] = "http://localhost:9999/font"; /* Change URL with service deployed server URL */

/* Pagination constants */
configData['currentPage'] = 1; /* Define current page */
configData['itemsPerPage'] = 10; /* Define max records per page */
configData['boundaryLinks'] = true; /* Define boundary links */
configData['directionLinks'] = true; /* Define direction links */
configData['rotate'] = false; /* Define pagination link rotation */
configData['maxSize'] = 5; /* Define max size for pagination link */
configData['maxResultSuitPerJob'] = 10; /* Define max result suit per job */
configData['maxSCCloneProjects'] = 5; /* Define max score card projects can be cloned */
configData['maxSCAddItems'] = 15; /* Define max score card items to be added */