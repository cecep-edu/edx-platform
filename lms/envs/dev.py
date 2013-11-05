"""
Specific overrides to the base prod settings to make development easier.
"""

# We intentionally define lots of variables that aren't used, and
# want to import all variables from base settings files
# pylint: disable=W0401, W0614

from .aws import *

DEBUG = True
USE_I18N = True
TEMPLATE_DEBUG = True

# By default don't use a worker, execute tasks as if they were local functions
CELERY_ALWAYS_EAGER = True

# Disable asset pipeline (helpful for debugging JavaScript and CSS)
del CACHES['staticfiles']

################################ DEBUG TOOLBAR ################################

INSTALLED_APPS += ('debug_toolbar',)
MIDDLEWARE_CLASSES += ('django_comment_client.utils.QueryCountDebugMiddleware',
                       'debug_toolbar.middleware.DebugToolbarMiddleware',)
INTERNAL_IPS = ('127.0.0.1',)

DEBUG_TOOLBAR_PANELS = (
   'debug_toolbar.panels.version.VersionDebugPanel',
   'debug_toolbar.panels.timer.TimerDebugPanel',
   'debug_toolbar.panels.settings_vars.SettingsVarsDebugPanel',
   'debug_toolbar.panels.headers.HeaderDebugPanel',
   'debug_toolbar.panels.request_vars.RequestVarsDebugPanel',
   'debug_toolbar.panels.sql.SQLDebugPanel',
   'debug_toolbar.panels.signals.SignalDebugPanel',
   'debug_toolbar.panels.logger.LoggingPanel',

#  Enabling the profiler has a weird bug as of django-debug-toolbar==0.9.4 and
#  Django=1.3.1/1.4 where requests to views get duplicated (your method gets
#  hit twice). So you can uncomment when you need to diagnose performance
#  problems, but you shouldn't leave it on.
#  'debug_toolbar.panels.profiling.ProfilingDebugPanel',
)

DEBUG_TOOLBAR_CONFIG = {
    'INTERCEPT_REDIRECTS': False
}

########################### PIPELINE #################################

PIPELINE_SASS_ARGUMENTS = '--debug-info --require {proj_dir}/static/sass/bourbon/lib/bourbon.rb'.format(proj_dir=PROJECT_ROOT)


#####################################################################
# Lastly, see if the developer has any local overrides.
try:
    from .private import *      # pylint: disable=F0401
except ImportError:
    pass
