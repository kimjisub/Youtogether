import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import './MainPage.scss'
import { firestore } from '../firebase'

class App extends Component {
	constructor() {
		super()

		this.fs = firestore()
	}

	render() {
		return (
			<div className="MainPage">
				<Button
					raised
					ripple
					onClick={() => {
						this.fs
							.collection('Room')
							.add({
								url: '',
								playing: false,
								playTime: {
									currentTime: 0,
									startAt: 0
								}
							})
							.then(docRef => {
								this.props.onCreated(docRef.id)
							})
							.catch(err => {
								this.setState({ err: err })
							})
					}}>
					새로 만들기
				</Button>
			</div>
		)
	}
}

export default App
