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
// import React, { useEffect, useState } from "react";
// import { StoreContext } from "@/store";
// import { observer } from "mobx-react-lite";
// import { MdAdd } from "react-icons/md";
// import { HANDSTAND, WALKING } from "@/utils/constants";

// type SvgResourceProps = {
//     svg: string;
//     index: number;
// };

// export const SvgResource = observer(({ svg, index }: SvgResourceProps) => {
//     const store = React.useContext(StoreContext);
//     const ref = React.useRef<HTMLImageElement>(null);
//     const [resolution, setResolution] = React.useState({ w: 0, h: 0 });
//     const [svgContent, setSvgContent] = React.useState<string | null>(null);

//     const reorganizeSvgContent = (content: string) => {
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(content, "image/svg+xml");
//         const svgElement = doc.querySelector("svg");
    
//         if (!svgElement) return content;
    
//         // Ensure we have <g> containers
//         let pantFrontDetails = doc.querySelector("g#pant-front-details");
//         let pantBackDetails = doc.querySelector("g#pant-back-details");
    
//         let legFront = doc.querySelector("g#leg-front");
//         let shoeFront = doc.querySelector("g#shoe-front");
    
//         let legBack = doc.querySelector("g#leg-back");
//         let shoeBack = doc.querySelector("g#shoe-back");
    
//         if (!pantFrontDetails) {
//             pantFrontDetails = doc.createElementNS("http://www.w3.org/2000/svg", "g");
//             pantFrontDetails.setAttribute("id", "pant-front-details");
//             svgElement.appendChild(pantFrontDetails);
//         }
    
//         if (!pantBackDetails) {
//             pantBackDetails = doc.createElementNS("http://www.w3.org/2000/svg", "g");
//             pantBackDetails.setAttribute("id", "pant-back-details");
//             svgElement.appendChild(pantBackDetails);
//         }
    
//         // Move elements inside the correct group
//         const moveElement = (element: Element | null, targetGroup: Element) => {
//             if (element) {
//                 targetGroup.appendChild(element);
//             } else {
//                 console.warn(`⚠️ Missing SVG part, skipping reorganization.`);
//             }
//         };
    
//         // Move front elements
//         moveElement(legFront, pantFrontDetails);
//         moveElement(shoeFront, pantFrontDetails);
    
//         // Move back elements
//         moveElement(legBack, pantBackDetails);
//         moveElement(shoeBack, pantBackDetails);
    
//         return new XMLSerializer().serializeToString(doc);
//     };
    
    

//     const assignAnimationType = (animationType: string) => {
//         if (!store.selectedElement || store.selectedElement.type !== "svg") {
//             alert("⚠️ Please select an SVG first!");
//             return;
//         }
//         console.log(`🆕 Assigning '${animationType}' animation to SVG ID:`, store.selectedElement.id);
//         store.assignAnimationToSelectedSvg(animationType);
//     };

//     const handleAddSvg = () => {
//         store.addSvg(index);
//     };

//     // Fetch and process the SVG content
//     useEffect(() => {
//         fetch(svg)
//             .then((response) => response.text())
//             .then((data) => {
//                 const reorganizedSvg = reorganizeSvgContent(data);
//                 setSvgContent(reorganizedSvg);
//             })
//             .catch((error) => console.error("Error loading SVG:", error));
//     }, [svg]);

//     return (
//         <>
//             <div className="rounded-lg overflow-hidden items-center bg-slate-800 m-[15px] flex flex-col relative">
//                 <div className="bg-[rgba(0,0,0,.25)] text-white py-1 absolute text-base top-2 right-2">
//                     {resolution.w}x{resolution.h}
//                 </div>

//                 <img
//                     ref={ref}
//                     className="max-h-[100px] max-w-[150px]"
//                     src={svg}
//                     height={200}
//                     width={200}
//                     id={`svg-${index}`}
//                     onLoad={() => {
//                         setResolution({
//                             w: ref.current?.naturalWidth ?? 0,
//                             h: ref.current?.naturalHeight ?? 0,
//                         });
//                     }}
//                 />

//                 <button
//                     className="hover:bg-[#00a0f5] bg-[rgba(0,0,0,.25)] rounded z-10 text-white font-bold py-1 absolute text-lg bottom-2 right-2"
//                     onClick={handleAddSvg}
//                 >
//                     <MdAdd size="25" />
//                 </button>
//             </div>

//             <div className="flex mt-2 space-x-2">
//                 <button
//                     className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded"
//                     onClick={() => assignAnimationType(WALKING)}
//                 >
//                     Walking
//                 </button>

//                 <button
//                     className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded"
//                     onClick={() => assignAnimationType(HANDSTAND)}
//                 >
//                     Handstand
//                 </button>
//             </div>

//             <div className="mt-5 p-4 bg-gray-900 rounded-lg flex justify-center">
//                 {svgContent ? (
//                     <div dangerouslySetInnerHTML={{ __html: svgContent }} className="svg-wrapper"/>
//                 ) : (
//                     <p className="text-white">Loading SVG...</p>
//                 )}
//             </div>
//         </>
//     );
// });
