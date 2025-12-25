"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { certificationApi } from "@/lib/api";
import { CertificationSimple, CategoryTree } from "@/types";
import {
  Search,
  Award,
  Filter,
  ChevronRight,
  ChevronDown,
  X,
} from "lucide-react";

// 데모 데이터
const DEMO_CERTIFICATIONS: CertificationSimple[] = [
  { id: 1, name: "정보처리기사", code: "1320", category_main: "IT", category_sub: "정보기술", level: "기사", level_order: 3 },
  { id: 2, name: "정보처리산업기사", code: "2290", category_main: "IT", category_sub: "정보기술", level: "산업기사", level_order: 2 },
  { id: 3, name: "SQLD", code: "SQL-D", category_main: "IT", category_sub: "데이터베이스", level: "전문자격", level_order: 2 },
  { id: 4, name: "빅데이터분석기사", code: "BD001", category_main: "IT", category_sub: "데이터", level: "기사", level_order: 3 },
  { id: 5, name: "전기기사", code: "7910", category_main: "전기", category_sub: "전기설비", level: "기사", level_order: 3 },
  { id: 6, name: "전기산업기사", code: "7911", category_main: "전기", category_sub: "전기설비", level: "산업기사", level_order: 2 },
  { id: 7, name: "건축기사", code: "6530", category_main: "건축", category_sub: "건축설계", level: "기사", level_order: 3 },
  { id: 8, name: "정보보안기사", code: "1351", category_main: "IT", category_sub: "보안", level: "기사", level_order: 3 },
];

const DEMO_CATEGORIES: CategoryTree[] = [
  { main: "IT", subs: [{ name: "정보기술", count: 10 }, { name: "데이터베이스", count: 5 }, { name: "데이터", count: 3 }, { name: "보안", count: 4 }], total: 22 },
  { main: "전기", subs: [{ name: "전기설비", count: 8 }, { name: "전기공사", count: 5 }], total: 13 },
  { main: "건축", subs: [{ name: "건축설계", count: 6 }, { name: "건축시공", count: 4 }], total: 10 },
];

const LEVELS = ["기능사", "산업기사", "기사", "기능장", "기술사", "전문자격"];

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<CertificationSimple[]>([]);
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 필터 상태
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [certsResponse, catsResponse] = await Promise.all([
          certificationApi.list(),
          certificationApi.getCategories(),
        ]);
        setCertifications(certsResponse.data.length > 0 ? certsResponse.data : DEMO_CERTIFICATIONS);
        setCategories(catsResponse.data.length > 0 ? catsResponse.data : DEMO_CATEGORIES);
      } catch (error) {
        console.error("데이터를 가져오는데 실패했습니다.", error);
        setCertifications(DEMO_CERTIFICATIONS);
        setCategories(DEMO_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredCertifications = certifications.filter((cert) => {
    const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.code?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || cert.category_main === selectedCategory;
    const matchesLevel = !selectedLevel || cert.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedLevel(null);
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case "기술사":
        return "bg-purple-100 text-purple-700";
      case "기능장":
        return "bg-red-100 text-red-700";
      case "기사":
        return "bg-blue-100 text-blue-700";
      case "산업기사":
        return "bg-green-100 text-green-700";
      case "기능사":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">자격증 탐색</h1>
          <p className="text-gray-600">
            다양한 분야의 자격증 정보를 검색하고 상세 정보를 확인하세요.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 사이드바 필터 (데스크톱) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">필터</h2>
                {(selectedCategory || selectedLevel) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    초기화
                  </button>
                )}
              </div>

              {/* 카테고리 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">분야</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <div key={cat.main}>
                      <button
                        onClick={() => {
                          setSelectedCategory(selectedCategory === cat.main ? null : cat.main);
                          toggleCategory(cat.main);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat.main
                            ? "bg-blue-50 text-blue-700"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <span>{cat.main}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{cat.total}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              expandedCategories.includes(cat.main) ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>
                      {expandedCategories.includes(cat.main) && (
                        <div className="ml-4 mt-1 space-y-1">
                          {cat.subs.map((sub) => (
                            <button
                              key={sub.name}
                              className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600"
                            >
                              <span>{sub.name}</span>
                              <span className="text-xs text-gray-400">{sub.count}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 등급 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">등급</h3>
                <div className="space-y-1">
                  {LEVELS.map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedLevel === level
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="flex-1">
            {/* 검색 & 모바일 필터 */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="자격증 이름 또는 코드로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-gray-100"
              >
                <Filter className="w-5 h-5" />
                필터
              </button>
            </div>

            {/* 활성 필터 태그 */}
            {(selectedCategory || selectedLevel) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory(null)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {selectedLevel && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {selectedLevel}
                    <button onClick={() => setSelectedLevel(null)}>
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* 결과 수 */}
            <p className="text-sm text-gray-500 mb-4">
              총 {filteredCertifications.length}개의 자격증
            </p>

            {/* 자격증 목록 */}
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">로딩 중...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCertifications.map((cert) => (
                  <Link
                    key={cert.id}
                    href={`/certifications/${cert.id}`}
                    className="group bg-white rounded-xl border p-5 hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getLevelColor(cert.level)}`}>
                        {cert.level || "기타"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                      {cert.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {cert.category_main && cert.category_sub
                        ? `${cert.category_main} > ${cert.category_sub}`
                        : cert.category_main || ""}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{cert.code || ""}</span>
                      <span className="flex items-center text-sm text-blue-600">
                        상세 보기
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {filteredCertifications.length === 0 && !loading && (
              <div className="text-center py-12 bg-white rounded-xl border">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">검색 결과가 없습니다.</p>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:underline"
                >
                  필터 초기화
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 모바일 필터 모달 */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold">필터</h2>
              <button onClick={() => setIsFilterOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              {/* 분야 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">분야</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.main}
                      onClick={() => setSelectedCategory(selectedCategory === cat.main ? null : cat.main)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.main
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {cat.main}
                    </button>
                  ))}
                </div>
              </div>

              {/* 등급 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">등급</h3>
                <div className="flex flex-wrap gap-2">
                  {LEVELS.map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedLevel === level
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-3 border rounded-lg"
                >
                  초기화
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg"
                >
                  적용
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
