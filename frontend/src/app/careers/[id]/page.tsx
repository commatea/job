"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { careerApi } from "@/lib/api";
import { Career } from "@/types";
import {
  Briefcase,
  Award,
  DollarSign,
  TrendingUp,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  BookOpen,
} from "lucide-react";

// 데모 데이터
const DEMO_CAREER: Career = {
  id: 1,
  name: "소프트웨어 개발자",
  type: "job",
  category: "IT",
  description:
    "소프트웨어 개발자는 다양한 프로그래밍 언어와 도구를 사용하여 소프트웨어 시스템을 설계, 개발, 테스트하는 전문직입니다. 웹 개발, 모바일 앱 개발, 시스템 개발 등 다양한 분야에서 활동할 수 있습니다.",
  salary_range: "3,500만원 ~ 8,000만원",
  growth_potential: "높음",
  requirements: [
    {
      id: 1,
      career_path_id: 1,
      certification_id: 1,
      description: "권장 자격증",
      certification_name: "정보처리기사",
    },
    {
      id: 2,
      career_path_id: 1,
      certification_id: 2,
      description: "권장 자격증",
      certification_name: "SQLD",
    },
  ],
};

export default function CareerDetailPage() {
  const params = useParams();
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const response = await careerApi.get(Number(params.id));
        setCareer(response.data);
      } catch (error) {
        console.error("직업 정보를 가져오는데 실패했습니다.", error);
        setCareer(DEMO_CAREER);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCareer();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-24">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            직업 정보를 찾을 수 없습니다
          </h2>
          <Link href="/careers" className="text-blue-600 hover:underline">
            직업 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/careers" className="hover:text-blue-600">
              직업 정보
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-800">{career.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded mb-2">
                  {career.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-800">
                  {career.name}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 설명 */}
            {career.description && (
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  직업 소개
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {career.description}
                </p>
              </div>
            )}

            {/* 필요 자격증 */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                관련 자격증
              </h2>

              {career.requirements && career.requirements.length > 0 ? (
                <div className="space-y-3">
                  {career.requirements.map((req) => (
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
                          <span className="ml-2 text-sm text-gray-500">
                            {req.description}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">관련 자격증 정보가 없습니다.</p>
              )}
            </div>

            {/* 추가 정보 */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                커리어 조언
              </h2>
              <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">
                    이 직업에 관심이 있다면
                  </h4>
                  <p className="text-sm text-blue-700">
                    관련 자격증을 취득하면 취업 경쟁력이 높아집니다. 테크트리를
                    확인하여 체계적인 준비 계획을 세워보세요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 정보 카드 */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                직업 정보
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    분야
                  </div>
                  <span className="font-medium">{career.category}</span>
                </div>

                {career.salary_range && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      예상 연봉
                    </div>
                    <span className="font-medium text-green-600">
                      {career.salary_range}
                    </span>
                  </div>
                )}

                {career.growth_potential && (
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      성장 가능성
                    </div>
                    <span className="font-medium">{career.growth_potential}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 테크트리 링크 */}
            <Link
              href="/tech-tree"
              className="block bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl p-6 text-white hover:opacity-95 transition-opacity"
            >
              <h3 className="font-semibold mb-2">자격증 테크트리 보기</h3>
              <p className="text-sm text-blue-100 mb-4">
                관련 자격증의 취득 경로를 시각적으로 확인하세요.
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
