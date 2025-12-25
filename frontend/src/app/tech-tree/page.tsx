"use client";

import { useState } from "react";
import TechTree from "@/components/TechTree";
import { Filter, Search, X } from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "전체" },
  { id: "IT", name: "IT" },
  { id: "전기", name: "전기" },
  { id: "건설", name: "건설" },
  { id: "기계", name: "기계" },
  { id: "화학", name: "화학" },
];

export default function TechTreePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === "all" ? undefined : categoryId);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* 상단 필터 바 */}
      <div className="bg-white border-b px-4 py-3">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-800">자격증 테크트리</h1>

            {/* 데스크탑 카테고리 필터 */}
            <div className="hidden md:flex items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    (cat.id === "all" && !selectedCategory) ||
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 검색 */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="자격증 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* 모바일 필터 버튼 */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-2 border rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 모바일 필터 패널 */}
        {showFilters && (
          <div className="md:hidden mt-3 pt-3 border-t">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    handleCategoryChange(cat.id);
                    setShowFilters(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    (cat.id === "all" && !selectedCategory) ||
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* 모바일 검색 */}
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="자격증 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* 테크트리 뷰어 */}
      <div className="flex-1 bg-gray-50">
        <TechTree category={selectedCategory} />
      </div>

      {/* 하단 도움말 */}
      <div className="bg-white border-t px-4 py-2">
        <div className="container mx-auto flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>드래그: 이동</span>
            <span>스크롤: 확대/축소</span>
            <span>클릭: 상세 정보</span>
          </div>
          <div className="hidden sm:block">
            화살표: 선수 자격증 → 후속 자격증
          </div>
        </div>
      </div>
    </div>
  );
}
