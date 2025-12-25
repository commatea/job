"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { careerApi } from "@/lib/api";
import { Career } from "@/types";
import {
  Rocket,
  Award,
  DollarSign,
  FileText,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Scale,
} from "lucide-react";

// 데모 데이터
const DEMO_STARTUP: Career = {
  id: 101,
  name: "전기공사업",
  type: "startup",
  category: "전기",
  description:
    "전기공사업은 건물, 공장, 시설물 등의 전기설비 설치, 시공, 유지보수 사업입니다. 전기사업법에 따라 등록이 필요하며, 일정 자격과 자본금 요건을 갖추어야 합니다.",
  salary_range: "연 매출 1억원 ~ 10억원",
  growth_potential: "보통",
  requirements: [
    {
      id: 1,
      career_path_id: 101,
      certification_id: 5,
      description: "업 등록 필수 자격 (전기공사업법)",
      certification_name: "전기기사",
      is_mandatory: true,
    },
    {
      id: 2,
      career_path_id: 101,
      certification_id: 6,
      description: "조건부 자격증 (규모에 따라)",
      certification_name: "전기산업기사",
      is_mandatory: false,
    },
  ],
};

export default function StartupDetailPage() {
  const params = useParams();
  const [startup, setStartup] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const response = await careerApi.get(Number(params.id));
        setStartup(response.data);
      } catch (error) {
        console.error("창업 정보를 가져오는데 실패했습니다.", error);
        setStartup(DEMO_STARTUP);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStartup();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-24">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            창업 정보를 찾을 수 없습니다
          </h2>
          <Link href="/startups" className="text-purple-600 hover:underline">
            창업 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const mandatoryReqs = startup.requirements?.filter((r) => r.is_mandatory) || [];
  const optionalReqs = startup.requirements?.filter((r) => !r.is_mandatory) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/startups" className="hover:text-purple-600">
              창업 가이드
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-800">{startup.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Rocket className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded mb-2">
                  {startup.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-800">
                  {startup.name}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 경고 배너 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-800 mb-1">
              창업 전 반드시 확인하세요
            </h4>
            <p className="text-sm text-amber-700">
              아래 정보는 참고용이며, 실제 창업 시에는 관련 법령과 관할 관청에
              반드시 확인하시기 바랍니다. 법령 개정에 따라 요건이 변경될 수
              있습니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 설명 */}
            {startup.description && (
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  사업 소개
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {startup.description}
                </p>
              </div>
            )}

            {/* 필수 자격증 */}
            {mandatoryReqs.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-red-600" />
                  필수 자격 요건
                </h2>
                <div className="space-y-3">
                  {mandatoryReqs.map((req) => (
                    <Link
                      key={req.id}
                      href={`/certifications/${req.certification_id}`}
                      className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <div>
                          <span className="font-medium text-gray-800">
                            {req.certification_name}
                          </span>
                          <span className="ml-2 text-sm text-red-600 font-medium">
                            필수
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {req.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 권장 자격증 */}
            {optionalReqs.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  권장 자격증
                </h2>
                <div className="space-y-3">
                  {optionalReqs.map((req) => (
                    <Link
                      key={req.id}
                      href={`/certifications/${req.certification_id}`}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <span className="font-medium text-gray-800">
                            {req.certification_name}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {req.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 창업 절차 안내 */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                창업 절차 안내
              </h2>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 font-medium">
                    1
                  </span>
                  <div>
                    <h4 className="font-medium text-gray-800">자격 요건 확인</h4>
                    <p className="text-sm text-gray-600">
                      필수 자격증 취득 및 경력 요건 확인
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 font-medium">
                    2
                  </span>
                  <div>
                    <h4 className="font-medium text-gray-800">사업자 등록</h4>
                    <p className="text-sm text-gray-600">
                      관할 세무서에 사업자 등록 신청
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 font-medium">
                    3
                  </span>
                  <div>
                    <h4 className="font-medium text-gray-800">업종 등록/인허가</h4>
                    <p className="text-sm text-gray-600">
                      관할 관청에 업종별 등록 또는 인허가 신청
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 font-medium">
                    4
                  </span>
                  <div>
                    <h4 className="font-medium text-gray-800">사업 개시</h4>
                    <p className="text-sm text-gray-600">
                      모든 요건 충족 후 사업 개시
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 정보 카드 */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                사업 정보
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Rocket className="w-4 h-4" />
                    업종
                  </div>
                  <span className="font-medium">{startup.category}</span>
                </div>

                {startup.salary_range && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      예상 매출
                    </div>
                    <span className="font-medium text-purple-600">
                      {startup.salary_range}
                    </span>
                  </div>
                )}

                {startup.growth_potential && (
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-4 h-4" />
                      성장 가능성
                    </div>
                    <span className="font-medium">{startup.growth_potential}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 관련 링크 */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                참고 자료
              </h3>
              <div className="space-y-3 text-sm">
                <a
                  href="https://www.law.go.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                >
                  국가법령정보센터
                </a>
                <a
                  href="https://www.gov.kr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                >
                  정부24 (인허가 신청)
                </a>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/tech-tree"
              className="block bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-6 text-white hover:opacity-95 transition-opacity"
            >
              <h3 className="font-semibold mb-2">자격증 테크트리 보기</h3>
              <p className="text-sm text-purple-100 mb-4">
                필요한 자격증의 취득 경로를 확인하세요.
              </p>
              <span className="inline-flex items-center text-sm font-medium">
                테크트리 바로가기
                <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
