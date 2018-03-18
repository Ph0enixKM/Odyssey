
//Setting up Tippy.js:
tippy('[title]:not(disabled)',{
  placement : "bottom",
  animation : "shift-toward" ,
  arrow : true,
  arrowType : "sharp",
  inertia : true
})
tippy('disabled',{
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
  btnBlocker : qs("disabled#move")[0],
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
    if (data !== undefined) {
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
    if (pages[i] === null){
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
    if (data != null) {
      data = data.replace(/(<([^>]+)>)/ig,"");
      return (data == null) ? data :
                ( data.length > 50 ) ? data.slice(0,50)+"..." : data.slice(0,50)
    }
  })
  let index = 1
  for (data of fv.pages) {
    //Create Elements
    let doc = document.createElement("article")
    doc.className = "doc"
    doc.setAttribute("index",index)
    // Tutaj ukryty jest zwnj w pustym stringu XD
    doc.innerHTML = `
      ${ (data == undefined || data.length <= 0 || data == "‌") ? "<emp>(pusta strona)</emp>" : data }
    <br><br>
      <h1 style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); ">
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
      if (this.sel) { // Select page
        // this.style.borderRadius = "0px"
        this.style.boxShadow = "none"
        fv.sel[this.id] = undefined
        this.sel = false
      } else {
        // this.style.borderRadius = "20px"
        this.style.boxShadow = "0 0 5px orange inset, 0 0 20px orange"
        this.id = fv.sel.length
        fv.sel.push(this)
        this.sel = true
      }


      let sortedSel = fv.sel.slice() //Clone Array
      sortedSel.sort((a,b)=>{ return a.index - b.index })
      filteredSel = sortedSel.filter(d =>{ if(d != undefined) return d})

      if (filteredSel.length > 0) {

        //Check whether you can open Chain Editor

        for (sel of sortedSel) {
          if(sel !== undefined){
            if(sortedSel[sortedSel.indexOf(sel)+1] !== undefined){ // If it is not the last item
              if(sel.index == sortedSel[sortedSel.indexOf(sel)+1].index -1){
                fv.btnBlocker.setAttribute("disabled",false)
              } else {
                fv.btnBlocker.setAttribute("disabled",true)
                break
              }

            } else {
              if (filteredSel.length == 1) {
                fv.btnBlocker.setAttribute("disabled",true)
                break
              }
            }
          }
        }
      } else {
        fv.btnBlocker.setAttribute("disabled",true)
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
  canvas : new Function(),
  docs : qs('#move-docs')[0],
  docsList : function() {return this.docs.childNodes},
  ok : qs("#move-tools #ok")[0],
  cancel : qs("#move-tools #cancel")[0],
  on : new Function(),
  off : new Function(),
  state : false,
  sel : undefined,
  move : setInterval(()=>{},1000),
  loc : {x: 0, y: 0},
  curves : [],
  loop : setInterval(()=>{},1000)
}

move.canvas = new PIXI.Application(0,0,{
  antialias : true,
  autoResize : true,
  transparent : true
})
move.bg.appendChild(move.canvas.view)
move.canvas.view.id = "move"
move.canvas.renderer.plugins.interaction.autoPreventDefault = false
move.canvas.view.style['touch-action'] = 'auto';


move.btn.addEventListener("click",()=>{ //When you click on BTN
  if (move.btn.getAttribute("disabled") == "false") {
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
move.cancel.addEventListener("mousedown", e =>{ //When you click on CANCEL
  e.stopPropagation()
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
move.ok.addEventListener("mousedown", e =>{ //When you click on OK
  e.stopPropagation()

  let sorted = fv.sel.slice()

  sorted = Array.from(sorted)
  sorted.filter(item =>{
    if(item.tagName) return item
  })

  sorted.sort((a,b)=>{
    return a.index - b.index
  })

  sorted = sorted.map(item =>{
    return item.index-1
  })

  pagesTemp = pages.slice()

  for (var i = sorted[0]; i < sorted[sorted.length-1]+1; i++)
    pages[i] = pagesTemp[Array.from(move.docsList)[i-sorted[0]].index-1]

  curPage = 0
  textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? "" : pages[curPage];

  move.bg.style.opacity = 0
  setTimeout(()=>{
    move.bg.style.display = "none"
    move.state = false //Turn off first this layer
    move.off()
  },150)
})

move.on = ()=>{
  fv.sel.sort((a,b)=>{ // Order all the selections
    return a.index - b.index
  })
  fv.bg.style.overflowY = "hidden"  //Unanabling scrolling previous layer
  for (data of fv.sel){
    if (data != undefined) {
      let doc = document.createElement("article")
      doc.className = "doc-move"
      doc.index = data.index
      doc.innerHTML = `
        ${ (data.childNodes[0].textContent == undefined ||
           data.childNodes[0].textContent.trim().length <= 1) ?
          "<emp>(pusta strona)</emp>" : data.childNodes[0].textContent }
      <br><br>
        <h1 style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);">
          ${doc.index}
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

      move.docs.appendChild(doc)
    }
  }
  document.body.addEventListener("mousemove", e =>{move.loc = {x: e.pageX, y: e.pageY-30}})
  move.move = setInterval(()=>{ //Move Interval Function
    if (move.sel != undefined) {
      move.sel.style.top = parseInt(move.sel.style.top) + (move.loc.y - move.sel.offsetTop)-(move.sel.offsetHeight/2-move.bg.scrollTop) + "px"
      move.sel.style.left = parseInt(move.sel.style.left) + (move.loc.x - move.sel.offsetLeft)-(move.sel.offsetWidth/2-move.bg.scrollLeft) + "px"
    }
  },16)
  moveModule.construct()
  move.canvas.renderer.resize(move.bg.offsetWidth,move.bg.offsetHeight)
}

move.off = ()=> {
  move.sel = undefined
  move.docs.innerHTML = ""
  clearInterval(move.move)
  clearInterval(move.loop)
  fv.bg.style.overflowY = "scroll"
  fv.sel.sort((a,b)=>{ // Order all the selections
    return a.index - b.index
  })
  for (c of move.curves) {
    c.clear()
  }
  fv.btnBlocker.setAttribute("disabled",true) //Turn off
  move.curves = []
  fv.off()
  fv.on()
}




//CHAPTER SECTION
let chapter = {
  btn : qs("#chapter-view")[0],
  bg : qs("#chapter-bg")[0],
  docs : qs("#chapter-docs")[0],
  tools : qs("#chapter-tools")[0],
  edit : qs("#chapter-tools #edit-chapter")[0],
  input : qs("#chapter-tools input")[0],
  trash : qs("#chapter-tools #trash")[0],
  on : new Function(),
  off : new Function(),
  state : false,
  sel : undefined,
  addF : new Function()
}

chapter.btn.addEventListener("click",()=>{
  chapter.bg.style.display = "inline-block"
  chapter.bg.style.opacity = 0
  setTimeout(()=>{
    chapter.bg.style.opacity = 1
    chapter.state = true
    chapter.on()
  },150);
})

chapter.bg.addEventListener("click",()=>{
  chapter.bg.style.opacity = 0
  setTimeout(()=>{
    chapter.bg.style.display = "none"
    chapter.state = false
    chapter.off()
    sbChapter.innerHTML = BASE_FILE.book[curChapter][0]
  },150)
})

chapter.tools.addEventListener("click", e => {
  e.stopPropagation()
})

//Change Name
chapter.input.addEventListener("change",()=>{
  BASE_FILE.book[chapter.sel][0] = chapter.input.value
  for (doc of chapter.docs.childNodes) {
    if (doc.tagName == "DIV" && doc.index == chapter.sel) {
      doc.childNodes[0].innerText = chapter.input.value
    }
  }
})

//Trash
chapter.trash.addEventListener("click",()=>{
  let sel = chapter.sel
  chapter.docs.childNodes[sel].style.transform = "translate(0,-100px)"
  chapter.docs.childNodes[sel].style.backgroundColor = "#930"
  chapter.docs.childNodes[sel].style.boxShadow = "-30px 30px 0px #930, 30px -30px 0px #930, -30px 30px 25px #930, 30px -30px 25px #930"
  chapter.docs.childNodes[sel].style.opacity = 0
  setTimeout(()=>{
    BASE_FILE.book.splice(sel, 1)


    chapter.off()
    chapter.on()

    if (curChapter == sel) {
      curChapter = 0
      pages = BASE_FILE.book[curChapter][1]

      curPage = 0;
      textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? "" : pages[curPage];
      pages[curPage] = textField.contentDocument.body.innerHTML;
      sbChapter.innerHTML = BASE_FILE.book[curChapter][0]
    }
  },300)
})

chapter.on = () => {
  let index = 0

  //If there is no chapter
  if (BASE_FILE.book.length == 0) {
      BASE_FILE.book[0] = ["Prolog", [] ]
  }

  for (let current of BASE_FILE.book) {
    let doc = document.createElement("div")
    doc.className = "doc-chapter"
    doc.innerHTML = `<p> ${current[0]} </p>`
    doc.state = false
    doc.index = index

    // HOVER
    doc.addEventListener("mouseover", e =>{
      let el = e.target //The element
      if (el.tagName == "DIV" && !el.state)
        el.style.boxShadow = "-10px -10px 0px #3a3a3a, 10px 10px 0px #333"
      else if (el.tagName == "P" && !el.parentNode.state){
        el.style.boxShadow = "none"
        el.parentNode.style.boxShadow = "-10px -10px 0px #3a3a3a, 10px 10px 0px #333"
      }
    })
    doc.addEventListener("mouseout", e =>{
      let el = e.target //The element
      if (el.tagName == "DIV" && !el.state)
        el.style.boxShadow = "-5px -5px 0px #2a2a2a, -10px -10px 0px #222"
      else if (el.tagName == "P" && !el.parentNode.state){
        el.style.boxShadow = "none"
        el.parentNode.style.boxShadow = "-5px -5px 0px #2a2a2a, -10px -10px 0px #222"
      }
    })

    // SELECT
    doc.addEventListener("contextmenu", e =>{

      e.stopPropagation()
      let el = e.target //The element



      // Trigger on
      if (el.tagName == "DIV" && !el.state) {
        el.style.boxShadow = "-10px 10px 0px #850, 10px -10px 0px #960, -10px 10px 25px #850, 10px -10px 25px #960"
        el.state = true

        if (typeof chapter.sel == "number") {
          let old = chapter.docs.childNodes[chapter.sel]
          old.style.boxShadow = "-5px -5px 0px #2a2a2a, -10px -10px 0px #222"
          old.state = false
        }

        chapter.sel = el.index
      }
      else if (el.tagName == "P" && !el.parentNode.state) {
        el.style.boxShadow = "none"
        el.parentNode.style.boxShadow = "-10px 10px 0px #850, 10px -10px 0px #960"
        el.parentNode.state = true

        if (typeof chapter.sel == "number") {
          let old = chapter.docs.childNodes[chapter.sel]
          old.style.boxShadow = "-5px -5px 0px #2a2a2a, -10px -10px 0px #222"
          old.state = false
        }

        chapter.sel = el.parentNode.index
      }
      //Trigger off
      else if (el.tagName == "DIV" && el.state) {
        el.style.boxShadow = "-10px -10px 0px #3a3a3a, 10px 10px 0px #333"
        el.state = false
        chapter.sel = undefined
      }
      else if (el.tagName == "P" && el.parentNode.state) {
        el.parentNode.style.boxShadow = "-10px -10px 0px #3a3a3a, 10px 10px 0px #333"
        el.parentNode.state = false
        chapter.sel = undefined
      }

      // Trigger Toolbar
      if (typeof chapter.sel == "number") {
        chapter.edit.style.transform = "translate(0,0)"
        if (el.tagName == "DIV")
          chapter.input.value = el.childNodes[0].innerText
        else
          chapter.input.value = el.innerText
      } else {
        chapter.edit.style.transform = "translate(0,-100px)"
      }



    })

    doc.addEventListener("click", e =>{
      this.el = (e.target.tagName == "DIV") ? e.target : e.target.parentNode
      this.el.style.transform = "scale(2)"
      this.el.style.opacity = 0

      curChapter = this.el.index
      pages = BASE_FILE.book[curChapter][1]

      curPage = 0;
      textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? "" : pages[curPage];
      pages[curPage] = textField.contentDocument.body.innerHTML;
      sbChapter.innerHTML = BASE_FILE.book[curChapter][0]

      fv.off()
      fv.on()
    })

    chapter.docs.appendChild(doc)
    index++
  }
  chapter.addF()

  if (chapter.docs.childNodes[0].nodeName == "#text") {
    chapter.docs.removeChild(chapter.docs.childNodes[0])
  }
}


chapter.addF = ()=> {
  let doc = document.createElement("div")
  doc.className = "doc-chapter-add"
  doc.innerHTML = `<p> + </p>`
  doc.addEventListener("click", e =>{
    e.stopPropagation()
    chapter.off()

    //Append new Element
    BASE_FILE.book.push(["Nowy Rozdział", [] ])

    chapter.on()
    let last = chapter.docs.childNodes[chapter.docs.childNodes.length-2]
    last.style.transition = "0ms"
    last.style.transform = "scale(0)"
    last.style.transition = "300ms"
    last.style.transitionTimingFunction = "cubic-bezier(0.2, 0.8, 0.5, 1.5)"
    setTimeout(()=>{
      last.style.transform = "scale(1)"
      setTimeout(()=>{
        last.style.transitionTimingFunction = "ease"
      },280)
    },10)
  })
  chapter.docs.appendChild(doc)
}


chapter.off = () => {
  chapter.docs.innerHTML = ""
  chapter.edit.style.transform = "translate(0,-100px)"
  chapter.sel = undefined
}

// TODO: move from chapter to chapter + box selections

// TODO: Tytułowanie stron
