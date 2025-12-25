"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { certificationApi, authApi, userApi } from "@/lib/api";
import { Certification, User } from "@/types";
import {
  Award,
  Building,
  Calendar,
  DollarSign,
  BarChart3,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  Bookmark,
  Share2,
  ExternalLink,
  Target,
  CheckCircle,
  Plus,
} from "lucide-react";

// 데모 데이터
const DEMO_CERT: Certification = {
  id: 1,
  name: "정보처리기사",
  code: "1321",
  issuer: "한국산업인력공단",
  category_main: "IT",
  category_sub: "소프트웨어",
  level: "기사",
  level_order: 3,
  fee_written: 19400,
  fee_practical: 22600,
  pass_rate: "45.2%",
  description:
    "컴퓨터를 효과적으로 활용하기 위해 시스템 분석, 설계, 개발, 운영 등의 업무를 수행하는 전문 인력을 양성하기 위한 자격입니다. 정보처리기사는 IT 분야에서 가장 인기 있는 국가기술자격 중 하나입니다.",
  eligibility:
    "관련학과 4년제 졸업(예정)자 또는 산업기사 취득 후 실무경력 1년",
  subjects:
    '["소프트웨어 설계", "소프트웨어 개발", "데이터베이스 구축", "프로그래밍 언어 활용", "정보시스템 구축 관리"]',
  is_active: true,
  prerequisites: [
    { id: 2, name: "정보처리산업기사", level: "산업기사", level_order: 2 },
  ],
  required_for: [
    { id: 3, name: "정보처리기술사", level: "기술사", level_order: 4 },
  ],
};

export default function CertificationDetailPage() {
  const params = useParams();
  const [cert, setCert] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<"goal" | "acquired">("goal");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 자격증 정보 가져오기
        const certResponse = await certificationApi.get(Number(params.id));
        setCert(certResponse.data);
      } catch (error) {
        console.error("자격증 정보를 가져오는데 실패했습니다.", error);
        setCert(DEMO_CERT);
      } finally {
        setLoading(false);
      }

      // 로그인 상태 확인
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          const userResponse = await authApi.me();
          setUser(userResponse.data);
        }
      } catch {
        // 로그인 안됨
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleAddToGoals = async () => {
    if (!user || !cert) return;
    try {
      // API 호출 (실제로는 userApi.addGoal 같은 것 필요)
      alert(`"${cert.name}"이(가) 목표에 추가되었습니다.`);
      setShowAddModal(false);
    } catch (error) {
      console.error("목표 추가에 실패했습니다.", error);
    }
  };

  const handleAddToAcquired = async () => {
    if (!user || !cert) return;
    try {
      await userApi.addCertification(cert.id, {});
      alert(`"${cert.name}" 취득이 기록되었습니다.`);
      setShowAddModal(false);
    } catch (error) {
      console.error("취득 기록에 실패했습니다.", error);
    }
  };

  const parseSubjects = (subjects: string | undefined): string[] => {
    if (!subjects) return [];
    try {
      return JSON.parse(subjects);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-24">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            자격증을 찾을 수 없습니다
          </h2>
          <Link href="/tech-tree" className="text-blue-600 hover:underline">
            테크트리로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const subjects = parseSubjects(cert.subjects);

  const levelColors: Record<string, string> = {
    기술사: "bg-amber-100 text-amber-700 border-amber-300",
    기사: "bg-blue-100 text-blue-700 border-blue-300",
    산업기사: "bg-green-100 text-green-700 border-green-300",
    기능사: "bg-purple-100 text-purple-700 border-purple-300",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/tech-tree" className="hover:text-blue-600">
              테크트리
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>{cert.category_main}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-800">{cert.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    levelColors[cert.level || ""] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {cert.level}
                </span>
                <span className="text-sm text-gray-500">
                  {cert.category_main} &gt; {cert.category_sub}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {cert.name}
              </h1>
              <p className="text-gray-600">{cert.issuer}</p>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setAddType("goal");
                      setShowAddModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-purple-50 border-purple-300 text-purple-600 hover:bg-purple-100 transition-colors"
                  >
                    <Target className="w-5 h-5" />
                    목표 추가
                  </button>
                  <button
                    onClick={() => {
                      setAddType("acquired");
                      setShowAddModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-green-50 border-green-300 text-green-600 hover:bg-green-100 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    취득 완료
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    isBookmarked
                      ? "bg-blue-50 border-blue-300 text-blue-600"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                  />
                  북마크
                </button>
              )}
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white hover:bg-gray-50">
                <Share2 className="w-5 h-5" />
                공유
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 설명 */}
            {cert.description && (
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  자격증 소개
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {cert.description}
                </p>
              </div>
            )}

            {/* 시험 과목 */}
            {subjects.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  시험 과목
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {subjects.map((subject, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 응시 자격 */}
            {cert.eligibility && (
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  응시 자격
                </h2>
                <p className="text-gray-600">{cert.eligibility}</p>
              </div>
            )}

            {/* 테크트리 관계 */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                자격증 로드맵
              </h2>

              <div className="space-y-6">
                {/* 선수 자격증 */}
                {cert.prerequisites && cert.prerequisites.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      선수 자격증 (추천)
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {cert.prerequisites.map((prereq) => (
                        <Link
                          key={prereq.id}
                          href={`/certifications/${prereq.id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          {prereq.name}
                          <span className="text-xs text-blue-500">
                            ({prereq.level})
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 다음 단계 */}
                {cert.required_for && cert.required_for.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                      다음 단계
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {cert.required_for.map((next) => (
                        <Link
                          key={next.id}
                          href={`/certifications/${next.id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          {next.name}
                          <span className="text-xs text-green-500">
                            ({next.level})
                          </span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 시험 정보 카드 */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                시험 정보
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building className="w-4 h-4" />
                    시행 기관
                  </div>
                  <span className="font-medium">{cert.issuer}</span>
                </div>

                {cert.pass_rate && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-2 text-gray-600">
                      <BarChart3 className="w-4 h-4" />
                      합격률
                    </div>
                    <span className="font-medium text-blue-600">
                      {cert.pass_rate}
                    </span>
                  </div>
                )}

                {cert.fee_written && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      필기 응시료
                    </div>
                    <span className="font-medium">
                      {cert.fee_written.toLocaleString()}원
                    </span>
                  </div>
                )}

                {cert.fee_practical && (
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      실기 응시료
                    </div>
                    <span className="font-medium">
                      {cert.fee_practical.toLocaleString()}원
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 외부 링크 */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                관련 링크
              </h3>
              <div className="space-y-3">
                <a
                  href="https://www.q-net.or.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-700">Q-Net 원서접수</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-gray-700">시험 일정 확인</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>

            {/* CTA */}
            {!user && (
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl p-6 text-white">
                <h3 className="font-semibold mb-2">이 자격증에 관심이 있으신가요?</h3>
                <p className="text-sm text-blue-100 mb-4">
                  로그인하고 나만의 자격증 로드맵을 만들어보세요.
                </p>
                <Link
                  href="/register"
                  className="block w-full py-2 bg-white text-blue-600 font-medium rounded-lg text-center hover:bg-blue-50 transition-colors"
                >
                  무료로 시작하기
                </Link>
              </div>
            )}

            {user && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  나의 자격증 관리
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setAddType("goal");
                      setShowAddModal(true);
                    }}
                    className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      목표로 설정
                    </span>
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setAddType("acquired");
                      setShowAddModal(true);
                    }}
                    className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      취득 완료 기록
                    </span>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full m-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {addType === "goal" ? "목표 자격증 추가" : "취득 자격증 기록"}
            </h3>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                <span className="font-medium text-gray-800">{cert?.name}</span>을(를)
                {addType === "goal" ? " 목표로 설정하시겠습니까?" : " 취득 완료로 기록하시겠습니까?"}
              </p>

              {addType === "goal" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    목표 취득일 (선택)
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              {addType === "acquired" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      취득일
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      점수 (선택)
                    </label>
                    <input
                      type="number"
                      placeholder="예: 85"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={addType === "goal" ? handleAddToGoals : handleAddToAcquired}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  addType === "goal"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {addType === "goal" ? "목표 추가" : "기록하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
