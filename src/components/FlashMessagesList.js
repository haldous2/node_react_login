// Flash Message List container component

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FlashMessagesDetail from './FlashMessagesDetail';
import { incrementFlashMessage, deleteFlashMessage } from '../actions/flashMessages';

class FlashMessagesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flash_messages: [],
            flash_messages_count: 0
        };
    }
    componentWillReceiveProps(nextProps){
        if (this.props.messages === nextProps.messages){
            nextProps.incrementFlashMessage();
        }
    }
    render(){
        const { deleteFlashMessage } = this.props;
        //const messages = this.state.flash_messages.map(message =>
        const messages = this.props.messages.map(message =>
            <FlashMessagesDetail
                key={message.id}
                message={message}
                deleteFlashMessage={deleteFlashMessage}
            />
        );
        return(
            <div className='col-md-12' style={{display: (messages.length ? '' : 'none')}}>
                {messages}
            </div>
        );
    }
}

FlashMessagesList.propTypes = {
    incrementFlashMessage: PropTypes.func.isRequired,
    deleteFlashMessage: PropTypes.func.isRequired
}
function mapStateToProps(state) {
    return {
        messages: state.flashMessages,
        isAuthenticated: state.sessionData.isAuthenticated
    }
}
export default connect(mapStateToProps, { incrementFlashMessage, deleteFlashMessage })(FlashMessagesList);
