"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Briefcase,
  Eye,
  Calendar,
} from "lucide-react";

// 데모 통계 데이터
const DEMO_STATS = {
  overview: {
    totalUsers: 12345,
    totalCertifications: 1234,
    totalCareers: 456,
    todayVisits: 2345,
  },
  userGrowth: [
    { month: "7월", count: 8500 },
    { month: "8월", count: 9200 },
    { month: "9월", count: 10100 },
    { month: "10월", count: 10800 },
    { month: "11월", count: 11500 },
    { month: "12월", count: 12345 },
  ],
  popularCertifications: [
    { name: "정보처리기사", views: 15420, change: 12.5 },
    { name: "전기기사", views: 12380, change: 8.3 },
    { name: "빅데이터분석기사", views: 9870, change: 25.7 },
    { name: "정보보안기사", views: 8540, change: 15.2 },
    { name: "건축기사", views: 7230, change: -3.1 },
  ],
  popularCareers: [
    { name: "소프트웨어 개발자", views: 8920, type: "job" },
    { name: "데이터 분석가", views: 7650, type: "job" },
    { name: "전기공사업", views: 5430, type: "startup" },
    { name: "정보보안 전문가", views: 4890, type: "job" },
    { name: "건축설계사무소", views: 3210, type: "startup" },
  ],
  dailyVisits: [
    { day: "월", visits: 1850 },
    { day: "화", visits: 2120 },
    { day: "수", visits: 2340 },
    { day: "목", visits: 2180 },
    { day: "금", visits: 1920 },
    { day: "토", visits: 1450 },
    { day: "일", visits: 1280 },
  ],
};

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.me();
        if (!response.data.is_superuser) {
          router.push("/");
          return;
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const maxUserCount = Math.max(...DEMO_STATS.userGrowth.map((d) => d.count));
  const maxDailyVisits = Math.max(...DEMO_STATS.dailyVisits.map((d) => d.visits));

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
                <BarChart3 className="w-6 h-6 text-amber-600" />
                <h1 className="text-xl font-bold text-gray-800">통계</h1>
              </div>
            </div>
            <div className="flex gap-2">
              {(["week", "month", "year"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    period === p
                      ? "bg-blue-600 text-white"
                      : "bg-white border text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p === "week" ? "주간" : p === "month" ? "월간" : "연간"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* 개요 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +7.2%
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">총 회원수</p>
            <p className="text-2xl font-bold text-gray-800">
              {DEMO_STATS.overview.totalUsers.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <span className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2.1%
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">총 자격증</p>
            <p className="text-2xl font-bold text-gray-800">
              {DEMO_STATS.overview.totalCertifications.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
              <span className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +5.4%
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">총 직업/창업</p>
            <p className="text-2xl font-bold text-gray-800">
              {DEMO_STATS.overview.totalCareers.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-amber-600" />
              </div>
              <span className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.8%
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">오늘 방문</p>
            <p className="text-2xl font-bold text-gray-800">
              {DEMO_STATS.overview.todayVisits.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 회원 증가 추이 */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">회원 증가 추이</h2>
            <div className="h-64 flex items-end justify-between gap-4">
              {DEMO_STATS.userGrowth.map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                    style={{ height: `${(item.count / maxUserCount) * 200}px` }}
                  />
                  <p className="text-xs text-gray-500 mt-2">{item.month}</p>
                  <p className="text-xs font-medium text-gray-700">
                    {(item.count / 1000).toFixed(1)}k
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 일별 방문자 */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">일별 방문자</h2>
            <div className="h-64 flex items-end justify-between gap-4">
              {DEMO_STATS.dailyVisits.map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-amber-500 rounded-t-lg transition-all hover:bg-amber-600"
                    style={{ height: `${(item.visits / maxDailyVisits) * 200}px` }}
                  />
                  <p className="text-xs text-gray-500 mt-2">{item.day}</p>
                  <p className="text-xs font-medium text-gray-700">
                    {item.visits.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 인기 자격증 */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">인기 자격증 TOP 5</h2>
            <div className="space-y-4">
              {DEMO_STATS.popularCertifications.map((cert, index) => (
                <div key={cert.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : index === 1
                          ? "bg-gray-100 text-gray-600"
                          : index === 2
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-800">{cert.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {cert.views.toLocaleString()} 조회
                    </span>
                    <span
                      className={`flex items-center text-sm ${
                        cert.change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {cert.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(cert.change)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 인기 직업/창업 */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">인기 직업/창업 TOP 5</h2>
            <div className="space-y-4">
              {DEMO_STATS.popularCareers.map((career, index) => (
                <div key={career.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : index === 1
                          ? "bg-gray-100 text-gray-600"
                          : index === 2
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-50 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <span className="font-medium text-gray-800">{career.name}</span>
                      <span
                        className={`ml-2 px-2 py-0.5 text-xs rounded ${
                          career.type === "job"
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {career.type === "job" ? "직업" : "창업"}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {career.views.toLocaleString()} 조회
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="mt-8 bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            최근 활동
          </h2>
          <div className="space-y-4">
            {[
              { action: "새 회원 가입", user: "user123@example.com", time: "5분 전", type: "user" },
              { action: "자격증 조회", target: "정보처리기사", time: "8분 전", type: "view" },
              { action: "자격증 등록", target: "AI활용능력시험", time: "15분 전", type: "create" },
              { action: "직업 정보 수정", target: "데이터 분석가", time: "32분 전", type: "update" },
              { action: "새 회원 가입", user: "newbie@example.com", time: "1시간 전", type: "user" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "user"
                      ? "bg-green-500"
                      : activity.type === "view"
                      ? "bg-blue-500"
                      : activity.type === "create"
                      ? "bg-purple-500"
                      : "bg-amber-500"
                  }`}
                />
                <span className="text-gray-600">
                  {activity.action}
                  {activity.user && (
                    <span className="font-medium text-gray-800 ml-1">{activity.user}</span>
                  )}
                  {activity.target && (
                    <span className="font-medium text-gray-800 ml-1">{activity.target}</span>
                  )}
                </span>
                <span className="text-gray-400 ml-auto">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
