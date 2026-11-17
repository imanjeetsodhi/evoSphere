import { Position3D } from '../../types/organism';

export const createVector = (x = 0, y = 0, z = 0): Position3D => ({ x, y, z });

export const addVectors = (v1: Position3D, v2: Position3D): Position3D => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y,
  z: v1.z + v2.z,
});

export const subVectors = (v1: Position3D, v2: Position3D): Position3D => ({
  x: v1.x - v2.x,
  y: v1.y - v2.y,
  z: v1.z - v2.z,
});

export const scaleVector = (v: Position3D, s: number): Position3D => ({
  x: v.x * s,
  y: v.y * s,
  z: v.z * s,
});

export const lengthSq = (v: Position3D): number => v.x * v.x + v.y * v.y + v.z * v.z;

export const length = (v: Position3D): number => Math.sqrt(lengthSq(v));

export const normalizeVector = (v: Position3D): Position3D => {
  const len = length(v);
  if (len === 0) return { x: 0, y: 0, z: 0 };
  return { x: v.x / len, y: v.y / len, z: v.z / len };
};

export const clampVector = (
  v: Position3D,
  minX: number,
  maxX: number,
  minZ: number,
  maxZ: number
): Position3D => ({
  x: Math.max(minX, Math.min(maxX, v.x)),
  y: v.y, // Keep height
  z: Math.max(minZ, Math.min(maxZ, v.z)),
});

export const getDistanceSq = (v1: Position3D, v2: Position3D): number => {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  const dz = v1.z - v2.z;
  return dx * dx + dy * dy + dz * dz;
};

export const getDistance = (v1: Position3D, v2: Position3D): number => {
  return Math.sqrt(getDistanceSq(v1, v2));
};
