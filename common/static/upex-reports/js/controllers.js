angular.module('rUPEx.controllers', [])

  .controller('CoursesIndexCtrl', function($scope, $http) {   
    $http.get("/reports/api/courses")
    	.success(function(response) {

    		console.log(response);
    		$scope.courses = response;


    	});


  })

  .controller('CourseShowCtrl', function($scope, $routeParams, $http) {
  	var _course = $routeParams.course_id.split("/");

    var data = {
      org: _course[0],
      course: _course[1],
      name: _course[2]
    };

    $http({
      url: "/reports/api/course",
      params: data,
      method: 'GET'
    }).success(function(response) {
      console.log(response);
      $scope.course = response;
      //$scope.$apply();
    });

  })

  .controller('StudentIndexCtrl', function($scope) {
  	console.log("HOLA HOLA");
  }); 


