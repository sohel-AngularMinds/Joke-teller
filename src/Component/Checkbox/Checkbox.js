import React from 'react';
import { Field } from 'formik';

function Checkbox(props) {
    const { name,label,className1,className2,className3,value } = props;

    return (
        <React.Fragment key={name}>
            <div className={className1}>
                <Field
                    id={label}
                    type="checkbox"
                    name={name}
                    className={className2}
                    checked={value}
                />
                <label htmlFor={label} className={className3}>
                    {label}
                </label>
            </div>
        </React.Fragment>
    );
}

export default Checkbox;
