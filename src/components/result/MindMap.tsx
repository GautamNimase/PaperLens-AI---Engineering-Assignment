"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "reactflow";

import "reactflow/dist/style.css";

/**
 * Mind map data coming from API / AI response
 */
export type MindMapData = {
  nodes: Array<{
    id: string;
    data: {
      label: string;
    };
    position?: {
      x: number;
      y: number;
    };
  }>;

  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
};

type MindMapProps = {
  data: MindMapData;
};

export function MindMap({ data }: MindMapProps) {
  /**
   * Convert incoming data into ReactFlow nodes
   * Ensure every node has a unique ID
   */
  const initialNodes: Node[] = (data?.nodes ?? []).map(
    (node, index) => ({
      id: node.id || `node-${index}`,

      data: {
        label: node.data?.label ?? `Node ${index + 1}`,
      },

      position:
        node.position ?? {
          x: index * 180,
          y: index * 80,
        },
    })
  );

  /**
   * Convert incoming data into ReactFlow edges
   * Force unique edge IDs to prevent React key warnings
   */
  const initialEdges: Edge[] = (data?.edges ?? []).map(
    (edge, index) => ({
      id: `${edge.source}-${edge.target}-${index}`,
      source: edge.source,
      target: edge.target,
    })
  );

  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10">
      <div className="h-[420px] w-full">
        <ReactFlowProvider>
          <MindMapInner
            initialNodes={initialNodes}
            initialEdges={initialEdges}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}

type MindMapInnerProps = {
  initialNodes: Node[];
  initialEdges: Edge[];
};

function MindMapInner({
  initialNodes,
  initialEdges,
}: MindMapInnerProps) {
  /**
   * ReactFlow state hooks
   */
  const [nodes, , onNodesChange] =
    useNodesState(initialNodes);

  const [edges, , onEdgesChange] =
    useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      className="bg-slate-950"
      nodesDraggable={false}
    >
      {/* Background grid */}
      <Background
        gap={24}
        size={1}
        color="#1f2937"
      />

      {/* Small map preview */}
      <MiniMap />

      {/* Zoom / fit controls */}
      <Controls />
    </ReactFlow>
  );
}