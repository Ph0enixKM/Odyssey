const { remote } = require('electron');

var logo, newFile, openFile, packages, clicked, all;


//ManuBar
function menuBar() {

  var cl = document.getElementsByClassName.bind(document);
  var win = remote.getCurrentWindow();

  cl("minimize")[0].addEventListener("click",()=>{
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

  window.addEventListener("keydown",(e)=>{
    if (e.keyCode == 123) {
      location.reload();
    } else if (e.keyCode == 80) {
      win = remote.getCurrentWindow();
      win.toggleDevTools();
    }
  })

window.addEventListener("DOMContentLoaded",()=>{
  menuBar();

  clicked = false;

  with(document){
    logo = getElementsByClassName('logo')[0];
    newFile = getElementById('new-file');
    openFile = getElementById('open-file');
    packages = getElementById('packages');
  }
  setTimeout(()=>{
    logo.style.opacity = 1;
  },1500)

  startAnim();

  newFile.addEventListener("click",closeAnim);
  // openFile.addEventListener("click",closeAnim);
  // packages.addEventListener("click",closeAnim);

  delayAnchors();


})

function closeAnim(){
  all = document.getElementsByClassName('all')[0];
  all.style.display = "inline-block"
  setTimeout(()=>{
    all.style.opacity = 1
  },100)
}

function delayAnchors() {
  var anchors = document.getElementsByTagName('a');
  for (let i of anchors){
    i.addEventListener("click",()=>{
      setTimeout(()=>{
        window.location = i.href
      },500)
    })
  }
}


function startAnim() {
  logo.addEventListener("click",()=>{
    clicked = !clicked;
    if (clicked) {
      with(logo.style){
        top = "50%";
        transform = "translate(-50%, -50%)"
        border = "1px #aaa solid";
          setTimeout(()=>{
            newFile.style.left = "-25vw"
            newFile.style.transform = "translate(-50%, -50%) scale(1)"
            newFile.style.opacity = 1

            // openFile.style.left = "25vw"
            // openFile.style.transform = "translate(50%, -200%) scale(1)"
            // openFile.style.opacity = 1
            //
            // packages.style.top = "25vh"
            // packages.style.transform = "translate(-60%, -300%) scale(1)"
            // packages.style.opacity = 1
          },100)
      }
    } else {
      with(logo.style){
        top = "10vw";
        border = "0px #222 solid";

        newFile.style.left = "50%"
        newFile.style.transform = "translate(-50%, -50%) scale(0)"
        newFile.style.opacity = 0

        // openFile.style.left = "50%"
        // openFile.style.transform = "translate(50%, -50%) scale(0)"
        // openFile.style.opacity = 0
        //
        // packages.style.top = "50%"
        // packages.style.transform = "translate(-50%, -50%) scale(0)"
        // packages.style.opacity = 0

      }
    }
  })
}
