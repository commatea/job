"use client";

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// API 클라이언트 (간단한 버전)
// 이상적으로는 별도 파일로 분리해야 함
const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
});

export default function TechTree() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    useEffect(() => {
        // 백엔드에서 그래프 데이터 가져오기
        const fetchData = async () => {
            try {
                const response = await api.get('/certifications/graph');
                const data = response.data;

                // 데이터 설정
                setNodes(data.nodes);
                setEdges(data.edges);
            } catch (error) {
                console.error("그래프 데이터를 가져오는데 실패했습니다.", error);
                // API 실패 시 데모용 대체 데이터 (또는 백엔드 없이 개발 시)
                setNodes([
                    { id: '1', position: { x: 0, y: 0 }, data: { label: '정보처리기사' } },
                    { id: '2', position: { x: 0, y: 100 }, data: { label: '컴퓨터시스템응용기술사' } },
                ]);
                setEdges([
                    { id: 'e1-2', source: '1', target: '2' }
                ]);
            }
        };

        fetchData();
    }, [setNodes, setEdges]);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <Controls />
                <MiniMap />
                <Background gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
