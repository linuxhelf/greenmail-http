import React, {Component} from 'react'
import axios from 'axios'
import packageJson from '../../package.json'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'

import SoftwareUpdateMessage from '../m/SoftwareUpdateMessage'
import CheckingSoftwareVersion from '../m/CheckingSoftwareVersion'
import SoftwareIsUpToDate from '../m/SoftwareIsUpToDate'
import SoftwareIsUnreleased from '../m/SoftwareIsUnreleased'
import {read as brainRead, write as brainWrite} from '../c/Brain'


class WelcomePage extends Component {

	constructor(props) {
		super(props)
		this.state = {
			latest: packageJson.version,
			status: <CheckingSoftwareVersion/>
		}
	}

	/**
	 * a < b for versions
	 * 
	 * works for different lengths and parts with multiple digits,
	 * e.g. 1.1 < 1.3.1? 1.15.1 < 1.4.0?
	 */
	compareVersion(a,b) {
		let a_parts = a.split(".").map((n) => parseInt(n))
		let b_parts = b.split(".").map((n) => parseInt(n))
		for (let i = 0; i < b_parts.length; i++) {
			if (i == a_parts.length) {
				// a is finished
				// => a is smaller
				return true;
			}
			if (a_parts[i] != b_parts[i]) {
				return a_parts[i] < b_parts[i];
			}
		}
		// b is finished or both are equal
		// => a is not smaller
		return false;
	}

	componentDidMount() {
		let latestTag = brainRead('latestTag')
		if (latestTag !== null) {
			this.displayUserMessage(latestTag)
			return
		}

		axios.get("https://api.github.com/repos/davidnewcomb/greenmail-http/tags")
			.then( (response, state) => {
				const tags = response.data.map( tag => tag.name)
				const stags = tags.sort(this.compareVersion)
				const latestTag = stags[0]
				brainWrite('latestTag', latestTag)
				this.displayUserMessage(latestTag)
			})
			.catch( (error) => {
				let status = <SoftwareUpdateMessage error={error.toString()}/>
				this.setState({
					status: status
				})
				console.error('Error getting greenmail-http project tags', error)
			})
	}

	render() {

		return (
			<Container>
			<Jumbotron>
			<h1>GreenMail HTTP</h1>
			<div>You are currently running version: {packageJson.version}</div>
			{this.state.status}
			<hr/>
			<a href="https://github.com/davidnewcomb/greenmail-http" target="blank">GreenMail HTTP on Github</a>
			</Jumbotron>
			</Container>
		)
	}

	displayUserMessage(version) {
		let status = null
		if (packageJson.version !== version) {
			if (this.compareVersion(packageJson.version, version)) {
				status = <SoftwareUpdateMessage latest={version}/>
			} else {
				status = <SoftwareIsUnreleased latest={version}/>
			}
		} else {
			status = <SoftwareIsUpToDate/>
		}
		this.setState({
			latest: version,
			status: status
		})
		return
	}
}

export default WelcomePage
