"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi, userApi } from "@/lib/api";
import { User, CertificationSimple } from "@/types";
import {
  User as UserIcon,
  Award,
  Target,
  Calendar,
  Settings,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Trophy,
} from "lucide-react";

// 데모 데이터
interface MyCertification {
  id: number;
  certification: CertificationSimple;
  acquired_date?: string;
  score?: number;
}

interface MyGoal {
  id: number;
  certification: CertificationSimple;
  target_date?: string;
  status: "pending" | "in_progress" | "completed";
}

const DEMO_MY_CERTS: MyCertification[] = [
  {
    id: 1,
    certification: { id: 1, name: "정보처리기사", level: "기사", level_order: 3 },
    acquired_date: "2024-06-15",
    score: 78,
  },
  {
    id: 2,
    certification: { id: 2, name: "SQLD", level: "전문자격", level_order: 2 },
    acquired_date: "2024-03-22",
  },
];

const DEMO_GOALS: MyGoal[] = [
  {
    id: 1,
    certification: { id: 3, name: "빅데이터분석기사", level: "기사", level_order: 3 },
    target_date: "2025-06-30",
    status: "in_progress",
  },
  {
    id: 2,
    certification: { id: 4, name: "정보보안기사", level: "기사", level_order: 3 },
    target_date: "2025-12-31",
    status: "pending",
  },
];

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [myCertifications, setMyCertifications] = useState<MyCertification[]>([]);
  const [myGoals, setMyGoals] = useState<MyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"certs" | "goals" | "settings">("certs");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await authApi.me();
        setUser(userResponse.data);

        const [certsResponse, goalsResponse] = await Promise.all([
          userApi.getMyCertifications(),
          userApi.getMyGoals(),
        ]);

        setMyCertifications(certsResponse.data || []);
        setMyGoals(goalsResponse.data || []);
      } catch (error) {
        console.error("데이터를 가져오는데 실패했습니다.", error);
        // 로그인 필요시
        if (!user) {
          setMyCertifications(DEMO_MY_CERTS);
          setMyGoals(DEMO_GOALS);
          setUser({
            id: 0,
            email: "demo@example.com",
            full_name: "데모 사용자",
            is_active: true,
            is_superuser: false,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 프로필 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <UserIcon className="w-12 h-12 text-gray-400" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{user?.full_name || "사용자"}</h1>
              <p className="text-blue-100">{user?.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-sm">
                  <Trophy className="w-4 h-4" />
                  취득 자격증: {myCertifications.length}개
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Target className="w-4 h-4" />
                  목표 자격증: {myGoals.length}개
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("certs")}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === "certs"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <span className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                취득 자격증
              </span>
            </button>
            <button
              onClick={() => setActiveTab("goals")}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === "goals"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <span className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                목표 자격증
              </span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === "settings"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              <span className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                설정
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 취득 자격증 탭 */}
        {activeTab === "certs" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">취득 자격증</h2>
              <Link
                href="/certifications"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                자격증 추가
              </Link>
            </div>

            {myCertifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myCertifications.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {item.certification.name}
                          </h3>
                          <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded mt-1">
                            {item.certification.level}
                          </span>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(item.acquired_date)}
                            </span>
                            {item.score && (
                              <span className="font-medium text-green-600">
                                {item.score}점
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  취득한 자격증이 없습니다
                </h3>
                <p className="text-gray-500 mb-4">
                  자격증을 취득하면 여기에 기록해보세요.
                </p>
                <Link
                  href="/certifications"
                  className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                >
                  자격증 둘러보기
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 목표 자격증 탭 */}
        {activeTab === "goals" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">목표 자격증</h2>
              <Link
                href="/certifications"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                목표 추가
              </Link>
            </div>

            {myGoals.length > 0 ? (
              <div className="space-y-4">
                {myGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            goal.status === "completed"
                              ? "bg-green-100"
                              : goal.status === "in_progress"
                              ? "bg-amber-100"
                              : "bg-gray-100"
                          }`}
                        >
                          {goal.status === "completed" ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : goal.status === "in_progress" ? (
                            <Clock className="w-6 h-6 text-amber-600" />
                          ) : (
                            <Target className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {goal.certification.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              {goal.certification.level}
                            </span>
                            <span
                              className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                                goal.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : goal.status === "in_progress"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {goal.status === "completed"
                                ? "완료"
                                : goal.status === "in_progress"
                                ? "준비중"
                                : "예정"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {goal.target_date && (
                          <div className="text-right">
                            <p className="text-sm text-gray-500">목표일</p>
                            <p className="font-medium text-gray-800">
                              {formatDate(goal.target_date)}
                            </p>
                          </div>
                        )}
                        <Link
                          href={`/certifications/${goal.certification.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  설정한 목표가 없습니다
                </h3>
                <p className="text-gray-500 mb-4">
                  취득하고 싶은 자격증을 목표로 설정해보세요.
                </p>
                <Link
                  href="/tech-tree"
                  className="inline-flex items-center gap-2 text-purple-600 hover:underline"
                >
                  테크트리 확인하기
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 설정 탭 */}
        {activeTab === "settings" && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6">계정 설정</h2>

            <div className="bg-white rounded-xl border divide-y">
              {/* 프로필 정보 */}
              <div className="p-6">
                <h3 className="font-medium text-gray-800 mb-4">프로필 정보</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">이메일</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">이름</label>
                    <input
                      type="text"
                      defaultValue={user?.full_name || ""}
                      placeholder="이름을 입력하세요"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    저장
                  </button>
                </div>
              </div>

              {/* 알림 설정 */}
              <div className="p-6">
                <h3 className="font-medium text-gray-800 mb-4">알림 설정</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">시험 일정 알림</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">목표 마감일 알림</span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700">새로운 자격증 정보</span>
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              {/* 계정 관리 */}
              <div className="p-6">
                <h3 className="font-medium text-gray-800 mb-4">계정 관리</h3>
                <div className="space-y-3">
                  <button className="text-gray-600 hover:text-gray-800">
                    비밀번호 변경
                  </button>
                  <br />
                  <button className="text-red-600 hover:text-red-700">계정 삭제</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
