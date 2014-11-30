from django.shortcuts import render_to_response
from util.json_request import JsonResponse

from xmodule.modulestore.django import modulestore
from xmodule.error_module import ErrorDescriptor

#from contentstore.views.course import *
from contentstore.views.item import create_xblock_info

from opaque_keys.edx.locations import SlashSeparatedCourseKey
from opaque_keys.edx.keys import CourseKey

from course_action_state.models import CourseRerunState, CourseRerunUIStateManager

from instructor.access import list_with_level

from courseware.courses import get_course_with_access, get_course_by_id

import instructor_analytics.basic

# GET /reports
def index(request):
	return render_to_response('upex_reports/base.html')

# GET /reports/api/courses
def courses(request):
	courses, in_proccess = courses_list()
	
	resp = []
	for course in courses:
		resp.append(course_outline_json(request, course))
	for course in in_proccess:
		resp.append(course_outline_json(request, course))

	return JsonResponse(resp)


# GET /reports/api/course
def course(request):
    org = request.GET.get('org')
    course = request.GET.get('course')
    name = request.GET.get('name')

    course_key = SlashSeparatedCourseKey(org, course, name)

    course_module = get_course_module(course_key)
    resp = course_outline_json(request, course_module)

    return JsonResponse(resp)


# GET /reports/api/subscribers
def subscribers(request):  # pylint: disable=W0613, W0621
    org = request.GET.get('org')
    course = request.GET.get('course')
    name = request.GET.get('name')
    course_id = SlashSeparatedCourseKey(org, course, name)

    course = get_course_by_id(course_id)

    query_features = [
        'id', 'username', 'name', 'email', 'language', 'location',
        'year_of_birth', 'gender', 'level_of_education', 'mailing_address',
        'goals'
    ]

    student_data = instructor_analytics.basic.enrolled_students_features(course_id, query_features)
    response_payload = {
        'course_id': unicode(course_id),
        'students': student_data,
        'students_count': len(student_data)
    }
    return JsonResponse(response_payload)


# GET /reports/api/subs
def course_role_members(request):
    """
    List instructors and staff.
    Requires instructor access.

    rolename is one of ['instructor', 'staff', 'beta']

    Returns JSON of the form {
        "course_id": "some/course/id",
        "staff": [
            {
                "username": "staff1",
                "email": "staff1@example.org",
                "first_name": "Joe",
                "last_name": "Shmoe",
            }
        ]
    }
    """
    org = request.GET.get('org')
    course = request.GET.get('course')
    name = request.GET.get('name')
    course_id = SlashSeparatedCourseKey(org, course, name)

    #course = get_course_with_access(
    #    request.user, 'instructor', course_id, depth=None
    #)

    course = get_course_with_access(
        request.user, 'instructor', course_id, depth=None
    )

    rolename = 'instructor'

    def extract_user_info(user):
        """ convert user into dicts for json view """
        return {
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        }

    response_payload = {
        'course_id': course_id.to_deprecated_string(),
        rolename: map(extract_user_info, list_with_level(
            course, rolename
        )),
    }
    return JsonResponse(response_payload)



def courses_list():
    """
    List all courses available to the logged in user by iterating through all the courses
    """
    def course_filter(course):
        """
        Filter out unusable and inaccessible courses
        """
        if isinstance(course, ErrorDescriptor):
            return False

        # pylint: disable=fixme
        # TODO remove this condition when templates purged from db
        if course.location.course == 'templates':
            return False

        return True

    courses = filter(course_filter, modulestore().get_courses())
    in_process_course_actions = [
        course for course in
        CourseRerunState.objects.find_all(
            exclude_args={'state': CourseRerunUIStateManager.State.SUCCEEDED}, should_display=True
        )
        if True
    ]
    return courses, in_process_course_actions


def course_outline_json(request, course_module):
    """
    Returns a JSON representation of the course module and recursively all of its children.
    """
    return create_xblock_info(
        course_module,
        include_child_info=True,
        course_outline=True,
        include_children_predicate=lambda xblock: not xblock.category == 'vertical'
    )


def get_course_module(course_key, depth=0):
    course_module = modulestore().get_course(course_key, depth=depth)
    return course_module

