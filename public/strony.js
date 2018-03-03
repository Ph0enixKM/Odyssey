let strony = {
  btn : qs('#merge-all')[0],
  loading : qs('#compiling')[0],
  innerMsg : qs('#compiling-cont p')[0],
  gif : qs('#compiling-gif')[0],
  finished : false,
  invoked : false
}


strony.btn.addEventListener("click",()=>{
  strony.loading.style.display = "inline-block"
  strony.loading.style.opacity = 0
  strony.gif.style.transform = "rotate(30deg) scale(0)"
  strony.innerMsg.innerHTML = "Scalanie Stron"
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
  strony.invoked = true

  setTimeout(()=>{
    strony.loading.style.opacity = 1
    strony.gif.style.transform = "rotate(0deg) scale(1)"
  },300)
})

setInterval(()=>{
  if (strony.finished) {
    setTimeout(()=>{
      strony.loading.style.opacity = 0
      strony.gif.style.transform = "rotate(30deg) scale(0)"
      setTimeout(()=>{
        strony.loading.style.display = "none"
      },300)
    },500)
    strony.finished = false
  }
},200)
