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
					</div>
				</Paper>
			</div>
		)
	}
}

export default Info
