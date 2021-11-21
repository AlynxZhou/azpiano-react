const AudioContext = window.AudioContext || window.webkitAudioContext;

class AudioPlayer {
  constructor(opts = {}) {
    this.context = new AudioContext();
    this.gainNode = this.context.createGain();
    // Our default MIDI piano volume is too low so use 10 as gain.
    this.gainNode.gain.value = 10;
    this.gainNode.connect(this.context.destination);
    this.sources = {};
    this.stopDelay = opts.stopDelay || 0.3;
    this.decodeAudioData = this.context.decodeAudioData.bind(this.context);
  }

  play(id, buffer) {
    if (this.sources[id] != null) {
      return;
    }
    this.sources[id] = this.context.createBufferSource();
    this.sources[id].buffer = buffer;
    this.sources[id].connect(this.gainNode);
    this.sources[id].start(this.context.currentTime);
  }

  pause(id) {
    if (this.sources[id] == null) {
      return;
    }
    this.sources[id].stop(this.context.currentTime + this.stopDelay);
    delete this.sources[id];
  }

  pauseAll() {
    for (const id in this.sources) {
      this.pause(id);
    }
  }
}

export default AudioPlayer;
