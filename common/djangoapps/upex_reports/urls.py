from django.conf.urls import patterns, url

urlpatterns = patterns('',
               url(r'^$', 'upex_reports.views.index', name="index"),
               url(r'^api/courses$', 'upex_reports.views.courses', name="courses"),
               url(r'^api/course$', 'upex_reports.views.course', name="course"),
               url(r'^api/subscribers$', 'upex_reports.views.subscribers', name="subscribers"),
               url(r'^api/students$', 'upex_reports.views.students', name="students"),
               url(r'^api/student$', 'upex_reports.views.student', name="student"),
               url(r'^api/staff$', 'upex_reports.views.staff', name="staff"),
)
