"use client";

import { GlassCard } from "@/components/ui/shared/GlassCard";
import { SectionHeader } from "@/components/ui/shared/SectionHeader";
import { Network } from "lucide-react";
import { memo, useMemo } from "react";
import type { Edge, Node, NodeProps } from "reactflow";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

/* ─────────────────────────────────────────────────────────────────────
   Public data type
───────────────────────────────────────────────────────────────────── */
export type MindMapData = {
  nodes: Array<{
    id: string;
    data: { label: string };
    position?: { x: number; y: number };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
};

/* ─────────────────────────────────────────────────────────────────────
   Custom node components
   Defined at module scope so the reference is stable across renders.
   This eliminates the "new nodeTypes object" React Flow warning.
───────────────────────────────────────────────────────────────────── */
const CenterNode = memo(function CenterNode({ data }: NodeProps) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #6366f1, #a855f7)",
        borderRadius: 16,
        padding: "10px 16px",
        minWidth: 90,
        textAlign: "center",
        fontSize: 11,
        fontWeight: 700,
        color: "#fff",
        boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
        border: "2px solid rgba(255,255,255,0.18)",
      }}
    >
      {String(data.label ?? "")}
    </div>
  );
});
CenterNode.displayName = "CenterNode";

const ConceptNode = memo(function ConceptNode({ data }: NodeProps) {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: 12,
        padding: "8px 14px",
        minWidth: 72,
        textAlign: "center",
        fontSize: 11,
        fontWeight: 500,
        color: "#cbd5e1",
        boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.10)",
      }}
    >
      {String(data.label ?? "")}
    </div>
  );
});
ConceptNode.displayName = "ConceptNode";

// Stable constant — object identity never changes between renders
const NODE_TYPES: Record<string, React.ComponentType<NodeProps>> = {
  center: CenterNode,
  concept: ConceptNode,
};

// Stable edge style constants
const EDGE_STYLE: React.CSSProperties = {
  stroke: "rgba(99,102,241,0.55)",
  strokeWidth: 1.5,
};

// "arrowclosed" is the string value of MarkerType.ArrowClosed.
// We cast through unknown to avoid importing the enum (which the
// formatter strips), while still satisfying the EdgeMarkerType shape.
const EDGE_MARKER = {
  type: "arrowclosed",
  color: "rgba(99,102,241,0.55)",
  width: 12,
  height: 12,
} as unknown as Edge["markerEnd"];

/* ─────────────────────────────────────────────────────────────────────
   Layout helpers
───────────────────────────────────────────────────────────────────── */
function buildNodes(raw: MindMapData["nodes"]): Node[] {
  if (!raw?.length) return [];

  // Deduplicate by id
  const seen = new Set<string>();
  const deduped = raw.filter((n) => {
    const id = String(n?.id ?? "").trim();
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  if (!deduped.length) return [];

  // Prefer explicit "center" id; fall back to first node
  const centerId = deduped.some((n) => n.id === "center")
    ? "center"
    : deduped[0].id;

  const others = deduped.filter((n) => n.id !== centerId);
  const count  = others.length;
  const radius = Math.max(200, count * 44);

  return deduped.map((node) => {
    const id    = String(node.id).trim();
    const label = String(node.data?.label ?? id);

    // Use provided position when valid
    if (
      node.position &&
      typeof node.position.x === "number" &&
      typeof node.position.y === "number" &&
      isFinite(node.position.x) &&
      isFinite(node.position.y)
    ) {
      return {
        id,
        type: id === centerId ? "center" : "concept",
        data: { label },
        position: node.position,
      };
    }

    // Center node at origin
    if (id === centerId) {
      return { id, type: "center", data: { label }, position: { x: 0, y: 0 } };
    }

    // Radial layout for concept nodes
    const idx   = others.indexOf(node);
    const angle = (2 * Math.PI * idx) / count - Math.PI / 2;
    return {
      id,
      type: "concept",
      data: { label },
      position: {
        x: Math.round(Math.cos(angle) * radius),
        y: Math.round(Math.sin(angle) * radius),
      },
    };
  });
}

function buildEdges(
  raw: MindMapData["edges"],
  validIds: Set<string>
): Edge[] {
  if (!raw?.length) return [];

  const seenIds = new Set<string>();

  return raw.reduce<Edge[]>((acc, edge, idx) => {
    const source = String(edge?.source ?? "").trim();
    const target = String(edge?.target ?? "").trim();

    // Drop edges with missing, self-referencing, or non-existent endpoints
    if (!source || !target) return acc;
    if (source === target) return acc;
    if (!validIds.has(source) || !validIds.has(target)) return acc;

    // Guarantee a unique stable id
    const id = `e-${source}__${target}-${idx}`;
    if (seenIds.has(id)) return acc;
    seenIds.add(id);

    acc.push({
      id,
      source,
      target,
      style:     EDGE_STYLE,
      markerEnd: EDGE_MARKER,
      animated:  false,
    });

    return acc;
  }, []);
}

/* ─────────────────────────────────────────────────────────────────────
   Inner flow — receives stable initialNodes / initialEdges props
───────────────────────────────────────────────────────────────────── */
const MindMapInner = memo(function MindMapInner({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Node[];
  initialEdges: Edge[];
}) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={NODE_TYPES}
      fitView
      fitViewOptions={{ padding: 0.35, minZoom: 0.3, maxZoom: 1.5 }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnScroll={false}
      zoomOnDoubleClick={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={24}
        size={1}
        color="rgba(255,255,255,0.04)"
      />
      <MiniMap
        nodeColor={(n) => (n.id === "center" ? "#6366f1" : "#1e293b")}
        maskColor="rgba(8,11,20,0.75)"
        style={{
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
});

/* ─────────────────────────────────────────────────────────────────────
   Public component
───────────────────────────────────────────────────────────────────── */
export function MindMap({ data }: { data: MindMapData }) {
  const initialNodes = useMemo(
    () => buildNodes(data?.nodes ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  const validIds = useMemo(
    () => new Set(initialNodes.map((n) => n.id)),
    [initialNodes]
  );

  const initialEdges = useMemo(
    () => buildEdges(data?.edges ?? [], validIds),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, validIds]
  );

  const isEmpty = initialNodes.length === 0;

  return (
    <GlassCard className="p-6 animate-fade-up">
      <SectionHeader
        icon={<Network className="h-4 w-4" />}
        title="Mind Map"
        description="Visual concept graph — zoom and pan to explore."
      />

      <div className="h-[420px] w-full overflow-hidden rounded-xl ring-1 ring-white/[0.07]">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-600">
            No mind map data available.
          </div>
        ) : (
          <ReactFlowProvider>
            <MindMapInner
              initialNodes={initialNodes}
              initialEdges={initialEdges}
            />
          </ReactFlowProvider>
        )}
      </div>
    </GlassCard>
  );
}
