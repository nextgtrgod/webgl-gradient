import EventEmitter from './EventEmitter.js'

let instance = null

export default class Viewport extends EventEmitter {
	constructor() {
		super()

		if (instance) return instance
		instance = this

		this.setSizes()

		window.addEventListener('resize', () => {
			this.setSizes()
			this.emit('resize')
		})
	}

	setSizes() {
		this.pixelRatio = Math.min(window.devicePixelRatio, 2)
		this.width = window.innerWidth * this.pixelRatio
		this.height = window.innerHeight * this.pixelRatio
	}
}