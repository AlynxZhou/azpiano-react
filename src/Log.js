import React from 'react'
import Paper from '@material-ui/core/Paper'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import './Log.css'

class Log extends React.Component {
  render() {
    return (
      <div className="log">
        <Paper>
          <div className="log-inner">
            <div className="log-text">
              <TextField
                value={
                  this.props.outputMode === "digit"
                    ? this.props.state.join('')
                    : this.props.state.join(' ')
                }
                variant="outlined"
                InputProps={{'readOnly': true}}
                fullWidth
                rows="8"
                multiline
              />
            </div>
            <div className="log-buttons">
              <div className="log-item">
                <FormControlLabel
                  control={
                    <Switch
                      className="log-button"
                      checked={this.props.enabled}
                      color="primary"
                      onChange={this.props.onSwitchChange}
                    />
                  }
                  label="Enable (F1)"
                />
              </div>
              <div className="log-item">
                <Button
                  className="log-button"
                  variant="contained"
                  onClick={this.props.onSpaceClick}
                >Space (F2)</Button>
              </div>
              <div className="log-item">
                <Button
                  className="log-button"
                  variant="contained"
                  onClick={this.props.onReturnClick}
                >Return (F3)</Button>
              </div>
              <div className="log-item">
                <Button
                  className="log-button"
                  variant="contained"
                  color="secondary"
                  onClick={this.props.onDeleteClick}
                >Delete (F4)</Button>
              </div>
              <div className="log-item">
                <Button
                  className="log-button"
                  variant="contained"
                  color="secondary"
                  onClick={this.props.onClearClick}
                >Clear (F5)</Button>
              </div>
              <div className="log-item">
                <Button
                  className="log-button"
                  variant="contained"
                  color="primary"
                  onClick={this.props.onCopyClick}
                >Copy (F6)</Button>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}

export default Log
