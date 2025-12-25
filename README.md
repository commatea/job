# SpecLab

자격증 기반 커리어 네비게이션 플랫폼

## 프로젝트 개요

SpecLab은 자격증을 토대로 직업, 창업에 대한 정보를 제공하고, 사용자의 미래 스펙을 체계적으로 관리할 수 있는 올인원 커리어 플랫폼입니다.

## 핵심 기능

- **자격증 테크트리**: 게임 스킬트리 형태의 직관적인 자격증 로드맵 시각화
- **직업 연계**: 자격증과 취업 가능 직종 연결
- **창업 가이드**: 창업에 필요한 자격증 및 법적 요건 안내
- **AI 커리어 상담**: LLM 기반 맞춤형 커리어 컨설팅 (Phase 3)

## 기술 스택

### Frontend
- Next.js 16.1.1 (React 19)
- TypeScript
- Tailwind CSS v4
- React Flow (테크트리 시각화)

### Backend
- FastAPI (Python)
- SQLAlchemy + Alembic
- PostgreSQL 15
- Redis

### Infrastructure
- Docker Compose
- Vercel (Frontend)
- AWS/GCP (Backend)

## 문서

- [플랫폼 기획서](./docs/SPECLAB_PLATFORM.md) - 전체 기능 및 로드맵
- [관리자 설계서](./docs/ADMIN_DESIGN.md) - 관리자 페이지 상세 설계
- [시스템 설계](./docs/SYSTEM_DESIGN.md) - 기술 아키텍처

## 개발 환경 설정

```bash
# 데이터베이스 실행
docker-compose up -d

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## 프로젝트 구조

```
speclab/
├── frontend/           # Next.js 프론트엔드
│   ├── src/app/       # App Router 페이지
│   └── ...
├── backend/           # FastAPI 백엔드
│   ├── app/          # 애플리케이션 코드
│   └── alembic/      # DB 마이그레이션
├── docs/             # 프로젝트 문서
└── docker-compose.yml
```

## 개발 로드맵

| Phase | 목표 | 상태 |
|-------|------|------|
| Phase 1 | MVP - 테크트리 시각화, 기본 CRUD | 진행중 |
| Phase 2 | 데이터 고도화 - Q-Net/법령 API 연동 | 예정 |
| Phase 3 | AI 서비스 - LLM 커리어 상담 | 예정 |
| Phase 4 | 커뮤니티 & 수익화 | 예정 |

## 라이선스

Private - All rights reserved
