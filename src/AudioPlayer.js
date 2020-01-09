class AudioPlayer {
  constructor(opts = {}) {
    this.context = new AudioContext()
    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = 1
    this.gainNode.connect(this.context.destination)
    this.sources = {}
    this.stopDelay = opts.stopDelay || 0.3
    this.decodeAudioData = this.context.decodeAudioData.bind(this.context)
  }

  play(id, buffer) {
    if (this.sources[id] != null) {
      return
    }
    this.sources[id] = this.context.createBufferSource()
    this.sources[id].buffer = buffer
    this.sources[id].connect(this.gainNode)
    this.sources[id].start(this.context.currentTime)
  }

  pause(id) {
    if (this.sources[id] == null) {
      return
    }
    this.sources[id].stop(this.context.currentTime + this.stopDelay)
    delete this.sources[id]
  }

  pauseAll() {
    for (const id in this.sources) {
      this.pause(id)
    }
  }
}

export default AudioPlayer
