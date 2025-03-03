export const ALL_FONTS: string[] = [
  "Arial",
  "Verdana",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Comic Sans MS",
  "Impact",
  "Tahoma",
  "Trebuchet MS",
  "Lucida Console",
  "Garamond",
  "Palatino Linotype",
  "Book Antiqua",
  "Century Gothic",
  "Franklin Gothic Medium",
  "Gill Sans",
  "Brush Script MT",
  "Copperplate",
  "Segoe UI",
  "Calibri",
  "Cambria",
  "Didot",
  "Rockwell",
  "Arial Black",
];

export const WALKING:string='walking'
export const HANDSTAND:string='handstand'



 
export function setCustomOrigin(obj: fabric.Object, customOrigin: { x: number; y: number }) {
  const matrix = obj.calcTransformMatrix()
  const a = matrix[0], b = matrix[1], c = matrix[2], d = matrix[3], e = matrix[4], f = matrix[5];
  const absPivot = {
    x: a * customOrigin.x + c * customOrigin.y + e,
    y: b * customOrigin.x + d * customOrigin.y + f,
  };
  const bbox = obj.getBoundingRect();
  const offsetX = absPivot.x - bbox.left;
  const offsetY = absPivot.y - bbox.top;
  obj.set({
    left: (obj.left || 0) + offsetX,
    top: (obj.top || 0) + offsetY,
    originX: "left",
    originY: "top",
  });
  obj.setCoords();
}









 
 
 
 


 
 



 





