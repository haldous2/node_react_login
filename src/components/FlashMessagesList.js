// Flash Message List container component

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FlashMessagesDetail from './FlashMessagesDetail';
import { deleteFlashMessage, deleteFlashMessages } from '../actions/flashMessages';

class FlashMessagesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flash_messages: []
        };
    }
    shouldComponentUpdate(nextProps, nextState){
        //console.log('shouldComponentUpdate', nextProps);
        this.setState({ flash_messages: nextProps.messages });
        if (nextProps.messages.length > 0){
            nextProps.deleteFlashMessages();
            // No update on state change (flash_messages will retain state - balancing plates)
            return false;
        }else{
            // Allow update on state change
            return true;
        }
    }
    render(){
        const { deleteFlashMessage } = this.props;
        const messages = this.state.flash_messages.map(message =>
            <FlashMessagesDetail key={message.id} message={message} deleteFlashMessage={deleteFlashMessage} />
        );
        return(
            <div className='col-md-12' style={{display: (messages.length ? '' : 'none')}}>
                {messages}
            </div>
        );
    }
}

FlashMessagesList.propTypes = {
    deleteFlashMessage: PropTypes.func.isRequired,
    deleteFlashMessages: PropTypes.func.isRequired
}
function mapStateToProps(state) {
    return {
        messages: state.flashMessages,
        isAuthenticated: state.sessionData.isAuthenticated
    }
}
export default connect(mapStateToProps, { deleteFlashMessage, deleteFlashMessages })(FlashMessagesList);
