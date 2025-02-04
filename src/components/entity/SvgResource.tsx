"use client";
import React from "react";
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


    const assignAnimationType = (animationType: string) => {
        const selectedElement = store.selectedElement;

        if (!selectedElement || selectedElement.type !== "svg") {
            alert("Please select an SVG first!");
            return;
        }

        selectedElement.properties.animationType = animationType;
        store.assignAnimationToSelectedSvg(animationType);
    };


    return (
        <>

            <div className="rounded-lg overflow-hidden items-center bg-slate-800 m-[15px] flex flex-col relative">

                <div className="bg-[rgba(0,0,0,.25)] text-white py-1 absolute text-base top-2 right-2">
                    {resolution.w}x{resolution.h}
                </div>


                <button
                    className="hover:bg-[#00a0f5] bg-[rgba(0,0,0,.25)] rounded z-10 text-white font-bold py-1 absolute text-lg bottom-2 right-2"
                    onClick={() => store.addSvg(index)}
                >
                    <MdAdd size="25" />
                </button>


                <img
                    onLoad={() => {
                        setResolution({
                            w: ref.current?.naturalWidth ?? 0,
                            h: ref.current?.naturalHeight ?? 0,
                        });
                    }}
                    ref={ref}
                    className="max-h-[100px] max-w-[150px]"
                    src={svg}
                    height={200}
                    width={200}
                    id={`svg-${index}`}
                />



            </div>
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
