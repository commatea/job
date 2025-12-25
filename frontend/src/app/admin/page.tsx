"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { User } from "@/types";
import {
  LayoutDashboard,
  Award,
  Briefcase,
  Users,
  Settings,
  BarChart3,
  TrendingUp,
  LogOut,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.me();
        if (!response.data.is_superuser) {
          router.push("/");
          return;
        }
        setUser(response.data);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = [
    { label: "총 자격증", value: "1,234", icon: Award, color: "blue" },
    { label: "총 직업", value: "456", icon: Briefcase, color: "green" },
    { label: "총 회원", value: "12,345", icon: Users, color: "purple" },
    { label: "오늘 방문", value: "2,345", icon: TrendingUp, color: "amber" },
  ];

  const menuItems = [
    { href: "/admin/certifications", label: "자격증 관리", icon: Award },
    { href: "/admin/careers", label: "직업 관리", icon: Briefcase },
    { href: "/admin/users", label: "사용자 관리", icon: Users },
    { href: "/admin/analytics", label: "통계", icon: BarChart3 },
    { href: "/admin/settings", label: "설정", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 상단 헤더 */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">SpecLab 관리자</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    stat.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : stat.color === "green"
                      ? "bg-green-100 text-green-600"
                      : stat.color === "purple"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* 메뉴 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-xl border p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{item.label}</h3>
                  <p className="text-sm text-gray-500">관리 페이지로 이동</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 최근 활동 */}
        <div className="mt-8 bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">최근 활동</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">새 자격증 등록: 빅데이터분석기사</span>
              <span className="text-gray-400 ml-auto">5분 전</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">회원 가입: user@example.com</span>
              <span className="text-gray-400 ml-auto">15분 전</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-gray-600">직업 정보 수정: 데이터 분석가</span>
              <span className="text-gray-400 ml-auto">1시간 전</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
