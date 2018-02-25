
let loop
let construct = () => {

  // PIXI.utils.sayHello();
  // const renderer = PIXI.autoDetectRenderer()

  //Update the list of documents
  move.docsList = move.docs.childNodes
  /////// CANVAS
  let can = move.canvas
  let c = can.getContext("2d")

  let res = [move.bg.width,move.bg.scrollHeight]


  let row = 0
  let offset = false
  for(data of move.docsList) {
    if(data.tagName){
      //Poukadaj
      data.style.left = move.bg.offsetWidth/2 - data.offsetWidth/2 - 100 + 200*(+offset) + "px"
      data.style.top = (row*400)+30 + "px"
      offset = !offset
      row++
    }
  }

  //Update Docs

  loop = setInterval(()=>{

    let docs
    docs = Array.from(move.docsList)
    docs = docs.filter(item =>{
      if(item.tagName) return item
    })

    // Change canvas size
    can.height = move.bg.scrollHeight
    can.width = move.bg.scrollWidth

    res = [can.width,can.height]

    c.filter = "blur(1px)"
    c.clearRect(0,0,can.width,can.height)
    if (move.docsList.length > 1) { //If actually there is something

      let prev = null
      let vectors = []
      let vecList = []

      for(doc of docs){
        if(prev != null){
          //Lippy and Messy
          c.moveTo(prev.offsetLeft+prev.offsetWidth/2,prev.offsetTop+prev.offsetHeight/2)
          c.bezierCurveTo(prev.offsetLeft+prev.offsetWidth/2,(prev.offsetTop+prev.offsetHeight+doc.offsetTop-doc.offsetHeight)/2+(prev.offsetHeight/2),
            doc.offsetLeft+doc.offsetWidth/2,(prev.offsetTop+prev.offsetHeight+doc.offsetTop-doc.offsetHeight)/2+(prev.offsetHeight/2),
            doc.offsetLeft+doc.offsetWidth/2,doc.offsetTop+doc.offsetHeight/2)
            c.strokeStyle = 'orange'
            c.lineWidth = 3
            c.lineCap = 'round'
            c.stroke()
            c.filter = "blur(0px)"

            // Bezier Curve Helpers
            // c.fillRect(prev.offsetLeft+prev.offsetWidth/2,(prev.offsetTop+prev.offsetHeight+doc.offsetTop-doc.offsetHeight)/2+(prev.offsetHeight/2),10,10)
            // c.fillRect(doc.offsetLeft+doc.offsetWidth/2,(prev.offsetTop+prev.offsetHeight+doc.offsetTop-doc.offsetHeight)/2+(prev.offsetHeight/2),10,10)
        }
        prev = doc
      }
      if (input.move.LMBRelease) { //If released
        input.move.LMBRelease = false

        matrixDocs = []
        for (el of docs){
          matrixDocs.push({
            el,
            val : el.offsetTop + (el.offsetHeight/2)
          })
        }

        let xVec = matrixDocs.map(obj=>{
          return obj.val
        })

        let xEl = matrixDocs.map(obj=>{
          return obj.el
        })

        while(xEl.length > 0){
          let minimum = xVec.indexOf(Math.min(...xVec))
          vectors.push(xEl[minimum])
          xVec.splice(minimum,1)
          xEl.splice(minimum,1)
        }

        move.docsList = vectors

        //Update Docs
        docs = Array.from(move.docsList)
        docs = docs.filter(item =>{
          if(item.tagName) return item
        })
      }

    } // End of if


  },16)


}

let calculate = () => {
  if (move.docsList.length > 1) { //If actually there is something
    let prev = null
    for(doc of docs){
      if(prev != null){
        p
      }
      prev = doc

    }
  }
}

module.exports = {
  construct,
  calculate,
  loop
}
