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





export const  reorderPantFrontDetails=(svgDoc: XMLDocument)=> {
  const parentGroup = svgDoc.getElementById("pant-front-details");
  if (!parentGroup) return;

  const pantP2 = svgDoc.getElementById("pant-p2_00000181791082222361633450000004750754936289298353_");
  const legFront = svgDoc.getElementById("leg-front");
  const shoeFront = svgDoc.getElementById("shoe-front");
  const pantP1 = svgDoc.getElementById("pant-p1_00000031922170619610477720000001442069305815377831_");

  if (pantP2 && legFront && shoeFront && pantP1) {
      parentGroup.appendChild(pantP2);
      parentGroup.appendChild(legFront);
      parentGroup.appendChild(shoeFront);
      parentGroup.appendChild(pantP1);
  }
}


export const  reorderPantBackDetails=(svgDoc: XMLDocument)=> {
  const parentGroup = svgDoc.getElementById("pant-back-details");
  if (!parentGroup) return;

  const pantP2 = svgDoc.getElementById("pant-p2");
  const legBack = svgDoc.getElementById("leg-back");
  const shoeBack = svgDoc.getElementById("shoe-back");
  const pantP1 = svgDoc.getElementById("pant-p1");

  if (pantP2 && legBack && shoeBack && pantP1) {
      parentGroup.appendChild(pantP2);
      parentGroup.appendChild(legBack);
      parentGroup.appendChild(shoeBack);
      parentGroup.appendChild(pantP1);
  }
}