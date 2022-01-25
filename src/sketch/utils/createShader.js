
const createShader = (gl, type, source) => {
	const shader = gl.createShader(type)
	gl.shaderSource(shader, source)
	gl.compileShader(shader)

	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		return shader
	}

	console.error('Error compiling shader', gl.getShaderInfoLog(shader))
	console.warn('Source:', source)
	gl.deleteShader(shader)
}

export default createShader