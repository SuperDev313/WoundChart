// SwitchControl.js

import React from 'react';
import { Input, Label } from 'reactstrap';
import { Check, X } from 'react-feather'

const SwitchInput = ({ name, label, checked, onChange }) => {
  return (
    <div className="form-check form-check-inline">
      <div className='d-flex flex-column'>
        <Label for={name} className='form-check-label mb-50'>
          {label}
        </Label>
        <div className='form-switch form-check-primary'>
          <Input
            type='switch'
            id={name}
            name={name}
            checked={checked}
            onChange={onChange}
          />
          <CustomLabel htmlFor={name} />
        </div>
      </div>
    </div>
  );
};

const CustomLabel = ({ htmlFor }) => {
    return (
        <Label className='form-check-label' htmlFor={htmlFor}>
            <span className='switch-icon-left'>
            <Check size={14} />
            </span>
            <span className='switch-icon-right'>
            <X size={14} />
            </span>
        </Label>
    )
}

export default SwitchInput;
