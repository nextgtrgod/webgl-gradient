import Viewport from './helpers/Viewport.js'
import Debug from './helpers/Debug.js'
import Time from './helpers/Time.js'
import createShader from './utils/createShader.js'
import createProgram from './utils/createProgram.js'
import vertexShader from './shaders/vertex.glsl?raw'
import fragmentShader from './shaders/fragment.glsl?raw'
import hexToRgb from './utils/hexToRgb.js'
import { options } from './config'

export default class Sketch {
	constructor({ canvas } = {}) {
		this.canvas = canvas
		this.viewport = new Viewport()
		this.debug = new Debug()

		this.gl = this.canvas.getContext('webgl')

		this.createPlane()
		this.setProgram()
		this.setSize()
		this.setDebug()

		this.viewport.on('resize', this.setSize.bind(this))

		this.time = new Time()
		this.time.on('update', this.update.bind(this))
	}

	setSize() {
		this.canvas.width = this.viewport.width
		this.canvas.height = this.viewport.height

		this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight)
	}

	setProgram() {
		const vertexShaderObject = createShader(this.gl, this.gl.VERTEX_SHADER, vertexShader)
		const fragmentShaderObject = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShader)

		this.program = createProgram(this.gl, vertexShaderObject, fragmentShaderObject)

		const vertexPositionAttribute = this.gl.getAttribLocation(this.program, 'position')
		this.gl.enableVertexAttribArray(vertexPositionAttribute)
		this.gl.vertexAttribPointer(vertexPositionAttribute, 2, this.gl.FLOAT, false, 0, 0)

		this.gl.useProgram(this.program)
	}

	createPlane() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer())
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array([
				-1, -1,
				-1,  1,
				 1, -1,
				 1,  1,
			]),
			this.gl.STATIC_DRAW
		)
	}

	update(elapsed, delta) {
		this.debug.begin()

		this.draw(elapsed, delta)

		this.debug.end()
	}

	setDebug() {
		if (!this.debug.active) return

		this.debug.ui.addColor(options, 'color1')
		this.debug.ui.addColor(options, 'color2')
		this.debug.ui.add(options, 'scale', 0.01, 2, 0.001)
		this.debug.ui.add(options, 'speed', 0.01, 4, 0.001)
	}

	draw(elapsed) {
		this.gl.uniform1f(this.gl.getUniformLocation(this.program, 'uTime'), elapsed)
		this.gl.uniform2fv(this.gl.getUniformLocation(this.program, 'uResolution'), [ this.viewport.width, this.viewport.height ])
		this.gl.uniform3fv(this.gl.getUniformLocation(this.program, 'uColor1'), hexToRgb(options.color1))
		this.gl.uniform3fv(this.gl.getUniformLocation(this.program, 'uColor2'), hexToRgb(options.color2))
		this.gl.uniform1f(this.gl.getUniformLocation(this.program, 'uScale'), options.scale)
		this.gl.uniform1f(this.gl.getUniformLocation(this.program, 'uSpeed'), options.speed)

		this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
	}
}