// Global Variables:
(function(){
  Object.assign(window,{
    fonts  : undefined,
    fontSizes  : undefined,
    textField  : undefined,
    str  : undefined,
    rest  : undefined,
    pages  : undefined,
    left  : undefined,
    right  : undefined,
    space  : undefined,
    bodyContent  : undefined,
    logo  : undefined,
    menu  : undefined,
    scrolling  : undefined,
    sbPages  : undefined,
    sbWords  : undefined,
    sbLetters  : undefined,
    sbChapter  : undefined,
    ctxMenu  : undefined,
    ctxMenuIndex : 0,
    pageDefaults : undefined,

    latestLocY : 0,
    latestLocX : 0,

    margins : {
      top : 0,
      left : 0,
      right : 0,
      bottom : 0
    },
    position : 0,
    curPage : 0,
    curChapter : 0,
    autobackup : true,
    prevCheck : false,
    restOf : ''
  })
})()

// Require Electron
const { remote } = require('electron')
const PIXI = require('pixi.js')
const { ipcRenderer } = require('electron')
const fs = require('fs')
const cargodb = require('cargodb');
const path = require('path');


window.qs = document.querySelectorAll.bind(document)
const storage = new cargodb('storage')
PopUp.summon("Witaj z powrotem!")

window.BASE_FILE = {
  title: undefined,
  author: undefined,
  keywords: [],
  book: [
    ['Prolog', [] ]
  ],
  config: []
}
window.clearTemplate = JSON.parse(JSON.stringify(BASE_FILE))

window.keys = {
  enter: false,
  backsp: false,
  up: false,
  down: false,
  left: false,
  right: false,
  shift: false,
  v: false,
  click: {state: false, loc: [], target: undefined}
}

window.SETTINGS = {
  autobackup: true,
  imageQuality: 0.5,
  scrollPastEnd: false,
  spell: 'pl-PL',
}

// If it's first time opened the app
if (localStorage.getItem('settings') == null) {
  localStorage.setItem('settings', JSON.stringify(SETTINGS))
} else {
  SETTINGS = JSON.parse(localStorage.getItem('settings'))
}

let settingsEl = {
  autosave: qs('.autosave input')[0],
  autosaveLabel: qs('.autosave label')[0],
  imageQuality: qs('.img-quality input')[0],
  scrollPastEnd: qs('.scroll-past-end input')[0],
  scrollPastEndLabel: qs('.scroll-past-end label')[0],
  spell: qs('.choose-spell select')[0],
}

function command (com) {
  textField.contentDocument.execCommand(com, false, null)
}

function font () {
  let fontVal = fonts.options[fonts.selectedIndex].value
  textField.contentDocument.execCommand('fontname', false, fontVal)
}

function fontSize () {
  let fontSizeVal = fontSizes.options[fontSizes.selectedIndex].value
  textField.contentDocument.execCommand('fontSize', false, parseInt(fontSizeVal))
}

function turnLeft () {
  if (textField.style.opacity == 1) { // Has the page turned on?
    if (curPage <= 0) {
      textField.style.transform = 'translate(-30px)'
      setTimeout(function () {
        textField.style.transform = 'translate(20px)'
        setTimeout(function () {
          textField.style.transform = 'translate(-10px)'
          setTimeout(function () {
            textField.style.transform = 'translate(0px)'
          }, 100)
        }, 100)
      }, 100)
      curPage = 0
    } else {
    // Animation
      textField.style.transform = 'translate(150%) scale(0.5)'
      textField.style.opacity = 0
      setTimeout(function () {
        textField.style.transform = 'translate(-150%) scale(0.5)'

      // Logic Section

        curPage--
        textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? '' : pages[curPage]

      // Logic Section

        setTimeout(function () {
          textField.style.transform = 'translate(0) scale(1)'
          textField.style.opacity = 1
        }, 150)
      }, 150)
    }
  }
}

function turnRight () {
  if (textField.style.opacity == 1) {
 // Has the page turned on?

    // Animation
    textField.style.transform = 'translate(-150%) scale(0.5)'
    textField.style.opacity = 0
    setTimeout(function () {
      textField.style.transform = 'translate(150%) scale(0.5)'

      // Logic Section

      curPage++
      textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? '' : pages[curPage]

      sbPages.innerHTML = curPage + 1

      sbWords.innerHTML = (textField.contentDocument.body.textContent.length == 1) ? 0 :
        textField.contentDocument.body.textContent.split(' ').length

      // Logic Section

      setTimeout(function () {
        textField.style.transform = 'translate(0) scale(1)'
        textField.style.opacity = 1
      }, 150)
    }, 150)
  }
}

function autosaveF (e) {
  setTimeout(function () {
      // When page is null then it means it's being deleted
    if (pages[curPage] === null) {
    } else {
      pages[curPage] = textField.contentDocument.body.innerHTML
    }

    if (BASE_FILE.book[curChapter] != undefined) {
      BASE_FILE.book[curChapter][1] = pages
    }
  }, 10)
}

let caretToEnd = () => {
  if (!keys.click.state)
    allow = true

  if (keys.click.state && keys.click.target.tagName == 'HTML' && allow) {
    allow = false
    textField.contentDocument.body.innerHTML += `<end></end>`
    var selection = textField.contentWindow.getSelection()
    var range = textField.contentDocument.createRange()
    range.selectNodeContents(textField.contentDocument.querySelector('end'))
    selection.removeAllRanges()
    selection.addRange(range)
    // TODO: gimme a sec
    range.collapse(true)
    let rects = range.getClientRects()
    if (rects.length > 0) {
      let rect = rects[0]
      latestLocY = rect.top
      latestLocX = rect.left
    }

    setTimeout(() => {
      for (let i = 0; i < textField.contentDocument.querySelectorAll('end').length; i++) {
        textField.contentDocument.querySelectorAll('end')[i].remove()
      }
    }, 100)
  }
}
let caretLastDoubleClick = e => {
    if (e.target.tagName == 'HTML') {
      setTimeout(()=>{
        var selection = textField.contentWindow.getSelection()
        var range = textField.contentDocument.createRange()
        let nodes = textField.contentDocument.body.childNodes
        let lastItem = textField.contentDocument.body.childNodes.length-1
        lastItem = ( nodes[lastItem].tagName == "END") ? lastItem-1 : lastItem
        range.selectNodeContents(nodes[lastItem])
        selection.removeAllRanges()
        selection.addRange(range)
      },20)
    }
}

// Presets & initialisation
document.addEventListener('DOMContentLoaded', function () {
  // If scroll past end enabled in settings
  if (SETTINGS.scrollPastEnd) {
    qs('.iframe #down')[0].innerHTML += `<div id="dummy"></div>`
  }

  // Electron compiling bug
  if (document.body.childNodes[0].tagName != "DIV" ) {
    document.body.childNodes[0].remove()
  }

  pageDefaults = {
    width : textField.contentDocument.documentElement.offsetWidth,
    height : textField.contentDocument.documentElement.offsetHeight
  }

  // Vars
  fonts = document.getElementsByTagName('select')[0]
  fontSizes = document.getElementsByTagName('select')[1]
  textField = document.getElementsByTagName('iframe')[0]

  bodyContent = document.getElementsByClassName('iframe')[0]

  menu = document.getElementsByClassName('menu')[0]
  window.ctxMenu = document.getElementsByClassName('menu')[1]

  window.settings = qs('.settings')[0]

  window.ctxLogo = document.getElementById('ctx-menu')
  window.logo = document.getElementById('logo')

  // Left/right buttons
  window.left = document.getElementsByClassName('move left')[0]
  window.right = document.getElementsByClassName('move right')[0]

  left.addEventListener('click', turnLeft)
  right.addEventListener('click', turnRight)

  textField.contentDocument.documentElement.setAttribute("contenteditable",false)
  textField.contentDocument.body.setAttribute("contenteditable",true)

  textField.contentDocument.documentElement.addEventListener('keydown', e => {
    if (e.keyCode == 27) {
      textField.contentDocument.body.blur()
      window.focus()
    }
  })

  window.addEventListener('keydown', e => {
    if (e.keyCode == 13) {
      window.blur()
      textField.contentDocument.body.focus()
    }
  })

  sbPages = document.getElementsByClassName('pages')[0]
  sbWords = document.getElementsByClassName('words')[0]
  sbLetters = document.getElementsByClassName('letters')[0]
  sbChapter = document.getElementsByClassName('chapter')[0]

  ipcRenderer.send('check-if-opened-with-file')

  qs('.menu button#open-file')[0].addEventListener('click', () => {
    ipcRenderer.send('open-file')
  })

  qs('.menu button#save-file')[0].addEventListener('click', () => {
    ipcRenderer.send('save-file', JSON.stringify(BASE_FILE))
  })

  ipcRenderer.on('saved-file', (event, name) => {
    qs('.bar span')[0].textContent = (name == null)
      ? qs('.bar span')[0].textContent
      : name
    PopUp.summon('Zapisano Dokument')
  })
  qs('.menu button#quick-save')[0].addEventListener('click', () => {
    let path = qs('.menubar .bar span')[0].innerHTML == '&lt;Brak tytułu&gt;'
      ? false
      : qs('.menubar .bar span')[0].innerHTML
    ipcRenderer.send('quick-save',[path, JSON.stringify(BASE_FILE)])
  })
  menu.children[0].addEventListener('click',()=>{
    BASE_FILE = JSON.parse(JSON.stringify(clearTemplate))
    pages = []
    textField.contentDocument.body.innerHTML = ''
    qs('.menubar .bar span')[0].innerHTML = '&lt;Brak tytułu&gt;'
    PopUp.summon('Odnowiono miejsce pracy')
    qs('input#keys')[0].value = ''
    qs('#all-keys p')[0].innerHTML = 0
    qs('input#title')[0].value = ''
    qs('input#author')[0].value = ''
  })

  ipcRenderer.on('selected-files', (event, source, name) => {
    try {
      BASE_FILE = JSON.parse(source)
    } catch (e) {
      BASE_FILE = {
        title: undefined,
        author: undefined,
        keywords: [],
        book: [
        ['Prolog', [source] ]
        ],
        config: []
      }
    } finally {
      qs('.bar span')[0].textContent = (name == null)
        ? qs('.bar span')[0].textContent
        : name

      curPage = 0
      curChapter = 0

      pages = BASE_FILE.book[curChapter][1]

      textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? '' : pages[curPage]
      pages[curPage] = textField.contentDocument.body.innerHTML
      sbChapter.innerHTML = BASE_FILE.book[curChapter][0]

      qs('input#keys')[0].value = BASE_FILE.keywords.join(' ')
      qs('#all-keys p')[0].innerHTML = BASE_FILE.keywords.length
      qs('input#title')[0].value = (BASE_FILE.title != undefined) ? BASE_FILE.title : ''
      qs('input#author')[0].value = (BASE_FILE.author != undefined) ? BASE_FILE.author : ''
    }
  })

  var caretLoc = { x: 0, y: 0 }
  var caret = textField.contentDocument.createElement('div')
  caret.className = 'caret'
  var cs = caret.style

  space = 19

  textField.contentDocument.documentElement.addEventListener('dblclick', caretLastDoubleClick)

  qs('#settings')[0].addEventListener('click', () => {
    settings.style.display = 'inline-block'
    setTimeout(() => {
      settings.style.opacity = 1
    }, 300)
  })

  qs('input#keys')[0].addEventListener('change', () => {
    let attrib = (qs('input#keys')[0].value.length == 0) ? [] : qs('input#keys')[0].value.split(' ')
    qs('#all-keys p')[0].innerHTML = attrib.length
    BASE_FILE_UPDATE('keywords', attrib)
  })

  qs('input#title')[0].addEventListener('change', () => {
    BASE_FILE_UPDATE('title', qs('input#title')[0].value)
  })

  qs('input#author')[0].addEventListener('change', () => {
    BASE_FILE_UPDATE('author', qs('input#author')[0].value)
  })

  function BASE_FILE_UPDATE (key, val) {
    BASE_FILE[key] = val
  }
  let scrollDif = 0
  document.getElementsByClassName('iframe')[0].addEventListener('scroll', () => {
    cs.transition = '0ms'
    insert.sizer.style.opacity = 0
    if (bodyContent.scrollTop != scrollDif) {
      scrollDif = bodyContent.scrollTop - scrollDif
    }

    clearTimeout(scrolling)

    scrolling = setTimeout(() => {
      cs.transition = '200ms'
      insert.sizer.style.opacity = 1
    }, 66)
  }, false)

// Caret Key Mapping
  function mapKeys (dock) {
    Object.keys(keys).map(function (key, index) {
      if (typeof keys[key] !== 'object') {
        keys[key] = false
      }
    })
    keys[dock] = true
  }
  textField.contentWindow.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
      case 13: // Enter
        mapKeys('enter')
        break
      case 8: // Backsp
        mapKeys('backsp')
        break
      case 38: // Up
        mapKeys('up')
        break
      case 40: // Down
        mapKeys('down')
        break
      case 37: // Left
        mapKeys('left')
        break
      case 39: // Right
        mapKeys('right')
        break
      case 123:
        var win = remote.getCurrentWindow()
        win.toggleDevTools()
    }
  })
  textField.contentWindow.addEventListener('mousedown', e => {
    keys.click.state = true
    keys.click.loc = [e.x, e.y]
    keys.click.target = e.target
  })
  textField.contentWindow.addEventListener('mouseup', () => {
    keys.click.state = false
    keys.click.target = undefined
  })

  textField.contentDocument.getElementsByTagName('body')[0].addEventListener('focus', function () {
    cs.transform = 'translate(0,0) scale(1)'
  })
  textField.contentDocument.getElementsByTagName('body')[0].addEventListener('focusout', function () {
    cs.transform = 'translate(-10px,0) scale(0)'
  })

  // Add verification tag (more in bodyBugFix function)
  textField.contentDocument.body.tag = true

  setInterval(() => {
    autosaveF()
  }, 100)
  setInterval(() => {
    if (SETTINGS.autobackup) {
      storage.setItem('backup', JSON.stringify(BASE_FILE))
    }
  }, 1000)

// ManuBar
  function menuBar () {
    var cl = document.getElementsByClassName.bind(document)
    var win = remote.getCurrentWindow()

    cl('minimize')[0].addEventListener('click', () => {
      win.minimize()
    })
    cl('maximize')[0].addEventListener('click', () => {
      if (win.isMaximized()) win.unmaximize()
      else win.maximize()
    })
    cl('exit')[0].addEventListener('click', () => {
      win.close()
      if (process.platform != 'darwin') {
        app.quit()
      }
    })
  }

  function fadeAll () {
    var all = document.getElementById('all')
    setTimeout(() => {
      all.style.opacity = 0
      setTimeout(() => {
        all.style.display = 'none'
      }, 500)
    }, (Math.random() * 1000) + 500)
  }

  function addStyle () {
    textField.contentDocument.head.innerHTML = `

    <style>
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
      @font-face{
        font-family: Lato;
        src: url("lato.ttf");
      }
      html{
        overflow: hidden;
        word-wrap: break-word;
        height: 100%;
        position: absolute;
      }
      body{
        caret-color: transparent;
        display: inline-block;
      }
      .image{
        filter: grayscale(100%) brightness(70%);
        border: 1px transparent solid;
        transition: 200ms;
        cursor: default;
      }
      .image:hover{
        filter: grayscale(0) brightness(100%);
        border: 1px orange solid;
      }
    </style>
    <link href="bin/toolbar.css" rel="stylesheet">
    `
  }

  function menuF () {
    logo.addEventListener('click', () => { // Open menu
      menu.style.display = 'inline-block'
      setTimeout(() => {
        menu.style.opacity = 1
      }, 100)
    })
    menu.addEventListener('click', () => { // Close Menu
      menu.style.opacity = 0
      setTimeout(() => {
        menu.style.display = 'none'
      }, 300)
    })

    ctxLogo.addEventListener('click', () => { // Open Context Menu
      ctxMenu.style.display = 'inline-block'
      setTimeout(() => {
        ctxMenu.style.opacity = 1
      }, 100)
    })

    ctxMenu.addEventListener('click', () => { // Close Context Menu
      ctxMenu.style.opacity = 0
      setTimeout(() => {
        ctxMenu.style.display = 'none'
      }, 300)
    })

    settings.addEventListener('click', () => {
      settings.style.opacity = 0
      setTimeout(() => {
        settings.style.display = 'none'
      // Save Settings
        localStorage.setItem('settings', JSON.stringify(SETTINGS))
      }, 300)
    })
    qs('.settings .setting')[0].addEventListener('click', e => { e.stopPropagation() })

    window.addEventListener('keydown', (e) => { // Escape shortcut
      if (e.keyCode == 27) {
        menu.style.opacity = 0
        ctxMenu.style.opacity = 0
        settings.style.opacity = 0
        setTimeout(() => {
          menu.style.display = 'none'
          ctxMenu.style.display = 'none'
          settings.style.display = 'none'
        // Save Settings
          localStorage.setItem('settings', JSON.stringify(SETTINGS))
        }, 300)

        if (!move.state && !chapter.state) {  // Merge comes from another file
          document.querySelector('.full-view').style.opacity = 0
          setTimeout(() => {
            document.querySelector('.full-view').style.display = 'none'
            fv.off()
          }, 300)
        } else {
        // Apply to move
          document.querySelector('#move-bg').style.opacity = 0
          setTimeout(() => {
            document.querySelector('#move-bg').style.display = 'none'
            move.state = false
            move.off()
          }, 150)

        // Apply to chapter
          document.querySelector('#chapter-bg').style.opacity = 0
          setTimeout(() => {
            document.querySelector('#chapter-bg').style.display = 'none'
            chapter.state = false
            chapter.off()
          }, 150)
        }
      }
    })

    ctxLogo.addEventListener('mouseover', () => shortcutOn('SHIFT + A'))
    ctxLogo.addEventListener('mouseout', shortcutOff)


    document.querySelector('#tools').style.display = 'inline-block'
    ctxMenu.childNodes[1].addEventListener('click', () => {
      document.querySelector('#ctx-menu').innerText = 'Narzędzia'
      document.querySelector('#view').style.display = 'none'
      document.querySelector('#tools').style.display = 'inline-block'
      document.querySelector('#insert').style.display = 'none'
      document.querySelector('#pages').style.display = 'none'
      document.querySelector('#project').style.display = 'none'
      ctxMenuIndex = 0
    })
    ctxMenu.childNodes[3].addEventListener('click', () => {
      document.querySelector('#ctx-menu').innerText = 'Wstawianie'
      document.querySelector('#view').style.display = 'none'
      document.querySelector('#insert').style.display = 'inline-block'
      document.querySelector('#tools').style.display = 'none'
      document.querySelector('#pages').style.display = 'none'
      document.querySelector('#project').style.display = 'none'
      ctxMenuIndex = 1
    })
    ctxMenu.childNodes[5].addEventListener('click', () => {
      document.querySelector('#ctx-menu').innerText = 'Widok'
      document.querySelector('#view').style.display = 'inline-block'
      document.querySelector('#insert').style.display = 'none'
      document.querySelector('#tools').style.display = 'none'
      document.querySelector('#pages').style.display = 'none'
      document.querySelector('#project').style.display = 'none'
      ctxMenuIndex = 2
    })
    ctxMenu.childNodes[7].addEventListener('click', () => {
      document.querySelector('#ctx-menu').innerText = 'Strony'
      document.querySelector('#view').style.display = 'none'
      document.querySelector('#insert').style.display = 'none'
      document.querySelector('#tools').style.display = 'none'
      document.querySelector('#pages').style.display = 'inline-block'
      document.querySelector('#project').style.display = 'none'
      ctxMenuIndex = 3
    })
    ctxMenu.childNodes[9].addEventListener('click', () => {
      document.querySelector('#ctx-menu').innerText = 'Projekt'
      document.querySelector('#view').style.display = 'none'
      document.querySelector('#insert').style.display = 'none'
      document.querySelector('#tools').style.display = 'none'
      document.querySelector('#pages').style.display = 'none'
      document.querySelector('#project').style.display = 'inline-block'
      ctxMenuIndex = 4
    })
  }

// Initial Commands
  init()
  function init () {
    textField.contentDocument.designMode = 'On'

  // Toolbar bindings:
  ;(function () {
    var id = document.getElementById.bind(document)
    var tag = document.getElementsByTagName.bind(document)

    id('bold').addEventListener('click', () => command('bold'))
    id('italic').addEventListener('click', () => command('italic'))
    id('underline').addEventListener('click', () => command('underline'))
    tag('select')[0].addEventListener('change', () => font())
    tag('select')[1].addEventListener('change', () => fontSize())
    id('justify-left').addEventListener('click', () => command('justifyLeft'))
    id('justify-center').addEventListener('click', () => command('justifyCenter'))
    id('justify-right').addEventListener('click', () => command('justifyRight'))
    id('justify-full').addEventListener('click', () => command('justifyFull'))
  })()

    fadeAll()
    menuBar()
    menuF()

    addStyle()

    pages = []

    textField.contentDocument.body.style.color = '#ccc'
    textField.contentDocument.body.style.fontFamily = 'Lato'
    textField.contentDocument.body.style.margin = 0
    textField.contentDocument.body.style.caretColor = 'transparent'
    textField.contentDocument.body.style.width = '100%'
    textField.contentDocument.body.style.wordWrap = 'break-word'
    textField.contentDocument.body.style.height = 'auto'
    textField.contentDocument.body.style.display = 'inline-block'

    textField.contentDocument.documentElement.style.cursor = 'text'

    textField.style.position = 'relative'
    textField.style.opacity = 1

    rest = ''

    // On change of body
    textField.contentWindow.addEventListener('keydown', autosaveF)

    // TextField's text
    var textHtml = textField.contentDocument.body.innerHTML

    caretInit()
  }

// Caret Design
  function caretInit () {
    cs.width = 3 + 'px'
    cs.height = 20 + 'px'
    cs.background = 'rgba(200,200,200,0.5)'
    cs.transition = 'left 200ms, transform 300ms'
    cs.position = 'absolute'
    cs.display = 'inline-block'

    document.body.appendChild(caret)
  }

  function caretUpdate () {
    cs.top =  (latestLocY + textField.offsetTop - bodyContent.scrollTop).toFixed() + "px"
    cs.left = latestLocX + textField.offsetLeft + "px"
    cs.height = space + "px"
  }

  function negateKeys () {
    Object.keys(keys).map(function (key, index) {
      if (typeof keys[key] !== 'object') {
        keys[key] = false
      } else if (key == 'click') {
        keys[key].state = false
      }
    })
  }

  function updateSidebar () {
    sbPages.innerHTML = curPage + 1

    sbWords.innerHTML = (textField.contentDocument.body.textContent.length == 1) ? 0 :
    textField.contentDocument.body.textContent.split(' ').length

    sbLetters.innerHTML = textField.contentDocument.body.textContent.length
  }

  function headChecker () {
    // Check if there are any heads inside
    if (textField.contentDocument.getElementsByTagName('head').length == 0) {
      var head = textField.contentDocument.createElement('head')
      var html = textField.contentDocument.getElementsByTagName('html')[0]
      html.innerHTML = '<head></head>'
      addStyle()
      caretInit()

      textField.contentDocument.body.style.color = '#ccc'
      textField.contentDocument.body.style.fontFamily = 'Lato'
      textField.contentDocument.body.style.margin = 0
      textField.contentDocument.body.style.caretColor = 'transparent'
      textField.contentDocument.body.style.width = '100%'
      textField.contentDocument.body.style.wordWrap = 'break-word'

      textField.contentDocument.body.addEventListener('focus', function () {
        cs.transform = 'translate(0,0) scale(1)'
      })
      textField.contentDocument.body.addEventListener('focusout', function () {
        cs.transform = 'translate(-10px,0) scale(0)'
      })
    }
  }

  function checkForFloatingDivs () {
    let els = textField.contentDocument.documentElement.childNodes
    let body = textField.contentDocument.body
    for (let i of els) {
      if (i.tagName == 'DIV') {
        body.prepend(i)
      }
    }
  }

  window.addEventListener('click', e => {
    cs.transform = 'translate(10px,0) scale(0)'
  })

  textField.contentDocument.documentElement.addEventListener('click', e => {
    e.stopPropagation()
    cs.transform = 'translate(0,0) scale(1)'
  })

  window.allow = false // caretToEnd && getSelectionCoords
  setInterval(function () {
    caretToEnd()
    getSelectionCoords(textField)
    caretSize()
    stickIntoBorders(cs.top)
    restrictions()
    settingsUpdate()
    checkForFloatingDivs()
    updateSidebar()
    headChecker()
    caretUpdate()

    // 284 && 280 && 270 && 200
    cs.top = (parseInt(cs.top) < 200 - bodyContent.scrollTop) ? 200 - bodyContent.scrollTop : cs.top - bodyContent.scrollTop
  }, 1)

  function getSelectionCoordsPosition (elem) {
    switch (elem) {
      case 'left':
        position = 0
        break
      case 'center':
        position = 1
        break
      case 'right':
        position = 2
        break
      case 'justify':
        position = 0
        break
      default: // And this won't occur
        position = 0
        break
    }
  }

  function settingsUpdate () {
  // Autosave
    settingsEl.autosaveLabel.title = settingsEl.autosave.checked == true ? 'Włączony' : 'Wyłączony'
  // Image Quality
    settingsEl.imageQuality.title = Math.round(settingsEl.imageQuality.value * 100) + '%'
  // Scroll Past End
    settingsEl.scrollPastEndLabel.title = settingsEl.scrollPastEnd.checked == true ? 'Włączony' : 'Wyłączony'
  }

  settingsEl.autosave.addEventListener('change', () => {
    SETTINGS.autobackup = settingsEl.autosave.checked
  })
  settingsEl.imageQuality.addEventListener('change', () => {
    SETTINGS.imageQuality = settingsEl.imageQuality.value
  })
  settingsEl.scrollPastEnd.addEventListener('change', () => {
    SETTINGS.scrollPastEnd = settingsEl.scrollPastEnd.checked
    if (SETTINGS.scrollPastEnd) {
      qs('.iframe #down')[0].innerHTML += `<div id="dummy"></div>`
    } else {
      document.getElementById('dummy').remove()
    }
  })
  settingsEl.spell.addEventListener('change', () => {
    let selected = settingsEl.spell.options[settingsEl.spell.selectedIndex].value
    window.spellCheckHandler.switchLanguage(selected)
    SETTINGS.spell = selected
  })

  settingsToElements()

  function settingsToElements () {
    settingsEl.autosave.checked = SETTINGS.autobackup
    settingsEl.imageQuality.value = SETTINGS.imageQuality
    settingsEl.scrollPastEnd.checked = SETTINGS.scrollPastEnd
    for (let i = 0; i < settingsEl.spell.options.length; i++) {
      if (settingsEl.spell.options[i].value == SETTINGS.spell)
        settingsEl.spell.selectedIndex = i
    }
  }

let getLatestCoordsY = 0
let prev = false
  function getSelectionCoords (iframe) {
    let win = iframe
    var doc = win.contentDocument
    var sel = doc.selection, range, rects, rect
    var x = 0, y = 0
    if (doc.getSelection) {
      sel = doc.getSelection()
      if (sel.rangeCount) {
        range = sel.getRangeAt(0).cloneRange()
        if (range.getClientRects) {
          range.collapse(true)
          rects = range.getClientRects()
          if (rects.length > 0) {
            rect = rects[0]
            latestLocY = getLatestCoordsY = rect.top
            latestLocX = rect.left
            prev = true

            try {
              if (sel.anchorNode.parentElement.parentElement.tagName == 'SPAN') { getSelectionCoordsPosition(sel.anchorNode.parentElement.parentElement.parentElement.style.textAlign) } else if (sel.anchorNode.parentElement.parentElement.tagName == 'DIV') {
                getSelectionCoordsPosition(sel.anchorNode.parentElement.parentElement.style.textAlign)
              }
            } catch (e) {
              position = 0
            }
          } else {

            if (keys.enter || keys.down || keys.right) {
              prev = false
              latestLocY = getLatestCoordsY + space
              let documentHeight = textField.contentDocument.body.offsetHeight
              if ((keys.down || keys.right) && (latestLocY + space) > documentHeight) {
                latestLocY = getLatestCoordsY
              }
              negateKeys()
              getLatestCoordsY = latestLocY
              latestLocX = (position == 0)
                ? 0
                : (position == 1)
                  ? (+textField.contentDocument.body.offsetWidth / 2)
                  : textField.contentDocument.body.offsetWidth
              latestLocX += margins.left

            } else if (keys.left || keys.up) {
              negateKeys()
              prev = false
              latestLocY = getLatestCoordsY - space
              getLatestCoordsY = latestLocY
              latestLocX = (position == 0)
                ? 0
                : (position == 1)
                  ? (+textField.contentDocument.body.offsetWidth / 2)
                  : textField.contentDocument.body.offsetWidth
              latestLocX += margins.left

            } else if (keys.backsp && !prev) {
              negateKeys()
              latestLocY = getLatestCoordsY - space
              getLatestCoordsY = latestLocY
              latestLocX = (position == 0)
                ? 0
                : (position == 1)
                  ? (+textField.contentDocument.body.offsetWidth / 2)
                  : textField.contentDocument.body.offsetWidth
              latestLocX += margins.left

            } else if (keys.backsp && prev) {
              negateKeys()
              prev = false
              latestLocY = getLatestCoordsY
              latestLocX = (position == 0)
                ? 0
                : (position == 1)
                  ? (+textField.contentDocument.body.offsetWidth / 2)
                  : textField.contentDocument.body.offsetWidth
              latestLocX += margins.left

            } else if (keys.click.state && allow) {
              prev = false
              let temp = keys.click.loc[1]
              latestLocY = temp - (temp % 19)
              latestLocX = (position == 0)
                ? 0
                : (position == 1)
                  ? (+textField.contentDocument.body.offsetWidth / 2)
                  : textField.contentDocument.body.offsetWidth
              latestLocX += margins.left

            } else {
              prev = false
            }
          }
        }
      }
    }
  }
  function stickIntoBorders (location) {
    if (parseInt(cs.top) > textField.contentDocument.body.offsetHeight + textField.offsetTop + margins.top - 18) {
      cs.top = (parseInt(cs.top) - 18) + 'px'
    }
  }

  function restrictionsOptimal (wordSize) {
  // Sprawdź, czy skończył poprawiać
    prevCheck = true
    restOf = str.slice(str.length - wordSize, str.length) + restOf
    // Otherwise delete the last character
    textField.contentDocument.body.innerHTML = str.slice(0, -wordSize)
    str = str.slice(0, -wordSize)
    return str
  // }
  // textContent
  }

  let restrictions_start = false
  function restrictions () {
    if (!restrictions_start && textField.contentDocument.body.offsetHeight > 1123) {
      str = textField.contentDocument.body.innerHTML
      restrictions_start = true
    } else if (textField.contentDocument.body.offsetHeight <= 1123) {
      restrictions_start = false
    }

    let prevLetters = sbLetters

  // 3 słowa przypadają na 1 pixel
    if (textField.contentDocument.body.offsetHeight > 25000) {
      str = restrictionsOptimal(25000 - 1123)
    } else if (textField.contentDocument.body.offsetHeight > 10000) {
      str = restrictionsOptimal(10000 - 1123)
    } else if (textField.contentDocument.body.offsetHeight > 5000) {
      str = restrictionsOptimal(5000 - 1123)
    } else if (textField.contentDocument.body.offsetHeight > 3000) {
      str = restrictionsOptimal(3000 - 1123)
    } else if (textField.contentDocument.body.offsetHeight > 2000) {
      str = restrictionsOptimal(2000 - 1123)
    } else if (textField.contentDocument.body.offsetHeight > 1500) {
      str = restrictionsOptimal(1700 - 1123)
    } else if (textField.contentDocument.body.offsetHeight > 1300) {
      str = restrictionsOptimal(1500 - 1123)
    } else if (textField.contentDocument.body.offsetHeight > 1170) {
      str = restrictionsOptimal(10)
    } else if (textField.contentDocument.body.offsetHeight > 1123) {
      str = restrictionsOptimal(1)
    } else if (prevCheck && !merge.invoked) {
      prevCheck = false
      autosaveF()
      setTimeout(() => {
        pages.splice(curPage + 1, 0, restOf)
        restOf = ''
        turnRight()
      }, 100)
    } else if (prevCheck && merge.invoked) {
      prevCheck = false

      pages[curPage] = textField.contentDocument.body.innerHTML // Autosave
      pages.splice(curPage + 1, 0, restOf)
      restOf = ''
      // Turn Right
      curPage++
      textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? '' : pages[curPage]
    } else {
      if (merge.invoked) {
        if (sbLetters == prevLetters) {
          merge.finished = true
          merge.invoked = false
        }
      }
    }
  }

  function fontSizeReader (elem) {
    switch (elem) {
      case '7':
        space = 57
        fontSizes.value = 7
        break
      case '6':
        space = 39
        fontSizes.value = 6
        break
      case '5':
        space = 29
        fontSizes.value = 5
        break
      case '4':
        space = 22
        fontSizes.value = 4
        break
      case '3':
        space = 18
        fontSizes.value = 3
        break
      case '2':
        space = 16
        fontSizes.value = 2
        break
      case '1':
        space = 12
        fontSizes.value = 1
        break
      default:
        space = 18
        fontSizes.value = 3
        break
    }
  }

  function fontIterator (selEl) {
    if (selEl == null || (selEl.tagName && selEl.tagName == "BODY")){
      return 'Lato'
    } else if (selEl.face && selEl.face != undefined) {
      return selEl.face
    } else {
      return fontIterator(selEl.parentElement)
    }
  }

  function caretSize () {
    try {
    // The following variable can be null.
      var selEl = textField.contentWindow.getSelection().anchorNode.parentElement
      fonts.value = fontIterator(selEl)

    // TagNames must be CAPITAL // TODO: Clean it up and make size to be a INPUT number
      if (selEl.tagName == 'FONT') {
        fontSizeReader(selEl.size)
      } else if (selEl.tagName == 'B' || selEl.tagName == 'U' ||
              selEl.tagName == 'I' || selEl.tagName == 'SPAN') {
        if (selEl.parentNode.tagName == 'FONT') {
          fontSizeReader(selEl.parentNode.size)
        } else if (selEl.parentNode.tagName == 'B' ||
                 selEl.parentNode.tagName == 'U' ||
                 selEl.parentNode.tagName == 'I' ||
                 selEl.parentNode.tagName == 'SPAN') {
          fontSizeReader(selEl.parentNode.parentNode.size)
        }
      } else {
        space = 18
        fontSizes.value = 3
        fonts.value = 'Lato'
      }
    } catch (e) {
    // Do not do anything
    }
  }

// Pasting text
  textField.contentWindow.addEventListener('paste', (e) => {
    // Prevent from default pasting text
    e.preventDefault()
    // Take text from clipboard and execute command to paste the text
    var normalizedText = textField.contentWindow.event.clipboardData.getData('text/plain')
    textField.contentDocument.execCommand('insertHTML', false, normalizedText)
  })
})
