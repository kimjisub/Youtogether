/*global chrome*/
import React, { useState, useEffect } from 'react'

import MainPage from './MainPage'
import CreateRoom from './CreateRoom'

const background = chrome.extension.getBackgroundPage()

function App() {
	const [tab, setTab] = useState(null)
	const [state, setState] = useState({})

	useEffect(() => {
		chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
			let tab = tabs[0]
			console.log('tab', tab)
			let state = background.tabApi.getOrCreate(tab)
			console.log('state', state)
			setState(state)
			setTab(tab)
		})
	}, [])

	if (tab) background.tabApi.update(tab, state)

	let component = null

	if (tab)
		switch (state.mode) {
			case 1:
				component = <CreateRoom roomId={state.roomId} />
				break
			case 2:
				break
			default:
				component = (
					<MainPage
						onCreated={roomId => {
							console.log('onCreated: ' + roomId)
							setState({ ...state, mode: 1, roomId })
						}}
					/>
				)
				break
		}

	return (
		<div>
			<p>{state.mode}</p>
			{component}
		</div>
	)
}

export default App
