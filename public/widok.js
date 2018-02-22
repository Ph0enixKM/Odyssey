let qs = document.querySelectorAll.bind(document)

//Setting up Tippy.js:
tippy('[title]:not(disabled)',{
  placement : "bottom",
  animation : "shift-toward" ,
  arrow : true,
  arrowType : "sharp",
  inertia : true
})
tippy('disabled[title]',{
  placement : "left",
  animation : "shift-toward",
  arrow : true,
  arrowType : "sharp",
  inertia : true
})

// SHORTCUT SECTION
let shortcut = qs("#shortcut")[0]
let out;
let shortcutState = false;

let shortcutOn = (type)=>{
  shortcut.style.display = "inline-block"
  shortcut.innerText = type
  shortcut.style.opacity = 1
}

let shortcutOff = ()=>{
  shortcut.style.opacity = 0
  shortcut.style.display = "none"
}





// FULL VIEW SECTION
let fv = {
  btn : qs("#full-view")[0],
  bg : qs(".full-view")[0],
  docs : qs(".full-view .docs")[0],
  tools : qs(".fv-tools")[0],
  sel : [],
  pages : [],
  objects : [],
  on : new Function(),
  off : new Function(),
}

fv.btn.addEventListener("click",()=>{
  fv.bg.style.display = "inline-block"
  setTimeout(()=>{
    fv.bg.style.opacity = 1
    fv.on()
  },300)
})
fv.bg.addEventListener("click",()=>{
  fv.bg.style.opacity = 0
  setTimeout(()=>{
    fv.bg.style.display = "none"
    fv.off()
  },300)
})
fv.btn.addEventListener("mouseover",()=> shortcutOn("SHITF + V"))
fv.btn.addEventListener("mouseout",shortcutOff)
fv.tools.addEventListener("click",e => e.stopPropagation()) //Prevent toolbar from closing

fv.tools.childNodes[3].addEventListener("click",()=>{ //Delete Button
  for (data of fv.sel) {
    if (data != undefined) {
      data.style.transform = "translate(0,-50px)"
      data.style.opacity = 0
      data.style.backgroundColor = "#933"
      data.style.boxShadow = "0 0 5px red inset, 0 0 20px red"
      setTimeout(function(){
        this.data = data
        this.data.remove()
      },300)
      pages[data.index-1] = null
    }
  }
  setTimeout(()=>{

  for (let i = 0; i < pages.length; i++) {
    if (pages[i] == null){
      pages.splice(i,1)
      i = 0
    }
  }
  //Load Page
  curPage = 0
  textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? "" : pages[curPage];
  fv.off()
  fv.on()
},301)
})

//View Turned on
fv.on = ()=>{
  fv.pages = (pages.length == 0) ? [""] : pages
  fv.pages = fv.pages.map( data =>{
    return (data == null) ? data :
              ( data.length > 20 ) ? data.slice(0,20)+"..." : data.slice(0,20)
  })
  let index = 1
  for (data of fv.pages) {
    //Create Elements
    let doc = document.createElement("article")
    doc.className = "doc"
    doc.innerHTML = `
      ${ (data == undefined || data.length <= 1) ? "<emp>(pusta strona)</emp>" : data }
    <br><br>
      <h1 style="
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      ">
        ${index}
      </h1>
    `
    doc.index = index
    doc.sel = false //Selection attribute
    doc.addEventListener("click",function(){

      //Animate Doc
      this.style.transform = "scale(2)"
      //Load Page
      curPage = this.index -1
      textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? "" : pages[curPage];

    });
    doc.addEventListener("contextmenu",function(){ // Right mouse button
      if (this.sel) {
        // this.style.borderRadius = "0px"
        this.style.boxShadow = "none"
        this.sel = false
        fv.sel[this.id] = undefined
      } else {
        // this.style.borderRadius = "20px"
        this.style.boxShadow = "0 0 5px orange inset, 0 0 20px orange"
        this.sel = true
        fv.sel.push(this)
        this.id = fv.sel.length -1
        fv.sel.sort((a,b)=>{ // Order all the selections
          return a.index - b.index
        })
      }
    })

    fv.docs.appendChild(doc);
    index++

  }
}

//View Turned off
fv.off = ()=>{
  fv.docs.innerHTML = ""
  fv.sel = []
}







// MOVE SECTION
const moveModule = require("./move.js")

let move = {
  btn : qs("#move-btn")[0],
  bg : qs("#move-bg")[0],
  canvas : qs("canvas#move")[0],
  docs : qs('#move-docs')[0],
  docsList : function() {return this.docs.childNodes},
  ok : qs("#move-tools #ok")[0],
  cancel : qs("#move-tools #cancel")[0],
  on : new Function(),
  off : new Function(),
  state : false,
  sel : undefined,
  move : setInterval(()=>{},1000),
  loc : {x: 0, y: 0}
}


move.btn.addEventListener("click",()=>{ //When you click on BTN
  if (!move.btn.getAttribute("disabled")) {
    move.bg.style.opacity = 0
    move.bg.style.display = "inline-block"
    setTimeout(()=>{
      move.bg.style.opacity = 1
      move.state = true //Turn on first this layer
      move.on()
    },150)
  } else {

  }
})
move.cancel.addEventListener("mousedown", e =>{ //When you click on BG
  e.stopPropagation()
  clearInterval(moveModule.loop)
  move.bg.style.opacity = 0
  setTimeout(()=>{
    move.bg.style.display = "none"
    move.state = false //Turn off first this layer
    move.off()
  },150)
})
move.bg.addEventListener("mouseup", e =>{ //When you click on BG
  e.stopPropagation()
  if(move.sel != undefined) move.sel.style.zIndex = "17"
  move.sel = undefined
})


move.on = ()=>{
  fv.bg.style.overflowY = "hidden"  //Unanabling scrolling previous layer
  let index = 1
  for (data of fv.sel){
    if (data != undefined) {
      let doc = document.createElement("article")
      doc.className = "doc-move"
      doc.innerHTML = `
        ${ (data.childNodes[0].textContent == undefined ||
           data.childNodes[0].textContent.trim().length <= 1) ?
          "<emp>(pusta strona)</emp>" : data.childNodes[0].textContent }
      <br><br>
        <h1 style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        ">
          ${index}
        </h1>
      `
      doc.center = {
        x: doc.offsetTop + (doc.offsetHeight/2),
        y: doc.offsetLeft + (doc.offsetWidth/2)
      }

      doc.loc = {
        x: doc.offsetLeft,
        y: doc.offsetTop
      }

      doc.addEventListener("click", e => e.stopPropagation())
      doc.addEventListener("mousedown", e => {

        e.stopPropagation()
        this.el = doc
        move.sel = (move.sel != undefined) ? move.sel : this.el

        this.el.style.top = (this.el.style.top == "") ? "0px" : this.el.style.top
        this.el.style.left = (this.el.style.left == "") ? "0px" : this.el.style.left
        this.el.style.zIndex = "18"
      })

      doc.index = index
      move.docs.appendChild(doc)
      index++
    }
  }
  document.body.addEventListener("mousemove", e =>{move.loc = {x: e.pageX, y: e.pageY-30}})
  move.move = setInterval(()=>{ //Move Interval Function
    if (move.sel != undefined) {
      move.sel.style.top = parseInt(move.sel.style.top) + (move.loc.y - move.sel.offsetTop)-(move.sel.offsetHeight/2-move.bg.scrollTop) + "px"
      move.sel.style.left = parseInt(move.sel.style.left) + (move.loc.x - move.sel.offsetLeft)-(move.sel.offsetWidth/2) + "px"
    }
  },16)
  moveModule.construct()
}

move.off = ()=> {
  move.sel = undefined
  move.docs.innerHTML = ""
  clearInterval(move.move)
  fv.bg.style.overflowY = "scroll"
}
