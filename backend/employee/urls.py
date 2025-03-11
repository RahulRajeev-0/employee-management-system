# In your urls.py
from django.urls import path
from .views import  FormTemplateView

urlpatterns = [
    path('forms/', FormTemplateView.as_view(), name='form-templates'),
    path('forms/<int:template_id>/', FormTemplateView.as_view(), name='form-template-detail'),
    # path('api/forms/submit/', DynamicFormView.as_view(), name='form-submit'),
]