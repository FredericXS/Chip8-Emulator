export class Sound {
  private ctx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gain: GainNode | null = null;

  private ensureContext() {
    if (!this.ctx) {
      this.ctx = new AudioContext();

      this.gain = this.ctx.createGain();
      this.gain.gain.value = 0.1;
      this.gain.connect(this.ctx.destination);
    }
  }

  start() {
    this.ensureContext();

    if (this.oscillator) return;

    this.oscillator = this.ctx!.createOscillator();
    this.oscillator.type = "square";
    this.oscillator.frequency.value = 440;
    this.oscillator.connect(this.gain!);
    this.oscillator.start();
  }

  stop() {
    if (!this.oscillator) return;

    this.oscillator.stop();
    this.oscillator.disconnect();
    this.oscillator = null;
  }
}
