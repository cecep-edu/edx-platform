from django.conf.urls import patterns, url

urlpatterns = patterns('',
               url(r'^$', 'upex_reports.views.index', name="index_reports"),
               url(r'^api/courses$', 'upex_reports.views.get_courses', name="get_courses"),
)
