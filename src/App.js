import React from 'react'
import Map from './Map'
import Log from './Log'
import AudioPlayer from './AudioPlayer'
import Base64Decoder from './Base64Decoder'
import defaultKeymap from './keymap/default.json'
import notesBuffers from './notesBuffers.json'
import notesDigits from './notesDigits.json'
import './App.css'
import Container from '@material-ui/core/Container'

const OGG_HEADER_LENGTH = "data:audio/ogg;base64,".length

class App extends React.Component {
  constructor(props) {
    super(props)
    this.player = new AudioPlayer()
    this.decoder = new Base64Decoder()
    this.state = {
      log: [],
      keymap: defaultKeymap,
      map: {}
    }

    this.codesNotes = {}
    for (let row of this.state.keymap) {
      for (let grid of row) {
        this.codesNotes[grid[0]] = grid[1]
      }
    }

    this.notesBuffers = {}
    for (let k in notesBuffers) {
      this.player.decodeAudioData(this.decoder.decode(
        notesBuffers[k].substring(OGG_HEADER_LENGTH)
      ), (buffer) => {
        this.notesBuffers[k] = buffer
      })
    }

    this.notesDigits = notesDigits
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown.bind(this))
    document.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown.bind(this))
    document.removeEventListener('keyup', this.onKeyUp.bind(this))
  }

  onKeyDown(event) {
    event.preventDefault()
    if (event.ctrlKey) {
      switch (event.code) {
        case 'Backspace':
          this.onDeleteClick()
          break
        case 'Space':
          this.onSpaceClick()
          break
        case 'Enter':
          this.onReturnClick()
          break
        default:
          break
      }
      return
    }
    if (event.repeat || this.codesNotes[event.code] == null) {
      return
    }
    const code = event.code
    const note = this.codesNotes[code]
    const {log, map} = this.state
    map[code] = true
    log.push(this.notesDigits[note])
    this.setState({log, map})
    this.player.play(note, this.notesBuffers[note])
  }

  onKeyUp(event) {
    event.preventDefault()
    if (event.repeat || this.codesNotes[event.code] == null) {
      return
    }
    const code = event.code
    const note = this.codesNotes[code]
    const {map} = this.state
    map[code] = false
    this.setState({map})
    this.player.pause(note)
  }

  onDeleteClick() {
    const {log} = this.state
    log.pop()
    this.setState({log})
  }

  onSpaceClick() {
    const {log} = this.state
    log.push(' ')
    this.setState({log})
  }

  onReturnClick() {
    const {log} = this.state
    log.push('\n')
    this.setState({log})
  }

  render() {
    return (
      <div className="app">
        <Container maxWidth="xl">
          <Map
            keymap={this.state.keymap}
            state={this.state.map}
          />
          <Log
            onDeleteClick={this.onDeleteClick.bind(this)}
            onSpaceClick={this.onSpaceClick.bind(this)}
            onReturnClick={this.onReturnClick.bind(this)}
            state={this.state.log}
          />
        </Container>
      </div>
    )
  }
}

export default App
