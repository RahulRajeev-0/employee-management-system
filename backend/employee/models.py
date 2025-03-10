from django.db import models

# Create your models here.

# forms/models.py
class FormTemplate(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class FormField(models.Model):
    FIELD_TYPES = (
        ('text', 'Text'),
        ('number', 'Number'),
        ('date', 'Date'),
        ('password', 'Password'),
        ('email', 'Email'),
        # Add more field types as needed
    )
    
    form_template = models.ForeignKey(FormTemplate, related_name='fields', on_delete=models.CASCADE)
    label = models.CharField(max_length=255)
    field_type = models.CharField(max_length=50, choices=FIELD_TYPES)
    required = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    options = models.JSONField(blank=True, null=True)  # For select fields

class Employee(models.Model):
    form_template = models.ForeignKey(FormTemplate, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
class EmployeeField(models.Model):
    employee = models.ForeignKey(Employee, related_name='fields', on_delete=models.CASCADE)
    form_field = models.ForeignKey(FormField, on_delete=models.PROTECT)
    value = models.TextField()  # Store all values as text and convert as needed