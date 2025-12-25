"use client";

import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeMouseHandler,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { certificationApi } from "@/lib/api";
import { GraphData, Certification } from "@/types";
import { X, Award, Calendar, DollarSign, BarChart3 } from "lucide-react";

// 데모 데이터 (API 실패 시 사용)
const DEMO_NODES: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 450 },
    data: { label: "전기기능사", level: "기능사" },
    style: { background: "#f3e8ff", border: "2px solid #a855f7", borderRadius: "8px", padding: "10px", width: 180 },
  },
  {
    id: "2",
    position: { x: 220, y: 450 },
    data: { label: "위험물기능사", level: "기능사" },
    style: { background: "#f3e8ff", border: "2px solid #a855f7", borderRadius: "8px", padding: "10px", width: 180 },
  },
  {
    id: "3",
    position: { x: 0, y: 300 },
    data: { label: "전기산업기사", level: "산업기사" },
    style: { background: "#dcfce7", border: "2px solid #22c55e", borderRadius: "8px", padding: "10px", width: 180 },
  },
  {
    id: "4",
    position: { x: 220, y: 300 },
    data: { label: "정보처리산업기사", level: "산업기사" },
    style: { background: "#dcfce7", border: "2px solid #22c55e", borderRadius: "8px", padding: "10px", width: 180 },
  },
  {
    id: "5",
    position: { x: 0, y: 150 },
    data: { label: "전기기사", level: "기사" },
    style: { background: "#dbeafe", border: "2px solid #3b82f6", borderRadius: "8px", padding: "10px", width: 180 },
  },
  {
    id: "6",
    position: { x: 220, y: 150 },
    data: { label: "정보처리기사", level: "기사" },
    style: { background: "#dbeafe", border: "2px solid #3b82f6", borderRadius: "8px", padding: "10px", width: 180 },
  },
  {
    id: "7",
    position: { x: 440, y: 150 },
    data: { label: "빅데이터분석기사", level: "기사" },
    style: { background: "#dbeafe", border: "2px solid #3b82f6", borderRadius: "8px", padding: "10px", width: 180 },
  },
  {
    id: "8",
    position: { x: 0, y: 0 },
    data: { label: "전기기술사", level: "기술사" },
    style: { background: "#fef3c7", border: "2px solid #f59e0b", borderRadius: "8px", padding: "10px", width: 180 },
  },
  {
    id: "9",
    position: { x: 220, y: 0 },
    data: { label: "정보처리기술사", level: "기술사" },
    style: { background: "#fef3c7", border: "2px solid #f59e0b", borderRadius: "8px", padding: "10px", width: 180 },
  },
];

const DEMO_EDGES: Edge[] = [
  { id: "e1-3", source: "1", target: "3", type: "smoothstep" },
  { id: "e3-5", source: "3", target: "5", type: "smoothstep" },
  { id: "e5-8", source: "5", target: "8", type: "smoothstep" },
  { id: "e4-6", source: "4", target: "6", type: "smoothstep" },
  { id: "e6-9", source: "6", target: "9", type: "smoothstep" },
];

interface TechTreeProps {
  category?: string;
  onNodeClick?: (certId: number) => void;
}

export default function TechTree({ category, onNodeClick }: TechTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await certificationApi.getGraph(category);
        const data: GraphData = response.data;

        if (data.nodes.length > 0) {
          setNodes(data.nodes as Node[]);
          setEdges(data.edges as Edge[]);
        } else {
          // 데이터가 없으면 데모 데이터 사용
          setNodes(DEMO_NODES);
          setEdges(DEMO_EDGES);
        }
      } catch (error) {
        console.error("그래프 데이터를 가져오는데 실패했습니다.", error);
        setNodes(DEMO_NODES);
        setEdges(DEMO_EDGES);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, setNodes, setEdges]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    async (event, node) => {
      const certId = parseInt(node.id);
      if (onNodeClick) {
        onNodeClick(certId);
      }

      // 상세 정보 로드
      setDetailLoading(true);
      try {
        const response = await certificationApi.get(certId);
        setSelectedCert(response.data);
      } catch (error) {
        console.error("자격증 정보를 가져오는데 실패했습니다.", error);
        // 데모용 데이터
        setSelectedCert({
          id: certId,
          name: node.data.label,
          level: node.data.level,
          category_main: node.data.category || "IT",
          level_order: 3,
          issuer: "한국산업인력공단",
          fee_written: 19400,
          fee_practical: 22600,
          pass_rate: "45.2%",
          description: "해당 분야의 전문 지식과 기술을 검증하는 국가기술자격입니다.",
          is_active: true,
          prerequisites: [],
          required_for: [],
        });
      } finally {
        setDetailLoading(false);
      }
    },
    [onNodeClick]
  );

  const closeDetail = () => setSelectedCert(null);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">테크트리 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
      >
        <Controls position="bottom-right" />
        <MiniMap
          position="bottom-left"
          nodeColor={(node) => {
            const level = node.data?.level;
            if (level === "기술사") return "#f59e0b";
            if (level === "기사") return "#3b82f6";
            if (level === "산업기사") return "#22c55e";
            return "#a855f7";
          }}
          maskColor="rgba(0,0,0,0.1)"
        />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      </ReactFlow>

      {/* 레벨 범례 */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">레벨</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-200 border-2 border-amber-500"></div>
            <span>기술사</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-500"></div>
            <span>기사</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-500"></div>
            <span>산업기사</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-100 border-2 border-purple-500"></div>
            <span>기능사</span>
          </div>
        </div>
      </div>

      {/* 자격증 상세 패널 */}
      {selectedCert && (
        <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-xl border-l overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
            <h3 className="font-bold text-lg">{selectedCert.name}</h3>
            <button
              onClick={closeDetail}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {detailLoading ? (
            <div className="p-4 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* 기본 정보 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">등급:</span>
                  <span className="font-medium">{selectedCert.level}</span>
                </div>
                {selectedCert.issuer && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">시행:</span>
                    <span className="font-medium">{selectedCert.issuer}</span>
                  </div>
                )}
                {selectedCert.pass_rate && (
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="w-4 h-4 text-amber-500" />
                    <span className="text-gray-600">합격률:</span>
                    <span className="font-medium">{selectedCert.pass_rate}</span>
                  </div>
                )}
              </div>

              {/* 응시료 */}
              {(selectedCert.fee_written || selectedCert.fee_practical) && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    응시료
                  </h4>
                  <div className="text-sm space-y-1">
                    {selectedCert.fee_written && (
                      <p>필기: {selectedCert.fee_written.toLocaleString()}원</p>
                    )}
                    {selectedCert.fee_practical && (
                      <p>실기: {selectedCert.fee_practical.toLocaleString()}원</p>
                    )}
                  </div>
                </div>
              )}

              {/* 설명 */}
              {selectedCert.description && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">설명</h4>
                  <p className="text-sm text-gray-600">{selectedCert.description}</p>
                </div>
              )}

              {/* 응시 자격 */}
              {selectedCert.eligibility && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">응시 자격</h4>
                  <p className="text-sm text-gray-600">{selectedCert.eligibility}</p>
                </div>
              )}

              {/* 선수 자격증 */}
              {selectedCert.prerequisites && selectedCert.prerequisites.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">선수 자격증</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCert.prerequisites.map((prereq) => (
                      <span
                        key={prereq.id}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                      >
                        {prereq.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 후속 자격증 */}
              {selectedCert.required_for && selectedCert.required_for.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">다음 단계</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCert.required_for.map((next) => (
                      <span
                        key={next.id}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                      >
                        {next.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 상세 페이지 링크 */}
              <a
                href={`/certifications/${selectedCert.id}`}
                className="block w-full py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
              >
                상세 정보 보기
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
