
const HighlighHashtags = ({ text }: { text: String }) => {
	const highlight = () => {
		const hashtagRegex = /#[\w]+/g;

		const parts = text.split(hashtagRegex);
		const matches = text.match(hashtagRegex) || [];

		let result = [];
		for (let i = 0; i < parts.length; i++) {
			result.push(parts[i]);
			if (matches[i]) {
				result.push(<span key={i} className="text-accent">{matches[i]}</span>
				);
			}
		}
		return result;
	};
	return <> {highlight()}</>
}

export default HighlighHashtags