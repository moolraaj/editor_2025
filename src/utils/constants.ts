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
export const VIDEO_EXPORT_LENGTH=600


export function showLoading() {
  let loadingEl = document.createElement('div')
  loadingEl.id = 'loadingIndicator'
  loadingEl.innerText = 'Please wait, video is downloading...' 
  loadingEl.style.position = 'fixed'
  loadingEl.style.top = '50%'
  loadingEl.style.left = '50%'
  loadingEl.style.transform = 'translate(-50%, -50%)'
  loadingEl.style.backgroundColor = 'rgb(37 99 235)'
  loadingEl.style.color = '#fff'
  loadingEl.style.padding = '20px'
  loadingEl.style.borderRadius = '2px'
  loadingEl.style.zIndex = '10000'
  document.body.appendChild(loadingEl)
}

export function hideLoading() {
  const loadingEl = document.getElementById('loadingIndicator')
  if (loadingEl) {
    loadingEl.remove()
  }
}


 
 