import React from 'react'
import Paper from '@material-ui/core/Paper'
import './Info.css'

class Info extends React.Component {
  render() {
    return (
      <div className="info">
        <Paper>
          <div className="info-inner">
            <div>Star or fork on <a href="https://github.com/AlynxZhou/azpiano-react/" target="_blank" rel="noreferrer noopener">GitHub</a>.</div>
            <div>Welcome to <a href="https://alynx.one/" target="_blank" rel="noreferrer noopener">Alynx Zhou's Homepage</a>.</div>
            <div>Icons made by <a href="https://www.flaticon.com/authors/smartline" title="Smartline" target="_blank" rel="noreferrer noopener">Smartline</a> from <a href="https://www.flaticon.com/" title="Flaticon" target="_blank" rel="noreferrer noopener">www.flaticon.com</a>.</div>
          </div>
        </Paper>
      </div>
    )
  }
}

export default Info
