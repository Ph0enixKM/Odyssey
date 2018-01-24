//Global Variables:
var fonts, fontSizes, iStyle, iStyleVal, textField, textHtml, overflow, overstyle,
str, rest, pages;
var keys = {
  enter: false,
  backsp: false,
  up: false,
  down: false,
  left: false,
  right: false
};
var prev = false;


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




//Presets & initialisation
document.addEventListener("DOMContentLoaded",function(){

//Vars
fonts = document.getElementsByTagName('select')[0]
fontSizes = document.getElementsByTagName('select')[1]
textField = document.getElementsByTagName('iframe')[0]


var caretLoc = { x: 0, y: 0 };
var caret = textField.contentDocument.createElement("div");
caret.className = "caret";
var cs = caret.style;

var space = 18;

//Caret Key Mapping
function mapKeys(dock){
  Object.keys(keys).map(function(key,index){
    keys[key] = false;
  })
  eval("keys."+dock+" = true");
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
  }
});

textField.contentDocument.body.addEventListener("focus",function () {
  cs.transform = "translate(0,0) scale(1)";
})
textField.contentDocument.body.addEventListener("focusout",function () {
  cs.transform = "translate(-10px,0) scale(0)";
})


//Initial Commands
init();
function init(){
  textField.contentDocument.designMode = "On";
  var iStyle = textField.contentDocument.createElement("style");
  textField.contentDocument.head.appendChild(iStyle);
  var iStyleVal = document.createTextNode(`
    body::selection,font::selection,div::selection{
      background-color: rgba(0,0,0,0.3);
      color: #eee;
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

    pages = [];

    textField.contentDocument.body.style.color = "#ccc";
    textField.contentDocument.body.style.fontFamily = "Lato";
    textField.contentDocument.body.style.margin = 0;
    textField.contentDocument.body.style.caretColor = "transparent";
    textField.contentDocument.body.style.width = "100%";


    textField.contentDocument.body.innerHTML = "&zwnj;"
    textField.contentDocument.body.style.display = "inline-block";


    //overflow
    overflow = document.getElementById('overflow');
    overstyle = overflow.style;
    window.addEventListener("click",()=>{overstyle.transform = "translate(0,0)";overstyle.opacity = 1;})

    rest = "";

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
  cs.top = caretLoc.y + textField.offsetTop + 70;
  cs.left = caretLoc.x + textField.offsetLeft + 70;
}



function negateKeys(){
  Object.keys(keys).map(function(key,index){
    keys[key] = false;
  })
}

setInterval(function () {

  caretLoc.x = getSelectionCoords(textField).x;
  caretLoc.y = getSelectionCoords(textField).y;
  stickIntoBorders(cs.top);
  restrictions();

  //Debugger - if nothing is being placed
  //Just to show the wae to WYSIWYG editor

  if (textField.contentDocument.body.innerHTML == "") {
    textField.contentDocument.body.innerHTML = "&zwnj;"
  }



  caretUpdate();
}, 10);

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
                }
                else{
                  //It's a value of CSS property (without CSS type)
                  var csNum = cs.top.replace(cs.top.match(/px/),"");


                  if(keys.enter || keys.down || keys.right){
                    negateKeys();
                    return {x : 0, y: cs.top = parseInt(csNum) + space}
                  }
                  else if (keys.left || keys.up) {
                    negateKeys();
                    return{x : 0, y: cs.top = parseInt(csNum) - space}
                  }
                  else if (keys.backsp && !prev) {
                    negateKeys();
                    return{x : 0, y: cs.top = parseInt(csNum) - space}
                  }
                  else if (keys.backsp && prev) {
                    prev = false;
                    negateKeys();
                    return{x : 0, y: cs.top = parseInt(csNum)}
                  }
                  else {
                    return{x: 0, y: cs.top}
                  }
                }
            }
        }
    }
    return { x: x, y: y };
}
function stickIntoBorders(location){
  if(parseInt(cs.top)<260){
    cs.top = 260
  }
}

function restrictions() {
  checkTheRestrictions();
  if (textField.contentDocument.body.offsetHeight > 877) {
    console.warn("enough!");
    //Do the code here!



  }
}

});



function checkTheRestrictions() {
  str = textField.contentDocument.body.innerText;

    // console.log(str);
  if (textField.contentDocument.body.offsetHeight > 877) {
    rest += str[str.length-1];
    // str = str.slice(0,-1);
    // var res = str.match(rest);
    textField.contentDocument.body.innerText = str.slice(0,-1);
    

    console.log("str: "+str);
    console.log("rest: "+rest);

  }
}
