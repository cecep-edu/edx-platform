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

from django.contrib.auth.models import User
#from student.models import UserProfile

from student.views import get_course_enrollment_pairs

from django.contrib.auth.decorators import login_required

# GET /reports
@login_required(login_url="/signin")
def index(request):
	return render_to_response('upex_reports/base.html')

# GET /reports/api/courses
@login_required(login_url="/signin")
def courses(request):
	courses, in_proccess = courses_list()
	
	resp = []
	for course in courses:
		resp.append(course_outline_json(request, course))
	for course in in_proccess:
		resp.append(course_outline_json(request, course))
		
    
	return JsonResponse(resp)


# GET /reports/api/course
@login_required(login_url="/signin")
def course(request):
    org = request.GET.get('org')
    course = request.GET.get('course')
    name = request.GET.get('name')

    course_key = SlashSeparatedCourseKey(org, course, name)

    course_module = get_course_module(course_key)
    resp = course_outline_json(request, course_module)

    return JsonResponse(resp)


# GET /reports/api/subscribers
@login_required(login_url="/signin")
def subscribers(request):  # pylint: disable=W0613, W0621
    org = request.GET.get('org')
    course = request.GET.get('course')
    name = request.GET.get('name')
    course_id = SlashSeparatedCourseKey(org, course, name)

    course = get_course_by_id(course_id)

    #print get_student_grade_summary_data(request, course)

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


# GET /reports/api/students
@login_required(login_url="/signin")
def students(request):
    data = {}

    users = User.objects.all()
    i = 0
    for user in users:
        if hasattr(user, 'profile'):
            obj = {
                'id': user.id,
                'name': user.profile.name,
                'email': user.email,
                'education': user.profile.level_of_education
            }
            if hasattr(user.profile, 'city') and user.profile.city is not None:
                obj["city"] = user.profile.city.name.capitalize()

            data[i] = obj
        i = i +1

    data["count"] = len(data)

    return JsonResponse(data)


# GET /reports/api/student
@login_required(login_url="/signin")
def student(request):
    user = User.objects.get(pk=request.GET.get('id'))

    data = {}
    courses = []

    _courses = list(get_course_enrollment_pairs(user, '', ''))
    for course in _courses:
        course_module = get_course_module(course[0].id)
        course_data = course_outline_json(request, course_module)
        course_data["period"] = course_data["studio_url"].split("/")[-1]
        courses.append(course_data)

    data["courses"] = courses

    if hasattr(user, 'profile'):
        data['name'] = user.profile.name
        data['email'] = user.email
        data['education'] = user.profile.level_of_education
        if hasattr(user.profile, 'city') and user.profile.city is not None:
            data["city"] = user.profile.city.name.capitalize()

    return JsonResponse(data)


@login_required(login_url="/signin")
def staff(request):
    _courses, in_proccess = courses_list()
    
    courses = []

    for course in _courses:
        courses.append(course_outline_json(request, course))
    for course in in_proccess:
        courses.append(course_outline_json(request, course))


    for c in courses:

        ar = c["studio_url"].split("/")[2:]
        course_id = "/".join(ar)

        course_id = SlashSeparatedCourseKey.from_deprecated_string(course_id)
        course = get_course_with_access(
            request.user, 'instructor', course_id, depth=None
        )

        def extract_user_info(user):
            """ convert user into dicts for json view """
            return {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'name': user.profile.name,
                'city': user.profile.city.name.capitalize(),
                'education': user.profile.level_of_education
            }

        response_payload = {
            'course_id': course_id.to_deprecated_string(),
            'instructors': map(extract_user_info, list_with_level(
                course, 'instructor'
            )),
        }

        c["instructors"] = response_payload["instructors"]


    return JsonResponse(courses)


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
        include_ancestor_info=True,
        include_child_info=True,
        course_outline=True,
        include_children_predicate=lambda xblock: not xblock.category == 'vertical',
        parent_xblock=True
    )


def get_course_module(course_key, depth=0):
    course_module = modulestore().get_course(course_key, depth=depth)
    return course_module

