import React from 'react'
import notesDigits from './notesDigits.json'
import codesChars from './codesChars.json'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import './Map.css'

class Block extends React.Component {
  render() {
    return (
      <Paper className={this.props.pressed ? "grid grid-pressed" : "grid"}>
        <span className="grid-upper">{this.props.upper}</span>
        <br />
        <span className="grid-lower">{this.props.lower}</span>
      </Paper>
    )
  }
}

class Map extends React.Component {
  renderBlock(block, y, x, length) {
    const display = this.props.display === 'digit'
      ? notesDigits[block[1]]
      : block[1]
    /**
     * I know this is too long, this is too simple, and this is too stupid.
     * But it is clear to see which key takes how much space.
     * I can merge some same length key, but if one day they need to change,
     * it is hard because I need to take them apart with copy & paste.
     */
    if (x === 0 && y === length - 1) {
      // Backspace.
      return (
        <Grid item xs={4} key={y}>
          <Block
            upper={codesChars[block[0]]}
            lower={display}
            pressed={this.props.state[block[0]]}
          />
        </Grid>
      )
    } else if (x === 1 && y === 0) {
      // Tab.
      return (
        <Grid item xs={3} key={y}>
          <Block
            upper={codesChars[block[0]]}
            lower={display}
            pressed={this.props.state[block[0]]}
          />
        </Grid>
      )
    } else if (x === 1 && y === length - 1) {
      // Backslash.
      return (
        <Grid item xs={3} key={y}>
          <Block
            upper={codesChars[block[0]]}
            lower={display}
            pressed={this.props.state[block[0]]}
          />
        </Grid>
      )
    } else if (x === 2 && y === 0) {
      // CapsLock.
      return (
        <Grid item xs={3} key={y}>
          <Block
            upper={codesChars[block[0]]}
            lower={display}
            pressed={this.props.state[block[0]]}
          />
        </Grid>
      )
    } else if (x === 2 && y === length - 1) {
      // Enter.
      return (
        <Grid item xs={4} key={y}>
          <Block
            upper={codesChars[block[0]]}
            lower={display}
            pressed={this.props.state[block[0]]}
          />
        </Grid>
      )
    } else if (x === 3 && y === 0) {
      // ShiftLeft.
      return (
        <Grid item xs={3} key={y}>
          <Block
            upper={codesChars[block[0]]}
            lower={display}
            pressed={this.props.state[block[0]]}
          />
        </Grid>
      )
    } else if (x === 3 && y === length - 1) {
      // ShiftRight.
      return (
        <Grid item xs={4} key={y}>
          <Block
            upper={codesChars[block[0]]}
            lower={display}
            pressed={this.props.state[block[0]]}
          />
        </Grid>
      )
    } else if (x === 4) {
      // Space.
      return (
        <Grid item xs={6} key={y}>
          <Block
            upper={codesChars[block[0]]}
            lower={display}
            pressed={this.props.state[block[0]]}
          />
        </Grid>
      )
    }
    // Other digit, alpha and symbol.
    return (
      <Grid item xs={2} key={y}>
        <Block
          upper={codesChars[block[0]]}
          lower={display}
          pressed={this.props.state[block[0]]}
        />
      </Grid>
    )
  }

  renderRow(row, x) {
    return (
      <Grid container justify="center" spacing={3} wrap="nowrap" key={x}>
        {row.map((block, y) => {
          return this.renderBlock(block, y, x, row.length)
        })}
      </Grid>
    )
  }

  render() {
    return (
      <div className="map">
        <Paper>
          <div className="map-inner">
            {this.props.layout.map(this.renderRow.bind(this))}
          </div>
        </Paper>
      </div>
    )
  }
}

export default Map
