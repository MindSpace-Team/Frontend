import React from "react";
import { MindNode } from "@/types/mind-graph";
import OrbitNode from "@/components/controls/Orbit";
import SatelliteNode from "./SatelliteNode";
import { usePopupStore } from "@/store/popupStore";
import { useMindGraphStore } from "@/store/mindGraphStore";
import { findRootId } from "./utils";

const planetBaseSpeed = 0.3;
const planetDecay = 0.8;

interface Props {
  planet: MindNode;
  nodes: { [id: number]: MindNode };
  planetIdx: number;
  orbitRadius: number;
  starX: number;
  starY: number;
  onFocusNode?: (x: number, y: number) => void;
}

export default function PlanetNode({ planet, nodes, planetIdx, orbitRadius, starX, starY, onFocusNode }: Props) {
  const setPopup = usePopupStore(s => s.setPopup);
  const pausedRootIds = usePopupStore(s => s.pausedRootIds);
  const selectNode = useMindGraphStore(s => s.selectNode);

  const isPaused = (nodeId: number) => pausedRootIds.has(findRootId(nodeId, nodes));
  const speed = planetBaseSpeed * Math.pow(planetDecay, planetIdx);

  return (
    <OrbitNode
      key={planet.id}
      centerX={starX}
      centerY={starY}
      radius={orbitRadius}
      speed={speed}
      size={planet.radius}
      color={planet.color}
      initialAngle={planet.initialAngle ?? Math.random() * Math.PI * 2}
      paused={isPaused(planet.id)}
      onContextMenu={(x, y, e) => {
        e.preventDefault();
        e.stopPropagation();
        setPopup({ id: planet.id, x, y });
      }}
      onFocusNode={onFocusNode}
    >
      {(x, y) => (
        <>
          {/* 행성 디자인 분기 - 입체감, 그라데이션, 표면 질감, 대기 효과 추가 */}
          {(() => {
            const gradId = `planet-grad-${planet.id}`;
            const atmId = `planet-atm-${planet.id}`;
            switch (planet.planetDesign) {
              case 'earth': {
                // 지구형: 북반구(가로로 길게), 남반구(더 아래), 남극 구름 추가
                function genContinentPath(cx: number, cy: number, rx: number, ry: number, n: number, rot: number, rough: number) {
                  const pts = [];
                  for (let i = 0; i < n; ++i) {
                    const theta = rot + (i / n) * Math.PI * 2;
                    const noise = 1 + (Math.sin(i*1.7) + Math.cos(i*2.3)) * rough * 0.25 + (Math.random()-0.5)*rough*0.18;
                    pts.push([
                      cx + Math.cos(theta) * rx * noise,
                      cy + Math.sin(theta) * ry * noise
                    ]);
                  }
                  let d = `M${pts[0][0]},${pts[0][1]}`;
                  for (let i = 1; i < n; ++i) {
                    const [x, y] = pts[i];
                    const [px, py] = pts[(i-1+n)%n];
                    d += ` Q${(px+x)/2},${(py+y)/2} ${x},${y}`;
                  }
                  d += ' Z';
                  return d;
                }
                // 북반구/남반구 대륙 설정: [cx, cy, rx, ry, n, rot, rough, color, opacity]
                const continents = [
                  // 북반구 대륙(더 위, 왼쪽, 더 크고 더 울퉁불퉁)
                  [x-planet.radius*0.13, y-planet.radius*0.28, planet.radius*0.48, planet.radius*0.32, 20, 0.1, 0.32, '#7ed957', 0.82],
                  // 남반구 대륙(더 아래)
                  [x, y+planet.radius*0.35, planet.radius*0.33, planet.radius*0.22, 16, 0.7, 0.25, '#a0e060', 0.7],
                  // 우측 최 끝 큰 대륙 (x축, y축 모두 더 크게)
                  [x+planet.radius, y, planet.radius*0.17, planet.radius*0.22, 13, 0.3, 0.22, '#5ec97b', 0.7],
                ];
                const clipId = `earth-clip-${planet.id}`;
                return (
                  <g pointerEvents="none">
                    {/* 대기 글로우 */}
                    <ellipse cx={x} cy={y} rx={planet.radius * 1.18} ry={planet.radius * 1.13} fill="#7fdfff" opacity="0.22" filter="blur(2.5px)" />
                    {/* 본체+clipPath */}
                    <defs>
                      <radialGradient id={gradId} cx="60%" cy="38%" r="70%">
                        <stop offset="0%" stopColor="#b3e6ff" />
                        <stop offset="60%" stopColor="#3a8fff" />
                        <stop offset="100%" stopColor="#1a2a4f" />
                      </radialGradient>
                      <clipPath id={clipId}>
                        <circle cx={x} cy={y} r={planet.radius} />
                      </clipPath>
                    </defs>
                    <circle cx={x} cy={y} r={planet.radius} fill={`url(#${gradId})`} />
                    <g clipPath={`url(#${clipId})`}>
                      {continents.map(([cx, cy, rx, ry, n, rot, rough, color, opacity], i) => (
                        <path key={i} d={genContinentPath(cx as number, cy as number, rx as number, ry as number, n as number, rot as number, rough as number)} fill={color as string} opacity={opacity as number} />
                      ))}
                      {/* 남극(흰색 ellipse+blur) */}
                      <ellipse cx={x} cy={y+planet.radius*0.93} rx={planet.radius*0.19} ry={planet.radius*0.07} fill="#fff" opacity="0.32" filter="blur(2.5px)" />
                      {/* 구름: 지구 곳곳에 더 또렷하게, 바다/대륙 위에 고르게 분포 */}
                      {[
                        [x+planet.radius*0.18, y-planet.radius*0.22, planet.radius*0.26, planet.radius*0.09, 0.28, 1.7],
                        [x-planet.radius*0.21, y-planet.radius*0.09, planet.radius*0.19, planet.radius*0.07, 0.22, 1.5],
                        [x+planet.radius*0.13, y+planet.radius*0.13, planet.radius*0.16, planet.radius*0.06, 0.24, 1.3],
                        [x-planet.radius*0.09, y+planet.radius*0.19, planet.radius*0.14, planet.radius*0.05, 0.21, 1.2],
                        [x+planet.radius*0.22, y+planet.radius*0.22, planet.radius*0.18, planet.radius*0.07, 0.19, 1.5],
                        [x-planet.radius*0.18, y+planet.radius*0.28, planet.radius*0.15, planet.radius*0.06, 0.18, 1.4],
                        [x+planet.radius*0.09, y-planet.radius*0.13, planet.radius*0.15, planet.radius*0.06, 0.23, 1.2],
                        [x-planet.radius*0.19, y+planet.radius*0.09, planet.radius*0.15, planet.radius*0.06, 0.20, 1.2],
                        [x+planet.radius*0.19, y+planet.radius*0.29, planet.radius*0.15, planet.radius*0.06, 0.22, 1.4],
                        [x-planet.radius*0.13, y-planet.radius*0.19, planet.radius*0.13, planet.radius*0.05, 0.19, 1.2],
                        [x+planet.radius*0.13, y+planet.radius*0.33, planet.radius*0.13, planet.radius*0.05, 0.20, 1.3],
                        [x, y+planet.radius*0.05, planet.radius*0.18, planet.radius*0.07, 0.18, 1.4],
                        // 남극 주변 구름 여러 겹
                        [x+planet.radius*0.09, y+planet.radius*0.85, planet.radius*0.22, planet.radius*0.09, 0.32, 2.2],
                        [x-planet.radius*0.13, y+planet.radius*0.91, planet.radius*0.17, planet.radius*0.07, 0.28, 1.7],
                        [x+planet.radius*0.17, y+planet.radius*0.97, planet.radius*0.15, planet.radius*0.06, 0.23, 1.5],
                        [x, y+planet.radius*0.99, planet.radius*0.19, planet.radius*0.08, 0.26, 1.8],
                        [x-planet.radius*0.11, y+planet.radius*0.88, planet.radius*0.15, planet.radius*0.06, 0.21, 1.3],
                        [x+planet.radius*0.13, y+planet.radius*0.91, planet.radius*0.15, planet.radius*0.06, 0.22, 1.5],
                      ].map(([cx, cy, rx, ry, op, blur], i) => (
                        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" opacity={op} filter={`blur(${blur}px)`} />
                      ))}
                    </g>
                  </g>
                );
              }
              case 'ringed':
                // 고리형: 입체 그라데이션, 줄무늬, 고리(입체감), 대기 글로우
                return (
                  <g pointerEvents="none">
                    {/* 대기 글로우 */}
                    <ellipse cx={x} cy={y} rx={planet.radius * 1.13} ry={planet.radius * 1.08} fill="#ffe7b3" opacity="0.18" filter="blur(2.5px)" />
                    {/* 고리(입체감) */}
                    <ellipse cx={x} cy={y+planet.radius*0.13} rx={planet.radius*1.55} ry={planet.radius*0.48} fill="#e6c07b" opacity="0.22" filter="blur(0.5px)" />
                    <ellipse cx={x} cy={y+planet.radius*0.13} rx={planet.radius*1.4} ry={planet.radius*0.43} fill="none" stroke="#e6c07b" strokeWidth={planet.radius*0.13} opacity="0.55" />
                    {/* 본체 */}
                    <defs>
                      <radialGradient id={gradId} cx="60%" cy="38%" r="70%">
                        <stop offset="0%" stopColor="#fff2c7" />
                        <stop offset="60%" stopColor="#e6c07b" />
                        <stop offset="100%" stopColor="#b88f4a" />
                      </radialGradient>
                    </defs>
                    <circle cx={x} cy={y} r={planet.radius} fill={`url(#${gradId})`} />
                    {/* 줄무늬 */}
                    <ellipse cx={x} cy={y+planet.radius*0.25} rx={planet.radius*0.95} ry={planet.radius*0.13} fill="#fff" opacity="0.18" />
                    <ellipse cx={x} cy={y-planet.radius*0.18} rx={planet.radius*0.7} ry={planet.radius*0.09} fill="#fff" opacity="0.13" />
                    <ellipse cx={x} cy={y+planet.radius*0.05} rx={planet.radius*0.8} ry={planet.radius*0.07} fill="#fff" opacity="0.09" />
                  </g>
                );
              case 'default':
              default:
                // 기본형: 입체 그라데이션, 표면 얼룩, 대기 글로우
                return (
                  <g pointerEvents="none">
                    {/* 대기 글로우 */}
                    <ellipse cx={x} cy={y} rx={planet.radius * 1.09} ry={planet.radius * 1.06} fill="#aeeaff" opacity="0.13" filter="blur(2.5px)" />
                    {/* 본체 */}
                    <defs>
                      <radialGradient id={gradId} cx="60%" cy="38%" r="70%">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="60%" stopColor={planet.color} />
                        <stop offset="100%" stopColor="#1a2a4f" />
                      </radialGradient>
                    </defs>
                    <circle cx={x} cy={y} r={planet.radius} fill={`url(#${gradId})`} />
                    {/* 표면 얼룩 */}
                    <ellipse cx={x-planet.radius*0.18} cy={y+planet.radius*0.13} rx={planet.radius*0.22} ry={planet.radius*0.08} fill="#fff" opacity="0.13" />
                    <ellipse cx={x+planet.radius*0.16} cy={y-planet.radius*0.09} rx={planet.radius*0.13} ry={planet.radius*0.05} fill="#fff" opacity="0.09" />
                  </g>
                );
            }
          })()}
          {/* 위성 렌더링 */}
          {planet.children.map((satId, idx) => (
            <SatelliteNode
              key={satId}
              satId={satId}
              satIdx={idx}
              nodes={nodes}
              centerX={x}
              centerY={y}
              onFocusNode={onFocusNode}
            />
          ))}
        </>
      )}
    </OrbitNode>
  );
}