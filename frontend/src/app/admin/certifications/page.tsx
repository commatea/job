"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi, adminApi, CertificationFormData } from "@/lib/api";
import { Certification } from "@/types";
import {
  ArrowLeft,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// 데모 데이터
const DEMO_CERTIFICATIONS: Certification[] = [
  {
    id: 1,
    name: "정보처리기사",
    code: "1320",
    category_main: "IT",
    category_sub: "정보기술",
    level: "기사",
    level_order: 3,
    issuer: "한국산업인력공단",
    fee_written: 19400,
    fee_practical: 22600,
    pass_rate: "24.7%",
    is_active: true,
    prerequisites: [],
    required_for: [],
  },
  {
    id: 2,
    name: "SQLD",
    code: "SQL-D",
    category_main: "IT",
    category_sub: "데이터베이스",
    level: "전문자격",
    level_order: 2,
    issuer: "한국데이터산업진흥원",
    fee_written: 50000,
    is_active: true,
    prerequisites: [],
    required_for: [],
  },
  {
    id: 3,
    name: "빅데이터분석기사",
    code: "BD001",
    category_main: "IT",
    category_sub: "데이터",
    level: "기사",
    level_order: 3,
    issuer: "한국데이터산업진흥원",
    fee_written: 25000,
    fee_practical: 45000,
    is_active: true,
    prerequisites: [],
    required_for: [],
  },
];

const emptyFormData: CertificationFormData = {
  name: "",
  code: "",
  category_main: "",
  category_sub: "",
  level: "",
  level_order: 1,
  issuer: "",
  fee_written: undefined,
  fee_practical: undefined,
  pass_rate: "",
  description: "",
  eligibility: "",
  subjects: "",
  is_active: true,
};

export default function AdminCertificationsPage() {
  const router = useRouter();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CertificationFormData>(emptyFormData);
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
        fetchCertifications();
      } catch {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const fetchCertifications = async () => {
    try {
      const response = await adminApi.certifications.list({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
      });
      setCertifications(response.data.items || response.data);
      setTotalPages(Math.ceil((response.data.total || response.data.length) / itemsPerPage));
    } catch (error) {
      console.error("자격증 목록을 가져오는데 실패했습니다.", error);
      setCertifications(DEMO_CERTIFICATIONS);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchCertifications();
    }
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCertifications();
  };

  const openCreateModal = () => {
    setFormData(emptyFormData);
    setIsEditing(false);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (cert: Certification) => {
    setFormData({
      name: cert.name,
      code: cert.code || "",
      category_main: cert.category_main || "",
      category_sub: cert.category_sub || "",
      level: cert.level || "",
      level_order: cert.level_order || 1,
      issuer: cert.issuer || "",
      fee_written: cert.fee_written,
      fee_practical: cert.fee_practical,
      pass_rate: cert.pass_rate || "",
      description: cert.description || "",
      eligibility: cert.eligibility || "",
      subjects: cert.subjects || "",
      is_active: cert.is_active,
    });
    setIsEditing(true);
    setSelectedId(cert.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing && selectedId) {
        await adminApi.certifications.update(selectedId, formData);
      } else {
        await adminApi.certifications.create(formData);
      }
      setIsModalOpen(false);
      fetchCertifications();
    } catch (error) {
      console.error("저장에 실패했습니다.", error);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminApi.certifications.delete(id);
      setDeleteConfirm(null);
      fetchCertifications();
    } catch (error) {
      console.error("삭제에 실패했습니다.", error);
      alert("삭제에 실패했습니다.");
    }
  };

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
                <Award className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-800">자격증 관리</h1>
              </div>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              새 자격증 등록
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* 검색 */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="자격증 이름, 코드로 검색..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              검색
            </button>
          </div>
        </form>

        {/* 테이블 */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">이름</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">코드</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">분류</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">등급</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">발급기관</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">상태</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {certifications.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{cert.id}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800">{cert.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cert.code || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {cert.category_main || "-"}
                    {cert.category_sub && ` / ${cert.category_sub}`}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {cert.level || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cert.issuer || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        cert.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {cert.is_active ? "활성" : "비활성"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(cert)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="수정"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(cert.id)}
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

          {certifications.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              등록된 자격증이 없습니다.
            </div>
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
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {isEditing ? "자격증 수정" : "새 자격증 등록"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    자격증명 <span className="text-red-500">*</span>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">코드</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">대분류</label>
                  <input
                    type="text"
                    value={formData.category_main}
                    onChange={(e) => setFormData({ ...formData, category_main: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">소분류</label>
                  <input
                    type="text"
                    value={formData.category_sub}
                    onChange={(e) => setFormData({ ...formData, category_sub: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">등급</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택</option>
                    <option value="기능사">기능사</option>
                    <option value="산업기사">산업기사</option>
                    <option value="기사">기사</option>
                    <option value="기능장">기능장</option>
                    <option value="기술사">기술사</option>
                    <option value="전문자격">전문자격</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">등급 순서</label>
                  <input
                    type="number"
                    value={formData.level_order}
                    onChange={(e) =>
                      setFormData({ ...formData, level_order: parseInt(e.target.value) || 1 })
                    }
                    min="1"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">발급기관</label>
                  <input
                    type="text"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    필기 수수료 (원)
                  </label>
                  <input
                    type="number"
                    value={formData.fee_written || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fee_written: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    실기 수수료 (원)
                  </label>
                  <input
                    type="number"
                    value={formData.fee_practical || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fee_practical: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">합격률</label>
                  <input
                    type="text"
                    value={formData.pass_rate}
                    onChange={(e) => setFormData({ ...formData, pass_rate: e.target.value })}
                    placeholder="예: 24.7%"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">응시 자격</label>
                <textarea
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시험 과목</label>
                <textarea
                  value={formData.subjects}
                  onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  활성화 (사용자에게 표시)
                </label>
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
              이 자격증을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
