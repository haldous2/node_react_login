// Flash Message Detail container component

import React from 'react';
import PropTypes from 'prop-types';

class FlashMessagesDetail extends React.Component {
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    onClick(){
        this.props.deleteFlashMessage(this.props.message.id);
    }
    render(){
        const { type, text } = this.props.message;
        return(
            <div className={'alert ' + (type === 'success' ? 'alert-success' : 'alert-danger')}>
                <button onClick={this.onClick} className="close"><span>&times;</span></button>
                {text}
            </div>
        );
    }
}

FlashMessagesDetail.propTypes = {
    message: PropTypes.object.isRequired,
    deleteFlashMessage: PropTypes.func.isRequired
}
export default FlashMessagesDetail;
