import React, {Component} from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent/DialogContent'
import axios from 'axios'
import {UploadEmailUrl} from '../c/GmhUrl'
import SendIcon from '@material-ui/icons/Send'
import {ValidatorForm} from 'react-material-ui-form-validator'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import PublishIcon from '@material-ui/icons/Publish'
import {Tooltip} from '@material-ui/core'

class ImportEmail extends Component{

    constructor(props){
        super(props)
        this.state = {
            openEmailDialog: false,
            errorMessage: '',
            file: null
        }
    }

    openDialog = () => {
        this.setState({
            openEmailDialog: true
        })
    }

    sendEmail = () => {
        let url = UploadEmailUrl()
        let formData = new FormData();
        formData.append("email", this.state.file);
        axios.post(url,formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then( res => {
            this.closeDialog()
            this.props.reload()
        }, (error) => {
            this.setState({
                errorMessage: error.toString()
            })
        })
    }

    closeDialog = () => {
        this.setState({
            openEmailDialog: false
        })
    }

    handleChange = (event) => {
        if (event.target.files) {
            this.setState({
                file : event.target.files[0]
            })
        }
    }

    render(){
        return (
            <span>
                <Tooltip title="Import Email">
                    <Button onClick={this.openDialog} className="btn btn-primary" style={{margin:2}}>
                        <PublishIcon/>Import
                    </Button>
                </Tooltip>
                
                <Dialog fullWidth onClose={this.closeDialog} aria-labelledby="customized-dialog-title" open={this.state.openEmailDialog}>
                    <DialogTitle id="compose-email-title" onClose={this.closeDialog}>
                        Import Email
                        <Button style={{float: 'right'}} onClick={this.closeDialog}>
                            <CloseIcon/>
                        </Button>
                    </DialogTitle>
                    <DialogContent dividers>

                        <Typography style={{color: 'red', marginLeft: 30}}>{this.state.errorMessage}</Typography>

                        <ValidatorForm onSubmit={this.sendEmail}>
                            <DialogContent>
                                <input type="file" onChange={this.handleChange} />
                               
                            </DialogContent>

                            <DialogActions>
                                <Button type="submit" color="primary">
                                    <SendIcon/>
                                    Import
                                </Button>
                            </DialogActions>
                        </ValidatorForm>
                    </DialogContent>
                </Dialog>
            </span>
        )
    }
}

export default ImportEmail