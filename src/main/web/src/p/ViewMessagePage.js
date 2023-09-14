import React, {Component} from 'react'
import axios from 'axios'
import Alert from 'react-bootstrap/Alert'
import Table from '@material-ui/core/Table'
import {ViewMessageUrl, AttachmentDownloadUrl} from '../c/GmhUrl'
import EmailAddresses from '../c/EmailAddresses'
import {BreadcrumbContext} from '../c/breadcrumbContext'
import PageHeader from '../m/PageHeader'
import ShadowDom from '../m/ShadowDom'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TableCell from '@material-ui/core/TableCell/TableCell'

class ViewMessagePage extends Component {

	static contextType = BreadcrumbContext

	constructor(props) {
		super(props)
		this.state = {
			data: {
				"headers":{},
				"flags": [],
				"to": [],
				"from": [],
				"cc": [],
				"bcc": [],
				"attachments": [],
			},
			error: false,
			value:0,
			bodytype: 0
		}
	}

	componentDidMount() {
		const {mailbox, uid} = this.props.match.params

		const url = ViewMessageUrl(mailbox, uid)
		axios.get(url)
			.then(res => {
				this.setState({
					data: res.data
				})
			}, (error) => {
				this.setState({
					data: error,
					error: true
				})
			})

		const hereUrl = window.location.pathname
		const title = `View: ${decodeURIComponent(mailbox)}/${uid}`
		this.context.addBreadcrumb(title, hereUrl)

	}

	handleChange = (event, newValue) => {
		this.setState({
				value: newValue
		})
	}

	handleBodyTypeChange = (event, newValue) => {
		this.setState({
				bodytype: newValue
		})
	}

	getContent = () => {
		let value = this.state.value
		return (value === 0) ? this.getMessageDetails() : this.getHeaderDetails()
	}

	getBody = () => {
		switch (this.state.bodytype) {
			case 0:
				return <div key="plain" style={{whiteSpace: "pre-wrap"}}>{this.state.data.body || ""}</div>;
			case 1:
				return <ShadowDom key="html" html={this.state.data.htmlBody || ""} />;
			case 2:
				return <div key="src" style={{whiteSpace: "pre-wrap"}}>{this.state.data.htmlBody || ""}</div>;
			default:
				return "";
		}
	}

	getHeaderDetails = () => {
		const {headers} = this.state.data
		const mEntries = Object.entries(headers).sort((a,b) => a > b)
		return (
			<Paper>
				<Table>
					<TableBody>
					{
						mEntries.map((item) => (
							<TableRow hover key={item}>
								<TableCell>{item[0]}</TableCell>
								<TableCell>{item[1]}</TableCell>
							</TableRow>
						))
					}
					</TableBody>
				</Table>
			</Paper>
		)
	}

	getMessageDetails = () => {
		const {flags, from, to, cc, bcc, subject, htmlBody, attachments} = this.state.data
		const {mailbox, uid} = this.props.match.params
		return(
			<Paper>
				<Table>
					<TableBody>
						<TableRow hover>
							<TableCell>Flags</TableCell>
							<TableCell>{flags.map(flag => {return flag})}</TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>From</TableCell>
							<TableCell><EmailAddresses emails={from}/></TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>To</TableCell>
							<TableCell><EmailAddresses emails={to}/></TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>Cc</TableCell>
							<TableCell><EmailAddresses emails={cc}/></TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>Bcc</TableCell>
							<TableCell><EmailAddresses emails={bcc}/></TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>Subject</TableCell>
							<TableCell>{subject}</TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>Body</TableCell>
							<TableCell>
							{htmlBody !== "" && <Tabs
								value={this.state.bodytype}
								indicatorColor="primary"
								textColor="primary"
								onChange={this.handleBodyTypeChange}>
								<Tab label="Plain" key="plain" />
								<Tab label="HTML" key="html" />
								<Tab label="HTML-Source" key="htmlsrc" />
							</Tabs>}
							{this.getBody()}
							</TableCell>
						</TableRow>
						<TableRow hover>
							<TableCell>Attachments</TableCell>
							<TableCell>{attachments.map((attachment) => <div key={attachment.filename} >
								<a href={AttachmentDownloadUrl(mailbox, uid, attachment.filename)}>{attachment.filename}</a>
							</div>)}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Paper>
		)
	}

	render() {

		if (this.state.error) {
			const eMessage = this.state.data.toString() + " " +this.state.url
			return <Alert variant="danger" dismissible>{eMessage}</Alert>
		}

		return (
			<div>
				<PageHeader title="Message"/>
				<Paper>
					<Tabs
						value={this.state.value}
						indicatorColor="primary"
						textColor="primary"
						onChange={this.handleChange}>
						<Tab label="Message" key="message"/>
						<Tab label="Headers" key="headers"/>
					</Tabs>
				</Paper>
				{
					this.getContent()
				}
			</div>
		)
	}
}

export default ViewMessagePage
