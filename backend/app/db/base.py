# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base
from app.models.user import User, UserCertification, UserGoal
from app.models.certification import Certification, ExamSchedule
from app.models.career import CareerPath, Requirement
