import React from 'react'
import notesDigits from './notesDigits.json'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import './Map.css'

class Block extends React.Component {
  render() {
    if (this.props.pressed) {
      return (
        <Paper className="grid grid-pressed">
          <span className="grid-code">{this.props.code}</span>
          <br />
          <span className="grid-digit">{notesDigits[this.props.note]}</span>
        </Paper>
      )
    }
    return (
      <Paper className="grid">
        <span className="grid-code">{this.props.code}</span>
        <br />
        <span className="grid-digit">{notesDigits[this.props.note]}</span>
      </Paper>
    )
  }
}

class Map extends React.Component {
  renderBlock(block, index) {
    return (
      <Grid item xs key={index}>
        <Block
          code={block[0]}
          note={block[1]}
          pressed={this.props.state[block[0]]}
        />
      </Grid>
    )
  }

  renderRow(row, index) {
    return (
      <Grid container justify="center" spacing={3} key={index}>
        {row.map(this.renderBlock.bind(this))}
      </Grid>
    )
  }

  render() {
    return (
      <div className="map">
        <Paper>
          <div className="map-inner">
            {this.props.keymap.map(this.renderRow.bind(this))}
          </div>
        </Paper>
      </div>
    )
  }
}

export default Map
