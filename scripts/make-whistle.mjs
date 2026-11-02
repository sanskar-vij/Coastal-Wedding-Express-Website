import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function createTrainWhistle() {
  const sampleRate = 44100;
  const totalDuration = 2.4;
  const numSamples = Math.floor(sampleRate * totalDuration);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // WAV Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  // Classic American/British 5-chime steam whistle (D major 6th / passenger express)
  // D4 (293.66), F#4 (369.99), A4 (440.00), B4 (493.88), D5 (587.33) + sub-harmonic
  const chimes = [
    { f: 293.66, amp: 0.32, beat: 1.2 },
    { f: 369.99, amp: 0.26, beat: 1.8 },
    { f: 440.00, amp: 0.24, beat: 2.1 },
    { f: 493.88, amp: 0.18, beat: 2.4 },
    { f: 587.33, amp: 0.14, beat: 2.8 },
    { f: 146.83, amp: 0.12, beat: 0.8 },
  ];

  function envelope(t) {
    // Blast 1: 0.04 to 0.45s
    // Breath gap: 0.45 to 0.65s
    // Blast 2: 0.65 to 2.25s
    if (t < 0.04) return 0;
    if (t >= 0.04 && t < 0.45) {
      const p = (t - 0.04) / 0.41;
      if (p < 0.15) return p / 0.15;
      if (p > 0.75) return 1 - (p - 0.75) / 0.25;
      return 1.0;
    }
    if (t >= 0.45 && t < 0.65) {
      return 0.03 * Math.pow(1 - (t - 0.45) / 0.20, 2);
    }
    if (t >= 0.65 && t < 2.25) {
      const p = (t - 0.65) / 1.60;
      if (p < 0.10) return p / 0.10;
      if (p > 0.55) return Math.pow(1 - (p - 0.55) / 0.45, 1.8);
      return 1.0;
    }
    return 0;
  }

  let noiseState1 = 0;
  let noiseState2 = 0;
  const dryBuffer = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const env = envelope(t);
    let s = 0;

    if (env > 0) {
      const airFlutter = 1 + 0.009 * Math.sin(2 * Math.PI * 5.5 * t) + 0.004 * Math.sin(2 * Math.PI * 11.2 * t);
      const ampTremolo = 1 + 0.06 * Math.sin(2 * Math.PI * 5.5 * t);

      for (const chime of chimes) {
        const phase1 = 2 * Math.PI * chime.f * airFlutter * t;
        const phase2 = 2 * Math.PI * (chime.f + chime.beat) * airFlutter * t;
        const tone = 0.65 * Math.sin(phase1) + 0.35 * Math.sin(phase2);
        const overtone = 0.18 * Math.sin(phase1 * 2);
        s += chime.amp * (tone + overtone);
      }

      const rawNoise = Math.random() * 2 - 1;
      noiseState1 = noiseState1 * 0.78 + rawNoise * 0.22;
      noiseState2 = noiseState2 * 0.82 + noiseState1 * 0.18;
      s += noiseState2 * 0.14;

      s = Math.tanh(s * 1.15) * ampTremolo * env;
    }
    dryBuffer[i] = s;
  }

  // Warm acoustic landscape reverberation
  const delaySamples1 = Math.floor(sampleRate * 0.068);
  const delaySamples2 = Math.floor(sampleRate * 0.115);
  const delaySamples3 = Math.floor(sampleRate * 0.182);

  for (let i = 0; i < numSamples; i++) {
    let out = dryBuffer[i] * 0.75;
    if (i >= delaySamples1) out += dryBuffer[i - delaySamples1] * 0.22;
    if (i >= delaySamples2) out += dryBuffer[i - delaySamples2] * 0.15;
    if (i >= delaySamples3) out += dryBuffer[i - delaySamples3] * 0.09;

    out = Math.max(-1, Math.min(1, out * 0.88));
    const intSample = Math.floor(out * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  const destPath = path.join(root, 'public/assets/train-whistle.wav');
  fs.writeFileSync(destPath, buffer);
  const distPath = path.join(root, 'dist/assets/train-whistle.wav');
  if (fs.existsSync(path.dirname(distPath))) {
    fs.writeFileSync(distPath, buffer);
  }
  console.log('Train whistle updated at public/assets/train-whistle.wav');
}

if (process.argv[1] && process.argv[1].endsWith('make-whistle.mjs')) {
  createTrainWhistle();
}
