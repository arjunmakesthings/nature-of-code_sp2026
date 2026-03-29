shaders run on the gpu, and are incredibly fast (because operations run parallelly on multiple threads unlike the cpu). 

---

typically, shaders work like so: 

- a mesh is defined, which is a bunch of ordered vertices, on the cpu. 
- these are passed to the vertex-shader which determines where each vertex should go on the screen. 
- for each pixel, a fragment shader is run (which determines the color of the pixel). 
- color is interpolated between vertices. 

---

however, a fragment-shader can also be thought of as simply a placeholder for any kind of data for all pixels on the screen. 

so, by using this loop-hole, we can use a fragment shader to compute via the gpu (which makes it far faster than running the same computation on the cpu). 

---

a fragment shader outputs `gl_FragColor` which is a four-dimensional vector containing `r,g,b,a` values. values are normalized — between 0 & 1 — as is often the case with shaders. 

by setting up a system of two off-screen buffers, we run two 'computing' shaders where one becomes the input source for the other to compare against. 

this is called ping-pong buffering.

since `gl_FragColor` is a four-dimensional vector, we can compare at-least 4 things. 

---

this is a p5.js sketch template that sets up the ping-pong buffering. 

acknowledgements: elias (elie) zananiri for his [shader time class](https://shadertime.betamovement.net/lecture/post-processing/). 