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

  // Handle the start of the drag event
  const handleDragStart = (index: number) => {
    setDraggedElementIndex(index);  // Set the dragged index
  };

  // Handle the drag over event
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();  // Prevent the default behavior to allow dropping
    setHoveredElementIndex(index);  // Set the hovered index
  };

  // Handle the drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedElementIndex === null || hoveredElementIndex === null) return;

    // If dragging and hovering over different elements, swap them
    if (draggedElementIndex !== hoveredElementIndex) {
      store.moveElement(draggedElementIndex, hoveredElementIndex);  // Move element in store
      store.reorderFabricObjects(draggedElementIndex, hoveredElementIndex);  // Reorder on canvas
    }

    // Reset the dragged and hovered indices
    setDraggedElementIndex(null);
    setHoveredElementIndex(null);
  };

  return (
    <div className="flex flex-col">
      <SeekPlayer />
      <div
        className="flex-1 relative"
        ref={timelineRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}   
      >
        {store.editorElements.map((element, index) => (
          <TimeFrameView
            key={element.id}
            element={element}
            index={index}
            onDragStart={handleDragStart}   
            onDragOver={(e) => handleDragOver(e, index)}   
            isDragged={draggedElementIndex === index}   
            isHovered={hoveredElementIndex === index}  
          />
        ))}
        <div
          className="w-[2px] bg-[#f87171] absolute top-0 bottom-0 z-20 left-10"
          style={{ left: `${percentOfCurrentTime}%` }}
        ></div>
      </div>
    </div>
  );
});


