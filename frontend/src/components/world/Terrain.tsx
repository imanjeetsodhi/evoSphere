import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WORLD_CONFIG } from '../../config/simulationConfig';
import { SeededRandom } from '../../simulation/utils/random';
import { useSimulationStore } from '../../store/simulationStore';

export const Terrain: React.FC = () => {
  const { width, depth } = WORLD_CONFIG;
  const biome = useSimulationStore((state) => state.biome);
  const spawnTool = useSimulationStore((state) => state.spawnTool);
  const spawnOrganismAt = useSimulationStore((state) => state.spawnOrganismAt);

  const waterRef = useRef<THREE.Mesh>(null);

  // Biome-specific color palettes and atmosphere
  const theme = useMemo(() => {
    switch (biome) {
      case 'desert':
        return {
          groundColor: '#d97706',
          gridColor: '#b45309',
          waterColor: '#06b6d4',
          waterOpacity: 0.75,
          rockColor: '#92400e',
          foliageColor: '#84cc16',
          trunkColor: '#78350f',
          perimeterColor: '#f59e0b',
        };
      case 'rainforest':
        return {
          groundColor: '#14532d',
          gridColor: '#052e16',
          waterColor: '#0284c7',
          waterOpacity: 0.8,
          rockColor: '#334155',
          foliageColor: '#22c55e',
          trunkColor: '#3f2512',
          perimeterColor: '#10b981',
        };
      case 'taiga':
        return {
          groundColor: '#1e293b',
          gridColor: '#0f172a',
          waterColor: '#38bdf8',
          waterOpacity: 0.65,
          rockColor: '#64748b',
          foliageColor: '#0f766e',
          trunkColor: '#451a03',
          perimeterColor: '#06b6d4',
        };
      case 'genesis':
      default:
        return {
          groundColor: '#244e2b',
          gridColor: '#1b3b21',
          waterColor: '#2563eb',
          waterOpacity: 0.78,
          rockColor: '#64748b',
          foliageColor: '#15803d',
          trunkColor: '#451a03',
          perimeterColor: '#10b981',
        };
    }
  }, [biome]);

  // Procedural natural props generated deterministically
  const decorations = useMemo(() => {
    const rng = new SeededRandom(1042);
    const trees: { x: number; z: number; scale: number; type: number }[] = [];
    const rocks: { x: number; z: number; scale: number; rotation: number }[] = [];
    const lilypads: { x: number; z: number; scale: number; rotation: number }[] = [];

    const pondCenterX = width / 2;
    const pondCenterZ = depth / 2;
    const pondRadius = 14;

    // Forest vegetation
    for (let i = 0; i < 35; i++) {
      const x = rng.range(6, width - 6);
      const z = rng.range(6, depth - 6);
      const distToPond = Math.sqrt((x - pondCenterX) ** 2 + (z - pondCenterZ) ** 2);
      if (distToPond > pondRadius + 3) {
        trees.push({
          x,
          z,
          scale: rng.range(0.7, 1.7),
          type: Math.floor(rng.range(0, 3)),
        });
      }
    }

    // Rocks & boulders
    for (let i = 0; i < 24; i++) {
      const x = rng.range(6, width - 6);
      const z = rng.range(6, depth - 6);
      const distToPond = Math.sqrt((x - pondCenterX) ** 2 + (z - pondCenterZ) ** 2);
      // Place some rocks on the shoreline
      rocks.push({
        x,
        z,
        scale: distToPond < pondRadius + 3 ? rng.range(0.4, 0.9) : rng.range(0.6, 1.4),
        rotation: rng.range(0, Math.PI * 2),
      });
    }

    // Lilypads inside the water
    for (let i = 0; i < 8; i++) {
      const angle = rng.range(0, Math.PI * 2);
      const r = rng.range(2, pondRadius - 3);
      lilypads.push({
        x: pondCenterX + Math.cos(angle) * r,
        z: pondCenterZ + Math.sin(angle) * r,
        scale: rng.range(0.6, 1.2),
        rotation: rng.range(0, Math.PI * 2),
      });
    }

    return { trees, rocks, lilypads };
  }, [width, depth]);

  // Gentle water oscillation
  useFrame(({ clock }) => {
    if (waterRef.current) {
      waterRef.current.position.y = 0.05 + Math.sin(clock.getElapsedTime() * 1.5) * 0.02;
    }
  });

  // Handle terrain click when god-mode spawn tool is active
  const handleTerrainClick = (e: { stopPropagation: () => void; point: THREE.Vector3 }) => {
    if (spawnTool !== 'none') {
      e.stopPropagation();
      const clampedX = Math.max(3, Math.min(width - 3, e.point.x));
      const clampedZ = Math.max(3, Math.min(depth - 3, e.point.z));
      spawnOrganismAt(spawnTool, { x: clampedX, y: 0, z: clampedZ });
    }
  };

  return (
    <group>
      {/* Primary Biome Ground Mesh */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[width / 2, -0.05, depth / 2]}
        receiveShadow
        onClick={handleTerrainClick}
      >
        <planeGeometry args={[width, depth, 64, 64]} />
        <meshStandardMaterial
          color={theme.groundColor}
          roughness={0.88}
          metalness={0.08}
          flatShading
        />
      </mesh>

      {/* Atmospheric coordinate telemetry grid */}
      <gridHelper
        args={[width, 50, theme.gridColor, theme.gridColor]}
        position={[width / 2, -0.02, depth / 2]}
      />

      {/* Central Oasis / Reservoir Water Mesh */}
      <mesh
        ref={waterRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[width / 2, 0.05, depth / 2]}
      >
        <circleGeometry args={[13.5, 48]} />
        <meshStandardMaterial
          color={theme.waterColor}
          roughness={0.08}
          metalness={0.9}
          transparent
          opacity={theme.waterOpacity}
        />
      </mesh>

      {/* Shoreline Sand/Silt Ring */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[width / 2, 0.02, depth / 2]}
      >
        <ringGeometry args={[13.4, 15.2, 48]} />
        <meshStandardMaterial
          color="#a16207"
          roughness={0.95}
          flatShading
        />
      </mesh>

      {/* Water Lilypads */}
      {decorations.lilypads.map((lp, i) => (
        <mesh
          key={`lp_${i}`}
          position={[lp.x, 0.1, lp.z]}
          rotation={[-Math.PI / 2, 0, lp.rotation]}
          scale={[lp.scale, lp.scale, lp.scale]}
        >
          <circleGeometry args={[0.7, 16, 0, Math.PI * 1.8]} />
          <meshStandardMaterial color="#166534" roughness={0.6} />
        </mesh>
      ))}

      {/* Procedural Foliage Trees */}
      {decorations.trees.map((tree, idx) => (
        <group
          key={`tree_${idx}`}
          position={[tree.x, 0, tree.z]}
          scale={[tree.scale, tree.scale, tree.scale]}
        >
          {/* Trunk */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.35, 2.4, 6]} />
            <meshStandardMaterial color={theme.trunkColor} roughness={0.9} />
          </mesh>

          {/* Foliage Variations */}
          {tree.type === 0 ? (
            // Tall Alpine Fir
            <group position={[0, 2.5, 0]}>
              <mesh position={[0, 0.5, 0]} castShadow>
                <coneGeometry args={[1.5, 2.2, 6]} />
                <meshStandardMaterial color={theme.foliageColor} roughness={0.8} flatShading />
              </mesh>
              <mesh position={[0, 1.8, 0]} castShadow>
                <coneGeometry args={[1.1, 1.8, 6]} />
                <meshStandardMaterial color={theme.foliageColor} roughness={0.8} flatShading />
              </mesh>
            </group>
          ) : tree.type === 1 ? (
            // Canopy Broadleaf Tree
            <mesh position={[0, 3.0, 0]} castShadow>
              <dodecahedronGeometry args={[1.7, 1]} />
              <meshStandardMaterial color={theme.foliageColor} roughness={0.85} flatShading />
            </mesh>
          ) : (
            // Tiered Pine
            <mesh position={[0, 3.2, 0]} castShadow>
              <coneGeometry args={[1.4, 3.2, 7]} />
              <meshStandardMaterial color={theme.foliageColor} roughness={0.8} flatShading />
            </mesh>
          )}
        </group>
      ))}

      {/* Procedural Boulders */}
      {decorations.rocks.map((rock, idx) => (
        <mesh
          key={`rock_${idx}`}
          position={[rock.x, rock.scale * 0.4, rock.z]}
          rotation={[0.2, rock.rotation, 0.1]}
          scale={[rock.scale, rock.scale * 0.75, rock.scale]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.9, 1]} />
          <meshStandardMaterial color={theme.rockColor} roughness={0.85} flatShading />
        </mesh>
      ))}

      {/* High-Tech Biosphere Perimeter Containment Emitters (Corner Towers & Neon Boundary Line) */}
      {[
        [0, 0],
        [width, 0],
        [0, depth],
        [width, depth],
      ].map(([cx, cz], i) => (
        <group key={`tower_${i}`} position={[cx, 0, cz]}>
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.5, 0.8, 5, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 5.2, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial color={theme.perimeterColor} />
          </mesh>
          <pointLight position={[0, 5.2, 0]} color={theme.perimeterColor} intensity={2} distance={15} />
        </group>
      ))}

      {/* Perimeter Force Field Base Lines */}
      {/* North */}
      <mesh position={[width / 2, 0.4, 0]}>
        <boxGeometry args={[width, 0.8, 0.3]} />
        <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* South */}
      <mesh position={[width / 2, 0.4, depth]}>
        <boxGeometry args={[width, 0.8, 0.3]} />
        <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* West */}
      <mesh position={[0, 0.4, depth / 2]}>
        <boxGeometry args={[0.3, 0.8, depth]} />
        <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* East */}
      <mesh position={[width, 0.4, depth / 2]}>
        <boxGeometry args={[0.3, 0.8, depth]} />
        <meshStandardMaterial color="#090d16" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
};
