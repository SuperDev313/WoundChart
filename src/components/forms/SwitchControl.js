import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Check, X } from 'react-feather'

import {
    Input, Label, Col
} from 'reactstrap'

const SwitchControl = ({ control, onValueChange, name, label, sm=5, justify=false }) => {

    return (
        <>
            <Col sm={sm} className='fw-bolder mb-1'>
                {label}
            </Col>
            <Col tag='dd' className='mb-1' style={justify?{
                display: 'flex', justifyContent: 'end'
            }: {}}>
                <div className='mt-50 mt-sm-0'>
                    <Controller
                        id={name}
                        name={name}
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                            <div className='form-switch'>
                                <Input type='switch' checked={!!value} onChange={onValueChange}   {...field} />
                            </div>
                        )}
                    />
                </div>
            </Col>
        </>

    )
}

export default SwitchControl