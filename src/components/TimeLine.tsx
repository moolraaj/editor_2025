"use client";
import React from "react";
import { SeekPlayer } from "./timeline-related/SeekPlayer";
import { StoreContext } from "@/store";
import { observer } from "mobx-react-lite";
import { TimeFrameView } from "./timeline-related/TimeFrameView";

export const TimeLine = observer(() => {
  const store = React.useContext(StoreContext);
  const percentOfCurrentTime = (store.currentTimeInMs / store.maxTime) * 100;
  return (
    <div className="flex flex-col">
      <SeekPlayer />
      <div className="flex-1 relative ">
        {store.editorElements.map((element) => {
          return <TimeFrameView key={element.id} element={element} />;
        })}
        <div
          className="w-[2px] bg-red-400 absolute top-0 bottom-0 z-20"
          style={{
            left: `${percentOfCurrentTime}%`,
          }}
        ></div>


         



        {/* <div className="flex gap-2 p-2">
          <button
            onClick={() => store.deleteElement()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            delete
          </button>
          <button
            onClick={() => store.copyElement()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            copy
          </button>
          <button
            onClick={() => store.pasteElement()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            paste
          </button>
        

          
 

          
        </div> */}





      </div>
    </div>
  );
});
