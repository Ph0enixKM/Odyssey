//Global Variables:
var fonts, fontSizes, iStyle, iStyleVal, textField, textHtml,
str, rest, pages, left, right, space, bodyContent, logo,
menu, scrolling, lastFont;

//Require Electron
const { remote } = require('electron');

var sbPages, sbWords, sbLetters;

var keys = {
  enter: false,
  backsp: false,
  up: false,
  down: false,
  left: false,
  right: false,
  shift: false,
  v: false
};
var prev = false;
var position = 0;
var curPage = 0;
var autosave = true;

var prevCheck = false, restOf="";



function command(com){
  textField.contentDocument.execCommand(com,false,null);
}

function font(){
  this.fontVal = fonts.options[fonts.selectedIndex].value
  textField.contentDocument.execCommand("fontname",false,this.fontVal)
}

function fontSize(){
  this.fontSizeVal = fontSizes.options[fontSizes.selectedIndex].value
  textField.contentDocument.execCommand("fontSize",false,parseInt(this.fontSizeVal))
}

function turnLeft() {
  if (textField.style.opacity == 1) { //Has the page turned on?
    if(curPage <= 0){
      textField.style.transform = "translate(-30px)"
      setTimeout(function () {
        textField.style.transform = "translate(20px)"
        setTimeout(function () {
          textField.style.transform = "translate(-10px)"
          setTimeout(function () {
            textField.style.transform = "translate(0px)"
          },100);
        },100);
      },100);
      curPage = 0;
    } else {


    // console.log("left");

    //Animation
    textField.style.transform = "translate(150%) scale(0.5)";
    textField.style.opacity = 0
    setTimeout(function () {
      textField.style.transform = "translate(-150%) scale(0.5)";

      //Logic Section

      curPage--;
      textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? "" : pages[curPage];


      //Logic Section

      setTimeout(function () {
        textField.style.transform = "translate(0) scale(1)";
        textField.style.opacity = 1;
      },150)
    },150);
    }
  }
}

function turnRight(){
  if (textField.style.opacity == 1) { //Has the page turned on?

    // console.log("right");

    //Animation
    textField.style.transform = "translate(-150%) scale(0.5)";
    textField.style.opacity = 0
    setTimeout(function () {
      textField.style.transform = "translate(150%) scale(0.5)";

      //Logic Section

      curPage++;
      textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? "" : pages[curPage];

      //Logic Section

      setTimeout(function () {
        textField.style.transform = "translate(0) scale(1)";
        textField.style.opacity = 1;
      },150)
    },150);
  }
}

function autosaveF(e){
    setTimeout(function () {

      pages[curPage] = textField.contentDocument.body.innerHTML;
      console.log("autosave executed");

    },10)
}




//Presets & initialisation
document.addEventListener("DOMContentLoaded",function(){

//Vars
fonts = document.getElementsByTagName('select')[0]
fontSizes = document.getElementsByTagName('select')[1]
textField = document.getElementsByTagName('iframe')[0]

bodyContent = document.getElementsByClassName('iframe')[0]

menu = document.getElementsByClassName('menu')[0]
ctxMenu = document.getElementsByClassName('menu')[1]

ctxLogo = document.getElementById('ctx-menu')
logo = document.getElementById('logo');

//Left/right buttons
left = document.getElementsByClassName('move left')[0]
right = document.getElementsByClassName('move right')[0]


left.addEventListener("click",turnLeft);
right.addEventListener("click",turnRight);


with(document){
  sbPages = getElementsByClassName("pages")[0]
  sbWords = getElementsByClassName("words")[0]
  sbLetters = getElementsByClassName("letters")[0]
}



var caretLoc = { x: 0, y: 0 };
var caret = textField.contentDocument.createElement("div");
caret.className = "caret";
var cs = caret.style;

space = 19;


with (document.getElementsByClassName('iframe')[0]){

  addEventListener("scroll",()=>{
    cs.transition = "0ms";

    clearTimeout(scrolling);

    scrolling = setTimeout(()=>{
      cs.transition = "200ms";
    },66);

  },false)

}

//Caret Key Mapping
function mapKeys(dock){
  Object.keys(keys).map(function(key,index){
    keys[key] = false;
  });
  keys[dock] = true;
}
textField.contentWindow.addEventListener("keydown",function(e){
  switch (e.keyCode) {
    case 13: //Enter
      mapKeys("enter");
      break;
    case 8: //Backsp
      mapKeys("backsp");
      break;
    case 38: //Up
      mapKeys("up");
      break;
    case 40: //Down
      mapKeys("down");
      break;
    case 37: //Left
      mapKeys("left");
      break;
    case 39: //Right
      mapKeys("right");
      break;
    case 123:
      var win = remote.getCurrentWindow()
      win.toggleDevTools()
  }
});



  with(textField.contentDocument.getElementsByTagName('body')[0]){
    addEventListener("focus",function () {
      cs.transform = "translate(0,0) scale(1)";
    })
    addEventListener("focusout",function () {
      cs.transform = "translate(-10px,0) scale(0)";
    })
  }




//ManuBar
function menuBar() {

    var cl = document.getElementsByClassName.bind(document);
    var win = remote.getCurrentWindow();

    cl("minimize")[0].addEventListener("click",()=>{
      console.log(win);
      win.minimize();
    });
    cl("maximize")[0].addEventListener("click",()=>{
      if (win.isMaximized()) win.unmaximize();
      else win.maximize();
    });
    cl("exit")[0].addEventListener("click",()=>{
      win.close();
      if (process.platform != "darwin") {
        app.quit();
      }
    })

}

function fadeAll() {
  var all = document.getElementById('all');
  setTimeout(()=>{
    all.style.opacity = 0;
    setTimeout(()=>{
      all.style.display = "none";
    },500)
  },(Math.random()*1000)+500)
}


function addStyle() {

  var iStyle = textField.contentDocument.createElement("style");
  textField.contentDocument.head.appendChild(iStyle);
  var iStyleVal = document.createTextNode(`
    *::selection{
      /*
      background-color: rgba(0,0,0,0.3);
      color: #eee;
      */
      background-color: rgba(255,150,0,0.3);
      color: #eee;
    }
    *:not(font):not(b):not(u):not(i):not(div):not(span){
      color: #ccc;
      font-family: Lato;
    }
    @page {
      size: auto;
    }
    html{
      overflow: hidden;
      word-wrap: break-word;
      height: 100%;
    }

    @font-face{
      font-family: Lato;
      src: url("arts/lato.ttf");
    }

    `);
  iStyle.appendChild(iStyleVal);
}


function delayAnchors() {
  var anchors = document.getElementsByTagName('a');
  for (let i of anchors){
    i.addEventListener("click",()=>{
      all.style.display = "inline-block"
      setTimeout(()=>{
        all.style.opacity = 1
        setTimeout(()=>{
          window.location = i.href
        },500)
      },100)
    })
  }
}

function menuF() {
  logo.addEventListener("click",()=>{ //Open menu
    menu.style.display = "inline-block"
    setTimeout(()=>{
      menu.style.opacity = 1
    },100)
  })
  menu.addEventListener("click",()=>{ //Close Menu
    menu.style.opacity = 0
    setTimeout(()=>{
      menu.style.display = "none"
    },300)
  })

  ctxLogo.addEventListener("click",()=>{ //Open Context Menu
    ctxMenu.style.display = "inline-block"
    setTimeout(()=>{
      ctxMenu.style.opacity = 1
    },100)
  })

  ctxMenu.addEventListener("click",()=>{ //Close Context Menu
    ctxMenu.style.opacity = 0
    setTimeout(()=>{
      ctxMenu.style.display = "none"
    },300)
  })

  window.addEventListener("keydown",(e)=>{ //Escape shortcut
    if (e.keyCode == 27) {

      menu.style.opacity = 0
      setTimeout(()=>{
        menu.style.display = "none"
      },300)

      ctxMenu.style.opacity = 0
      setTimeout(()=>{
        ctxMenu.style.display = "none"
      },300)

      if(!move.state){  // Merge comes from another file
        document.querySelector('.full-view').style.opacity = 0
        setTimeout(()=>{
          document.querySelector('.full-view').style.display = "none"
          fv.off()
        },300)
      } else {
        document.querySelector('#move-bg').style.opacity = 0
        setTimeout(()=>{
          document.querySelector('#move-bg').style.display = "none"
          move.state = false
          move.off()
        },150)
      }
    }
  })

  ctxMenu.childNodes[1].addEventListener("click",()=>{
    document.querySelector('#ctx-menu').innerText = "Narzędzia"
    document.querySelector('#view').style.display = "none"
    document.querySelector('#tools').style.display = "inline-block"
  })

  ctxMenu.childNodes[3].addEventListener("click",()=>{
    document.querySelector('#ctx-menu').innerText = "Widok"
    document.querySelector('#view').style.display = "inline-block"
    document.querySelector('#tools').style.display = "none"
  })
}

//Initial Commands
init();
function init(){
  textField.contentDocument.designMode = "On";

  //Toolbar bindings:
  (function(){
    var id = document.getElementById.bind(document);
    var tag = document.getElementsByTagName.bind(document);

    id("bold").addEventListener("click", ()=> command("bold"))
    id("italic").addEventListener("click",()=> command("italic"))
    id("underline").addEventListener("click",()=> command("underline"))
    tag("select")[0].addEventListener("change",()=> font())
    tag("select")[1].addEventListener("change",()=> fontSize())
    id("justify-left").addEventListener("click",()=> command("justifyLeft"))
    id("justify-center").addEventListener("click",()=> command("justifyCenter"))
    id("justify-right").addEventListener("click",()=> command("justifyRight"))
    id("justify-full").addEventListener("click",()=> command("justifyFull"))


  })();

  fadeAll()
  menuBar()
  delayAnchors()
  menuF()

    addStyle();

    pages = [];

    with (textField.contentDocument.body.style){

      color = "#ccc";
      fontFamily = "Lato";
      margin = 0;
      caretColor = "transparent";
      width = "100%";
      wordWrap = "break-word";
      height = "auto";

    }


    textField.style.position = "relative";
    textField.style.opacity = 1;

    textField.contentDocument.body.innerHTML = "&zwnj;"
    textField.contentDocument.body.style.display = "inline-block";



    rest = "";

    //On change of body
    textField.contentWindow.addEventListener("keydown",autosaveF);

    //TextField's text
    var textHtml = textField.contentDocument.body.innerHTML;

    caretInit();
}

//Caret Design
function caretInit(){
  cs.width = 3+"px";
  cs.height = 20+"px";
  cs.background = "rgba(200,200,200,0.5)";
  cs.transition = "200ms";
  cs.position = "absolute";
  cs.display = "inline-block";

  document.body.appendChild(caret);
}

function caretUpdate(){
  cs.top = caretLoc.y + textField.offsetTop + 70 - bodyContent.scrollTop;
  cs.left = caretLoc.x + textField.offsetLeft + 70;
  // console.log(window.pageYOffset);
  cs.height = space;
}



function negateKeys(){
  Object.keys(keys).map(function(key,index){
    keys[key] = false;
  })
}

function bodyBugFix(){
  //Body bug fix
  var bodies = textField.contentDocument.getElementsByTagName("body");
  var whileIter = bodies.length-1; //While loop iterator
  if (bodies.length > 1) {
    content = "";
    for (var i = 1; i < bodies.length; i++) {
      content += bodies[i].innerHTML;
    }

    bodies[0].innerHTML += content;

    while (bodies.length > 1) {
      bodies[whileIter].remove();
      whileIter--;
    }
    with(bodies[0]){
      addEventListener("focus",function () {
        cs.transform = "translate(0,0) scale(1)";
      })
      addEventListener("focusout",function () {
        cs.transform = "translate(-10px,0) scale(0)";
      })
    }
    addStyle();
  }
}

function updateSidebar(){
  sbPages.innerHTML = curPage + 1;

  sbWords.innerHTML = (textField.contentDocument.body.textContent.length == 1) ? 0 :
    textField.contentDocument.body.textContent.split(" ").length;

  sbLetters.innerHTML = textField.contentDocument.body.textContent.length -1;
}

function firstLetterFix() {
  //Debugger - if nothing is being placed
  //Just to show the wae to WYSIWYG editor

  if (textField.contentDocument.body.textContent == "") {
    with(textField.contentDocument){
      var bdy = getElementsByTagName('body')[0]
      bdy.innerHTML = "&zwnj;"
      var range = createRange();
      range.setStart(body,1);
      range.setEnd(body,1);
      var selection = textField.contentWindow.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}

function headChecker() {
  with(textField.contentDocument){
    //Check if there are any heads inside
    if (getElementsByTagName('head').length == 0) {
      var head = createElement('head');
      var html = getElementsByTagName('html')[0];
      html.innerHTML = '<head></head>';
      addStyle();
      caretInit();
      with (textField.contentDocument.body.style){

        color = "#ccc";
        fontFamily = "Lato";
        margin = 0;
        caretColor = "transparent";
        width = "100%";
        wordWrap = "break-word";

      }
      with(textField.contentDocument.body){
        addEventListener("focus",function () {
          cs.transform = "translate(0,0) scale(1)";
        })
        addEventListener("focusout",function () {
          cs.transform = "translate(-10px,0) scale(0)";
        })
      }

    }
  }
}

function checkForFloatingDivs () {
  let els = textField.contentDocument.documentElement.childNodes;
  let body = textField.contentDocument.body;
  // console.log(els);
  for (i of els){
    if (i.tagName == "DIV") {
      body.prepend(i);
    }
  }
}

window.addEventListener("click",e=>{
  cs.transform = "translate(10px,0) scale(0)"
})


textField.contentDocument.documentElement.addEventListener("click",e=>{
  e.stopPropagation()
  cs.transform = "translate(0,0) scale(1)"
})


setInterval(function () {

  bodyBugFix();

  caretLoc.x = getSelectionCoords(textField).x;
  caretLoc.y = getSelectionCoords(textField).y;
  caretSize();
  stickIntoBorders(cs.top);
  restrictions();


  firstLetterFix();

  cs.top = (parseInt(cs.top) < 280  - bodyContent.scrollTop) ? 280 - bodyContent.scrollTop : cs.top - bodyContent.scrollTop;

  checkForFloatingDivs();

  updateSidebar();
  headChecker();
  caretUpdate();
}, 1);

function getSelectionCoordsPosition(elem) {
  switch (elem) {
    case "left":
      position = 0;
      break;
    case "center":
      position = 1;
      break;
    case "right":
      position = 2;
      break;
    case "justify":
      position = 0;
      break;
    default: //And this won't occur
      position = 0;
      break;
  }
}


function getSelectionCoords(iframe) {
    win = iframe;
    var doc = win.contentDocument;
    var sel = doc.selection, range, rects, rect;
    var x = 0, y = 0;
     if (doc.getSelection) {
        sel = doc.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0).cloneRange();
            if (range.getClientRects) {
                range.collapse(true);
                rects = range.getClientRects();

                if (rects.length > 0) {
                    rect = rects[0];

                    y = rect.top;
                    x = rect.left;
                    prev = true;
                    try{
                      if(sel.anchorNode.parentElement.parentElement.tagName == "SPAN")
                        getSelectionCoordsPosition(sel.anchorNode.parentElement.parentElement.parentElement.style.textAlign);
                      else if (sel.anchorNode.parentElement.parentElement.tagName == "DIV")
                        getSelectionCoordsPosition(sel.anchorNode.parentElement.parentElement.style.textAlign);
                    } catch(e){
                        position = 0
                    }
                }
                else{

                  //It's a value of CSS property (without CSS type)
                  var csNum = cs.top.replace(cs.top.match(/px/),"");


                  if(keys.enter || keys.down || keys.right){
                    negateKeys();
                    return {
                      x : (position == 0)? 0 :
                          (position == 1)?
                          (+textField.contentDocument.body.offsetWidth/2) :
                          textField.contentDocument.body.offsetWidth,
                      y: cs.top = parseInt(csNum) + space}
                  }
                  else if (keys.left || keys.up) {
                    negateKeys();
                    return{
                      x : (position == 0)? 0 :
                        (position == 1)?
                        (+textField.contentDocument.body.offsetWidth/2) :
                        textField.contentDocument.body.offsetWidth,
                      y: cs.top = parseInt(csNum) - space}
                  }
                  else if (keys.backsp && !prev) {
                    negateKeys();
                    return{
                      x : (position == 0)? 0 :
                          (position == 1)?
                          (+textField.contentDocument.body.offsetWidth/2) :
                          textField.contentDocument.body.offsetWidth,
                      y: cs.top = parseInt(csNum) - space}
                  }
                  else if (keys.backsp && prev) {
                    prev = false;
                    negateKeys();

                    return{
                      x : (position == 0)? 0 :
                          (position == 1)?
                          (+textField.contentDocument.body.offsetWidth/2) :
                          textField.contentDocument.body.offsetWidth,
                      y: cs.top = parseInt(csNum)}
                  }
                  else {
                    return{x: undefined, y: undefined}
                  }
                }
            }
        }
    }
    return { x: x, y: y };
}
function stickIntoBorders(location){
  // TODO:jak nie ma heada, to ma być wraz ze stylem!

  if (parseInt(cs.top) > textField.contentDocument.body.offsetHeight + textField.offsetTop + 70 - 18) {
    cs.top = (parseInt(cs.top) - 18)+"px";
  }
}

function restrictionsOptimal (wordSize){
  //Sprawdź, czy skończył poprawiać
  prevCheck = true;
  restOf = str.slice(str.length-wordSize,str.length) + restOf;
  // textField.contentDocument.body.innerHTML = str.slice(0,-1); //TMP
  if(textField.contentDocument.body.lastChild.textContent == ""){
    //If the div is empty - delete it
    textField.contentDocument.body.lastChild.remove();
    console.log("deleted"); //TMP
  } else {
    //Otherwise delete the last character
    textField.contentDocument.body.lastChild.textContent =
    textField.contentDocument.body.lastChild.textContent.slice(0,-wordSize);
    console.log("removed"); //TMP
  }
  //textContent
}


function restrictions() {
  str = textField.contentDocument.body.textContent;

  // 3 słowa na 1 pixel przypadają
  if (textField.contentDocument.body.offsetHeight > 5000) {
    restrictionsOptimal(5000-1123);
  } else if (textField.contentDocument.body.offsetHeight > 3000) {
    restrictionsOptimal(3000-1123);
  } else if (textField.contentDocument.body.offsetHeight > 2000) {
    restrictionsOptimal(2000-1123);
  } else if (textField.contentDocument.body.offsetHeight > 1500) {
    restrictionsOptimal(1700-1123);
  } else if (textField.contentDocument.body.offsetHeight > 1300) {
    restrictionsOptimal(1500-1123);
  } else if (textField.contentDocument.body.offsetHeight > 1170) {
    restrictionsOptimal(5);
  } else if (textField.contentDocument.body.offsetHeight > 1123) {
    restrictionsOptimal(1);
  }
  else if(prevCheck) {
    prevCheck = false;
    autosaveF();
    setTimeout(()=>{

      pages.splice(curPage+1,0,restOf);
      console.log(restOf);
      restOf = ""
      turnRight();
    },100)


  }
}



function caretSize() {
  try {
    //The following variable can be null.
    var selEl = textField.contentWindow.getSelection().anchorNode.parentElement;

    //TagNames must be CAPITAL
    if (selEl.tagName == "FONT") {
      switch (selEl.size) {
        case '7':
        space = 57
        fontSizes.value = 7;
        break;
        case '6':
        space = 39
        fontSizes.value = 6;
        break;
        case '5':
        space = 29
        fontSizes.value = 5;
        break;
        case '4':
        space = 22
        fontSizes.value = 4;
        break;
        case '3':
        space = 18
        fontSizes.value = 3;
        break;
        case '2':
        space = 16
        fontSizes.value = 2;
        break;
        case '1':
        space = 12
        fontSizes.value = 1;
        break;
      }
    } else {
      space = 18
      fontSizes.value = 3;
    }
  } catch (e) {
    //Do not do anything
  }
}


//Pasting text
with (textField){
  contentWindow.addEventListener("paste",(e)=>{
    //Prevent from default pasting text
    e.preventDefault();
    //Take text from clipboard and execute command to paste the text
    var normalizedText = contentWindow.event.clipboardData.getData("text/plain");
    contentDocument.execCommand("insertHTML",false,normalizedText);
  })
}


});
