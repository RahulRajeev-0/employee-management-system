# django
from django.db import transaction
from django.db import models, transaction
from datetime import datetime
# drf
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# from rest_framework.exceptions import AuthenticationFailed, ParseError
from rest_framework.permissions import IsAuthenticated

# model
from .models import FormTemplate, FormField, Employee, EmployeeField

# Create your views here.

class FormTemplateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """
        Create a new form template with fields.
        
        Expected request body:
        {
            "name": "Employee Onboarding",
            "description": "Form for new employee information",
            "fields": [
                {
                    "label": "Full Name",
                    "field_type": "text",
                    "required": true,
                    "order": 1,
                    "options": null
                },
                {
                    "label": "Email",
                    "field_type": "email",
                    "required": true,
                    "order": 2,
                    "options": null
                },
                ...
            ]
        }
        """
        try:
            with transaction.atomic():
                # Create form template
                template_data = {
                    'name': request.data.get('name'),
                    'description': request.data.get('description', '')
                }
                
                # Validate template data
                if not template_data['name']:
                    return Response(
                        {"error": "Form template name is required"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                form_template = FormTemplate.objects.create(**template_data)
                
                # Create form fields
                fields_data = request.data.get('fields', [])
                if not fields_data:
                    return Response(
                        {"error": "At least one field is required"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                created_fields = []
                print("**************")
                print(fields_data)
                for idx, field_data in enumerate(fields_data):
                    # Validate field data
                    if not field_data.get('label'):
                        return Response(
                            {"error": f"Field at index {idx} is missing a label"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
                    field_type = field_data.get('field_type')
                    if not field_type or field_type not in dict(FormField.FIELD_TYPES):
                        return Response(
                            {"error": f"Field '{field_data.get('label')}' has invalid field type"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    
                    # Create the field
                    field = FormField.objects.create(
                        form_template=form_template,
                        label=field_data.get('label'),
                        field_type=field_type,
                        required=field_data.get('required', False),
                        order=field_data.get('order', idx),
                        options=field_data.get('options')
                    )
                    created_fields.append({
                        'id': field.id,
                        'label': field.label,
                        'field_type': field.field_type,
                        'required': field.required,
                        'order': field.order
                    })
                
                return Response({
                    'id': form_template.id,
                    'name': form_template.name,
                    'description': form_template.description,
                    'fields': created_fields,
                    'created_at': form_template.created_at
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


    def get(self, request, template_id=None):
        """
        Retrieve form templates.
        If template_id is provided, return that specific template with its fields.
        Otherwise, return a list of all templates.
        """
        if template_id:
            try:
                template = FormTemplate.objects.get(id=template_id)
                fields = template.fields.all().order_by('order')
                
                fields_data = [{
                    'id': field.id,
                    'label': field.label,
                    'field_type': field.field_type,
                    'required': field.required,
                    'order': field.order,
                    'options': field.options
                } for field in fields]
                
                return Response({
                    'id': template.id,
                    'name': template.name,
                    'description': template.description,
                    'fields': fields_data,
                    'created_at': template.created_at,
                    'updated_at': template.updated_at
                })
            except FormTemplate.DoesNotExist:
                return Response({"error": "Form template not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            templates = FormTemplate.objects.all().order_by('-created_at')
            templates_data = [{
                'id': template.id,
                'name': template.name,
                'description': template.description,
                'fields_count': template.fields.count(),
                'created_at': template.created_at
            } for template in templates]
            
            return Response(templates_data)