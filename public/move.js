
let construct = () => {

  /////// CANVAS
  let can = move.canvas
  let c = can.getContext("2d")

  let res = [move.bg.width,move.bg.scrollHeight]


  let row = 0
  let column = 0
  for(data of move.docs.childNodes) {
    if(data.tagName){
      //Poukadaj
      data.style.left = column*200 + "px"
      data.style.top = row*300 + "px"
      column++
      if(data.offsetLeft > move.bg.offsetWidth){
        row++
        column = 0
      }
    }
  }


  setInterval(()=>{
    // Change canvas size
    can.height = move.bg.scrollHeight
    can.width = move.bg.scrollWidth

    res = [can.width,can.height]


    c.clearRect(0,0,can.width,can.height)
    c.beginPath()
    c.moveTo(move.docs.childNodes[1].offsetLeft,move.docs.childNodes[1].offsetTop)
    c.lineTo(move.docs.childNodes[2].offsetLeft,move.docs.childNodes[2].offsetTop)
    c.strokeStyle = 'orange'
    c.lineWidth = 4
    c.lineCap = 'round'
    c.stroke()
  },16)


}

let calculate = () => {
  console.log("Calculating...");
}

module.exports = {
  construct,
  calculate
}
