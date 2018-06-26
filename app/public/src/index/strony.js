window.merge = {
  btn : qs('#merge-all')[0],
  loading : qs('#compiling')[0],
  innerMsg : qs('#compiling-cont p')[0],
  gif : qs('#compiling-gif')[0],
  finished : false,
  invoked : false
}


merge.btn.addEventListener("click",()=>{
  merge.loading.style.display = "inline-block"
  merge.loading.style.opacity = 0
  merge.gif.style.transform = "rotate(30deg) scale(0)"
  if (lang === 'PL') merge.innerMsg.innerHTML = "Scalanie Wszystkich Stron"
  if (lang === 'EN') merge.innerMsg.innerHTML = "Merging All Pages"
  //Merging
  let all = ""
  pages.map(item => {
    all += (item != undefined) ? item : "" + " "
    return item
  })

  //Replace
  pages = []
  pages[0] = all

  //Change Page
  curPage = 0
  textField.contentDocument.body.innerHTML = (pages[curPage] == undefined) ? "" : pages[curPage]
  merge.invoked = true

  setTimeout(()=>{
    merge.loading.style.opacity = 1
    merge.gif.style.transform = "rotate(0deg) scale(1)"
  },300)
})

setInterval(()=>{
  if (merge.finished) {
    setTimeout(()=>{
      merge.loading.style.opacity = 0
      merge.gif.style.transform = "rotate(30deg) scale(0)"
      setTimeout(()=>{
        merge.loading.style.display = "none"
      },300)
    },500)
    merge.finished = false
  }
},200)


// Print section

window.printReq = {
  btn : qs('#print')[0],
  printView : qs('#print-view')[0],
  printViewToggle : qs('#print-view .toggle')[0],
  printViewState : false
}

printReq.btn.addEventListener('click',()=>{
  ipcRenderer.send('print',{pages,margins})
})
printReq.printView.addEventListener('click',()=>{
  printReq.printViewState = !printReq.printViewState
  if (printReq.printViewState) {
    // Turn on toggle
    printReq.printViewToggle.className = "toggle-on"

    // Turn paper White
    textField.style.background = 'white'
    textField.contentDocument.body.style.color = 'black'
    document.body.style.background = 'radial-gradient(#ccc,#222)'
    qs('.caret')[0].style.visibility = 'hidden'

    // Turn off Spell Checker
    textField.contentDocument.body.setAttribute("contenteditable",false)
  } else {
    // Turn on toggle
    printReq.printViewToggle.className = "toggle"

    // Turn paper White
    textField.style.background = '#444'
    textField.contentDocument.body.style.color = '#aaa'
    document.body.style.background = 'radial-gradient(#333,#222)'
    qs('.caret')[0].style.visibility = 'visible'

    // Turn off Spell Checker
    textField.contentDocument.body.setAttribute("contenteditable",true)
  }
})
