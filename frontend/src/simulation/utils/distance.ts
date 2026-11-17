import { Position3D } from '../../types/organism';
import { getDistance, getDistanceSq } from './vector';

export { getDistance, getDistanceSq };

export const isWithinRange = (
  v1: Position3D,
  v2: Position3D,
  range: number
): boolean => {
  return getDistanceSq(v1, v2) <= range * range;
};
