"use client";
import React, { useEffect, useState } from "react";
import { StoreContext } from "@/store";
import { observer } from "mobx-react-lite";
import { MdAdd } from "react-icons/md";
import { HANDSTAND, WALKING } from "@/utils/constants";

type SvgResourceProps = {
    svg: string;
    index: number;
};

export const SvgResource = observer(({ svg, index }: SvgResourceProps) => {
    const store = React.useContext(StoreContext);
    const ref = React.useRef<HTMLImageElement>(null);
    const [resolution, setResolution] = React.useState({ w: 0, h: 0 });
    const [svgContent, setSvgContent] = React.useState<string | null>(null);

    const assignAnimationType = (animationType: string) => {
        if (!store.selectedElement || store.selectedElement.type !== "svg") {
            alert("⚠️ Please select an SVG first!");
            return;
        }

        console.log(`🆕 Assigning '${animationType}' animation to SVG ID:`, store.selectedElement.id);
        store.assignAnimationToSelectedSvg(animationType);
    };
    
    const handleAddSvg = () => {        
        store.addSvg(index);
    };

    // Fetch the raw SVG content
    useEffect(() => {
        fetch(svg)
            .then((response) => response.text())
            .then((data) => setSvgContent(data))
            .catch((error) => console.error("Error loading SVG:", error));
    }, [svg]);

    return (
        <>
            {/* Upper SVG Preview Section */}
            <div className="rounded-lg overflow-hidden items-center bg-slate-800 m-[15px] flex flex-col relative">
                <div className="bg-[rgba(0,0,0,.25)] text-white py-1 absolute text-base top-2 right-2">
                    {resolution.w}x{resolution.h}
                </div>

                <img
                    ref={ref}
                    className="max-h-[100px] max-w-[150px]"
                    src={svg}
                    height={200}
                    width={200}
                    id={`svg-${index}`}
                    onLoad={() => {
                        setResolution({
                            w: ref.current?.naturalWidth ?? 0,
                            h: ref.current?.naturalHeight ?? 0,
                        });
                    }}
                />

                <button
                    className="hover:bg-[#00a0f5] bg-[rgba(0,0,0,.25)] rounded z-10 text-white font-bold py-1 absolute text-lg bottom-2 right-2"
                    onClick={handleAddSvg}
                >
                    <MdAdd size="25" />
                </button>
            </div>

            {/* Animation Buttons */}
            <div className="flex mt-2 space-x-2">
                <button
                    className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded"
                    onClick={() => assignAnimationType(WALKING)}
                >
                    Walking
                </button>

                <button
                    className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded"
                    onClick={() => assignAnimationType(HANDSTAND)}
                >
                    Handstand
                </button>
            </div>

          
             
        </>
    );
});


// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { observer } from "mobx-react-lite";
// import { MdGif, MdPlayArrow, MdPause } from "react-icons/md";
// import gifshot from "gifshot";
// import anime from "animejs";
// import { parseGIF, decompressFrames } from "gifuct-js"; // Extract frames
// import { walkingAnimations } from "@/utils/animations"; // Import animation data
// import { StoreContext } from "@/store";

// type SvgResourceProps = {
//     svg: string;
//     index: number;
// };

// export const SvgResource = observer(({ svg, index }: SvgResourceProps) => {
//      const store = React.useContext(StoreContext);
//     const svgContainerRef = useRef<HTMLDivElement>(null);
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const [gifUrl, setGifUrl] = useState<string | null>(null);
//     const [gifFrames, setGifFrames] = useState<string[]>([]); // Extracted frames
//     const [currentFrame, setCurrentFrame] = useState<number>(0);
//     const [isPlaying, setIsPlaying] = useState<boolean>(false);
//     const intervalRef = useRef<NodeJS.Timeout | null>(null);
//     const [svgLoaded, setSvgLoaded] = useState<boolean>(false);
//     const [dimensions, setDimensions] = useState({ width: 250, height: 400 });

//     // ✅ Decode Base64 SVG
//     const decodeBase64Svg = (base64String: string) => {
//         try {
//             return atob(base64String.split(",")[1]); // Decode
//         } catch (error) {
//             console.error("❌ Error decoding Base64 SVG:", error);
//             return null;
//         }
//     };

//     // ✅ Load and Inject SVG
//     useEffect(() => {
//         if (svgContainerRef.current && svg) {
//             let decodedSvg = svg.startsWith("data:image/svg+xml;base64,")
//                 ? decodeBase64Svg(svg)
//                 : svg;

//             if (decodedSvg) {
//                 svgContainerRef.current.innerHTML = decodedSvg;
//             } else {
//                 console.error("❌ Failed to decode base64 SVG!");
//                 return;
//             }

//             setTimeout(() => {
//                 const svgEl = svgContainerRef.current?.querySelector("svg");
//                 if (svgEl) {
//                     const bbox = svgEl.getBoundingClientRect();
//                     setDimensions({ width: bbox.width || 250, height: bbox.height || 400 });
//                     setSvgLoaded(true);
//                 }
//             }, 100);
//         }
//     }, [svg]);

//     // ✅ Apply Animation to SVG
//     const applyAnimation = () => {
//         if (!svgContainerRef.current) return;
//         const svgElements = svgContainerRef.current.querySelectorAll("g, path, rect, circle");

//         let animationApplied = false;
//         svgElements.forEach((element) => {
//             const partId = element.getAttribute("id");
//             if (partId && walkingAnimations[partId]) {
//                 anime({
//                     targets: element,
//                     rotate: walkingAnimations[partId].keys.map(k => k.v),
//                     duration: 3000,
//                     easing: "linear",
//                     loop: true
//                 });
//                 animationApplied = true;
//             }
//         });

//         if (!animationApplied) {
//             alert("⚠️ No matching animation found for this SVG.");
//         }
//     };

//     // ✅ Capture Frames for GIF
//     const captureFramesForGif = (callback: (frames: string[]) => void) => {
//         if (!canvasRef.current || !svgContainerRef.current) return;

//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");

//         canvas.width = dimensions.width;
//         canvas.height = dimensions.height;

//         let frameIndex = 0;
//         const totalFrames = 30;
//         const frameDelay = 50;
//         const capturedFrames: string[] = [];

//         const animateFrame = () => {
//             if (!ctx || !svgContainerRef.current) return;
//             ctx.clearRect(0, 0, canvas.width, canvas.height);

//             // Convert SVG to Image for Canvas Drawing
//             const svgBlob = new Blob([svgContainerRef.current.innerHTML], { type: "image/svg+xml" });
//             const svgUrl = URL.createObjectURL(svgBlob);
//             const img = new Image();
//             img.src = svgUrl;

//             img.onload = () => {
//                 ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//                 capturedFrames.push(canvas.toDataURL("image/png"));

//                 frameIndex++;
//                 if (frameIndex < totalFrames) {
//                     setTimeout(() => animateFrame(), frameDelay);
//                 } else {
//                     callback(capturedFrames);
//                 }

//                 URL.revokeObjectURL(svgUrl);
//             };

//             img.onerror = () => {
//                 console.error("⚠️ Error loading SVG as an image!");
//             };
//         };

//         animateFrame();
//     };

//     // ✅ Convert to GIF and Extract Frames
//     const convertSvgToGif = () => {
//         captureFramesForGif((capturedFrames) => {
//             gifshot.createGIF(
//                 {
//                     images: capturedFrames,
//                     gifWidth: dimensions.width,
//                     gifHeight: dimensions.height,
//                     interval: 0.1,
//                     numFrames: capturedFrames.length,
//                     loop: true
//                 },
//                 function (obj) {
//                     if (!obj.error) {
//                         setGifUrl(obj.image);
//                         extractGifFrames(obj.image);
//                         store.addGifToCanvas(obj.image);
//                     }
//                 }
//             );
//         });
//     };

//     // ✅ Extract Frames from GIF
//     const extractGifFrames = async (gifSrc: string) => {
//         const response = await fetch(gifSrc);
//         const arrayBuffer = await response.arrayBuffer();
//         const gif = parseGIF(arrayBuffer);
//         const frameData = decompressFrames(gif, true);

//         const extractedFrames: string[] = [];
//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");

//         frameData.forEach((frame) => {
//             const { dims, patch } = frame;
//             canvas.width = dims.width;
//             canvas.height = dims.height;

//             // Draw frame
//             const imageData = new ImageData(new Uint8ClampedArray(patch), dims.width, dims.height);
//             ctx?.putImageData(imageData, 0, 0);
//             extractedFrames.push(canvas.toDataURL("image/png"));
//         });

//         setGifFrames(extractedFrames);
//     };

//     // ✅ Toggle Play/Pause for GIF animation using frames
//     const toggleGifAnimation = () => {
//         if (isPlaying) {
//             clearInterval(intervalRef.current as NodeJS.Timeout);
//             setIsPlaying(false);
//         } else {
//             intervalRef.current = setInterval(() => {
//                 setCurrentFrame((prevFrame) => {
//                     const nextFrame = (prevFrame + 1) % gifFrames.length;
//                     setGifUrl(gifFrames[nextFrame]); // Update the displayed GIF frame
//                     return nextFrame;
//                 });
//             }, 100); // Adjust speed here
//             setIsPlaying(true);
//         }
//     };


//     return (
//         <div className="flex flex-col items-center">
//             {/* 🎨 SVG Container */}
//             <div
//                 ref={svgContainerRef}
//                 className="border border-gray-500 flex items-center justify-center bg-white"
//                 style={{
//                     width: dimensions.width,
//                     height: dimensions.height,
//                     overflow: "hidden",
//                 }}
//             />

//             {/* 🎨 Hidden Canvas for GIF Conversion */}
//             <canvas ref={canvasRef} className="hidden"></canvas>

//             {/* 🎬 Apply Animation & Convert to GIF */}
//             <button
//                 className="px-4 py-2 mt-4 bg-green-500 hover:bg-green-600 text-white rounded-md"
//                 onClick={() => {
//                     if (!svgLoaded) {
//                         alert("⚠️ Please wait for the SVG to load.");
//                         return;
//                     }
//                     applyAnimation();
//                     convertSvgToGif();
//                 }}
//             >
//                 Apply Animation & Convert to GIF <MdGif size="20" />
//             </button>

//             {/* 🎥 GIF Preview */}
//             {gifUrl && (
//                 <div className="border border-gray-500 mt-4">
//                     <img src={gifUrl} alt="Converted GIF" className="w-full h-full object-contain" />
//                 </div>
//             )}

//             {/* 🎨 GIF Layers Display */}
//             {gifFrames.length > 0 && (
//                 <div className="mt-4 grid grid-cols-5 gap-2">
//                     {gifFrames.map((frame, index) => (
//                         <img
//                             key={index}
//                             src={frame}
//                             alt={`Frame ${index}`}
//                             className="w-16 h-16 border cursor-pointer"
//                             onClick={() => setGifUrl(frame)}
//                         />
//                     ))}
//                 </div>
//             )}

//             {gifFrames.length > 0 && (
//                 <button
//                     className="px-4 py-2 mt-4 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
//                     onClick={toggleGifAnimation}
//                 >
//                     {isPlaying ? "Pause GIF" : "Play GIF"} {isPlaying ? <MdPause size="20" /> : <MdPlayArrow size="20" />}
//                 </button>
//             )}
//         </div>
//     );
// });
