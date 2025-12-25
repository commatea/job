"""
SpecLab 초기 데이터 시드 스크립트
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import async_session
from app.models.certification import Certification
from app.models.career import CareerPath, Requirement
from app.models.user import User
from app.core.security import get_password_hash
from app.core.config import settings

# 자격증 데이터
CERTIFICATIONS = [
    # IT 분야 - 정보처리 계열
    {
        "name": "정보처리기술사",
        "code": "1320",
        "issuer": "한국산업인력공단",
        "category_main": "IT",
        "category_sub": "소프트웨어",
        "level": "기술사",
        "level_order": 4,
        "fee_written": 67800,
        "fee_practical": 87100,
        "pass_rate": "8.5%",
        "description": "정보기술 분야의 최고 전문가 자격으로, 정보시스템 기획, 설계, 구축, 운영 전반에 대한 전문 지식을 검증합니다.",
        "eligibility": "기사 취득 후 실무경력 4년 이상",
        "subjects": '["정보관리", "소프트웨어공학", "데이터베이스", "보안", "신기술동향"]',
    },
    {
        "name": "정보처리기사",
        "code": "1321",
        "issuer": "한국산업인력공단",
        "category_main": "IT",
        "category_sub": "소프트웨어",
        "level": "기사",
        "level_order": 3,
        "fee_written": 19400,
        "fee_practical": 22600,
        "pass_rate": "45.2%",
        "description": "컴퓨터를 효과적으로 활용하기 위해 시스템 분석, 설계, 개발, 운영 등의 업무를 수행하는 전문 인력을 양성하기 위한 자격입니다.",
        "eligibility": "관련학과 4년제 졸업(예정)자 또는 산업기사 취득 후 실무경력 1년",
        "subjects": '["소프트웨어 설계", "소프트웨어 개발", "데이터베이스 구축", "프로그래밍 언어 활용", "정보시스템 구축 관리"]',
    },
    {
        "name": "정보처리산업기사",
        "code": "1322",
        "issuer": "한국산업인력공단",
        "category_main": "IT",
        "category_sub": "소프트웨어",
        "level": "산업기사",
        "level_order": 2,
        "fee_written": 19400,
        "fee_practical": 22600,
        "pass_rate": "38.7%",
        "description": "정보시스템 개발 및 운영에 필요한 기본적인 전문 지식과 기술을 갖춘 기술인력을 양성합니다.",
        "eligibility": "관련학과 2년제 졸업(예정)자 또는 기능사 취득 후 실무경력 1년",
        "subjects": '["프로그래밍 언어", "소프트웨어 개발", "데이터베이스", "컴퓨터 구조"]',
    },

    # IT 분야 - 빅데이터/AI 계열
    {
        "name": "빅데이터분석기사",
        "code": "1350",
        "issuer": "한국산업인력공단",
        "category_main": "IT",
        "category_sub": "데이터",
        "level": "기사",
        "level_order": 3,
        "fee_written": 19400,
        "fee_practical": 22600,
        "pass_rate": "32.1%",
        "description": "빅데이터 이해 및 처리 기술, 분석 기획, 분석 수행, 결과 활용 능력을 검증하는 국가기술자격입니다.",
        "eligibility": "관련학과 4년제 졸업(예정)자 또는 데이터분석준전문가(ADsP) 취득자",
        "subjects": '["빅데이터 분석 기획", "빅데이터 탐색", "빅데이터 모델링", "빅데이터 결과 해석"]',
    },
    {
        "name": "데이터분석준전문가",
        "code": "ADsP",
        "issuer": "한국데이터산업진흥원",
        "category_main": "IT",
        "category_sub": "데이터",
        "level": "기능사",
        "level_order": 1,
        "fee_written": 50000,
        "fee_practical": None,
        "pass_rate": "42.8%",
        "description": "데이터 분석의 기초적인 이론과 실무 능력을 검증하는 민간자격입니다.",
        "eligibility": "제한 없음",
        "subjects": '["데이터 이해", "데이터 분석 기획", "데이터 분석"]',
    },

    # IT 분야 - 네트워크/보안 계열
    {
        "name": "정보보안기사",
        "code": "1351",
        "issuer": "한국인터넷진흥원",
        "category_main": "IT",
        "category_sub": "보안",
        "level": "기사",
        "level_order": 3,
        "fee_written": 18800,
        "fee_practical": 20800,
        "pass_rate": "12.3%",
        "description": "정보보안 관련 시스템 및 솔루션 개발, 운영, 관리 업무를 수행하는 전문인력을 양성합니다.",
        "eligibility": "관련학과 4년제 졸업(예정)자 또는 관련 실무경력 4년 이상",
        "subjects": '["시스템 보안", "네트워크 보안", "애플리케이션 보안", "정보보안 관리"]',
    },
    {
        "name": "네트워크관리사 2급",
        "code": "NET2",
        "issuer": "한국정보통신자격협회",
        "category_main": "IT",
        "category_sub": "네트워크",
        "level": "기능사",
        "level_order": 1,
        "fee_written": 22000,
        "fee_practical": 33000,
        "pass_rate": "55.2%",
        "description": "네트워크 구축 및 운영에 필요한 기초 지식과 실무 능력을 검증합니다.",
        "eligibility": "제한 없음",
        "subjects": '["네트워크 일반", "NOS", "네트워크 운용기기"]',
    },

    # 전기 분야
    {
        "name": "전기기술사",
        "code": "2010",
        "issuer": "한국산업인력공단",
        "category_main": "전기",
        "category_sub": "전기설비",
        "level": "기술사",
        "level_order": 4,
        "fee_written": 67800,
        "fee_practical": 87100,
        "pass_rate": "5.2%",
        "description": "전기 분야의 최고 전문가 자격으로, 발전, 송배전, 전기설비 등 전반에 대한 고도의 전문 지식을 검증합니다.",
        "eligibility": "기사 취득 후 실무경력 4년 이상",
        "subjects": '["전력시스템 공학", "전기설비 설계", "전기 안전 관리"]',
    },
    {
        "name": "전기기사",
        "code": "2011",
        "issuer": "한국산업인력공단",
        "category_main": "전기",
        "category_sub": "전기설비",
        "level": "기사",
        "level_order": 3,
        "fee_written": 19400,
        "fee_practical": 22600,
        "pass_rate": "28.5%",
        "description": "전기설비의 설계, 시공, 유지보수 업무를 수행하는 전문 기술인력을 양성합니다.",
        "eligibility": "관련학과 4년제 졸업(예정)자 또는 산업기사 취득 후 실무경력 1년",
        "subjects": '["전기자기학", "전력공학", "전기기기", "회로이론", "전기설비기술기준"]',
    },
    {
        "name": "전기산업기사",
        "code": "2012",
        "issuer": "한국산업인력공단",
        "category_main": "전기",
        "category_sub": "전기설비",
        "level": "산업기사",
        "level_order": 2,
        "fee_written": 19400,
        "fee_practical": 22600,
        "pass_rate": "35.8%",
        "description": "전기설비의 시공, 점검, 유지보수 업무를 수행하는 기술인력을 양성합니다.",
        "eligibility": "관련학과 2년제 졸업(예정)자 또는 기능사 취득 후 실무경력 1년",
        "subjects": '["전기이론", "전력공학", "전기기기", "전기설비"]',
    },
    {
        "name": "전기기능사",
        "code": "2013",
        "issuer": "한국산업인력공단",
        "category_main": "전기",
        "category_sub": "전기설비",
        "level": "기능사",
        "level_order": 1,
        "fee_written": 14500,
        "fee_practical": 20900,
        "pass_rate": "48.2%",
        "description": "전기설비의 기초적인 설치 및 유지보수 업무를 수행하는 기능인력을 양성합니다.",
        "eligibility": "제한 없음",
        "subjects": '["전기이론", "전기기기", "전기설비"]',
    },

    # 건설 분야
    {
        "name": "건축기사",
        "code": "3011",
        "issuer": "한국산업인력공단",
        "category_main": "건설",
        "category_sub": "건축",
        "level": "기사",
        "level_order": 3,
        "fee_written": 19400,
        "fee_practical": 22600,
        "pass_rate": "22.1%",
        "description": "건축물의 설계, 시공, 감리 업무를 수행하는 전문 기술인력을 양성합니다.",
        "eligibility": "관련학과 4년제 졸업(예정)자 또는 산업기사 취득 후 실무경력 1년",
        "subjects": '["건축계획", "건축시공", "건축구조", "건축설비"]',
    },
    {
        "name": "토목기사",
        "code": "3021",
        "issuer": "한국산업인력공단",
        "category_main": "건설",
        "category_sub": "토목",
        "level": "기사",
        "level_order": 3,
        "fee_written": 19400,
        "fee_practical": 22600,
        "pass_rate": "25.3%",
        "description": "토목구조물의 설계, 시공, 감리 업무를 수행하는 전문 기술인력을 양성합니다.",
        "eligibility": "관련학과 4년제 졸업(예정)자 또는 산업기사 취득 후 실무경력 1년",
        "subjects": '["응용역학", "측량학", "수리학", "토질역학", "상하수도공학"]',
    },

    # 기계 분야
    {
        "name": "기계설계기사",
        "code": "4011",
        "issuer": "한국산업인력공단",
        "category_main": "기계",
        "category_sub": "기계설계",
        "level": "기사",
        "level_order": 3,
        "fee_written": 19400,
        "fee_practical": 22600,
        "pass_rate": "35.6%",
        "description": "기계장치 및 설비의 설계 업무를 수행하는 전문 기술인력을 양성합니다.",
        "eligibility": "관련학과 4년제 졸업(예정)자 또는 산업기사 취득 후 실무경력 1년",
        "subjects": '["기계설계", "기계제도", "CAD/CAM"]',
    },

    # 화학/위험물 분야
    {
        "name": "위험물산업기사",
        "code": "5011",
        "issuer": "한국산업인력공단",
        "category_main": "화학",
        "category_sub": "위험물",
        "level": "산업기사",
        "level_order": 2,
        "fee_written": 19400,
        "fee_practical": 22600,
        "pass_rate": "42.5%",
        "description": "위험물의 취급, 저장, 운반 등에 관한 안전관리 업무를 수행합니다.",
        "eligibility": "관련학과 2년제 졸업(예정)자 또는 기능사 취득 후 실무경력 1년",
        "subjects": '["일반화학", "화재예방", "소화설비", "위험물 안전관리"]',
    },
    {
        "name": "위험물기능사",
        "code": "5012",
        "issuer": "한국산업인력공단",
        "category_main": "화학",
        "category_sub": "위험물",
        "level": "기능사",
        "level_order": 1,
        "fee_written": 14500,
        "fee_practical": 20900,
        "pass_rate": "58.3%",
        "description": "위험물의 기초적인 취급 및 안전관리 업무를 수행합니다.",
        "eligibility": "제한 없음",
        "subjects": '["화학개론", "화재예방", "소화설비"]',
    },
]

# 선수 자격증 관계 (하위 -> 상위)
PREREQUISITES = [
    # 정보처리 계열
    ("정보처리산업기사", "정보처리기사"),
    ("정보처리기사", "정보처리기술사"),

    # 빅데이터 계열
    ("데이터분석준전문가", "빅데이터분석기사"),

    # 전기 계열
    ("전기기능사", "전기산업기사"),
    ("전기산업기사", "전기기사"),
    ("전기기사", "전기기술사"),

    # 위험물 계열
    ("위험물기능사", "위험물산업기사"),
]

# 커리어 데이터
CAREERS = [
    # 직업
    {
        "name": "소프트웨어 개발자",
        "type": "job",
        "category": "IT",
        "description": "소프트웨어 시스템 설계, 개발, 테스트를 수행하는 전문직",
        "salary_range": "3,500만원 ~ 8,000만원",
        "growth_potential": "높음",
    },
    {
        "name": "데이터 분석가",
        "type": "job",
        "category": "IT",
        "description": "데이터를 수집, 분석하여 비즈니스 인사이트를 도출하는 전문직",
        "salary_range": "4,000만원 ~ 9,000만원",
        "growth_potential": "매우 높음",
    },
    {
        "name": "전기안전관리자",
        "type": "job",
        "category": "전기",
        "description": "전기설비의 안전관리 및 점검을 수행하는 전문직",
        "salary_range": "3,000만원 ~ 5,500만원",
        "growth_potential": "보통",
    },
    {
        "name": "건축 설계사",
        "type": "job",
        "category": "건설",
        "description": "건축물의 설계 및 도면 작성을 수행하는 전문직",
        "salary_range": "3,500만원 ~ 7,000만원",
        "growth_potential": "보통",
    },

    # 창업
    {
        "name": "전기공사업",
        "type": "startup",
        "category": "전기",
        "description": "전기설비의 설치, 시공, 유지보수 사업",
        "salary_range": "연 매출 1억원 ~ 10억원",
        "growth_potential": "보통",
    },
    {
        "name": "IT 솔루션 개발업",
        "type": "startup",
        "category": "IT",
        "description": "소프트웨어 솔루션 개발 및 서비스 제공 사업",
        "salary_range": "연 매출 5천만원 ~ 50억원",
        "growth_potential": "높음",
    },
    {
        "name": "위험물 저장소 운영",
        "type": "startup",
        "category": "화학",
        "description": "위험물 저장 및 관리 시설 운영 사업",
        "salary_range": "연 매출 5억원 ~ 30억원",
        "growth_potential": "보통",
    },
]

# 커리어-자격증 요구사항
REQUIREMENTS = [
    ("소프트웨어 개발자", "정보처리기사", "권장 자격증"),
    ("데이터 분석가", "빅데이터분석기사", "필수 자격증"),
    ("데이터 분석가", "데이터분석준전문가", "입문 자격증"),
    ("전기안전관리자", "전기기사", "필수 자격증 (전기사업법)"),
    ("전기안전관리자", "전기산업기사", "조건부 자격증 (규모에 따라)"),
    ("전기공사업", "전기기사", "업 등록 필수 자격"),
    ("위험물 저장소 운영", "위험물산업기사", "필수 자격증 (위험물안전관리법)"),
]


async def seed_database():
    """
    데이터베이스 초기 데이터 시드
    """
    async with async_session() as session:
        # 1. 관리자 계정 생성
        print("Creating admin user...")
        admin = User(
            email=settings.FIRST_SUPERUSER_EMAIL,
            hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            full_name="관리자",
            is_active=True,
            is_superuser=True,
        )
        session.add(admin)

        # 2. 자격증 데이터 생성
        print("Creating certifications...")
        cert_map = {}
        for cert_data in CERTIFICATIONS:
            cert = Certification(**cert_data)
            session.add(cert)
            cert_map[cert_data["name"]] = cert

        await session.flush()

        # 3. 선수 자격증 관계 설정
        print("Setting prerequisites...")
        for prereq_name, cert_name in PREREQUISITES:
            if prereq_name in cert_map and cert_name in cert_map:
                cert_map[cert_name].prerequisites.append(cert_map[prereq_name])

        # 4. 커리어 데이터 생성
        print("Creating careers...")
        career_map = {}
        for career_data in CAREERS:
            career = CareerPath(**career_data)
            session.add(career)
            career_map[career_data["name"]] = career

        await session.flush()

        # 5. 커리어 요구사항 설정
        print("Setting requirements...")
        for career_name, cert_name, description in REQUIREMENTS:
            if career_name in career_map and cert_name in cert_map:
                requirement = Requirement(
                    career_path_id=career_map[career_name].id,
                    certification_id=cert_map[cert_name].id,
                    description=description,
                )
                session.add(requirement)

        await session.commit()
        print("Seed completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
