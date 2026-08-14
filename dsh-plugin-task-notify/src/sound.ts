/**
 * 提示音合成：在宿主内生成 WAV（16-bit PCM mono），无需音频资产。
 * 苹果三全音（macOS Ping）采用社区公认近似：C5 → E5 → G5 琶音，指数衰减包络。
 */

export type SoundType = 'apple' | 'ding' | 'double' | 'system'
export const SOUND_TYPES: readonly SoundType[] = ['apple', 'ding', 'double', 'system']

const SAMPLE_RATE = 44100

interface Tone {
  freq: number
  durationSec: number
  startSec: number
  volume?: number
}

/** 正弦 + attack 防爆音 + 指数衰减包络。 */
function synthTone(freq: number, durationSec: number, volume: number): Float32Array {
  const n = Math.max(1, Math.round(durationSec * SAMPLE_RATE))
  const out = new Float32Array(n)
  const attack = Math.min(0.008, durationSec / 6)
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE
    const atk = t < attack ? t / attack : 1
    const env = Math.exp(-4.2 * (t / durationSec))
    out[i] = Math.sin(2 * Math.PI * freq * t) * atk * env * volume
  }
  return out
}

function mixTones(tones: Tone[]): Float32Array {
  const total = Math.round(
    Math.max(...tones.map((t) => t.startSec + t.durationSec)) * SAMPLE_RATE,
  )
  const out = new Float32Array(total)
  for (const tone of tones) {
    const seg = synthTone(tone.freq, tone.durationSec, tone.volume ?? 0.5)
    const offset = Math.round(tone.startSec * SAMPLE_RATE)
    for (let i = 0; i < seg.length && offset + i < total; i++) {
      out[offset + i] += seg[i]
    }
  }
  for (let i = 0; i < out.length; i++) {
    if (out[i] > 1) out[i] = 1
    else if (out[i] < -1) out[i] = -1
  }
  return out
}

function buildWav(samples: Float32Array): Buffer {
  const dataLen = samples.length * 2
  const buf = Buffer.alloc(44 + dataLen)
  buf.write('RIFF', 0)
  buf.writeUInt32LE(36 + dataLen, 4)
  buf.write('WAVE', 8)
  buf.write('fmt ', 12)
  buf.writeUInt32LE(16, 16)
  buf.writeUInt16LE(1, 20) // PCM
  buf.writeUInt16LE(1, 22) // mono
  buf.writeUInt32LE(SAMPLE_RATE, 24)
  buf.writeUInt32LE(SAMPLE_RATE * 2, 28)
  buf.writeUInt16LE(2, 32)
  buf.writeUInt16LE(16, 34)
  buf.write('data', 36)
  buf.writeUInt32LE(dataLen, 40)
  for (let i = 0; i < samples.length; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]))
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2)
  }
  return buf
}

/** 合成指定音色（system 无合成产物）。volumePercent 0..100 为主音量增益。 */
export function synthSound(type: Exclude<SoundType, 'system'>, volumePercent: number): Buffer {
  const gain = Math.max(0, Math.min(100, volumePercent)) / 100
  const applyGain = (samples: Float32Array): Float32Array => {
    const out = new Float32Array(samples.length)
    for (let i = 0; i < samples.length; i++) {
      out[i] = samples[i] * gain
    }
    return out
  }
  switch (type) {
    case 'apple':
      // 三全音：C5 → E5 → G5，略重叠的琶音
      return buildWav(
        applyGain(
          mixTones([
            { freq: 523.25, durationSec: 0.4, startSec: 0.0 },
            { freq: 659.25, durationSec: 0.42, startSec: 0.18 },
            { freq: 783.99, durationSec: 0.5, startSec: 0.36 },
          ]),
        ),
      )
    case 'ding':
      return buildWav(applyGain(mixTones([{ freq: 783.99, durationSec: 0.7, startSec: 0 }])))
    case 'double':
      return buildWav(
        applyGain(
          mixTones([
            { freq: 660, durationSec: 0.15, startSec: 0 },
            { freq: 660, durationSec: 0.18, startSec: 0.25 },
          ]),
        ),
      )
  }
}
