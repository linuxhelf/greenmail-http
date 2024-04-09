import React from 'react'
import Alert from 'react-bootstrap/Alert'

function SoftwareIsUnreleased(props) {
	const {latest} = props
	return (
		<Alert variant="warning">
			<Alert.Heading>You are using an unreleased version.</Alert.Heading>
			<div>Last released version ist {latest}</div>
		</Alert>
	)
}

export default SoftwareIsUnreleased
