type TextButtonTypes = {
	text: string,
	className: string,
	type: 'button' | 'submit',
	onClick?: () => void
}

const TextButton = ({ text, className, type, onClick }: TextButtonTypes) => {
	return (
		<button onClick={onClick} className={className} type={type}>{text}</button>
	)
}

export default TextButton