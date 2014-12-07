angular.module('rUPEx.controllers', [])

  .controller('CoursesIndexCtrl', function($scope, $http) {
    $("#students-link").removeClass("active");
    $("#orgs-link").removeClass("active");
    $("#courses-link").addClass("active");

    $http.get("/reports/api/courses")
    	.success(function(response) {
    		console.log(response);
    		$scope.courses = response;
    	});

    $scope.downloadCSV = function(courses) {
      var csv = Papa.unparse(courses);
      console.log(csv);

      var data = "text/csv;charset=utf-8," + encodeURIComponent(csv);
      $('<p><a href="data:' + data + '" download="upex-list-courses.csv">Descargar el listado de cursos en formato CSV</a></p>')
        .appendTo('#link-download-csv-list-courses');

      $("#downloadCSVListCourses").modal('show');
    };

  })

  .controller('CourseShowCtrl', function($scope, $routeParams, $http) {
    $("#students-link").removeClass("active");
    $("#orgs-link").removeClass("active");
    $("#courses-link").addClass("active");


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
      $scope.students_count = response.students_count;
    });

    $scope.downloadCSV = function(course, students) {
      var csvCourse = Papa.unparse(course);
      console.log(csvCourse);

      var csvSubscribers = Papa.unparse(students);
      console.log(csvSubscribers);

      var dataCourse = "text/csv;charset=utf-8," + encodeURIComponent(csvCourse);
      $('<p><a href="data:' + dataCourse + '" download="upex-data-course.csv">Descargar la información del curso en formato CSV</a></p>')
        .appendTo('#link-download-csv-info-course');

      var dataSubscribers = "text/csv;charset=utf-8," + encodeURIComponent(csvSubscribers);
      $('<p><a href="data:' + dataSubscribers + '" download="upex-data-subscribers.csv">Descargar la información de subscritos en formato CSV</a></p>')
        .appendTo('#link-download-csv-info-course');

      $("#downloadCSVInfoCourse").modal('show');
    };


  })

  .controller('StudentIndexCtrl', function($scope, $http) {
    $("#courses-link").removeClass("active");
    $("#orgs-link").removeClass("active");
    $("#students-link").addClass("active");

    $http({
      url: "/reports/api/students",
      method: 'GET'
    }).success(function(response) {
        console.log(response);
        $scope.students = response;
    });

    // está función no recoge $scope.students
    $scope.downloadCSV = function(students) {
      var csv = Papa.unparse(students);
      console.log(csv);

      var data = "text/csv;charset=utf-8," + encodeURIComponent(csv);
      $('<p><a href="data:' + data + '" download="upex-list-students.csv">Descargar el listado de alumnos en formato CSV</a></p>')
        .appendTo('#link-download-csv-list-students');

      $("#downloadCSVListStudents").modal('show');
    };

  })

  .controller('StudentShowCtrl', function($scope, $http, $routeParams) {
    $("#courses-link").removeClass("active");
    $("#orgs-link").removeClass("active");
    $("#students-link").addClass("active");

    $http({
      url: "/reports/api/student",
      params: { id: $routeParams.id },
      method: 'GET'
    }).success(function(response) {
      console.log(response);
      $scope.student = response;
      $scope.courses = response.courses;
    });

    $scope.downloadCSV = function(student, courses) {
      var csvStudent = Papa.unparse(student);
      console.log(csvStudent);

      var csvCourses = Papa.unparse(courses);
      console.log(csvCourses);

      var dataStudent = "text/csv;charset=utf-8," + encodeURIComponent(csvStudent);
      $('<p><a href="data:' + dataStudent + '" download="upex-data-student.csv">Descargar la información del alumno en formato CSV</a></p>')
        .appendTo('#link-download-csv-info-student');

      var dataCourses = "text/csv;charset=utf-8," + encodeURIComponent(csvCourses);
      $('<p><a href="data:' + dataCourses + '" download="upex-data-student-courses.csv">Descargar la información de cursos en formato CSV</a></p>')
        .appendTo('#link-download-csv-info-student');

      $("#downloadCSVInfoStudent").modal('show');
    };


  })

  .controller('OrgsIndexCtrl', function($scope, $http) {
        $("#courses-link").removeClass("active");
        $("#students-link").removeClass("active");
        $("#orgs-link").addClass("active");
        
        function get_organization(courseId) {
            return courseId.split("/")[2];
        }

        function get_all_orgs(data) {      
            var orgs = [];

            for (i = 0; i < data.length; i++) {
                var organization = get_organization(data[i]['id']);
                orgs.push(organization);
            }

            return _.uniq(orgs);
        }

        $http.get("/reports/api/courses")
          .success(function(response) {
            $scope.orgs = get_all_orgs(response);
            console.log($scope.orgs);
          });

  })

  .controller('OrgShowCtrl', function($scope, $http, $routeParams) {
    $("#courses-link").removeClass("active");
    $("#students-link").removeClass("active");
    $("#orgs-link").addClass("active");

    $scope.orgName = $routeParams.org_name.toUpperCase();

    $http.get("/reports/api/courses")
        .success(function(response) {
            $scope.courses = _.filter(response, function(course) {
              if (typeof course.id != 'undefined') {
                var orgName = course.id.split("/")[2];
                if (typeof orgName != 'undefined') {
                  return orgName.toUpperCase() == $scope.orgName;
                }
              }
            });
            console.log($scope.courses);
        });
  }); 
