import React, { Component } from 'react'

import MainPage from './MainPage'
import CreateRoom from './CreateRoom'

class App extends Component {
	constructor() {
		super()

		this.state = {
			mode: 0,
			roomId: ''
		}
	}

	render() {
		let component

		switch (this.state.mode) {
			case 1:
				component = <CreateRoom roomId={this.state.roomId} />
				break
			case 2:
				break
			default:
				component = (
					<MainPage
						onCreated={roomId => {
							console.log('onCreated: ' + roomId)
							this.setState({
								mode: 1,
								roomId
							})
						}}
					/>
				)
				break
		}

		return <div>{component}</div>
	}
}

export default App
