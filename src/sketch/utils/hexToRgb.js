
const hexToRgb = hex => hex
	.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
	.slice(1)
	.map(e => parseInt(e, 16) / 255)

export default hexToRgb