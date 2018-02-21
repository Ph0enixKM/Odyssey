
let loop
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
      data.style.top = (row*300)+30 + "px"
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
    docs = Array.from(move.docs.childNodes)
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
    if (move.docs.childNodes.length > 1) { //If actually there is something

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

        }
        prev = doc


        //// CALCULATIONS:

        //First Element:
        first[0].push(Math.sqrt( Math.pow(doc.offsetTop,2) + Math.pow(doc.offsetLeft,2) ) )
        first[1].push(doc)
      }
        matrixDocs = docs
        // console.log(matrixDocs);
        let firstIndex = first[0].indexOf(Math.min(...first[0]))
        first = first[1][firstIndex] //Take first el closest
        vectors.push(first)
        matrixDocs.splice(firstIndex,1)
        console.log(matrixDocs);

        //Add the smallest
        for (d of matrixDocs) {

          //Create Vector
          for (doc of matrixDocs) {

            let last = Math.sqrt(
              Math.pow(vectors[vectors.length-1].offsetTop,2) +
              Math.pow(vectors[vectors.length-1].offsetLeft,2)
            )
            let cur = Math.sqrt(
              Math.pow(doc.offsetTop,2) +
              Math.pow(doc.offsetLeft,2)
            )
            let difference = Math.abs( last - cur )

            if (difference != 0)
              vecList.push(difference)
          }

          vectors.push(matrixDocs[vecList.indexOf(Math.min(...vecList))])
          matrixDocs.splice(vecList.indexOf(Math.min(...vecList)),1)
        }
        //Reindexing:
        console.log(vectors);
        move.docs.childNodes = vectors












      // TODO: Do that ^ only if the element is an article
    }
    c.strokeStyle = 'orange'
    c.lineWidth = 3
    c.lineCap = 'round'
    c.stroke()
    c.filter = "blur(0px)"
    // TODO: Zrob coś z tym blurem :D

  },16)


}

let calculate = () => {
  if (move.docs.childNodes.length > 1) { //If actually there is something
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
