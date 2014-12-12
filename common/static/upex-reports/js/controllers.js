function getProgressOfACourse(releaseDate, dueDate) {

  if (releaseDate && !dueDate) {
    return 15
  } else if (releaseDate && dueDate) {
    var releaseDate = moment(releaseDate);
    var dueDate = moment(dueDate);

    console.log(releaseDate);
    console.log(dueDate);

    var diff = releaseDate.diff(dueDate, "days")
    console.log("DIFF: " + diff);    
  } else {
    return 0
  }
}

angular.module('rUPEx.controllers', [])

  .controller('CoursesIndexCtrl', function($scope, $http) {
    $("#students-link").removeClass("active");
    $("#orgs-link").removeClass("active");
    $("#stats-link").removeClass("active");
    $("#staff-link").removeClass("active");
    $("#courses-link").addClass("active");

    $http.get("/reports/api/courses")
    	.success(function(response) {
    		console.log(response);

        var courses = response;
        for (var c in courses) {
          var course = courses[c];
          course["progress"] = getProgressOfACourse(course.release_date, courses.due_date);
        }

    		$scope.courses = courses;
        $scope.apredicate = "display_name";
        $scope.ppredicate = "display_name";
        $scope.tpredicate = "display_name";

    	});

    $scope.downloadCSV = function(courses) {
      var csv = Papa.unparse(courses);
      console.log(csv);

      var data = "text/csv;charset=utf-8," + encodeURIComponent(csv);
      $('<p><a href="data:' + data + '" download="upex-list-courses.csv">Descargar el listado de cursos en formato CSV</a></p>')
        .appendTo('#link-download-csv-list-courses');

      $("#downloadCSVListCourses").modal('show');
    };

    $scope.downloadPDF = function(courses) {

      var data = []
          ,fontSize = 10
          ,height = 0
          ,doc
          ;
        
        doc = new jsPDF('p', 'pt', 'a4', true);
        doc.setFont("courier", "normal");
        doc.setFontSize(fontSize);

        for (i=0; i < courses.length; i++) {
          data.push({
            "Nombre" : courses[i].display_name,
            "Fecha de inicio" : courses[i].release_date || 'Sin definir',
            "Fecha de fin" : courses[i].due_date || 'Sin definir'
          });
        }

        height = doc.drawTable(data, {xstart:10,ystart:10,tablestart:70,marginleft:50});
        doc.save("upex-listado-cursos.pdf");
    };

  })

  .controller('CourseShowCtrl', function($scope, $routeParams, $http) {
    $("#students-link").removeClass("active");
    $("#orgs-link").removeClass("active");
    $("#stats-link").removeClass("active");
    $("#staff-link").removeClass("active");
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

      $scope.predicate = 'name'
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

    $scope.downloadPDF = function(students) {

        console.log(students);

      var data = []
          ,fontSize = 10
          ,height = 0
          ,doc
          ;
        
        doc = new jsPDF('p', 'pt', 'a4', true);
        doc.setFont("courier", "normal");
        doc.setFontSize(fontSize);

        for (i=0; i < students.length; i++) {
          data.push({
            "Nombre" : students[i].name,
            "Email" : students[i].email,
            "Nota final" : null,
            "Localización": students[i].location,
            "Nivel de estudios": students[i].level_of_education
          });
        }

        height = doc.drawTable(data, {xstart:10,ystart:10,tablestart:70,marginleft:50});
        doc.save("upex-listado-alumnos.pdf");
    };

  })

  .controller('StudentIndexCtrl', function($scope, $http) {
    $("#courses-link").removeClass("active");
    $("#orgs-link").removeClass("active");
    $("#stats-link").removeClass("active");
    $("#staff-link").removeClass("active");
    $("#students-link").addClass("active");


    $http.get("/reports/api/students")
      .success(function(response) {
        console.log(response);

        $scope.students = response;
        $scope.studentsCount = $scope.students.length

        $scope.zpredicate = 'name'; 
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

    $scope.downloadPDF = function(students) {

        //console.log(students);

      var data = []
          ,fontSize = 10
          ,height = 0
          ,doc
          ;
        
        doc = new jsPDF('p', 'pt', 'a4', true);
        doc.setFont("courier", "normal");
        doc.setFontSize(fontSize);

        for (i=0; i < students.length; i++) {
          data.push({
            "Nombre" : students[i].name,
            "Email" : students[i].email,
            "Localización" : students[i].city || 'Sin definir',
            "Nivel de estudios" : students[i].education || 'Sin definir'
          });
        }

        console.log(data);

        height = doc.drawTable(data, {xstart:10,ystart:10,tablestart:70,marginleft:50});
        doc.save("upex-listado-alumnos.pdf");
    };

  })

  .controller('StudentShowCtrl', function($scope, $http, $routeParams) {
    $("#courses-link").removeClass("active");
    $("#orgs-link").removeClass("active");
    $("#stats-link").removeClass("active");
    $("#staff-link").removeClass("active");
    $("#students-link").addClass("active");

    $http({
      url: "/reports/api/student",
      params: { id: $routeParams.id },
      method: 'GET'
    }).success(function(response) {
      console.log(response);
      console.log(response.courses);
      $scope.student = response;
      $scope.courses = response.courses;

      $scope.apredicate = 'display_name';
      $scope.tpredicate = 'display_name';
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


        $scope.downloadPDF = function(student, courses) {


          var studentData = []
              , coursesData = []
              ,fontSize = 10
              ,height = 0
              ,doc
              ;
            
            doc = new jsPDF('p', 'pt', 'a4', true);
            doc.setFont("courier", "normal");
            doc.setFontSize(fontSize);

            studentData.push({
              "Usuario": student.name,
              "Email": student.email,
              "Nivel de estudios": student.education,
              "Ciudad": student.city
            });
            doc.drawTable(studentData, {xstart:10,ystart:10,tablestart:70,marginleft:50});



            for (i = 0; i < courses.length; i++) {
              coursesData.push({
                "Curso": courses[i].display_name,
                "Nota final": null,
                "Fecha de inicio": courses[i].release_date,
                "Fecha de fin": courses[i].due_date
              });
            }
            doc.drawTable(coursesData, {xstart:10,ystart:10,tablestart:140,marginleft:50});
          
            doc.save("upex-cursos-alumno.pdf");
        };


  })

  .controller('OrgsIndexCtrl', function($scope, $http) {
        $("#courses-link").removeClass("active");
        $("#students-link").removeClass("active");
        $("#stats-link").removeClass("active");
        $("#staff-link").removeClass("active");
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

            $scope.predicate = "-";
          });

  })

  .controller('OrgShowCtrl', function($scope, $http, $routeParams) {
    $("#courses-link").removeClass("active");
    $("#students-link").removeClass("active");
    $("#stats-link").removeClass("active");
    $("#staff-link").removeClass("active");
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
              return false;
            });
            console.log($scope.courses);

            $scope.apredicate = "display_name";
            $scope.ppredicate = "display_name";
            $scope.tpredicate = "display_name";
        });
  })

  .controller('StaffIndexCtrl', function($scope, $http) {
    $("#courses-link").removeClass("active");
    $("#students-link").removeClass("active");
    $("#orgs-link").removeClass("active");
    $("#stats-link").removeClass("active");
    $("#staff-link").addClass("active");

    $http({
          url: "/reports/api/staff",
          method: 'GET'
        }).success(function(response) {
            console.log(response);
            var courses = response;

            var instructors = [];

            for (var course in courses) {
              var _course = courses[course];
              for (var instructor in _course.instructors) {
                instructors.push(_course.instructors[instructor]);
              }
            }

            console.log(instructors);

            
            $scope.students = _.uniq(instructors, 'email');
            console.log($scope.students);

            $scope.predicate = "name";
      });
  })

  .controller('StaffShowCtrl', function($scope, $http, $routeParams) {
    $("#courses-link").removeClass("active");
    $("#students-link").removeClass("active");
    $("#orgs-link").removeClass("active");
    $("#stats-link").removeClass("active");
    $("#staff-link").addClass("active");
    
    $http({
      url: "/reports/api/student",
      params: { id: $routeParams.id },
      method: 'GET'
    }).success(function(response) {
      console.log(response);
      console.log(response.courses);
      $scope.student = response;
      var courses = response.courses;

      for (var c in courses) {
        var course = courses[c];
        course["progress"] = getProgressOfACourse(course.release_date, courses.due_date);
      }

      $scope.courses = courses;

      $scope.apredicate = 'display_name';
      $scope.tpredicate = 'display_name';
    });

    $http({
      url: "/reports/api/staff-courses",
      params: { id: $routeParams.id },
      method: 'GET'
    }).success(function(response) {
      console.log(response);
      //$scope.course = response;
    });


    console.log("hola");
  })

  .controller('StatsIndexCtrl', function($scope, $http) {
    $("#courses-link").removeClass("active");
    $("#students-link").removeClass("active");
    $("#orgs-link").removeClass("active");
    $("#staff-link").removeClass("active");
    $("#stats-link").addClass("active");


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
        var response = response;
        $scope.orgs = get_all_orgs(response);
        console.log($scope.orgs);

        function getTheData() {
            //console.log(response);

            var courses = response;
            var data = [];
            var orgs = $scope.orgs;

            function countCourses(org) {
                var count = 0;

                for (var i = 0; i < courses.length; i++) {
                    if (courses[i].id.split("/")[2] == org)
                        count++
                }

                return count
            }

            for (var i = 0; i < orgs.length; i++) {
                var counts = countCourses(orgs[i]);
                data.push(counts);
            }

            console.log(data);

            return data
        }

        var courseInstitutionData = {
            labels: $scope.orgs,
            datasets: [
                    {
                        label: "Cursos por institución",
                        fillColor: "rgba(220,220,220,0.5)",
                        strokeColor: "rgba(220,220,220,0.8)",
                        highlightFill: "rgba(220,220,220,0.75)",
                        highlightStroke: "rgba(220,220,220,1)",
                        data: getTheData()
                    }
            ]
        };

        var courseInstitutionCtx = document.getElementById("chart-org-more-courses").getContext("2d");
        var courseInstitutionChart = new Chart(courseInstitutionCtx).Bar(courseInstitutionData);

      });

    var courseSubscribersData = {
        labels: ['IAEN/CC101/2014_T4', 'IAEN/CC10/2014_T3', 'IAEN/CC105/2014_T3', 'IAEN/CC101/2014_T4', 'IAEN/CC84/2013_T4', 'IAEN/CC80/2014_T2'],
        datasets: [
                {
                    label: "Alumnos por curso",
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 101, 150, 54, 24]
                }
        ]
    };

    var courseSubscribersCtx = document.getElementById("chart-courses-subscribers").getContext("2d");
    var courseSubscribersChart = new Chart(courseSubscribersCtx).Bar(courseSubscribersData);





  }); 
