import React from 'react'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import './Log.css'

class Log extends React.Component {
  render() {
    return (
      <div className="log">
        <Paper>
          <div className="log-inner">
            <div className="log-text">
              <TextField
                defaultValue={this.props.state.join('')}
                variant="outlined"
                InputProps={{readOnly: true}}
                fullWidth
                rows="8"
                multiline />
            </div>
            <div className="log-buttons">
              <Button
                className="log-button">Ctrl +</Button>
              <Button
                className="log-button"
                variant="contained"
                color="secondary"
                onClick={this.props.onDeleteClick}>Backspace</Button>
              <Button
                className="log-button"
                variant="contained"
                onClick={this.props.onSpaceClick}>Space</Button>
              <Button
                className="log-button"
                variant="contained"
                color="primary"
                onClick={this.props.onReturnClick}>Enter</Button>
            </div>
          </div>
        </Paper>
      </div>  
    )
  }
}

export default Log
