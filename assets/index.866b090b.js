import{G as f,S as u}from"./vendor.831b013d.js";const v=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerpolicy&&(o.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?o.credentials="include":r.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}};v();class l{constructor(){this.callbacks={}}on(t,n){typeof n=="function"&&(this.callbacks[t]=[...this.callbacks[t]||[],n])}emit(t,...n){(this.callbacks[t]||[]).forEach(i=>i(...n))}off(t,n){!this.callbacks[t]||(this.callbacks[t]=this.callbacks[t].filter(i=>i!==n))}}let c=null;class m extends l{constructor(){super();if(c)return c;c=this,this.setSizes(),window.addEventListener("resize",()=>{this.setSizes(),this.emit("resize")})}setSizes(){this.pixelRatio=Math.min(window.devicePixelRatio,2),this.width=window.innerWidth*this.pixelRatio,this.height=window.innerHeight*this.pixelRatio}}let g=null;class p{constructor(){if(g)return g;g=this,this.active=window.location.hash==="#debug",this.active&&(this.ui=new f,this.stats=new u,this.stats.showPanel(0),document.body.appendChild(this.stats.dom))}begin(){this.stats&&this.stats.begin()}end(){this.stats&&this.stats.end()}}class x extends l{constructor({autoStart:t=!0}={}){super();this.current=performance.now(),this.elapsed=0,this.delta=0,this.rafId=0,this.update=this.update.bind(this),t&&this.start()}start(){this.running||(this.running=!0,this.update())}stop(){!this.running||(window.cancelAnimationFrame(this.rafId),this.running=!1)}pause(){this.stop()}resume(){this.current=performance.now(),this.start()}update(){const t=performance.now();this.delta=(t-this.current)/1e3,this.current=t,this.elapsed+=this.delta,this.emit("update",this.elapsed,this.delta),this.rafId=window.requestAnimationFrame(this.update)}}const h=(e,t,n)=>{const i=e.createShader(t);if(e.shaderSource(i,n),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS))return i;console.error("Error compiling shader",e.getShaderInfoLog(i)),console.warn("Source:",n),e.deleteShader(i)},y=(e,t,n)=>{const i=e.createProgram();if(e.attachShader(i,t),e.attachShader(i,n),e.linkProgram(i),e.getProgramParameter(i,e.LINK_STATUS))return i;console.error("Error linking program:",e.getProgramInfoLog(i)),e.deleteProgram(i)};var z=`
attribute vec4 position;

void main() {
	gl_Position = position;
}`,P=`
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uScale;
uniform float uSpeed;

//  Classic Perlin 3D Noise 
//  by Stefan Gustavson
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec3 P) {
	vec3 Pi0 = floor(P); // Integer part for indexing
	vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
	Pi0 = mod(Pi0, 289.0);
	Pi1 = mod(Pi1, 289.0);
	vec3 Pf0 = fract(P); // Fractional part for interpolation
	vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
	vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
	vec4 iy = vec4(Pi0.yy, Pi1.yy);
	vec4 iz0 = Pi0.zzzz;
	vec4 iz1 = Pi1.zzzz;

	vec4 ixy = permute(permute(ix) + iy);
	vec4 ixy0 = permute(ixy + iz0);
	vec4 ixy1 = permute(ixy + iz1);

	vec4 gx0 = ixy0 / 7.0;
	vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
	gx0 = fract(gx0);
	vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
	vec4 sz0 = step(gz0, vec4(0.0));
	gx0 -= sz0 * (step(0.0, gx0) - 0.5);
	gy0 -= sz0 * (step(0.0, gy0) - 0.5);

	vec4 gx1 = ixy1 / 7.0;
	vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
	gx1 = fract(gx1);
	vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
	vec4 sz1 = step(gz1, vec4(0.0));
	gx1 -= sz1 * (step(0.0, gx1) - 0.5);
	gy1 -= sz1 * (step(0.0, gy1) - 0.5);

	vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
	vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
	vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
	vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
	vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
	vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
	vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
	vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

	vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
	g000 *= norm0.x;
	g010 *= norm0.y;
	g100 *= norm0.z;
	g110 *= norm0.w;
	vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
	g001 *= norm1.x;
	g011 *= norm1.y;
	g101 *= norm1.z;
	g111 *= norm1.w;

	float n000 = dot(g000, Pf0);
	float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
	float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
	float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
	float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
	float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
	float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
	float n111 = dot(g111, Pf1);

	vec3 fade_xyz = fade(Pf0);
	vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
	vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
	float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 

	return 2.2 * n_xyz;
}

float map(float value, float min1, float max1, float min2, float max2) {
	return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
	vec2 vUv = gl_FragCoord.xy / uResolution.xy;

	// vec2 displacedUv = vUv + cnoise( vec3(vUv * 0.5, uTime * 0.01) );

	vUv = vUv * uScale;

	vec3 color = vec3(0.0) + cnoise( vec3(vUv.x, uTime * uSpeed, vUv.y) );

	// color = clamp(color, vec3(0.0), vec3(1.0));
	color = vec3(
		map(color.r, 0.0, 1.0, uColor1.r, uColor2.r),
		map(color.g, 0.0, 1.0, uColor1.g, uColor2.g),
		map(color.b, 0.0, 1.0, uColor1.b, uColor2.b)
	);

	// gl_FragColor = vec4(displacedUv, 1.0, 1.0);
	gl_FragColor = vec4(color, 1.0);
}`;const d=e=>e.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i).slice(1).map(t=>parseInt(t,16)/255),s={color1:"#2B71CA",color2:"#B7F1F5",scale:1,speed:.2};class w{constructor({canvas:t}={}){this.canvas=t,this.viewport=new m,this.debug=new p,this.gl=this.canvas.getContext("webgl"),this.createPlane(),this.setProgram(),this.setSize(),this.setDebug(),this.viewport.on("resize",this.setSize.bind(this)),this.time=new x,this.time.on("update",this.update.bind(this))}setSize(){this.canvas.width=this.viewport.width,this.canvas.height=this.viewport.height,this.gl.viewport(0,0,this.gl.drawingBufferWidth,this.gl.drawingBufferHeight)}setProgram(){const t=h(this.gl,this.gl.VERTEX_SHADER,z),n=h(this.gl,this.gl.FRAGMENT_SHADER,P);this.program=y(this.gl,t,n);const i=this.gl.getAttribLocation(this.program,"position");this.gl.enableVertexAttribArray(i),this.gl.vertexAttribPointer(i,2,this.gl.FLOAT,!1,0,0),this.gl.useProgram(this.program)}createPlane(){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.gl.createBuffer()),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,-1,1,1]),this.gl.STATIC_DRAW)}update(t,n){this.debug.begin(),this.draw(t,n),this.debug.end()}setDebug(){!this.debug.active||(this.debug.ui.addColor(s,"color1"),this.debug.ui.addColor(s,"color2"),this.debug.ui.add(s,"scale",.01,2,.001),this.debug.ui.add(s,"speed",.01,4,.001))}draw(t){this.gl.uniform1f(this.gl.getUniformLocation(this.program,"uTime"),t),this.gl.uniform2fv(this.gl.getUniformLocation(this.program,"uResolution"),[this.viewport.width,this.viewport.height]),this.gl.uniform3fv(this.gl.getUniformLocation(this.program,"uColor1"),d(s.color1)),this.gl.uniform3fv(this.gl.getUniformLocation(this.program,"uColor2"),d(s.color2)),this.gl.uniform1f(this.gl.getUniformLocation(this.program,"uScale"),s.scale),this.gl.uniform1f(this.gl.getUniformLocation(this.program,"uSpeed"),s.speed),this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4)}}new w({canvas:document.getElementById("scene")});
