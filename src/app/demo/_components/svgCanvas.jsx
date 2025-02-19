'use client';

import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import anime from "animejs";
import { walkingAnimations } from "@/utils/animations";
import { Canvg } from "canvg";
import "./style.css";

export default function SvgCanvasAnimation() {
  // Holds the SVG file's text content.
  const [svgContent, setSvgContent] = useState(null);
  // Controls whether we are in "animation mode".
  const [isPlaying, setIsPlaying] = useState(false);
  // Holds the extracted layers from the SVG.
  const [layers, setLayers] = useState([]);

  // Single canvas ref for both static and animated rendering.
  const canvasRef = useRef(null);
  // A hidden container to hold the SVG markup (and animate it).
  const hiddenSvgRef = useRef(null);

  // Configure dropzone to accept SVG files.
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/svg+xml",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      // Read the file as text (to get SVG markup).
      reader.onload = (e) => {
        const content = e.target.result;
        console.log("SVG File Content:", content);
        setSvgContent(content);

        // Extract layers from the SVG.
        try {
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(content, "image/svg+xml");
          // Select common SVG elements.
          const layerElements = svgDoc.querySelectorAll(
            "g, path, rect, circle, ellipse, line, polygon, polyline, text"
          );
          const extractedLayers = [];
          layerElements.forEach((el) => {
            extractedLayers.push({
              tag: el.tagName,
              id: el.getAttribute("id") || "(no id)",
            });
          });
          console.log("Extracted Layers:", extractedLayers);
          setLayers(extractedLayers);
        } catch (error) {
          console.error("Error extracting layers:", error);
        }
      };
      reader.readAsText(file);
    },
  });

  // Utility: Render the (current) SVG markup (from the hidden container)
  // into the single canvas using canvg.
  const renderSvgToCanvas = async () => {
    if (!hiddenSvgRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    // Clear the canvas.
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    // Use canvg to render the SVG.
    const v = await Canvg.fromString(ctx, hiddenSvgRef.current.innerHTML, {
      ignoreMouse: true,
      ignoreAnimation: true,
    });
    await v.render();
  };

  // -------------------------------
  // ADD TO CANVAS FUNCTIONALITY (static render)
  // -------------------------------
  const addSvgToCanvas = async () => {
    if (!svgContent) return;
    // For static rendering, we simply set the hidden container's content.
    if (hiddenSvgRef.current) {
      hiddenSvgRef.current.innerHTML = svgContent;
    }
    await renderSvgToCanvas();
  };

  // -------------------------------
  // PLAY ANIMATION FUNCTIONALITY (using Anime.js and re-rendering via canvg)
  // -------------------------------
  const playAnimation = () => {
    if (!svgContent || !hiddenSvgRef.current) return;

    // Put the SVG into the hidden container.
    hiddenSvgRef.current.innerHTML = svgContent;
    setIsPlaying(true);

    // Get the root SVG element (assumes a single root <svg> element).
    const svgElement = hiddenSvgRef.current.querySelector("svg");
    if (!svgElement) {
      console.error("No <svg> element found in the uploaded content.");
      return;
    }

    // For each part defined in walkingAnimations, animate via Anime.js.
    Object.entries(walkingAnimations).forEach(([partId, animationData]) => {
      const targetElement = svgElement.querySelector(`#${partId}`);
      if (!targetElement) {
        console.warn(`⚠️ Missing SVG part: ${partId}, skipping animation.`);
        return;
      }
      console.log(`✅ Found SVG part: ${partId}, applying animation`);

      const keys = animationData.keys;
      // Build keyframes for Anime.js.
      const keyframes = [
        { val: keys[0].v, duration: keys[0].t },
        { val: keys[1].v, duration: keys[1].t - keys[0].t },
        { val: keys[2].v, duration: keys[2].t - keys[1].t },
        { val: keys[3].v, duration: keys[3].t - keys[2].t },
      ];

      // Animate a dummy property 'val' and update the element's transform.
      anime({
        targets: { val: keys[0].v },
        keyframes: keyframes,
        easing: "linear",
        duration: 3000,
        loop: true,
        update: (anim) => {
          const currentVal = anim.animations[0].currentValue;
          // Update the transform attribute (here, we apply a vertical translation).
          targetElement.setAttribute("transform", `translate(0, ${currentVal})`);
          // Re-render the updated SVG to the canvas.
          renderSvgToCanvas();
        }
      });
    });

    // Animate the entire SVG element moving horizontally.
    anime({
      targets: svgElement,
      translateX: [
        { value: 300, duration: 10000, easing: "linear" }, // Move forward
        { value: 300, duration: 500, easing: "linear" },   // Pause
        { value: 0, duration: 0 }                           // Reset instantly
      ],
      loop: true,
      update: () => {
        renderSvgToCanvas();
      }
    });
  };

  return (
    <div className="flex_demo_structure">
      <div className="left_section">
        {/* Upload Button */}
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Upload SVG</p>
        </div>

        {svgContent && (
          <>
            {/* Add to Canvas Button */}
            <button onClick={addSvgToCanvas}>Add</button>
            {/* Play Animation Button */}
            <button onClick={playAnimation}>Play</button>
          </>
        )}
      </div>

      {/* Single canvas for both static and animated rendering */}
      <div className="canvas_wrapper">
        <canvas ref={canvasRef} width={800} height={500} className="border"></canvas>
      </div>

      {/* Hidden SVG container used for animation rendering.
          This element is not visible. */}
      <div
        ref={hiddenSvgRef}
        style={{ display: "none" }}
      />

      {/* All layers displayed here */}
      <div className="all_layesr">
        {layers && layers.length > 0 ? (
          <ul>
            {layers.map((layer, index) => (
              <li key={index}>
                <span>
                  {layer.tag} {layer.id}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>not found</p>
        )}
      </div>
    </div>
  );
}
