export class SimulationClock {
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private onTick: () => void;
  private speed: number = 1.0;
  private baseIntervalMs: number = 300; // 300ms base tick interval (approx. 3 ticks per second at 1x)

  constructor(onTick: () => void) {
    this.onTick = onTick;
  }

  start(speed: number) {
    this.speed = speed;
    this.stop();

    const loop = () => {
      this.onTick();
      const interval = this.baseIntervalMs / this.speed;
      this.timerId = setTimeout(loop, interval);
    };

    const interval = this.baseIntervalMs / this.speed;
    this.timerId = setTimeout(loop, interval);
  }

  stop() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  setSpeed(speed: number) {
    this.speed = speed;
    if (this.isActive()) {
      this.start(speed);
    }
  }

  isActive(): boolean {
    return this.timerId !== null;
  }
}
