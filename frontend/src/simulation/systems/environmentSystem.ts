import { Environment } from '../../types/environment';
import { ENVIRONMENT_CONFIG } from '../../config/simulationConfig';

export const updateEnvironment = (currentEnv: Environment): Environment => {
  const config = ENVIRONMENT_CONFIG;
  let newTimeOfDay = currentEnv.timeOfDay + config.timeScale;
  let newDay = currentEnv.day;

  if (newTimeOfDay >= 24.0) {
    newTimeOfDay = 0.0;
    newDay += 1;
  }

  // Sunlight cycle (sine wave peaking at 12:00 PM, 0% between 6:00 PM and 6:00 AM)
  let sunlight = 0;
  if (newTimeOfDay >= 6.0 && newTimeOfDay <= 18.0) {
    // scale 6 AM -> 18 PM to 0 -> PI
    const angle = ((newTimeOfDay - 6.0) / 12.0) * Math.PI;
    sunlight = Math.round(Math.sin(angle) * 100);
  }

  // Temperature cycle (peaking at 3:00 PM, coldest at 4:00 AM)
  // Base temperature shifts based on sunlight
  const tempOffset = Math.sin(((newTimeOfDay - 9.0) / 24.0) * Math.PI * 2) * 8;
  const temperature = Math.round(22 + tempOffset);

  // Water level fluctuates slightly
  const waterLevel = currentEnv.waterLevel;

  return {
    day: newDay,
    timeOfDay: parseFloat(newTimeOfDay.toFixed(2)),
    sunlight,
    temperature,
    waterLevel,
  };
};
