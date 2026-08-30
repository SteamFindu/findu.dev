import React, { useEffect, useRef } from "react";
import { Curtains, Plane } from "curtainsjs";

const vertexShader = `
precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord;
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform vec2 uMouse;        // normalized mouse [0..1]
uniform float uGlobalTime;  // seconds
uniform float uStartTime;   // ripple start time in seconds (set when mouse moved)

void main() {
    vec2 uv = vTextureCoord;

    // elapsed time since last mouse move
    float t = uGlobalTime - uStartTime;
    // distance from mouse
    float d = distance(uv, uMouse);

    // create a traveling ripple: the ripple radius increases over time
    float radius = t * 0.7; // speed
    float wave = 0.0;
    // only evaluate ripple in a band around the radius
    float band = 0.02 + 0.01 * sin(t * 6.0);
    float diff = d - radius;
    float mask = smoothstep(-band, 0.0, -abs(diff)) ; // narrow ring
    // wave shape
    wave = sin((d - radius) * 80.0 - t * 6.0) * 0.02 * exp(-d * 8.0);

    // also a small follow effect while moving (when t ~ 0)
    float follow = 0.02 * exp(-d * 12.0) * exp(-t * 6.0);

    // combine offsets
    vec2 offset = normalize(uv - uMouse) * (wave + follow);

    vec2 displacedUV = uv + offset;

    // sample texture
    vec4 color = texture2D(uSampler, displacedUV);

    gl_FragColor = color;
}
`;

export default function BackgroundRipples() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const curtainsRef = useRef<Curtains | null>(null);
  const planeRef = useRef<Plane | null>(null);
  const startTimeRef = useRef<number>(-1000);

  useEffect(() => {
    const container = document.querySelector(".bgdiv") as HTMLElement | null;
    if (!container) {
      console.warn("BackgroundRipples: .bgdiv element not found.");
      return;
    }

    // create a DOM wrapper for curtains (full size)
    const curtainsWrapper = document.createElement("div");
    curtainsWrapper.className = "curtains-wrapper";
    curtainsWrapper.style.position = "absolute";
    curtainsWrapper.style.top = "0";
    curtainsWrapper.style.left = "0";
    curtainsWrapper.style.width = "100%";
    curtainsWrapper.style.height = "100%";
    curtainsWrapper.style.zIndex = "0"; // keep in background
    container.appendChild(curtainsWrapper);
    containerRef.current = curtainsWrapper;

    // create a texture source:
    // prefer an <img class="bg-texture"> inside the bgdiv if present,
    // otherwise attempt to read computed background-image url
    let textureImg: HTMLImageElement | null = container.querySelector(".bg-texture");
    if (!textureImg) {
      const bg = getComputedStyle(container).backgroundImage;
      const urlMatch = bg && bg.match(`url\\(["']?(.+?)["']?\\)`);
        textureImg = document.createElement("img");
        textureImg.className = "bg-texture";
        textureImg.src = urlMatch[1];
        textureImg.style.display = "none";
        container.appendChild(textureImg);
    }

    // create DOM plane element that curtains will use
    const planeEl = document.createElement("div");
    planeEl.className = "plane";
    planeEl.style.width = "100%";
    planeEl.style.height = "100%";
    planeEl.style.position = "absolute";
    planeEl.style.top = "0";
    planeEl.style.left = "0";
    planeEl.style.pointerEvents = "none"; // don't block interactions
    planeEl.style.zIndex = "0";
    planeEl.innerHTML = `<img class="plane__texture" src="${textureImg.src}" style="display:none" />`;
    curtainsWrapper.appendChild(planeEl);

    // init curtains
    const curtains = new Curtains({
      container: curtainsWrapper,
      watchScroll: false,
      autoRender: false,
    });
    curtainsRef.current = curtains;

    const params = {
      vertexShader,
      fragmentShader,
      textures: {
        sampler: {
          name: "uSampler",
          src: textureImg.src,
        },
      },
      widthSegments: 10,
      heightSegments: 10,
      uniforms: {
        uMouse: { name: "uMouse", type: "2f", value: [0.5, 0.5] },
        uGlobalTime: { name: "uGlobalTime", type: "1f", value: 0.0 },
        uStartTime: { name: "uStartTime", type: "1f", value: -1000.0 },
      },
    };

    const plane = new Plane(curtains, planeEl, params);
    planeRef.current = plane;

    // animation loop to update uGlobalTime
    let raf = 0;
    const animate = (now: number) => {
      if (!plane) return;
      const seconds = now * 0.001;
      if (plane.uniforms && plane.uniforms.uGlobalTime) {
        plane.uniforms.uGlobalTime.value = seconds;
      }
      curtains.needRender();
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    // mouse handling: set uMouse and reset start time to spawn a ripple
    const onMove = (e: MouseEvent) => {
      const rect = curtainsWrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height; // invert Y for shader
      if (plane.uniforms && plane.uniforms.uMouse) {
        plane.uniforms.uMouse.value = [x, y];
      }
      // set start time to current second, so shader knows t = global - start
      const nowSec = performance.now() * 0.001;
      startTimeRef.current = nowSec;
      if (plane.uniforms && plane.uniforms.uStartTime) {
        plane.uniforms.uStartTime.value = nowSec;
      }
    };

    // when the mouse leaves, let the ripple run out (don't update start time)
    curtainsWrapper.addEventListener("mousemove", onMove);

    // cleanup
    return () => {
      curtainsWrapper.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      try {
        plane && plane && plane.destroy();
      } catch (e) {}
      try {
        curtains && curtains && curtains.dispose();
      } catch (e) {}
      if (curtainsWrapper.parentElement === container) {
        container.removeChild(curtainsWrapper);
      }
    };
  }, []);

  return null;
}
