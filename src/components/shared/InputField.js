
import React from 'react';
import PropTypes from 'prop-types';

class InputField extends React.Component {
    render() {
        /*
         Homogenized input field

            ## reference is a function call back of the input field to react
               e.g. from component
               reference={ input => { this.inputField = input }}
               then inside component, this.inputField acts like elementById

            ## disabled = true or false
        */
        const { reference, field, type, value, disabled, label, onChange, onInput, onBlur, onKeyUp, onKeyDown, error } = this.props;
        return (
            <div className={error ? 'form-group has-error' : 'form-group'}>
                <label className="control-label">{label}</label>
                <input
                    ref={reference}
                    name={field}
                    type={type}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                    onInput={onInput}
                    onBlur={onBlur}
                    onKeyUp={onKeyUp}
                    onKeyDown={onKeyDown}
                    className="form-control"
                />
                {error && <span className="help-block">{error}</span>}
            </div>
        );
    }
}

InputField.propTypes = {
    reference: PropTypes.func,
    field: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    onInput: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyUp: PropTypes.func,
    onKeyDown: PropTypes.func,
    error: PropTypes.string
}
InputField.defaultProps = {
    type: 'text'
}

export default InputField;
