"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import {
  ArrowLeft,
  Settings,
  Bell,
  Globe,
  Database,
  Shield,
  Mail,
  Save,
  RefreshCw,
} from "lucide-react";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailNotifications: boolean;
  dataRetentionDays: number;
  maxUploadSize: number;
  apiRateLimit: number;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "SpecLab",
  siteDescription: "자격증 기반 커리어 네비게이션 플랫폼",
  contactEmail: "support@speclab.com",
  maintenanceMode: false,
  allowRegistration: true,
  emailNotifications: true,
  dataRetentionDays: 365,
  maxUploadSize: 10,
  apiRateLimit: 100,
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<"general" | "security" | "notifications" | "advanced">(
    "general"
  );

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

  const handleSave = async () => {
    setSaving(true);
    // 실제로는 API 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    alert("설정이 저장되었습니다.");
  };

  const handleReset = () => {
    if (confirm("설정을 기본값으로 초기화하시겠습니까?")) {
      setSettings(DEFAULT_SETTINGS);
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
                <Settings className="w-6 h-6 text-gray-600" />
                <h1 className="text-xl font-bold text-gray-800">설정</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                초기화
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 탭 네비게이션 */}
          <aside className="lg:w-64">
            <nav className="bg-white rounded-xl border p-2 space-y-1">
              {[
                { id: "general", label: "일반", icon: Globe },
                { id: "security", label: "보안", icon: Shield },
                { id: "notifications", label: "알림", icon: Bell },
                { id: "advanced", label: "고급", icon: Database },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* 설정 내용 */}
          <main className="flex-1">
            {/* 일반 설정 */}
            {activeTab === "general" && (
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">일반 설정</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      사이트 이름
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      사이트 설명
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) =>
                        setSettings({ ...settings, siteDescription: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연락처 이메일
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) =>
                          setSettings({ ...settings, contactEmail: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-4 border-t">
                    <div>
                      <h3 className="font-medium text-gray-800">유지보수 모드</h3>
                      <p className="text-sm text-gray-500">
                        활성화하면 일반 사용자는 사이트에 접근할 수 없습니다.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) =>
                          setSettings({ ...settings, maintenanceMode: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 보안 설정 */}
            {activeTab === "security" && (
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">보안 설정</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <h3 className="font-medium text-gray-800">회원가입 허용</h3>
                      <p className="text-sm text-gray-500">
                        비활성화하면 새로운 사용자가 가입할 수 없습니다.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.allowRegistration}
                        onChange={(e) =>
                          setSettings({ ...settings, allowRegistration: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API 요청 제한 (분당)
                    </label>
                    <input
                      type="number"
                      value={settings.apiRateLimit}
                      onChange={(e) =>
                        setSettings({ ...settings, apiRateLimit: parseInt(e.target.value) || 0 })
                      }
                      min="1"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      분당 허용되는 API 요청 수를 설정합니다.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="font-medium text-amber-800 mb-2">보안 권장사항</h3>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>- 정기적으로 관리자 비밀번호를 변경하세요</li>
                      <li>- 불필요한 관리자 계정은 삭제하세요</li>
                      <li>- API 요청 제한을 적절히 설정하세요</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 알림 설정 */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">알림 설정</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <h3 className="font-medium text-gray-800">이메일 알림</h3>
                      <p className="text-sm text-gray-500">
                        새 회원가입, 문의 등의 이메일 알림을 받습니다.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) =>
                          setSettings({ ...settings, emailNotifications: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-800">알림 유형</h3>
                    {[
                      { id: "newUser", label: "새 회원가입" },
                      { id: "newCert", label: "새 자격증 등록" },
                      { id: "report", label: "신고 접수" },
                      { id: "error", label: "시스템 오류" },
                    ].map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center justify-between py-2 cursor-pointer"
                      >
                        <span className="text-gray-700">{item.label}</span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 고급 설정 */}
            {activeTab === "advanced" && (
              <div className="bg-white rounded-xl border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">고급 설정</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      데이터 보관 기간 (일)
                    </label>
                    <input
                      type="number"
                      value={settings.dataRetentionDays}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          dataRetentionDays: parseInt(e.target.value) || 0,
                        })
                      }
                      min="30"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      로그 및 임시 데이터의 보관 기간을 설정합니다.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      최대 업로드 크기 (MB)
                    </label>
                    <input
                      type="number"
                      value={settings.maxUploadSize}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxUploadSize: parseInt(e.target.value) || 0,
                        })
                      }
                      min="1"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium text-gray-800 mb-4">데이터 관리</h3>
                    <div className="flex gap-4">
                      <button className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        캐시 초기화
                      </button>
                      <button className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                        데이터 백업
                      </button>
                      <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        로그 삭제
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-medium text-red-800 mb-2">위험 영역</h3>
                    <p className="text-sm text-red-700 mb-4">
                      아래 작업은 되돌릴 수 없습니다. 신중하게 진행하세요.
                    </p>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      전체 데이터 초기화
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
