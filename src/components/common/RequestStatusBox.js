import React from 'react'
import { Grid } from 'semantic-ui-react'
import styled from 'styled-components'
import { Translate } from 'react-localize-redux'
import classNames from '../../utils/classNames'

const RequestStatusBoxGrid = styled(Grid)`
    &&& .alert-info {
        font-weight: 600;
        padding-left: 15px;

        &.problem {
            color: #ff585d;
        }
        &.success {
            color: #6ad1e3;
        }

        &.dots {
            color: #4a4f54;

            :after {
                content: '.';
                animation: link 1s steps(5, end) infinite;
            
                @keyframes link {
                    0%, 20% {
                        color: rgba(0,0,0,0);
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    40% {
                        color: #4a4f54;
                        text-shadow:
                            .3em 0 0 rgba(0,0,0,0),
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    60% {
                        text-shadow:
                            .3em 0 0 #4a4f54,
                            .6em 0 0 rgba(0,0,0,0);
                    }
                    80%, 100% {
                        text-shadow:
                            .3em 0 0 #4a4f54,
                            .6em 0 0 #4a4f54;
                    }
                }
            }
        }
    }

    @media screen and (max-width: 991px) {
        && {
            padding-left: 0px;
        }
        &&& .alert-info {
            padding-left: 0px;
        }
    }

    @media screen and (max-width: 767px) {
        &&& .alert-info {
            font-size: 12px;
            padding: 0px !important;
            margin: 10px 0 5px 15px;
        }

        && {
            margin-top: -12px;
        }
  }
`
/**
 * Renders request status.
 *
 * @param requestStatus {object} request status, can be null in case not completed yet / no outgoing request
 * @param requestStatus.success {boolean} true if request was succesful
 * @param requestStatus.messageCode {string} localization code of status message to display
 */
const RequestStatusBox = ({ requestStatus, accountId, dots }) => (
    requestStatus ?
        <RequestStatusBoxGrid className='status-wrapper'>
            <Grid.Column className={classNames(['alert-info', {'success': requestStatus.success}, {'problem': !requestStatus.success}, {'dots': dots}])}>
                <Translate id={requestStatus.messageCode} data={{ accountId: accountId }}/>
            </Grid.Column>
        </RequestStatusBoxGrid>
        : null
)

export default RequestStatusBox
