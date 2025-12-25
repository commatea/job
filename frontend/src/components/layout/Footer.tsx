import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl text-gray-800">SpecLab</span>
            </Link>
            <p className="text-gray-600 text-sm">
              자격증 기반 커리어 네비게이션 플랫폼
              <br />
              당신의 미래 스펙을 설계하세요.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">서비스</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/tech-tree" className="hover:text-blue-600">
                  자격증 테크트리
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-blue-600">
                  직업 정보
                </Link>
              </li>
              <li>
                <Link href="/startups" className="hover:text-blue-600">
                  창업 가이드
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">지원</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-blue-600">
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-600">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2025 SpecLab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
