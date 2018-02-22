
let loop
let construct = () => {
  //Update the list of documents
  move.docsList = move.docs.childNodes
  /////// CANVAS
  let can = move.canvas
  let c = can.getContext("2d")

  let res = [move.bg.width,move.bg.scrollHeight]


  let row = 0
  let column = 0
  for(data of move.docsList) {
    if(data.tagName){
      //Poukadaj
      data.style.left = column*200 + "px"
      data.style.top = (row*400)+30 + "px"
      column++
      if(data.offsetLeft > move.bg.offsetWidth-400){
        row++
        column = 0
      }
    }
  }


  loop = setInterval(()=>{

    //Update Docs
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
    c.beginPath()
    if (move.docsList.length > 1) { //If actually there is something

      let prev = null
      let first = [[],[]]
      let vectors = []
      let vecList = []

      for(doc of docs){
        if(prev != null){
          //Lippy and Messy
          c.moveTo(prev.offsetLeft+prev.offsetWidth/2,prev.offsetTop+prev.offsetHeight/2)
          c.bezierCurveTo(prev.offsetLeft+prev.offsetWidth,prev.offsetTop+prev.offsetHeight/2,
            doc.offsetLeft-doc.offsetWidth,doc.offsetTop+doc.offsetHeight/2,
            doc.offsetLeft+doc.offsetWidth/2,doc.offsetTop+doc.offsetHeight/2)
            c.strokeStyle = 'orange'
            c.lineWidth = 3
            c.lineCap = 'round'
            c.stroke()
            c.filter = "blur(0px)"
            // TODO: Zrob coś z tym blurem :D
        }
        prev = doc


        //// CALCULATIONS:

        //First Element:
        first[0].push(Math.sqrt( Math.pow(doc.offsetTop,2) + Math.pow(doc.offsetLeft,2) ) )
        first[1].push(doc)
      }

        matrixDocs = []
        for (el of docs){
          matrixDocs.push({
            el,
            val : [el.offsetLeft, el.offsetTop]
          })
        }

        let xVec = matrixDocs.map(obj=>{
          return obj.val
        })

        let xEl = matrixDocs.map(obj=>{
          return obj.el
        })

        xVec = xVec.map(item=>{
          return Math.sqrt(
            Math.pow(item[0],2) +
            Math.pow(item[1],2)
          )
        })

        while(xEl.length > 0){
          let minimum = xVec.indexOf(Math.min(...xVec))
          vectors.push(xEl[minimum])
          xVec.splice(minimum,1)
          xEl.splice(minimum,1)
        }

        move.docsList = vectors
        // TODO: napraw mechanikę, bo jednak nie działa
    }


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
