"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { certificationApi } from "@/lib/api";
import { Certification } from "@/types";
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

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        const response = await certificationApi.get(Number(params.id));
        setCert(response.data);
      } catch (error) {
        console.error("자격증 정보를 가져오는데 실패했습니다.", error);
        setCert(DEMO_CERT);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCertification();
    }
  }, [params.id]);

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
          </div>
        </div>
      </div>
    </div>
  );
}
