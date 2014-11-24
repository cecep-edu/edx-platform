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
	    
	      otherwise({
	        redirectTo: '/courses'
	      });


    	$interpolateProvider.startSymbol('{$');
    	$interpolateProvider.endSymbol('$}');
}]);
