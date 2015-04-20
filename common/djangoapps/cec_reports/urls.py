from django.conf.urls import patterns, url

urlpatterns = patterns('',
               url(r'^$', 'cec_reports.views.index', name="index"),
               url(r'^api/courses$', 'cec_reports.views.courses', name="courses"),
               url(r'^api/course$', 'cec_reports.views.course', name="course"),
               url(r'^api/subscribers$', 'cec_reports.views.subscribers', name="subscribers"),
               url(r'^api/students$', 'cec_reports.views.students', name="students"),
               url(r'^api/student$', 'cec_reports.views.student', name="student"),
               url(r'^api/staff$', 'cec_reports.views.staff', name="staff"),
               url(r'^api/staff-courses$', 'cec_reports.views.staff_courses', name="staff_courses"),
)
