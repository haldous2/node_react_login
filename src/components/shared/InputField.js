
import React from 'react';
import PropTypes from 'prop-types';

class InputField extends React.Component {
    render() {
        const { field, value, type, label, onChange, onBlur, onKeyUp, onKeyDown, error } = this.props;
        return (
            <div className={error ? 'form-group has-error' : 'form-group'}>
                <label className="control-label">{label}</label>
                <input
                    value={value}
                    type={type}
                    name={field}
                    onChange={onChange}
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
    field: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onKeyUp: PropTypes.func,
    onKeyDown: PropTypes.func,
    error: PropTypes.string
}
InputField.defaultProps = {
    type: 'text'
}

export default InputField;
