import React from "react";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import "./Settings.css";

class Settings extends React.Component {
  render() {
    return (
      <div className='settings'>
        <Paper>
          <div className='settings-inner'>
            <div className='settings-item'>
              <FormControl fullWidth>
                <InputLabel id='display'>Display</InputLabel>
                <Select
                  labelId='display'
                  defaultValue={this.props.defaultDisplayValue}
                  onChange={this.props.onDisplayChange}
                >
                  {this.props.displayOptions.map((option, index) => {
                    return (
                      <MenuItem key={index} value={option}>{option}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className='settings-item'>
              <FormControl fullWidth>
                <InputLabel id='output'>Output</InputLabel>
                <Select
                  labelId='output'
                  defaultValue={this.props.defaultOutputValue}
                  onChange={this.props.onOutputChange}
                >
                  {this.props.outputOptions.map((option, index) => {
                    return (
                      <MenuItem key={index} value={option}>{option}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className='settings-item'>
              <FormControl fullWidth>
                <InputLabel id='layout'>Layout</InputLabel>
                <Select
                  labelId='layout'
                  defaultValue={this.props.defaultLayoutValue}
                  onChange={this.props.onLayoutChange}
                >
                  {this.props.layoutOptions.map((option, index) => {
                    return (
                      <MenuItem key={index} value={option}>{option}</MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default Settings;
