import React, { useState, useContext, useRef } from "react";
import { StoreContext } from "@/store";
import { observer } from "mobx-react-lite";
import { TimeFrameView } from "./timeline-related/TimeFrameView";
import { SeekPlayer } from "./timeline-related/SeekPlayer";

export const TimeLine = observer(() => {
  const store = useContext(StoreContext);
  const [draggedElementIndex, setDraggedElementIndex] = useState<number | null>(null);  
  const [hoveredElementIndex, setHoveredElementIndex] = useState<number | null>(null); 
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const percentOfCurrentTime = (store.currentTimeInMs / store.maxTime) * 100;

  const handleDragStart = (index: number) => {
    setDraggedElementIndex(index);  // Store dragged element index
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setHoveredElementIndex(index);  // Set hovered element index
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedElementIndex === null || hoveredElementIndex === null) return;

    if (draggedElementIndex !== hoveredElementIndex) {
      store.moveElement(draggedElementIndex, hoveredElementIndex);  // Move element in state
      store.reorderFabricObjects(draggedElementIndex, hoveredElementIndex);  // Reorder on the canvas
    }

    // Clear dragged and hovered element index after drop
    setDraggedElementIndex(null);  
    setHoveredElementIndex(null);  
  };

  // Handle drag end
  const handleDragEnd = (index: number) => {
    // Clear dragged element index once drag ends
    setDraggedElementIndex(null);
  };

  return (
    <div className="flex flex-col">
      <SeekPlayer />
      <div
        className="flex-1 relative"
        ref={timelineRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}  // Allow dragging over the timeline
      >
        {store.editorElements.map((element, index) => (
          <TimeFrameView
            key={element.id}
            element={element}
            index={index}
            onDragStart={handleDragStart}  
            onDragOver={(e) => handleDragOver(e, index)}  
            onDragEnd={handleDragEnd}  // Call handleDragEnd to clear dragging
            isDragged={draggedElementIndex === index}  
            isHovered={hoveredElementIndex === index}  
          />
        ))}
        <div
          className="w-[2px] bg-red-400 absolute top-0 bottom-0 z-20"
          style={{ left: `${percentOfCurrentTime}%` }}
        ></div>
      </div>
    </div>
  );
});
