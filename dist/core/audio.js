class AudioFx {
    constructor() {
        this.volume = 0.5;
        this.sampleRate = 44100;
        this.x = new AudioContext();
    }
    // muteFx() {
    //     ZZFX.volume = 0;
    // }
    // changeVolume(value: number) {
    //     ZZFX.volume = value;
    // }
    playJumpFx() {
        this.play(...[, , 372, .03, .04, , 1, 1.34, -9.5, .2, , , , , , , , .64, .05, .01]);
    }
    playDieFx() {
        this.play(...[2.06, , 292, .02, .01, .07, 3, 1.29, -9.4, -0.2, , , .15, .5, , .3, .16, .86, .05]); // dead sound.
    }
    playCupFx() {
        this.play(...[1.9, , 543, .01, .07, .17, 1, 1.13, , , -570, .05, .03, , , , .09, .7, .04]);
    }
    playDoorFx() {
        this.play(...[1.99, 0, 261.6256, .07, .38, .24, , .74, , , , , , .1, , .1, .15, .37, .12]);
    }
    playDashFx() {
        this.play(...[2.06, 0, 69.41, , .07, .16, , 1.38, .1, .1, 50, .02, -0.01, .2, , , .08, .26, .06]); // dash sound.
    }
    play(...parameters) {
        return this.playSamples(this.buildSamples(...parameters));
    }
    playSamples(...samples) {
        const buffer = this.x.createBuffer(samples.length, samples[0].length, this.sampleRate), source = this.x.createBufferSource();
        samples.map((d, i) => buffer.getChannelData(i).set(d));
        source.buffer = buffer;
        source.connect(this.x.destination);
        source.start();
        return source;
    }
    buildSamples(volume = 1, randomness = .05, frequency = 220, attack = 0, sustain = 0, release = .1, shape = 0, shapeCurve = 1, slide = 0, deltaSlide = 0, pitchJump = 0, pitchJumpTime = 0, repeatTime = 0, noise = 0, modulation = 0, bitCrush = 0, delay = 0, sustainVolume = 1, decay = 0, tremolo = 0) {
        // init parameters
        let PI2 = Math.PI * 2, sampleRate = this.sampleRate, sign = (v) => v > 0 ? 1 : -1, startSlide = slide *= 500 * PI2 / sampleRate / sampleRate, startFrequency = frequency *= (1 + randomness * 2 * Math.random() - randomness) * PI2 / sampleRate, b = [], t = 0, tm = 0, i = 0, j = 1, r = 0, c = 0, s = 0, f, length;
        // scale by sample rate
        attack = attack * sampleRate + 9; // minimum attack to prevent pop
        decay *= sampleRate;
        sustain *= sampleRate;
        release *= sampleRate;
        delay *= sampleRate;
        deltaSlide *= 500 * PI2 / sampleRate ** 3;
        modulation *= PI2 / sampleRate;
        pitchJump *= PI2 / sampleRate;
        pitchJumpTime *= sampleRate;
        repeatTime = repeatTime * sampleRate | 0;
        // generate waveform
        for (length = attack + decay + sustain + release + delay | 0; i < length; b[i++] = s) {
            if (!(++c % (bitCrush * 100 | 0))) // bit crush
             {
                s = shape ? shape > 1 ? shape > 2 ? shape > 3 ? // wave shape
                    Math.sin((t % PI2) ** 3) : // 4 noise
                    Math.max(Math.min(Math.tan(t), 1), -1) : // 3 tan
                    1 - (2 * t / PI2 % 2 + 2) % 2 : // 2 saw
                    1 - 4 * Math.abs(Math.round(t / PI2) - t / PI2) : // 1 triangle
                    Math.sin(t); // 0 sin
                s = (repeatTime ?
                    1 - tremolo + tremolo * Math.sin(PI2 * i / repeatTime) // tremolo
                    : 1) *
                    sign(s) * (Math.abs(s) ** shapeCurve) * // curve 0=square, 2=pointy
                    volume * this.volume * ( // envelope
                i < attack ? i / attack : // attack
                    i < attack + decay ? // decay
                        1 - ((i - attack) / decay) * (1 - sustainVolume) : // decay falloff
                        i < attack + decay + sustain ? // sustain
                            sustainVolume : // sustain volume
                            i < length - delay ? // release
                                (length - i - delay) / release * // release falloff
                                    sustainVolume : // release volume
                                0); // post release
                s = delay ? s / 2 + (delay > i ? 0 : // delay
                    (i < length - delay ? 1 : (length - i) / delay) * // release delay 
                        b[i - delay | 0] / 2) : s; // sample delay
            }
            f = (frequency += slide += deltaSlide) * // frequency
                Math.cos(modulation * tm++); // modulation
            t += f - f * noise * (1 - (Math.sin(i) + 1) * 1e9 % 2); // noise
            if (j && ++j > pitchJumpTime) // pitch jump
             {
                frequency += pitchJump; // apply pitch jump
                startFrequency += pitchJump; // also apply to start
                j = 0; // stop pitch jump time
            }
            if (repeatTime && !(++r % repeatTime)) // repeat
             {
                frequency = startFrequency; // reset frequency
                slide = startSlide; // reset slide
                j = j || 1; // reset pitch jump time
            }
        }
        return b;
    }
}
export const audio = new AudioFx();
