import React from "react";
import Map from "./Map";
import Log from "./Log";
import Settings from "./Settings";
import Info from "./Info";
import AudioPlayer from "./AudioPlayer";
import Base64Decoder from "./Base64Decoder";
import defaultLayout from "./layouts/default.json";
import ctrlcapsLayout from "./layouts/ctrlcaps.json";
import hhkbLayout from "./layouts/hhkb.json";
import jpLayout from "./layouts/jp.json";
import dvorakLayout from "./layouts/dvorak.json";
import notesDigits from "./notesDigits.json";
import notesLily from "./notesLily.json";
import "./App.css";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

const OGG_HEADER_LENGTH = "data:audio/ogg;base64,".length;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.decoder = new Base64Decoder();
    this.searchParams = new URLSearchParams(window.location.search);
    this.mapLayouts = {
      "default": defaultLayout,
      "ctrlcaps": ctrlcapsLayout,
      "hhkb": hhkbLayout,
      "jp": jpLayout,
      "dvorak": dvorakLayout
    };
    this.displayOptions = ["digit", "note"];
    this.outputOptions = ["digit", "lilypond-is", "lilypond-es"];
    const storedLog = window.localStorage.getItem("logState");
    this.state = {
      "start": false,
      "ready": false,
      "percent": 0,
      "logState": storedLog == null ? [] : JSON.parse(storedLog),
      "logEnabled": true,
      "mapState": {},
      "displayParam": this.searchParams.has("display") &&
        this.displayOptions.indexOf(this.searchParams.get("display")) !== -1
        ? this.searchParams.get("display")
        : "digit",
      "outputParam": this.searchParams.has("output") &&
        this.outputOptions.indexOf(this.searchParams.get("output")) !== -1
        ? this.searchParams.get("output")
        : "digit",
      "layoutParam": this.searchParams.has("layout") &&
        this.mapLayouts[this.searchParams.get("layout")] != null
        ? this.searchParams.get("layout")
        : "default"
    };
    // Don't use state to store layout, it's **async**!
    this.mapLayout = this.mapLayouts[this.state.layoutParam];
    this.updateMapLayout();

    this.notesBuffers = {};

    this.notesDigits = notesDigits;
    this.notesLily = notesLily;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleSpaceClick = this.handleSpaceClick.bind(this);
    this.handleReturnClick = this.handleReturnClick.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
    this.handleCopyClick = this.handleCopyClick.bind(this);
    this.handleDisplayChange = this.handleDisplayChange.bind(this);
    this.handleOutputChange = this.handleOutputChange.bind(this);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange
    );
  }

  updateQueryString() {
    const newPath = [
      window.location.protocol,
      "//",
      window.location.host,
      window.location.pathname,
      "?",
      this.searchParams.toString()
    ].join("");
    window.history.replaceState({"path": newPath}, "", newPath);
  }

  updateMapLayout() {
    this.codesNotes = {};
    for (const row of this.mapLayout) {
      for (const grid of row) {
        this.codesNotes[grid[0]] = grid[1];
      }
    }
  }

  handleVisibilityChange(event) {
    // Typically no keyup event is send when user switch tabs.
    // So we clear state manually.
    if (document.visibilityState !== "visible") {
      this.player.pauseAll();
      this.setState({"mapState": {}});
    }
  }

  handleKeyDown(event) {
    event.preventDefault();
    // "Press Any Key to Start"!
    // Ah, in fact, not any key.
    if (!this.state.ready) {
      this.onStartClick();
      return;
    }
    switch (event.code) {
      case "F1":
        this.handleSwitchChange();
        return;
      case "F2":
        this.handleSpaceClick();
        return;
      case "F3":
        this.handleReturnClick();
        return;
      case "F4":
        this.handleDeleteClick();
        return;
      case "F5":
        this.handleClearClick();
        return;
      case "F6":
        this.handleCopyClick();
        return;
      default:
        break;
    }
    if (event.repeat || this.codesNotes[event.code] == null) {
      return;
    }
    const code = event.code;
    const note = this.codesNotes[code];
    const {logState, mapState} = this.state;
    mapState[code] = true;
    if (this.state.logEnabled && this.state.ready) {
      logState.push(
        this.state.outputParam === "digit"
          ? this.notesDigits[note]
          : this.notesLily[this.state.outputParam][note]
      );
    }
    window.localStorage.setItem("logState", JSON.stringify(logState));
    this.setState({logState, mapState});
    this.player.play(note, this.notesBuffers[note]);
  }

  handleKeyUp(event) {
    event.preventDefault();
    if (event.repeat || this.codesNotes[event.code] == null) {
      return;
    }
    const code = event.code;
    const note = this.codesNotes[code];
    const {mapState} = this.state;
    mapState[code] = false;
    this.setState({mapState});
    this.player.pause(note);
  }

  handleSwitchChange(event) {
    if (event == null) {
      const {logEnabled} = this.state;
      this.setState({"logEnabled": !logEnabled});
      return;
    }
    this.setState({"logEnabled": event.target.checked});
  }

  handleDeleteClick() {
    if (!this.state.logEnabled) {
      return;
    }
    const {logState} = this.state;
    logState.pop();
    window.localStorage.setItem("logState", JSON.stringify(logState));
    this.setState({logState});
  }

  handleSpaceClick() {
    if (!this.state.logEnabled) {
      return;
    }
    const {logState} = this.state;
    logState.push(" ");
    window.localStorage.setItem("logState", JSON.stringify(logState));
    this.setState({logState});
  }

  handleReturnClick() {
    if (!this.state.logEnabled) {
      return;
    }
    const {logState} = this.state;
    logState.push("\n");
    window.localStorage.setItem("logState", JSON.stringify(logState));
    this.setState({logState});
  }

  handleClearClick() {
    let {logState} = this.state;
    logState = [];
    window.localStorage.removeItem("logState");
    this.setState({logState});
  }

  handleCopyClick() {
    const {logState} = this.state;
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = logState.join("");
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  handleDisplayChange(event) {
    this.setState({"displayParam": event.target.value});
    this.searchParams.set("display", event.target.value);
    this.updateQueryString();
  }

  handleOutputChange(event) {
    this.setState({"outputParam": event.target.value});
    this.searchParams.set("output", event.target.value);
    this.updateQueryString();
  }

  handleLayoutChange(event) {
    // setState is only used for re-trigger rendering.
    this.setState({"layoutParam": event.target.value});
    this.searchParams.set("layout", event.target.value);
    this.updateQueryString();
    // Don't use state to update layout, it's **async**!
    this.mapLayout = this.mapLayouts[event.target.value];
    this.updateMapLayout();
  }

  handleStartClick() {
    // Oh I hate Chromium!
    // Why I can only create AudioPlayer after user action?
    this.setState({"start": true});
    this.player = new AudioPlayer();
    // Webpack trunked loading.
    import("./notesBuffers.json").then(({"default": notesBuffers}) => {
      const totalLength = Object.keys(notesBuffers).length;
      for (const k of Object.keys(notesBuffers)) {
        this.player.decodeAudioData(this.decoder.decode(
          notesBuffers[k].substring(OGG_HEADER_LENGTH)
        ), (buffer) => {
          this.notesBuffers[k] = buffer;
          if (!this.state.ready) {
            this.setState({
              "percent": Math.round(
                Object.keys(this.notesBuffers).length * 100 / totalLength
              ),
              "ready": Object.keys(this.notesBuffers).length === totalLength
            });
          }
        });
      }
    });
  }

  render() {
    // So if user has gone to toliet,
    // we need to wait, too.
    if (!this.state.start) {
      return (
        <div className='app'>
          <Container maxWidth='xl'>
            <div className='loading'>
              <Paper>
                <div className='loading-inner'>
                  <div className='loading-item'>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={this.handleStartClick}
                    >
                      Press Any Key to Start
                    </Button>
                  </div>
                </div>
              </Paper>
            </div>
          </Container>
        </div>
      );
    }
    if (!this.state.ready) {
      return (
        <div className='app'>
          <Container maxWidth='xl'>
            <div className='loading'>
              <Paper>
                <div className='loading-inner'>
                  <div className='loading-item'>
                    <LinearProgress />
                  </div>
                  <div className='loading-item'>
                    <LinearProgress
                      variant='determinate'
                      value={this.state.percent}
                      color='secondary'
                    />
                  </div>
                </div>
              </Paper>
            </div>
          </Container>
        </div>
      );
    }
    return (
      <div className='app'>
        <Container maxWidth='xl'>
          <Map
            layout={this.mapLayout}
            state={this.state.mapState}
            layoutParam={this.state.layoutParam}
            displayParam={this.state.displayParam}
          />
          <Log
            onSwitchChange={this.handleSwitchChange}
            onDeleteClick={this.handleDeleteClick}
            onSpaceClick={this.handleSpaceClick}
            onReturnClick={this.handleReturnClick}
            onClearClick={this.handleClearClick}
            onCopyClick={this.handleCopyClick}
            outputMode={this.state.outputParam}
            state={this.state.logState}
            enabled={this.state.logEnabled}
          />
          <Settings
            onDisplayChange={this.handleDisplayChange}
            onOutputChange={this.handleOutputChange}
            onLayoutChange={this.handleLayoutChange}
            defaultDisplayValue={this.state.displayParam}
            displayOptions={this.displayOptions}
            defaultOutputValue={this.state.outputParam}
            outputOptions={this.outputOptions}
            defaultLayoutValue={this.state.layoutParam}
            layoutOptions={Object.keys(this.mapLayouts)}
          />
          <Info />
        </Container>
      </div>
    );
  }
}

export default App;
