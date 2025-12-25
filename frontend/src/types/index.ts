// 자격증
export interface CertificationSimple {
  id: number;
  name: string;
  code?: string;
  category_main?: string;
  category_sub?: string;
  level?: string;
  level_order: number;
}

export interface Certification extends CertificationSimple {
  issuer?: string;
  fee_written?: number;
  fee_practical?: number;
  pass_rate?: string;
  description?: string;
  eligibility?: string;
  subjects?: string;
  is_active: boolean;
  prerequisites: CertificationSimple[];
  required_for: CertificationSimple[];
}

// 그래프
export interface GraphNode {
  id: string;
  data: {
    label: string;
    level?: string;
    category?: string;
    issuer?: string;
  };
  position: { x: number; y: number };
  type?: string;
  style?: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// 카테고리
export interface CategoryCount {
  name: string;
  count: number;
}

export interface CategoryTree {
  main: string;
  subs: CategoryCount[];
  total: number;
}

// 커리어
export interface CareerSimple {
  id: number;
  name: string;
  type: 'job' | 'startup';
}

export interface Requirement {
  id: number;
  career_path_id: number;
  certification_id?: number;
  description?: string;
  certification_name?: string;
  is_mandatory?: boolean;
}

export interface Career extends CareerSimple {
  category?: string;
  description?: string;
  salary_range?: string;
  growth_potential?: string;
  requirements: Requirement[];
}

// 사용자
export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;
}

// 인증
export interface Token {
  access_token: string;
  token_type: string;
}
