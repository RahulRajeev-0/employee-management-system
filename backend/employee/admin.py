from django.contrib import admin
from .models import Employee, EmployeeField, FormField, FormTemplate

# Register your models here.
admin.site.register(Employee)
admin.site.register(EmployeeField)
admin.site.register(FormField)
admin.site.register(FormTemplate)