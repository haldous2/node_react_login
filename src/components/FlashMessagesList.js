// Flash Message List container component

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FlashMessagesDetail from './FlashMessagesDetail';
import { incrementFlashMessage, deleteFlashMessage } from '../actions/flashMessages';

class FlashMessagesList extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {};
        this.pathname = null;
    }

    componentDidMount(){
        /*
         Initialize state.pathname for comparison later
        */
        this.pathname = this.props.location.pathname;
    }
    componentDidUpdate(prevProps, prevState){
        /*
         Check pathname on update (e.g. after didmount and other lifecycles)
         Need to increment message counter so each message is only displayed once per page
         Although flashmessages are cleared on a new page load, when a page is
         redirected the same behavior isn't replicated. This method allows messages to
         clear when a page is redirected.
         ## the number of times a message can be display is set in reducers/flashMessages @ count
        */
        const { pathname } = prevProps.location;
        if (pathname !== this.pathname){
            this.pathname = pathname;
            this.props.incrementFlashMessage();
        }
    }

    render(){
        const { deleteFlashMessage } = this.props;
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
