import React, { useState, useEffect, useRef } from "react";
import { EditorElement } from "@/types";
import { StoreContext } from "@/store";
import { observer } from "mobx-react-lite";
import DragableView from "./DragableView";
import { colorMap } from "@/utils/animations";
import { FaCopy, FaPaste, FaTrash, FaEllipsisV, FaCut } from "react-icons/fa";
import { MdCallSplit } from 'react-icons/md';


export const TimeFrameView = observer((props: {
  element: EditorElement,
  onDragStart: (index: number) => void,
  onDragOver: (e: React.DragEvent, index: number) => void,
  isDragged: boolean,
  isHovered: boolean,
  index: number
}) => {
  const store = React.useContext(StoreContext);
  const { element, onDragStart, onDragOver, isDragged, isHovered, index } = props;
  const disabled = element.type === "audio";
  const [isShow, setIsShow] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const layerColor = colorMap[element.type] || "gray";
  const disabledCursor = disabled ? "cursor-no-drop" : "cursor-ew-resize";


  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
    
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

   
      const key = event.key.toLowerCase();

      
      if (isCtrlOrCmd) {
        switch (key) {
          case "x": 
            event.preventDefault();
            if (store.selectedElement) {
              store.cutElement();
            } else {
              console.warn("⚠️ No layer selected to cut.");
            }
            return;

          case "c": 
            event.preventDefault();
            if (store.selectedElement) {
              store.copyElement();
            } else {
              console.warn("⚠️ No layer selected to copy.");
            }
            return;

          case "v": 
            event.preventDefault();
            store.pasteElement();
            return;

          default:
            break;
        }
      }
     
      else {
        
        if (event.key === "Delete") {
          event.preventDefault();
          if (store.selectedElement) {
            store.deleteElement();
          } else {
            console.warn("⚠️ No layer selected to delete.");
          }
        }
      }
    }
 
    window.addEventListener("keydown", handleKeyDown);

 
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [store]);

  const isSelected = store.selectedElement?.id === element.id;





  return (
    <>
    
    
    <div
      onClick={() => store.setSelectedElement(element)}
      key={element.id}
      className={`
        relative w-full h-[25px] my-2 flex items-center 
        
      `}
      id="timeline_l_w"
      draggable
      onDragStart={() => onDragStart(index)}   
      onDragOver={(e) => onDragOver(e, index)}   
      style={{ cursor: isDragged ? "grabbing" : "grab" }}
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
          width: `${((element.timeFrame.end - element.timeFrame.start) / store.maxTime) * 100}%`,
          backgroundColor: layerColor,
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
        <div className={`h-full w-full text-white text-xs min-w-[0px] px-2 py-1.25 leading-[25px] text-center ${isSelected ? "layer_active" : ""}`}>
          {element.name} 
          <div className="button_l_w">
            <button onClick={() => setIsShow(!isShow)}>
              <FaEllipsisV />
            </button>
          </div>

          {isShow && (
            <div ref={dropdownRef} className="layers_w" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => { store.cutElement(); setIsShow(false); }}>
                <FaCut className="text-blue-500" />
                Ctrl + x
              </button>
              <button onClick={() => { store.copyElement(); setIsShow(false); }}>
                <FaCopy className="text-blue-500" />
                Ctrl + c
              </button>
              <button onClick={() => { store.pasteElement(); setIsShow(false); }}>
                <FaPaste className="text-blue-500" />
                Ctrl +v
              </button>
              <button onClick={() => { store.deleteElement(); setIsShow(false); }}>
                <FaTrash className="text-red-500" />
                Delete
              </button>
              <button onClick={() => { store.splitElement(); setIsShow(false); }}>
                <FaCut className="text-blue-500" />
                Split
              </button>
            </div>
          )}
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
    </>
  );
});
