"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi, adminApi } from "@/lib/api";
import { User } from "@/types";
import {
  ArrowLeft,
  Search,
  Users,
  Shield,
  ShieldOff,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// 데모 데이터
const DEMO_USERS: User[] = [
  { id: 1, email: "admin@speclab.com", full_name: "관리자", is_active: true, is_superuser: true },
  { id: 2, email: "user1@example.com", full_name: "홍길동", is_active: true, is_superuser: false },
  { id: 3, email: "user2@example.com", full_name: "김철수", is_active: true, is_superuser: false },
  { id: 4, email: "user3@example.com", full_name: "이영희", is_active: false, is_superuser: false },
  { id: 5, email: "user4@example.com", full_name: "박민수", is_active: true, is_superuser: false },
];

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 15;

  // 현재 로그인한 관리자 ID
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.me();
        if (!response.data.is_superuser) {
          router.push("/");
          return;
        }
        setCurrentUserId(response.data.id);
        fetchUsers();
      } catch {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await adminApi.users.list({
        page: currentPage,
        limit: itemsPerPage,
      });
      setUsers(response.data.items || response.data);
      setTotalPages(Math.ceil((response.data.total || response.data.length) / itemsPerPage));
    } catch (error) {
      console.error("사용자 목록을 가져오는데 실패했습니다.", error);
      setUsers(DEMO_USERS);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchUsers();
    }
  }, [currentPage]);

  const handleToggleActive = async (userId: number, currentStatus: boolean) => {
    try {
      await adminApi.users.update(userId, { is_active: !currentStatus });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, is_active: !currentStatus } : user
        )
      );
    } catch (error) {
      console.error("상태 변경에 실패했습니다.", error);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const handleToggleSuperuser = async (userId: number, currentStatus: boolean) => {
    if (userId === currentUserId) {
      alert("자신의 관리자 권한은 변경할 수 없습니다.");
      return;
    }

    const confirmMessage = currentStatus
      ? "이 사용자의 관리자 권한을 해제하시겠습니까?"
      : "이 사용자에게 관리자 권한을 부여하시겠습니까?";

    if (!confirm(confirmMessage)) return;

    try {
      await adminApi.users.update(userId, { is_superuser: !currentStatus });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, is_superuser: !currentStatus } : user
        )
      );
    } catch (error) {
      console.error("권한 변경에 실패했습니다.", error);
      alert("권한 변경에 실패했습니다.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-800">사용자 관리</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* 검색 */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="이메일 또는 이름으로 검색..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">전체 사용자</p>
            <p className="text-2xl font-bold text-gray-800">{users.length}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">활성 사용자</p>
            <p className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.is_active).length}
            </p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">관리자</p>
            <p className="text-2xl font-bold text-purple-600">
              {users.filter((u) => u.is_superuser).length}
            </p>
          </div>
        </div>

        {/* 테이블 */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">이메일</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">이름</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">상태</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">권한</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{user.id}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800">{user.email}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.full_name || "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        user.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.is_active ? "활성" : "비활성"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.is_superuser && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                        <Shield className="w-3 h-3" />
                        관리자
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleToggleActive(user.id, user.is_active)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.is_active
                            ? "text-gray-600 hover:text-red-600 hover:bg-red-50"
                            : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                        }`}
                        title={user.is_active ? "비활성화" : "활성화"}
                      >
                        {user.is_active ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleToggleSuperuser(user.id, user.is_superuser)}
                        disabled={user.id === currentUserId}
                        className={`p-2 rounded-lg transition-colors ${
                          user.id === currentUserId
                            ? "text-gray-300 cursor-not-allowed"
                            : user.is_superuser
                            ? "text-purple-600 hover:text-gray-600 hover:bg-gray-50"
                            : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                        }`}
                        title={user.is_superuser ? "관리자 해제" : "관리자 지정"}
                      >
                        {user.is_superuser ? (
                          <ShieldOff className="w-4 h-4" />
                        ) : (
                          <Shield className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-gray-500">사용자가 없습니다.</div>
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
    </div>
  );
}
