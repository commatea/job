"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { careerApi } from "@/lib/api";
import { CareerSimple } from "@/types";
import { Search, Briefcase, TrendingUp, ChevronRight } from "lucide-react";

// 데모 데이터
const DEMO_CAREERS: CareerSimple[] = [
  { id: 1, name: "소프트웨어 개발자", type: "job" },
  { id: 2, name: "데이터 분석가", type: "job" },
  { id: 3, name: "전기안전관리자", type: "job" },
  { id: 4, name: "건축 설계사", type: "job" },
  { id: 5, name: "네트워크 엔지니어", type: "job" },
  { id: 6, name: "정보보안 전문가", type: "job" },
];

export default function CareersPage() {
  const [careers, setCareers] = useState<CareerSimple[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await careerApi.listJobs();
        setCareers(response.data.length > 0 ? response.data : DEMO_CAREERS);
      } catch (error) {
        console.error("직업 목록을 가져오는데 실패했습니다.", error);
        setCareers(DEMO_CAREERS);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  const filteredCareers = careers.filter((career) =>
    career.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">직업 정보</h1>
        <p className="text-gray-600">
          자격증과 연결된 다양한 직업을 탐색하고, 필요한 자격요건을 확인하세요.
        </p>
      </div>

      {/* 검색 */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="직업 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 직업 목록 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career) => (
            <Link
              key={career.id}
              href={`/careers/${career.id}`}
              className="group bg-white rounded-xl border p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {career.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                관련 자격증 보기
              </p>
              <div className="flex items-center text-sm text-blue-600">
                상세 정보
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredCareers.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
