// Global Variables:
(function(){
  Object.assign(window,{
    version : '1.4.0',

    fonts  : undefined,
    fontSizes  : undefined,
    textField  : undefined,
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
      top : 70,
      left : 70,
      right : 70,
      bottom : 70
    },
    position : 0,
    curPage : 0,
    curChapter : 0,
    autobackup : true,
    prevCheck : false,
    restOf : '',
    str  : '',
    prevBounds : null,
    lang : 'PL'
  })
})()

// TODO: CTRL + Z Handler

// Require Electron
const { remote } = require('electron')
const PIXI = require('pixi.js')
const { ipcRenderer } = require('electron')
const fs = require('fs')
const cargodb = require('cargodb')
const path = require('path')
const {shell} = require('electron')
const brain = require('brainjs')
const osLocale = require('os-locale')

window.addEventListener('DOMContentLoaded', () => {
  // Electron compiling bug
  if (document.body.childNodes[0].tagName != "DIV" ) {
    document.body.childNodes[0].remove()
  }
})

window.qs = document.querySelectorAll.bind(document)
const storage = new cargodb('storage')

if (remote.app.getLocale() != 'pl') lang = 'EN'

if (lang === 'PL') PopUp.summon("Witaj z powrotem!")
if (lang === 'EN') PopUp.summon("Welcome back!")


function versionValue (version) {
  let ver = version.split('.')
  let sum = 0
  let arg = ver.length -1
  for (let iter of ver) {
    sum += Number(iter) * (10 ** arg)
    arg--
  }
  return sum
}

// Check for updates
fetch('https://api.github.com/repos/ph0enixkm/odyssey/releases/latest')
.then(res => res.json())
.then(json => {
  if (versionValue(json.tag_name) > versionValue(version)) {
    if (lang === 'PL')
    PopUp.summon(`Jest dostępna nowa wersja Odysei!
        <a onclick='return updateVersion()'>Pobierz</a>`, 15000)
    if (lang === 'EN')
    PopUp.summon(`A new version of the Odyssey is available!
        <a onclick='return updateVersion()'>Download</a>`, 15000)
  }
})

function updateVersion() {
  shell.openExternal('https://odysseyapp.herokuapp.com')
}


window.BASE_FILE = {
  title: undefined,
  author: undefined,
  keywords: [],
  book: [
    ['Prolog', [] ]
  ],
  config: {
    margins : {
      top : 70,
      left : 70,
      right : 70,
      bottom : 70
    }
  }
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
window.SETTINGS.spell = (lang === 'EN') ? 'en-US' : 'pl-PL'

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

function translate (lang) {
  let get = document.querySelector.bind(document)
  if (lang === 'EN'){
    get('.bar t').innerHTML = 'Odyssey'
    get('.bar span').innerHTML = '&lt;Untitled&gt;'
    get('#ctx-menu').title = 'Change mode'
    get('#ctx-menu').innerHTML = 'Tools'
    get('#bold').title = 'Bold'
    get('#italic').title = 'Italic'
    get('#underline').title = 'Underline'
    get('select[font-size]').title = 'Font size'
    get('.justify').title = 'Text placement'
    get('#design #image').title = 'Insert image'
    get('#design #fg-text').title = 'Text color'
    get('#design #bg-text').title = 'Text background color'
    get('#view #full-view').title = 'Full view'
    get('#pages #merge-all').title = 'Merge all pages'
    get('#pages #print').title = 'Print'
    get('#pages #print-view').title = 'Print preview'
    get('#project #title').title = 'Title'
    get('#project #keys').title = 'Keywords (space separated)'
    get('#project #author').title = 'Author'
    get('#project #title').placeholder = '<Untitled>'
    get('#project #keys').placeholder = '<No Keys>'
    get('#project #author').placeholder = '<No Author>'
    get('.menu #reload').title = 'Renovate Document'
    get('.menu #open-file').title = 'Open File'
    get('.menu #save-file').title = 'Save File As'
    get('.menu #quick-save').title = 'Save File'
    get('.menu #settings').title = 'Settings'
    get('.menu[ctx] button[tools]').innerHTML = 'Tools'
    get('.menu[ctx] button[design]').innerHTML = 'Design'
    get('.menu[ctx] button[view]').innerHTML = 'View'
    get('.menu[ctx] button[pages]').innerHTML = 'Pages'
    get('.menu[ctx] button[project]').innerHTML = 'Project'
    get('.full-view .fv-tools p').innerHTML = 'Full view'
    get('.full-view .fv-tools span#trash').title = 'Delete pages'
    get('.full-view .fv-tools disabled#move').title = 'You have to select a sequence of pages in succession'
    get('.full-view .fv-tools disabled#merge').title = 'You have to select a sequence of pages in succession'
    get('.full-view .fv-tools span#chapter-view').title = 'All chapter view'
    get('.full-view .fv-tools span#move-btn').title = 'Chain editor'
    get('.full-view .fv-tools span#merge-sel').title = 'Merge selected pages'
    get('.full-view .fv-tools #move-bg p').innerHTML = 'Chain editor'
    get('.full-view .fv-tools #chapter-bg p').innerHTML = 'Chapters'
    get('.full-view .fv-tools #chapter-bg input').title = 'Chapter name'
    get('.full-view .fv-tools #chapter-bg #trash').title = 'Delete chapter'
    get('#compiling p').innerHTML = 'Processing'
    get('.settings .general').innerHTML = 'General'
    get('.settings .themes').innerHTML = 'Theme'
    get('.settings #options h1').innerHTML = 'General'
    get('.settings #options .autosave span').innerHTML = 'Autosave backup'
    get('.settings #options .img-quality span').innerHTML = 'JPG image quality'
    get('.settings #options .scroll-past-end span').innerHTML = 'Scroll past end'
    get('.settings #options .choose-spell span').innerHTML = 'Choose dictionary language'
  }
}

function command (com, arg) {
  arg = (arg == undefined) ? null : arg
  textField.contentDocument.execCommand(com, false, arg)
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
      for (let obj of document.querySelectorAll('.resizer')) {
        obj.style.opacity = 0
      }
      setTimeout(function () {
        textField.style.transform = 'translate(-150%) scale(0.5)'

      // Logic Section

        curPage--
        textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? '' : pages[curPage]
        design.findImages()

      // Logic Section

        setTimeout(function () {
          textField.style.transform = 'translate(0) scale(1)'
          textField.style.opacity = 1
          for (let obj of document.querySelectorAll('.resizer')) {
            obj.style.opacity = 1
          }
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
    for (let obj of document.querySelectorAll('.resizer')) {
      obj.style.opacity = 0
    }
    setTimeout(function () {
      textField.style.transform = 'translate(150%) scale(0.5)'

      // Logic Section

      curPage++
      textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? '' : pages[curPage]

      sbPages.innerHTML = curPage + 1

      sbWords.innerHTML = (textField.contentDocument.body.textContent.length == 1) ? 0 :
        textField.contentDocument.body.textContent.split(' ').length

      design.findImages()

      // Logic Section

      setTimeout(function () {
        textField.style.transform = 'translate(0) scale(1)'
        textField.style.opacity = 1
        for (let obj of document.querySelectorAll('.resizer')) {
          obj.style.opacity = 1
        }
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

// Scripts included
require('./src/index/design.js')
require('./src/index/widok.js')
require('./src/index/input.js')
require('./src/index/resizer.js')
require('./src/index/spell.js')
require('./src/index/strony.js')

let loaded = () => {

  if (lang === 'EN') translate('EN')
  // Set up version
  qs('.menubar .bar v')[0].innerHTML = (version != null)
    ? version
    : qs('.menubar .bar v')[0].innerHTML

  // If scroll past end enabled in settings
  if (SETTINGS.scrollPastEnd) {
    qs('.iframe #down')[0].innerHTML += `<div id="dummy"></div>`
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
    if (lang === 'PL')
    PopUp.summon('Zapisano Dokument')
    if (lang === 'EN')
    PopUp.summon('Document Saved')
  })
  qs('.menu button#quick-save')[0].addEventListener('click', () => {
    let path
    if (lang === 'PL')
      path = qs('.menubar .bar span')[0].innerHTML == '&lt;Brak tytułu&gt;'
        ? false
        : qs('.menubar .bar span')[0].innerHTML
    if (lang === 'EN')
      path = qs('.menubar .bar span')[0].innerHTML == '&lt;Untitled&gt;'
        ? false
        : qs('.menubar .bar span')[0].innerHTML
    ipcRenderer.send('quick-save',[path, JSON.stringify(BASE_FILE)])
  })
  menu.children[0].addEventListener('click',()=>{
    BASE_FILE = JSON.parse(JSON.stringify(clearTemplate))
    pages = []
    textField.contentDocument.body.innerHTML = ''
    if (lang === 'PL') {
      qs('.menubar .bar span')[0].innerHTML = '&lt;Brak tytułu&gt;'
      PopUp.summon('Odnowiono miejsce pracy')
    }
    if (lang === 'EN') {
      qs('.menubar .bar span')[0].innerHTML = '&lt;Untitled&gt;'
      PopUp.summon('Workplace has been renovated')
    }
    qs('input#keys')[0].value = ''
    qs('#all-keys p')[0].innerHTML = 0
    qs('input#title')[0].value = ''
    qs('input#author')[0].value = ''
  })

  ipcRenderer.on('selected-files', (event, source, name) => {
    try {
      BASE_FILE = JSON.parse(source)
      if (!BASE_FILE.config || !BASE_FILE.config.margins) {
        BASE_FILE.config = {
          margins : {
            top : 70,
            left : 70,
            right : 70,
            bottom : 70
          }
        }
      }
      console.log(BASE_FILE.config.margins);
    } catch (e) {
      BASE_FILE = {
        title: undefined,
        author: undefined,
        keywords: [],
        book: [
        ['Prolog', [source] ]
        ],
        config: {
          margins : {
            top : 70,
            left : 70,
            right : 70,
            bottom : 70
          }
        }
      }
    } finally {
      qs('.bar span')[0].textContent = (name == null || (name[0] == '-'))
        ? qs('.bar span')[0].textContent
        : name

      curPage = 0
      curChapter = 0

      pages = BASE_FILE.book[curChapter][1]

      textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? '' : pages[curPage]
      pages[curPage] = textField.contentDocument.body.innerHTML
      sbChapter.innerHTML = BASE_FILE.book[curChapter][0]
      design.findImages()

      qs('input#keys')[0].value = BASE_FILE.keywords.join(' ')
      qs('#all-keys p')[0].innerHTML = BASE_FILE.keywords.length
      qs('input#title')[0].value = (BASE_FILE.title != undefined) ? BASE_FILE.title : ''
      qs('input#author')[0].value = (BASE_FILE.author != undefined) ? BASE_FILE.author : ''
      margins = BASE_FILE.config.margins
      resizer.apply()
    }
  })

  var caretLoc = { x: 0, y: 0 }
  var caret = textField.contentDocument.createElement('div')
  caret.className = 'caret'
  var cs = caret.style

  space = 19

  textField.contentWindow.addEventListener('keydown', e => {
    if (e.ctrlKey && e.code == 'KeyS') {
      if (lang === 'PL')
        PopUp.summon('Nie można zapisać, ponieważ jesteś w trybie pisania.'+
        ' Wyjdź najpierw z trybu pisania klikając ESC')
      if (lang === 'EN')
      PopUp.summon('You can not save because you are in writing mode.'+
      ' Exit writing mode by clicking ESC')
    }
    if (e.ctrlKey && e.code == 'KeyO') {
      if (lang === 'PL')
        PopUp.summon('Nie można otworzyć pliku, ponieważ jesteś w trybie pisania.'+
        ' Wyjdź najpierw z trybu pisania klikając ESC')
      if (lang === 'EN')
        PopUp.summon('You can not open file because you are in writing mode.'+
        ' Exit writing mode by clicking ESC')
    }
  })

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
      // case 123:
      //   var win = remote.getCurrentWindow()
      //   win.toggleDevTools()
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
      }
      *:not(font):not(b):not(u):not(i):not(div):not(span){
        color: #ccc;
        font-family: Lato;
      }
      @font-face{
        font-family: Lato;
        src: url("arts/lato.ttf");
      }
      html{
        overflow: hidden;
        word-wrap: break-word;
        height: 100%;
        position: relative;
      }
      body{
        caret-color: transparent;
        display: inline-block;
      }
      .image{
        filter: grayscale(100%) brightness(70%);
        border: 1px transparent solid;
        transition: filter 200ms, border 200ms;
        cursor: default;
      }
    </style>
    <link href="bin/css/toolbar.css" rel="stylesheet">
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
      if (lang === 'PL') document.querySelector('#ctx-menu').innerText = 'Narzędzia'
      if (lang === 'EN') document.querySelector('#ctx-menu').innerText = 'Tools'
      document.querySelector('#view').style.display = 'none'
      document.querySelector('#tools').style.display = 'inline-block'
      document.querySelector('#design').style.display = 'none'
      document.querySelector('#pages').style.display = 'none'
      document.querySelector('#project').style.display = 'none'
      ctxMenuIndex = 0
    })
    ctxMenu.childNodes[3].addEventListener('click', () => {
      if (lang === 'PL') document.querySelector('#ctx-menu').innerText = 'Projektowanie'
      if (lang === 'EN') document.querySelector('#ctx-menu').innerText = 'Design'
      document.querySelector('#view').style.display = 'none'
      document.querySelector('#design').style.display = 'inline-block'
      document.querySelector('#tools').style.display = 'none'
      document.querySelector('#pages').style.display = 'none'
      document.querySelector('#project').style.display = 'none'
      ctxMenuIndex = 1
    })
    ctxMenu.childNodes[5].addEventListener('click', () => {
      if (lang === 'PL') document.querySelector('#ctx-menu').innerText = 'Widok'
      if (lang === 'EN') document.querySelector('#ctx-menu').innerText = 'View'
      document.querySelector('#view').style.display = 'inline-block'
      document.querySelector('#design').style.display = 'none'
      document.querySelector('#tools').style.display = 'none'
      document.querySelector('#pages').style.display = 'none'
      document.querySelector('#project').style.display = 'none'
      ctxMenuIndex = 2
    })
    ctxMenu.childNodes[7].addEventListener('click', () => {
      if (lang === 'PL') document.querySelector('#ctx-menu').innerText = 'Strony'
      if (lang === 'EN') document.querySelector('#ctx-menu').innerText = 'Pages'
      document.querySelector('#view').style.display = 'none'
      document.querySelector('#design').style.display = 'none'
      document.querySelector('#tools').style.display = 'none'
      document.querySelector('#pages').style.display = 'inline-block'
      document.querySelector('#project').style.display = 'none'
      ctxMenuIndex = 3
    })
    ctxMenu.childNodes[9].addEventListener('click', () => {
      if (lang === 'PL') document.querySelector('#ctx-menu').innerText = 'Projekt'
      if (lang === 'EN') document.querySelector('#ctx-menu').innerText = 'Project'
      document.querySelector('#view').style.display = 'none'
      document.querySelector('#design').style.display = 'none'
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

    let bg = new CP(id('bg-text'), 'mousedown')
    let fg = new CP(id('fg-text'))

    let net = new brain.NeuralNetwork()

    net.train([
      {input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 }},
      {input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 }},
      {input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 }},
      {input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 }},
      {input: { r: 0, g: 0, b: 0 }, output: { black: 1 }},
      {input: { r: 0.35, g: 0.37, b: 0.1 }, output: { black: 1 }},
      {input: { r: 0.42, g: 0.25, b: 0.25 }, output: { black: 1 }},
      {input: { r: 0.80, g: 0.62, b: 0.62 }, output: { white: 1 }},
      {input: { r: 0.27, g: 0.30, b: 0.54 }, output: { black: 1 }},
      {input: { r: 0.26, g: 0.27, b: 0.33 }, output: { black: 1 }},
      {input: { r: 0, g: 0.16, b: 0.99 }, output: { black: 1 }},
      {input: { r: 0.33, g: 0.09, b: 0.2 }, output: { black: 1 }},
      {input: { r: 0.42, g: 0.02, b: 0.2 }, output: { black: 1 }},
      {input: { r: 0.3, g: 0.93, b: 0.45 }, output: { white: 1 }},
      {input: { r: 1, g: 0, b: 0 }, output: { white: 1 }},
      {input: { r: 0, g: 1, b: 1 }, output: { white: 1 }},
      {input: { r: 1, g: 0, b: 0.75 }, output: { white: 1 }},
      {input: { r: 0, g: 1, b: 0 }, output: { white: 1 }},
      {input: { r: 0.19, g: 0.05, b: 0.05 }, output: { black: 1 }},
      {input: { r: 0.12, g: 0.11, b: 0.11 }, output: { black: 1 }},
      {input: { r: 0.44, g: 0.52, b: 0.67 }, output: { black: 1 }}
    ])

    fg.on('change', color => {
      command('foreColor', '#' + color)
      id('fg-text').style.backgroundColor = '#' + color
      let rgb = CP.HEX2RGB(color)
      let res = net.run({r: rgb[0]/255, g:rgb[1]/255, b:rgb[2]/255})
      id('fg-text').style.backgroundImage = (res.black > res.white)
        ? 'url(arts/fg.png)'
        : 'url(arts/fgDark.png)'
    })
    bg.on('change', color => {
      command('backColor', '#' + color)
      id('bg-text').style.backgroundColor = '#' + color
      let rgb = CP.HEX2RGB(color)
      let res = net.run({r: rgb[0]/255, g:rgb[1]/255, b:rgb[2]/255})
      id('bg-text').style.backgroundImage = (res.black > res.white)
        ? 'url(arts/bg.png)'
        : 'url(arts/bgDark.png)'
    })

    fg.set('#ccc')
    id('fg-text').style.backgroundImage = 'url(arts/fgDark.png)'
    bg.set('#444')

    id('fg-text').addEventListener('contextmenu', e => {
      fg.set('#ccc')
      id('fg-text').style.backgroundColor = '#ccc'
      command('foreColor', '#ccc')
      id('fg-text').style.backgroundImage = 'url(arts/fgDark.png)'
    })
    id('bg-text').addEventListener('contextmenu', e => {
      bg.set('#444')
      id('bg-text').style.backgroundColor = 'transparent'
      command('backColor', 'transparent')
    })
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
    if (lang === 'PL') settingsEl.autosaveLabel.title = settingsEl.autosave.checked == true ? 'Włączony' : 'Wyłączony'
    if (lang === 'EN') settingsEl.autosaveLabel.title = settingsEl.autosave.checked == true ? 'On' : 'Off'
  // Image Quality
    settingsEl.imageQuality.title = Math.round(settingsEl.imageQuality.value * 100) + '%'
  // Scroll Past End
    if (lang === 'PL') settingsEl.scrollPastEndLabel.title = settingsEl.scrollPastEnd.checked == true ? 'Włączony' : 'Wyłączony'
    if (lang === 'EN') settingsEl.scrollPastEndLabel.title = settingsEl.scrollPastEnd.checked == true ? 'On' : 'Off'
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
          let documentHeight = textField.contentDocument.body.offsetHeight
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
              if ((keys.down || keys.right) && latestLocY > margins.top + documentHeight - space) {
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
              if (latestLocY < margins.top) {
                latestLocY = getLatestCoordsY
              }
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
              if (latestLocY < margins.top) {
                latestLocY = getLatestCoordsY
              }
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

  function restrictions () {
    let prevLetters = sbLetters
    let content = textField.contentDocument.body
    let html = textField.contentDocument.documentElement

    if (content.offsetHeight > (html.offsetHeight)) {
      // if (content.offsetHeight - html.offsetHeight > 5000) decreaseBounds(50000)
      // else if (content.offsetHeight - html.offsetHeight > 1000) decreaseBounds(5000)
      // else if (content.offsetHeight - html.offsetHeight > 500) decreaseBounds(1500)
      // else if (content.offsetHeight - html.offsetHeight > 100) decreaseBounds(300)
      // else if (content.offsetHeight - html.offsetHeight > 57) decreaseBounds(150)
      // else if (content.offsetHeight - html.offsetHeight > 18) decreaseBounds(5)
      /* else */ decreaseBounds(1) // First deal with images
    }
    else if (prevBounds && !merge.invoked) {
      autosaveF()
      prevBounds = false
      setTimeout(() => {
        // In case od bad HTML cut
        if (restOf[0] == '>')
          restOf = restOf.slice(1,restOf.length)

        pages.splice(curPage + 1, 0, restOf)

        if (!merge.invoked) turnRight()
        else { // Turn Page seemlessly
          curPage++
          textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? '' : pages[curPage]
          design.findImages()
        }
        restOf = ''
      },100)
    } else if (merge.invoked && sbLetters == prevLetters) {
      merge.finished = true
      merge.invoked = false
    }

    function decreaseBounds(number) {
      if (!prevBounds) str = content.innerHTML
      prevBounds = true
      // Check if we're dealing with image
      if(str[str.length-1] == '>') {
        let obj = /<img[\s\S][^<>]*?>$/gi.exec(str)
        if (obj != null) {
          restOf = str
            .slice(str.length-1-obj[0].length,str.length-1) + '>' + restOf
          str = str.slice(0,-obj[0].length)
          content.innerHTML = str
          return null
        }
      }
      restOf = str
        .slice(str.length-1-number,str.length-1) + restOf
      str = str.slice(0,-number)
      content.innerHTML = str
    }
  }


  function fontSizeReader (elem) {
    switch (elem.toString()) {
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

  function fontSizeTextToNumber (name) {
    switch (name) {
      case 'x-small':
        return 1
        break
      case 'small':
        return 2
        break
      case 'medium':
        return 3
        break
      case 'large':
        return 4
        break
      case 'x-large':
        return 5
        break
      case 'xx-large':
        return 6
        break
      case '-webkit-xxx-large':
        return 7
        break
      default:
        return name
        break
    }
  }

  function fontIterator (selEl) {
    if (selEl == null || (selEl.tagName && selEl.tagName == "BODY")){
      return 'Lato'
    } else if (selEl.face && selEl.face != undefined) {
      return selEl.face
    } else if (selEl.style.fontFamily && selEl.style.fontFamily != '') {
      return selEl.style.fontFamily
    } else {
      return fontIterator(selEl.parentElement)
    }
  }

  function sizeIterator (selEl) {
    if (selEl == null || (selEl.tagName && selEl.tagName == "BODY")){
      return 3
    } else if (selEl.size && selEl.size != undefined) {
      return selEl.size
    } else if (selEl.style.fontSize && selEl.style.fontSize != '') {
      return fontSizeTextToNumber(selEl.style.fontSize)
    } else {
      return fontIterator(selEl.parentElement)
    }
  }

  function caretSize () {
    // The following variable can be null.
    let selection = textField.contentWindow.getSelection().anchorNode
    if (selection != null) {
      var selEl = selection.parentElement
      fonts.value = fontIterator(selEl)
      fontSizeReader(sizeIterator(selEl))
    }
  }
}

// Presets & initialisation
if (document.readyState === 'complete')
  loaded()
else
  document.addEventListener('DOMContentLoaded', loaded)
