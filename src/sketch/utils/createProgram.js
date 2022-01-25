
const createProgram = (gl, vertexShader, fragmentShader) => {
	const program = gl.createProgram()
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)

	if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
		return program
	}

	console.error('Error linking program:', gl.getProgramInfoLog(program))
	gl.deleteProgram(program)
}

export default createProgram