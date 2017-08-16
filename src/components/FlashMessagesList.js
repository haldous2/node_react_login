// Flash Message List container component

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FlashMessagesDetail from './FlashMessagesDetail';
import { deleteFlashMessage } from '../actions/flashMessages';

class FlashMessagesList extends React.Component {
    render(){
        const { deleteFlashMessage } = this.props;
        const messages = this.props.messages.map(message =>
            <FlashMessagesDetail key={message.id} message={message} deleteFlashMessage={deleteFlashMessage} />
        );
        return(
            <div>{messages}</div>
        );
    }
}

FlashMessagesList.propTypes = {
    messages: PropTypes.array.isRequired,
    deleteFlashMessage: PropTypes.func.isRequired
}

// Connect to data store - load messages into list
function mapStateToProps(state) {
    return {
        messages: state.flashMessages
    }
}

export default connect(mapStateToProps, { deleteFlashMessage })(FlashMessagesList);
