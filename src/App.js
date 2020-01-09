import React from 'react'
import Map from './Map'
import Log from './Log'
import Settings from './Settings'
import Info from './Info'
import AudioPlayer from './AudioPlayer'
import Base64Decoder from './Base64Decoder'
import defaultLayout from './layouts/default.json'
import ctrlcapsLayout from './layouts/ctrlcaps.json'
import hhkbLayout from './layouts/hhkb.json'
import notesDigits from './notesDigits.json'
import './App.css'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import LinearProgress from '@material-ui/core/LinearProgress'

const OGG_HEADER_LENGTH = 'data:audio/ogg;base64,'.length

class App extends React.Component {
  constructor(props) {
    super(props)
    this.player = new AudioPlayer()
    this.decoder = new Base64Decoder()
    this.searchParams = new URLSearchParams(window.location.search)
    this.layouts = {
      'default': defaultLayout,
      'ctrlcaps': ctrlcapsLayout,
      'hhkb': hhkbLayout
    }
    this.displayOptions = ['digit', 'note']
    this.state = {
      'ready': false,
      'percent': 0,
      'logState': [],
      'logEnabled': true,
      'mapState': {},
      'display': this.searchParams.has('display') &&
        this.displayOptions.indexOf(this.searchParams.get('display')) !== -1
        ? this.searchParams.get('display')
        : 'digit',
      'layout': this.searchParams.has('layout') &&
        this.layouts[this.searchParams.get('layout')] != null
        ? this.searchParams.get('layout')
        : 'default'
    }
    // Don't use state to store layout, it's **async**!
    this.layout = this.layouts[this.state.layout]
    this.updateLayout()

    this.notesBuffers = {}

    this.notesDigits = notesDigits
  }

  componentDidMount() {
    // Webpack trunked loading.
    import('./notesBuffers.json').then((module) => {
      const notesBuffers = module.default
      const totalLength = Object.keys(notesBuffers).length
      for (const k in notesBuffers) {
        this.player.decodeAudioData(this.decoder.decode(
          notesBuffers[k].substring(OGG_HEADER_LENGTH)
        ), (buffer) => {
          this.notesBuffers[k] = buffer
          if (!this.state.ready) {
            this.setState({
              'percent': Math.round(
                Object.keys(this.notesBuffers).length * 100 / totalLength
              ),
              'ready': Object.keys(this.notesBuffers).length === totalLength
            })
          }
        })
      }
    })
    document.addEventListener('keydown', this.onKeyDown.bind(this))
    document.addEventListener('keyup', this.onKeyUp.bind(this))
    document.addEventListener(
      'visibilitychange',
      this.onVisibilityChange.bind(this)
    )
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown.bind(this))
    document.removeEventListener('keyup', this.onKeyUp.bind(this))
    document.removeEventListener(
      'visibilitychange',
      this.onVisibilityChange.bind(this)
    )
  }

  updateQueryString() {
    const newPath = [
      window.location.protocol,
      '//',
      window.location.host,
      window.location.pathname,
      '?',
      this.searchParams.toString()
    ].join('')
    window.history.replaceState({'path': newPath}, '', newPath);
  }

  updateLayout() {
    this.codesNotes = {}
    for (const row of this.layout) {
      for (const grid of row) {
        this.codesNotes[grid[0]] = grid[1]
      }
    }
  }

  onVisibilityChange(event) {
    // Typically no keyup event is send when user switch tabs.
    // So we clear state manually.
    if (document.visibilityState !== 'visible') {
      this.player.pauseAll()
      this.setState({'mapState': {}})
    }
  }

  onKeyDown(event) {
    event.preventDefault()
    switch (event.code) {
      case 'F1':
        this.onSwitchChange()
        return
      case 'F2':
        this.onSpaceClick()
        return
      case 'F3':
        this.onReturnClick()
        return
      case 'F4':
        this.onDeleteClick()
        return
      case 'F5':
        this.onClearClick()
        return
      case 'F6':
        this.onCopyClick()
        return
      default:
        break
    }
    if (event.repeat || this.codesNotes[event.code] == null) {
      return
    }
    const code = event.code
    const note = this.codesNotes[code]
    const {logState, mapState} = this.state
    mapState[code] = true
    if (this.state.logEnabled && this.state.ready) {
      logState.push(this.notesDigits[note])
    }
    this.setState({logState, mapState})
    this.player.play(note, this.notesBuffers[note])
  }

  onKeyUp(event) {
    event.preventDefault()
    if (event.repeat || this.codesNotes[event.code] == null) {
      return
    }
    const code = event.code
    const note = this.codesNotes[code]
    const {mapState} = this.state
    mapState[code] = false
    this.setState({mapState})
    this.player.pause(note)
  }

  onSwitchChange(event) {
    if (event == null) {
      const {logEnabled} = this.state
      this.setState({'logEnabled': !logEnabled})
      return
    }
    this.setState({'logEnabled': event.target.checked})
  }

  onDeleteClick() {
    if (!this.state.logEnabled) {
      return
    }
    const {logState} = this.state
    logState.pop()
    this.setState({logState})
  }

  onSpaceClick() {
    if (!this.state.logEnabled) {
      return
    }
    const {logState} = this.state
    logState.push(' ')
    this.setState({logState})
  }

  onReturnClick() {
    if (!this.state.logEnabled) {
      return
    }
    const {logState} = this.state
    logState.push('\n')
    this.setState({logState})
  }

  onClearClick() {
    let {logState} = this.state
    logState = []
    this.setState({logState})
  }

  onCopyClick() {
    const {logState} = this.state
    const dummy = document.createElement('textarea')
    document.body.appendChild(dummy)
    dummy.value = logState.join('')
    dummy.select()
    document.execCommand('copy')
    document.body.removeChild(dummy)
  }

  onDisplayChange(event) {
    this.setState({'display': event.target.value})
    this.searchParams.set('display', event.target.value)
    this.updateQueryString()
  }

  onLayoutChange(event) {
    // setState is only used for re-trigger rendering.
    this.setState({'layout': event.target.value})
    this.searchParams.set('layout', event.target.value)
    this.updateQueryString()
    // Don't use state to update layout, it's **async**!
    this.layout = this.layouts[event.target.value]
    this.updateLayout()
  }

  render() {
    if (!this.state.ready) {
      return (
        <div className="app">
          <Container maxWidth="xl">
            <div className="loading">
              <Paper>
                <div className="loading-inner">
                  <div className="loading-item">
                    <LinearProgress />
                  </div>
                  <div className="loading-item">
                    <LinearProgress
                      variant="determinate"
                      value={this.state.percent}
                      color="secondary"
                    />
                  </div>
                </div>
              </Paper>
            </div>
          </Container>
        </div>
      )
    }
    return (
      <div className="app">
        <Container maxWidth="xl">
          <Map
            layout={this.layout}
            state={this.state.mapState}
            display={this.state.display}
          />
          <Log
            onSwitchChange={this.onSwitchChange.bind(this)}
            onDeleteClick={this.onDeleteClick.bind(this)}
            onSpaceClick={this.onSpaceClick.bind(this)}
            onReturnClick={this.onReturnClick.bind(this)}
            onClearClick={this.onClearClick.bind(this)}
            onCopyClick={this.onCopyClick.bind(this)}
            state={this.state.logState}
            enabled={this.state.logEnabled}
          />
          <Settings
            onDisplayChange={this.onDisplayChange.bind(this)}
            onLayoutChange={this.onLayoutChange.bind(this)}
            defaultDisplayValue={this.state.display}
            displayOptions={this.displayOptions}
            defaultLayoutValue={this.state.layout}
            layoutOptions={Object.keys(this.layouts)}
          />
          <Info />
        </Container>
      </div>
    )
  }
}

export default App
