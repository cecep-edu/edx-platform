angular.module('rUPEx.controllers', [])

  .controller('CoursesIndexCtrl', function($scope, $http) {   
    $http.get("/reports/api/courses")
    	.success(function(response) {

    		console.log(response);
    		$scope.courses = response;


    	});


  })

  .controller('CourseShowCtrl', function($scope) {
  	console.log("MUESTRA CURSO");
  })

  .controller('StudentIndexCtrl', function($scope) {
  	console.log("HOLA HOLA");
  }); 


