import React, { Component, Fragment } from 'react'
import { withRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { Translate } from 'react-localize-redux'

import AccountFormSection from './AccountFormSection'
import AccountFormContainer from './AccountFormContainer'
import {Snackbar, snackbarDuration } from '../common/Snackbar'
import { redirectToApp, addAccessKeySeedPhrase, clearAlert } from '../../actions/account'
import { generateSeedPhrase } from '../../utils/seed-phrase'
import SetupSeedPhraseVerify from './SetupSeedPhraseVerify'

import SetupSeedPhraseForm from './SetupSeedPhraseForm'

class SetupSeedPhrase extends Component {
    state = {
        seedPhrase: '',
        enterWord: '',
        wordId: null,
        requestStatus: null,
        successSnackbar: false
    }

    componentDidMount = () => {
        this.refreshData()
    }

    refreshData = () => {
        const { seedPhrase, publicKey } = generateSeedPhrase()
        const wordId = Math.floor(Math.random() * 12)

        this.setState((prevState) => ({
            ...prevState,
            seedPhrase,
            publicKey,
            wordId,
            enterWord: '',
            requestStatus: null
        }))
    }

    handleChangeWord = (e, { name, value }) => {
        if (value.match(/[^a-zA-Z]/)) {
            return false
        }

        this.setState((state) => ({
           [name]: value.trim().toLowerCase(),
           requestStatus: null
        }))
    }

    handleStartOver = e => {
        this.refreshData()
        this.props.history.push(`/setup-seed-phrase/${this.props.accountId}`)
    }

    handleSubmit = e => {
        e.preventDefault()

        const { seedPhrase, enterWord, wordId } = this.state
        if (enterWord !== seedPhrase.split(' ')[wordId]) {
            this.setState(() => ({
                requestStatus: {
                    success: false,
                    messageCode: 'account.verifySeedPhrase.error'
                }
            }))
            return false
        }

        const contractName = null;
        this.props.addAccessKeySeedPhrase(this.props.accountId, contractName, this.state.publicKey)
            .then(({ error }) => {
                if (error) return
                this.props.redirectToApp()
            })
    }

    handleCopyPhrase = e => {
        e.preventDefault();
        const selection = window.getSelection();
        selection.selectAllChildren(document.getElementById('seed-phrase'));
        document.execCommand('copy');
        selection.removeAllRanges();
        this.setState({ successSnackbar: true }, () => {
            setTimeout(() => {
                this.setState({successSnackbar: false});
            }, snackbarDuration)
        });

    }

    render() {

        return (
            <>
                <Translate>
                    {({ translate }) => (
                        <Fragment>
                            <Route 
                                exact
                                path={`/setup-seed-phrase/:accountId`}
                                render={() => (
                                    <AccountFormContainer
                                        title={translate('setupSeedPhrase.pageTitle')}
                                        text={translate('setupSeedPhrase.pageText')}
                                    >
                                        <AccountFormSection requestStatus={this.props.requestStatus}>
                                            <SetupSeedPhraseForm
                                                seedPhrase={this.state.seedPhrase}
                                                handleCopyPhrase={this.handleCopyPhrase}
                                            />
                                        </AccountFormSection>
                                    </AccountFormContainer>
                                )}
                            />
                            <Route 
                                exact
                                path={`/setup-seed-phrase/:accountId/verify`}
                                render={() => (
                                    <AccountFormContainer
                                        title={translate('setupSeedPhraseVerify.pageTitle')}
                                        text={translate('setupSeedPhraseVerify.pageText')}
                                    >
                                        <AccountFormSection handleSubmit={this.handleSubmit} requestStatus={this.state.requestStatus}>
                                            <SetupSeedPhraseVerify
                                                enterWord={this.state.enterWord}
                                                wordId={this.state.wordId}
                                                handleChangeWord={this.handleChangeWord}
                                                handleStartOver={this.handleStartOver}
                                                formLoader={this.props.formLoader}
                                                requestStatus={this.state.requestStatus}
                                                globalAlert={this.props.globalAlert}
                                            />
                                        </AccountFormSection>
                                    </AccountFormContainer>
                                )}
                            />
                        </Fragment>
                    )}
                </Translate>
                <Snackbar
                    theme='success'
                    message='Seed phrase copied!'
                    show={this.state.successSnackbar}
                    onHide={() => this.setState({ successSnackbar: false })}
                />
            </>
        )
    }
}

const mapDispatchToProps = {
    redirectToApp,
    addAccessKeySeedPhrase,
    clearAlert
}

const mapStateToProps = ({ account }, { match }) => ({
    ...account,
    accountId: match.params.accountId
})

export const SetupSeedPhraseWithRouter = connect(mapStateToProps, mapDispatchToProps)(withRouter(SetupSeedPhrase))
