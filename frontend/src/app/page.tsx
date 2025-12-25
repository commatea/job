import Link from "next/link";
import { Award, Briefcase, Rocket, Bot, ChevronRight, TrendingUp, Users, BookOpen } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Award,
      title: "자격증 테크트리",
      description: "게임 스킬트리처럼 직관적인 자격증 로드맵을 탐색하세요.",
      href: "/tech-tree",
      color: "blue",
    },
    {
      icon: Briefcase,
      title: "직업 정보",
      description: "자격증과 연결된 취업 가능 직종을 확인하세요.",
      href: "/careers",
      color: "green",
    },
    {
      icon: Rocket,
      title: "창업 가이드",
      description: "창업에 필요한 자격증과 법적 요건을 안내합니다.",
      href: "/startups",
      color: "purple",
    },
    {
      icon: Bot,
      title: "AI 커리어 상담",
      description: "AI가 맞춤형 커리어 로드맵을 설계해 드립니다.",
      href: "/ai-consultant",
      color: "amber",
      badge: "Coming Soon",
    },
  ];

  const stats = [
    { icon: Award, value: "1,200+", label: "자격증 정보" },
    { icon: Briefcase, value: "500+", label: "직업 연계" },
    { icon: Users, value: "10,000+", label: "사용자" },
    { icon: BookOpen, value: "50+", label: "창업 가이드" },
  ];

  const popularCerts = [
    { name: "정보처리기사", category: "IT", level: "기사" },
    { name: "전기기사", category: "전기", level: "기사" },
    { name: "빅데이터분석기사", category: "IT", level: "기사" },
    { name: "건축기사", category: "건설", level: "기사" },
    { name: "위험물산업기사", category: "화학", level: "산업기사" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              자격증으로 설계하는
              <br />
              <span className="text-teal-300">당신의 미래 커리어</span>
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 mb-8">
              SpecLab은 자격증을 기반으로 직업과 창업에 대한 정보를 제공하고,
              <br className="hidden lg:block" />
              체계적인 커리어 로드맵을 설계할 수 있도록 돕습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tech-tree"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                테크트리 탐색하기
                <ChevronRight className="ml-1 w-5 h-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                무료로 시작하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              SpecLab 주요 기능
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              자격증 정보부터 커리어 설계까지, 당신의 미래를 위한 모든 것
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative bg-white rounded-xl border p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                {feature.badge && (
                  <span className="absolute top-4 right-4 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                    {feature.badge}
                  </span>
                )}
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    feature.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : feature.color === "green"
                      ? "bg-green-100 text-green-600"
                      : feature.color === "purple"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Certifications */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                인기 자격증
              </h2>
              <p className="text-gray-600">가장 많이 찾는 자격증을 확인하세요</p>
            </div>
            <Link
              href="/tech-tree"
              className="hidden sm:inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              전체 보기
              <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {popularCerts.map((cert, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {cert.category}
                  </span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                <p className="text-sm text-gray-500">{cert.level}</p>
              </div>
            ))}
          </div>

          <div className="sm:hidden mt-6 text-center">
            <Link
              href="/tech-tree"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              전체 보기
              <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 커리어 설계를 시작하세요
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            무료 회원가입 후 맞춤형 자격증 로드맵과 커리어 정보를 받아보세요.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            무료로 시작하기
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
