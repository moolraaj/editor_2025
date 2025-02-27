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





 
 
 
export const mergePantBackPaths = (svgDoc: XMLDocument): Element | null => {
 
  const container = svgDoc.getElementById("pant-back-details");
  if (!container) {
    console.error("Error: 'pant-back-details' container not found.");
    return null;
  }

 
  const pantP1 = svgDoc.getElementById("pant-p1");
  if (!pantP1) {
    console.error("Error: 'pant-p1' element not found.");
    return null;
  }

 
  const legBackGroup = svgDoc.getElementById("leg-back");
  if (!legBackGroup) {
    console.error("Error: 'leg-back' group not found.");
    return null;
  }
  const legBackPath = legBackGroup.querySelector("path#path39");
  if (!legBackPath) {
    console.error("Error: 'path39' element not found in 'leg-back'.");
    return null;
  }

 
  const shoeBackGroup = svgDoc.getElementById("shoe-back");
  if (!shoeBackGroup) {
    console.error("Error: 'shoe-back' group not found.");
    return null;
  }
  const shoeBackPath = shoeBackGroup.querySelector("path#path45");
  if (!shoeBackPath) {
    console.error("Error: 'path45' element not found in 'shoe-back'.");
    return null;
  }

  // 3. Extract the "d" attributes.
  const dPant = pantP1.getAttribute("d") || "";
  const dLeg = legBackPath.getAttribute("d") || "";
  const dShoe = shoeBackPath.getAttribute("d") || "";

  if (!dPant || !dLeg || !dShoe) {
    console.error("Missing 'd' attribute on one or more required elements.", {
      dPant,
      dLeg,
      dShoe,
    });
    return null;
  }

  // 4. Merge the path data. (Assumes each subpath starts with a move command.)
  const mergedD = `${dPant} ${dLeg} ${dShoe}`.trim();
  console.log("Merged path data:", mergedD);

  // 5. Create a new <path> element with the merged data.
  const svgNS = "http://www.w3.org/2000/svg";
  const mergedPath = svgDoc.createElementNS(svgNS, "path");
  mergedPath.setAttribute("id", "merged_pant_back");
  // Use the fill from pantP1 or a default value.
  const fillPant = pantP1.getAttribute("fill") || "#020b16";
  mergedPath.setAttribute("fill", fillPant);
  mergedPath.setAttribute("d", mergedD);

  // 6. Remove the original elements so they are not duplicated.
  // Remove pant-p1.
  if (pantP1.parentNode) {
    pantP1.parentNode.removeChild(pantP1);
  }
  // Remove the entire leg-back group.
  if (legBackGroup.parentNode) {
    legBackGroup.parentNode.removeChild(legBackGroup);
  }
  // Remove the entire shoe-back group.
  if (shoeBackGroup.parentNode) {
    shoeBackGroup.parentNode.removeChild(shoeBackGroup);
  }

  // 7. Append the merged path to the container.
  container.appendChild(mergedPath);
  console.log("Merged path added to 'pant-back-details' and old elements removed.");

  return mergedPath;
};


 





