import React from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type InputTypes = {
	type: string,
	id: string,
	placeholder: string,
	onChange: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
	value: string,
	label?: string,
	disabled?: boolean,
	textarea?: boolean,
	register: UseFormRegisterReturn,
	error?: FieldError;
}

const Input = ({ type, id, onChange, placeholder, value, label, disabled, textarea, error, register }: InputTypes) => {
	return (
		<div className='w-full'>
			{label && <label className='label' htmlFor={id}>{label}: </label>}
			{
				!textarea ? <input {...register} onChange={onChange} value={value} className='input' type={type} disabled={disabled} placeholder={placeholder} id={id} name={id} /> : <textarea {...register} className='resize-none input h-36' rows={8} disabled={disabled} placeholder={placeholder} id={id} name={id} onChange={onChange} value={value} ></textarea>
			}
			{error && <span style={{ color: 'red' }}>{error.message}</span>}
		</div>
	)
}

export default Input