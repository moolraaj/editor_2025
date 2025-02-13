"use client";
import React from "react";
import { EditorElement } from "@/types";
import { StoreContext } from "@/store";
import { observer } from "mobx-react-lite";
import DragableView from "./DragableView";

export const TimeFrameView = observer((props: { element: EditorElement }) => {
  const store = React.useContext(StoreContext);
  const { element } = props;
  const disabled = element.type === "audio";
  const isSelected = store.selectedElement?.id === element.id;

  // Map each element type to an exact CSS color.
  const colorMap: Record<string, string> = {
    text:"rgba(255, 166, 0, 0.8)",
    audio:"rgba(238, 130, 238, 0.79)",
    svg:"rgba(135, 207, 235, 0.72)",
    video:"rgba(144, 238, 144, 0.73)",
    image:"rgba(255, 182, 193, 0.78)",
  };

  const layerColor = colorMap[element.type] || "gray";
  const disabledCursor = disabled ? "cursor-no-drop" : "cursor-ew-resize";

  return (
    <div
      onClick={() => store.setSelectedElement(element)}
      key={element.id}
      className="relative w-full h-[25px] my-2"
    >
   
      <DragableView
        className="z-10"
        value={element.timeFrame.start}
        total={store.maxTime}
        disabled={disabled}
        onChange={(value) =>
          store.updateEditorElementTimeFrame(element, { start: value })
        }
      >
        <div
          className={`bg-${layerColor} border-2 border-white-500 w-[8px] h-[25px] mt-[calc(25px/2)] translate-y-[-50%] transform translate-x-[-50%] ${disabledCursor}`}
        ></div>
      </DragableView>

      
      <DragableView
        className={disabled ? "cursor-no-drop" : "cursor-col-resize"}
        value={element.timeFrame.start}
        disabled={disabled}
        style={{
          width: `${
            ((element.timeFrame.end - element.timeFrame.start) / store.maxTime) * 100
          }%`,
        }}
        total={store.maxTime}
        onChange={(value) => {
          const { start, end } = element.timeFrame;
          store.updateEditorElementTimeFrame(element, {
            start: value,
            end: value + (end - start),
          });
        }}
      >
        <div
          style={{
            backgroundColor: layerColor,
            border: isSelected ? "2px solid #80808078" : "none",
       
          }}
          className="h-full w-full text-white text-xs min-w-[0px] px-2 py-1.25 leading-[25px]"
        >
          {element.name}
        </div>
      </DragableView>

      
      <DragableView
        className="z-10"
        disabled={disabled}
        value={element.timeFrame.end}
        total={store.maxTime}
        onChange={(value) =>
          store.updateEditorElementTimeFrame(element, { end: value })
        }
      >
        <div
          className={`bg-${layerColor} border-2 border-white-400 w-[8px] h-[25px] mt-[calc(25px/2)] translate-y-[-50%] transform translate-x-[-50%] ${disabledCursor}`}
        ></div>
      </DragableView>
    </div>
  );
});
