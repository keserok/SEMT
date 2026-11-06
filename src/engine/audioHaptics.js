// SEMT Silent Haptics Engine (All synthetic Web Audio & Speech sounds removed per user direction)

class AudioHapticsEngine {
  constructor() {
    this.isAmbientPlaying = false;
  }
  init() {}
  vibrate() {}
  playSoftTick() {}
  playProximityPing() {}
  playUnlockCeremony() {}
  toggleHarborSoundscape() {
    return false;
  }
  setDucking() {}
  stopHarborSoundscape() {}
}

export const audioEngine = new AudioHapticsEngine();
