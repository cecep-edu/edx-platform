angular.module('rUPEx', ['ngRoute', 'rUPEx.controllers'])

  .config(['$routeProvider', '$interpolateProvider',

	function($routeProvider, $interpolateProvider) {

	    $routeProvider.
	      when('/courses', {
	        templateUrl: 'course_index.html',
	        controller: 'CoursesIndexCtrl'
	      }).

	      when('/course/:course_id*', {
	      	templateUrl: 'course_show.html',
	      	controller: 'CourseShowCtrl'
	      }).

	      when('/students', {
	      	templateUrl: 'student_index.html',
	      	controller: 'StudentIndexCtrl'
	      }).

	      when('/student/:id', {
	      	templateUrl: 'student_show.html',
	      	controller: 'StudentShowCtrl'
	      }).

	      when('/orgs', {
	      	templateUrl: 'orgs_index.html',
	      	controller: 'OrgsIndexCtrl'
	      }).

	      when('/org/:org_name', {
	      	templateUrl: 'org_show.html',
	      	controller: 'OrgShowCtrl'
		  }).

		  when('/staff', {
		  	templateUrl: 'staff_index.html',
		  	controller: 'StaffIndexCtrl'
		  }).

		  when('/stats', {
		  	templateUrl: 'stats_index.html',
		  	controller: 'StatsIndexCtrl'
		  }).
	    
	      otherwise({
	        redirectTo: '/courses'
	      });


    	$interpolateProvider.startSymbol('{$');
    	$interpolateProvider.endSymbol('$}');
}]);

