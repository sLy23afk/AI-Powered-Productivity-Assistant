from marshmallow import Schema, fields, post_dump
from datetime import datetime

class TaskSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True)
    # Custom serialization for due_date to handle both str and datetime objects gracefully
    due_date = fields.Method(serialize='serialize_due_date', deserialize='load_due_date', required=False)
    status = fields.Str()
    priority = fields.Integer(dump_only = True)  # Added priority field to output schema
    suggestions = fields.List(fields.Str(), dump_only=True)  # Added suggestions field for output
    complimentary_tasks = fields.List(fields.String(), dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    completed_at = fields.DateTime(dump_only=True)  # Nullable for pending tasks
   
    def serialize_due_date(self, obj):
        """
        Custom serializer for due_date field.
        Marshmallow calls this method during dump.
        It handles both datetime objects and strings gracefully.
        """
        due_date = getattr(obj, 'due_date', None)
        if due_date is None:
            return None
        if isinstance(due_date, datetime):
            return due_date.isoformat()
        # If due_date is a string, return as is
        if isinstance(due_date, str):
            return due_date
        # Fallback: convert to string
        return str(due_date)

    def load_due_date(self, value):
        if value is None:
            return None
        if isinstance(value, datetime):
            return value
        try:
            return datetime.fromisoformat(value)
        except Exception:
            return value  # Return as is if conversion fails

class TaskCreateSchema(Schema):
    title = fields.Str(required=True)
    due_date = fields.DateTime(required=False)
    status = fields.Str(load_default='pending')
    priority = fields.Integer(required=False)
    created_at = fields.DateTime(dump_only=True)
    
class TaskUpdateSchema(Schema):
    title = fields.Str()
    due_date = fields.DateTime(required=False)
    status = fields.Str()
    priority = fields.Integer(required=False)
    
class UserRegisterSchema(Schema):
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(load_only=True, required=True)# Only load password during registration
    
class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(load_only=True, required=True)  # Only load password during login

class UserProfileSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str()
    email = fields.Email()
    tasks = fields.List(fields.Nested(TaskSchema), dump_only=True)  # Nested TaskSchema for user tasks
    @post_dump
    def remove_password(self, data, **kwargs):
        """
        Remove password from the output schema.
        """
        data.pop('password', None)
        return data