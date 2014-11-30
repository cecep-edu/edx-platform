from django.conf.urls import patterns, url

urlpatterns = patterns('',
               url(r'^$', 'upex_reports.views.index', name="index_reports"),
               url(r'^api/courses$', 'upex_reports.views.courses', name="courses"),
               url(r'^api/course$', 'upex_reports.views.course', name="course"),
)
