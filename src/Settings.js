import React from 'react'

class Settings extends React.Component {
  render() {
    return (
      <div className="settings">
        <div className="settings-display">
          <h1>Display</h1>
          <select onChange={this.props.onDisplayChange}>
            <option value="digit" selected>Digit</option>
            <option value="note">Note</option>
          </select>
        </div>
        <div className="settings-layout">
          <h1>Layout</h1>
          <select onChange={this.props.onLayoutChange}>
            <option value="default" selected>Default</option>
          </select>
        </div>
      </div>
    )
  }
}

export default Settings
