"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi, adminApi, CareerFormData } from "@/lib/api";
import { Career } from "@/types";
import {
  ArrowLeft,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Briefcase,
  Rocket,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// 데모 데이터
const DEMO_CAREERS: Career[] = [
  {
    id: 1,
    name: "소프트웨어 개발자",
    type: "job",
    category: "IT",
    description: "소프트웨어를 설계, 개발, 테스트하는 전문직",
    salary_range: "3,500만원 ~ 8,000만원",
    growth_potential: "높음",
    requirements: [],
  },
  {
    id: 2,
    name: "데이터 분석가",
    type: "job",
    category: "IT",
    description: "데이터를 분석하여 비즈니스 인사이트를 도출",
    salary_range: "4,000만원 ~ 7,000만원",
    growth_potential: "매우 높음",
    requirements: [],
  },
  {
    id: 101,
    name: "전기공사업",
    type: "startup",
    category: "전기",
    description: "전기설비 설치 및 유지보수 사업",
    salary_range: "연 매출 1억원 ~ 10억원",
    growth_potential: "보통",
    requirements: [],
  },
];

const emptyFormData: CareerFormData = {
  name: "",
  type: "job",
  category: "",
  description: "",
  salary_range: "",
  growth_potential: "",
};

const CATEGORIES = ["IT", "전기", "건축", "기계", "화학", "의료", "금융", "기타"];
const GROWTH_OPTIONS = ["매우 높음", "높음", "보통", "낮음"];

export default function AdminCareersPage() {
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "job" | "startup">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CareerFormData>(emptyFormData);
  const [saving, setSaving] = useState(false);

  // 삭제 확인 모달
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.me();
        if (!response.data.is_superuser) {
          router.push("/");
          return;
        }
        fetchCareers();
      } catch {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const fetchCareers = async () => {
    try {
      const response = await adminApi.careers.list({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
      });
      setCareers(response.data.items || response.data);
      setTotalPages(Math.ceil((response.data.total || response.data.length) / itemsPerPage));
    } catch (error) {
      console.error("직업/창업 목록을 가져오는데 실패했습니다.", error);
      setCareers(DEMO_CAREERS);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchCareers();
    }
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCareers();
  };

  const openCreateModal = (type: "job" | "startup") => {
    setFormData({ ...emptyFormData, type });
    setIsEditing(false);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (career: Career) => {
    setFormData({
      name: career.name,
      type: career.type,
      category: career.category || "",
      description: career.description || "",
      salary_range: career.salary_range || "",
      growth_potential: career.growth_potential || "",
    });
    setIsEditing(true);
    setSelectedId(career.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing && selectedId) {
        await adminApi.careers.update(selectedId, formData);
      } else {
        await adminApi.careers.create(formData);
      }
      setIsModalOpen(false);
      fetchCareers();
    } catch (error) {
      console.error("저장에 실패했습니다.", error);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminApi.careers.delete(id);
      setDeleteConfirm(null);
      fetchCareers();
    } catch (error) {
      console.error("삭제에 실패했습니다.", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const filteredCareers = careers.filter((career) => {
    if (filterType === "all") return true;
    return career.type === filterType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-green-600" />
                <h1 className="text-xl font-bold text-gray-800">직업/창업 관리</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openCreateModal("job")}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                직업 등록
              </button>
              <button
                onClick={() => openCreateModal("startup")}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                창업 등록
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* 검색 및 필터 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="이름으로 검색..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              검색
            </button>
          </form>
          <div className="flex gap-2">
            {(["all", "job", "startup"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === type
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-600 hover:bg-gray-50"
                }`}
              >
                {type === "all" ? "전체" : type === "job" ? "직업" : "창업"}
              </button>
            ))}
          </div>
        </div>

        {/* 테이블 */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">유형</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">이름</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">분야</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">예상 수입</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">성장성</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCareers.map((career) => (
                <tr key={career.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{career.id}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${
                        career.type === "job"
                          ? "bg-green-100 text-green-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {career.type === "job" ? (
                        <Briefcase className="w-3 h-3" />
                      ) : (
                        <Rocket className="w-3 h-3" />
                      )}
                      {career.type === "job" ? "직업" : "창업"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800">{career.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{career.category || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{career.salary_range || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        career.growth_potential === "매우 높음"
                          ? "bg-green-100 text-green-700"
                          : career.growth_potential === "높음"
                          ? "bg-blue-100 text-blue-700"
                          : career.growth_potential === "보통"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {career.growth_potential || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(career)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="수정"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(career.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCareers.length === 0 && (
            <div className="py-12 text-center text-gray-500">등록된 항목이 없습니다.</div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* 생성/수정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {isEditing
                  ? `${formData.type === "job" ? "직업" : "창업"} 수정`
                  : `새 ${formData.type === "job" ? "직업" : "창업"} 등록`}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">분야</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.type === "job" ? "예상 연봉" : "예상 매출"}
                </label>
                <input
                  type="text"
                  value={formData.salary_range}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  placeholder="예: 3,500만원 ~ 8,000만원"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">성장 가능성</label>
                <select
                  value={formData.growth_potential}
                  onChange={(e) => setFormData({ ...formData, growth_potential: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {GROWTH_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "저장 중..." : "저장"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full m-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">삭제 확인</h3>
            <p className="text-gray-600 mb-6">
              이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
