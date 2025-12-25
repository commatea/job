"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { careerApi } from "@/lib/api";
import { CareerSimple } from "@/types";
import { Search, Rocket, FileText, ChevronRight, AlertCircle } from "lucide-react";

// 데모 데이터
const DEMO_STARTUPS: CareerSimple[] = [
  { id: 101, name: "전기공사업", type: "startup" },
  { id: 102, name: "IT 솔루션 개발업", type: "startup" },
  { id: 103, name: "위험물 저장소 운영", type: "startup" },
  { id: 104, name: "건설업", type: "startup" },
  { id: 105, name: "소방시설업", type: "startup" },
];

export default function StartupsPage() {
  const [startups, setStartups] = useState<CareerSimple[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await careerApi.listStartups();
        setStartups(response.data.length > 0 ? response.data : DEMO_STARTUPS);
      } catch (error) {
        console.error("창업 목록을 가져오는데 실패했습니다.", error);
        setStartups(DEMO_STARTUPS);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const filteredStartups = startups.filter((startup) =>
    startup.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">창업 가이드</h1>
        <p className="text-gray-600">
          창업에 필요한 자격증과 법적 요건을 확인하세요.
        </p>
      </div>

      {/* 안내 배너 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-800 mb-1">
            창업 전 확인하세요
          </h4>
          <p className="text-sm text-amber-700">
            각 업종별로 필수 자격증, 인허가 요건, 관련 법령이 다릅니다.
            상세 페이지에서 정확한 요건을 확인하세요.
          </p>
        </div>
      </div>

      {/* 검색 */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="창업 분야 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* 창업 목록 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map((startup) => (
            <Link
              key={startup.id}
              href={`/startups/${startup.id}`}
              className="group bg-white rounded-xl border p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-purple-600" />
                </div>
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                {startup.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                필수 자격증 및 법적 요건 확인
              </p>
              <div className="flex items-center text-sm text-purple-600">
                상세 정보
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredStartups.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
