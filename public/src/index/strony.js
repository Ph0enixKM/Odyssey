let merge = {
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
  merge.innerMsg.innerHTML = "Scalanie Wszystkich Stron"
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
