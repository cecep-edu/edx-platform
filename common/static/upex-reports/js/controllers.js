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

      if (response.released_to_students == true)
        $scope.state = {'class': 'success', 'text': 'Activo'};
      if (response.released_to_students == false)
        $scope.state = {'class': 'default', 'text': 'Planificado'};
      if (response.due == true)
        $scope.state = {'class': 'danger', 'text': 'Terminado'};
    });

    $http({
      url: "/reports/api/subscribers",
      params: data,
      method: 'GET'
    }).success(function(response) {
      console.log(response);
      $scope.subscribers = response;
      $scope.students = response.students;
    })

  })

  .controller('StudentIndexCtrl', function($scope) {
  	console.log("HOLA HOLA");
  }); 


