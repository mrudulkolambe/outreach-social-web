import { twMerge } from 'tailwind-merge'

type ButtonTypes = {
	text: string,
	className: string,
	type: 'button' | 'submit',
	loading: boolean,
	disabled: boolean
}


const Button = ({ text, type, loading, disabled, className }: ButtonTypes) => {
	return (
		<button type={type} disabled={disabled || loading} className={twMerge('button', className)}>{text}</button>
	)
}

export default Button