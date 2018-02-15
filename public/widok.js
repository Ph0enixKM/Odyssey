let qs = document.querySelectorAll.bind(document)

//Setting up Tippy.js:
tippy('[title]',{
  placement : "bottom",
  animation : "shift-toward" ,
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







// MERGE SECTION
let merge = {
  btn : qs("#merge-btn")[0],
  bg : qs("#merge-bg")[0],
  docs : qs('#merge-docs')[0],
  ok : qs("#merge-tools #ok")[0],
  cancel : qs("#merge-tools #cancel")[0],
  on : new Function(),
  off : new Function(),
  sel : undefined,
  move : setInterval(()=>{},1000),
  loc : {x: 0, y: 0}
}

merge.btn.addEventListener("click",()=>{ //When you click on BTN
  merge.bg.style.opacity = 0
  merge.bg.style.display = "inline-block"
  setTimeout(()=>{
    merge.bg.style.opacity = 1
    merge.on()
  },150)
})

merge.cancel.addEventListener("mousedown", e =>{ //When you click on BG
  e.stopPropagation()
  merge.bg.style.opacity = 0
  setTimeout(()=>{
    merge.bg.style.display = "none"
    merge.off()
  },150)
})
merge.bg.addEventListener("mouseup", e =>{ //When you click on BG
  e.stopPropagation()
  if(merge.sel != undefined) merge.sel.style.zIndex = "17"
  merge.sel = undefined
})
// merge.bg.addEventListener("mouseup", e => {
//   e.stopPropagation()
//
// })

merge.on = ()=>{
  //Unanabling scrolling previous layer
  fv.bg.style.overflowY = "hidden"


  let index = 1


  for (data of fv.sel){
    if (data != undefined) {
      let doc = document.createElement("article")
      doc.className = "doc-block"
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
      doc.loc = {x: doc.offsetLeft, y: doc.offsetTop}
      // TODO: Przenoszenie i zrobienie przedziałki :D
      doc.addEventListener("click", e => e.stopPropagation())
      doc.addEventListener("mousedown", e => {

        e.stopPropagation()
        this.el = doc
        merge.sel = (merge.sel != undefined) ? merge.sel : this.el

        this.el.style.top = (this.el.style.top == "") ? "0px" : this.el.style.top
        this.el.style.zIndex = "18"

      })



      doc.index = index
      merge.docs.appendChild(doc)
      index++
    }
  }
  document.body.addEventListener("mousemove", e =>{merge.loc = {x: e.pageX, y: e.pageY-30}})
  merge.move = setInterval(()=>{
    if (merge.sel != undefined) {
      console.log(merge.loc.y);
      merge.sel.style.top = parseInt(merge.sel.style.top) + (merge.loc.y - merge.sel.offsetTop)-(merge.sel.offsetHeight/2) + "px"
      // TODO: Napraw to (kartka się przesowa w zależności do offsetu, a jej style.top jest pozycją relatywną)
    }
  },16)
}

merge.off = ()=> {
  merge.sel = undefined
  merge.docs.innerHTML = ""
  clearInterval(merge.move)
  fv.bg.style.overflowY = "scroll"
}
