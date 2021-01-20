import React, { Component } from 'react';

import Input from '../Input';
import Button from '../Button';

import './style.less';

export default class InputForm extends Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.value ?? '' };
        this.allowEmpty = this.props.allowEmpty ?? false;
        this.placeholder = this.props.placeholder ?? '';
        this.text = this.props.text ?? 'Button';
    }

    _patchEvent = (e) => {
        e.input = {value: this.state.value}
        return e;
    }

    handleChange = (e) => {
        this.setState(
            { value: e.target.value },
            // it guarantees that _patchEvent will be called after state update
            // and user-defined handler will get up-to-date Event object
            () => this.props.onChange?.(this._patchEvent(e))
        )
    }

    handleSubmit = (e) => {
        // if validation condition doesn't match 
        // then call handleEmptyError if it is defined
        let validation_condition = this.state.value || this.allowEmpty;
        if ( !validation_condition ) {
            this.props.onEmptyError?.();
            return;
        }
        
        this.props.onSubmit?.(this._patchEvent(e));
    };

    render() {
        return (
            <form id='input_form'>
                <Input 
                    value={this.state.value}
                    placeholder={this.placeholder}
                    onChange={this.handleChange}/>
                <Button 
                    text={this.text}
                    onClick={this.handleSubmit}/>
            </form>
        )
    }
}