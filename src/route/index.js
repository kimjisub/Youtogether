import React, { useState } from 'react'

import MainPage from './MainPage'
import CreateRoom from './CreateRoom'

function App() {
	const [mode, setMode] = useState(0)
	const [roomId, setRoomId] = useState(null)

	let component

	switch (mode) {
		case 1:
			component = <CreateRoom roomId={roomId} />
			break
		case 2:
			break
		default:
			component = (
				<MainPage
					onCreated={roomId => {
						console.log('onCreated: ' + roomId)
						setRoomId(roomId)
						setMode(1)
					}}
				/>
			)
			break
	}

	return <div>{component}</div>
}

export default App
