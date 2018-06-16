window.textField = qs("iframe")[0] //Just to remind the compiler

window.design = {
  addImageBtn : qs("#design #image")[0],
  canvas : document.createElement("canvas"),
  context : function() {return this.canvas.getContext("2d")},
  findImages : new Function(),
  towers : [],
  seed : undefined,
  clearSel : new Function(),
  updateTowers : new Function(),
}

design.addImageBtn.addEventListener("click",()=>{
  // Open file Dialog
  ipcRenderer.send("open-image")
})

ipcRenderer.on("selected-image",(event, arr)=>{
  merge.loading.style.display = "inline-block"
  merge.loading.style.opacity = 0
  merge.gif.style.transform = "rotate(30deg) scale(0)"
  merge.innerMsg.innerHTML = "Optymalizowanie zdjęcia"
  merge.loading.style.opacity = 1
  merge.gif.style.transform = "rotate(0deg) scale(1)"
  setTimeout(()=>{
    // Show up image
    let elem = document.createElement("IMG")
    elem.src = 'data:image/png;base64, ' + Buffer.from(arr[0]).toString('base64')
    elem.width = textField.contentDocument.body.offsetWidth-4
    elem.className = "image"
    elem.state = false
    elem.loaded = false
    elem.onload = () =>{
      if (!elem.loaded) {
        design.canvas.width = elem.width
        design.canvas.height = elem.height
        design.context().drawImage(elem,0,0,elem.width,elem.height)
        let src = arr[1].match(/.png$/)
          ? design.canvas.toDataURL("image/png")
          : design.canvas.toDataURL("image/jpeg",Number(SETTINGS.imageQuality))
        elem.src = src
        elem.loaded = true
      setTimeout(()=>{
        merge.loading.style.opacity = 0
        merge.gif.style.transform = "rotate(30deg) scale(0)"
        setTimeout(()=>{
          merge.loading.style.display = "none"
        },300)
      },500)
    }
  }
    textField.contentDocument.body.appendChild(elem)
    setTimeout(()=>{
      design.findImages()
    },10)
  },300)
})

design.findImages = () => {
  let imgs = textField.contentDocument.querySelectorAll('img')
  let seed = 0
  for (let tower of design.towers) {
    tower.remove()
  }
  design.towers = []
  for (let img of imgs) {
    img.setAttribute('seed', seed)
    seed++
    createTower('nw', img)
    createTower('sw', img)
    createTower('ne', img)
    createTower('se', img)
  }

  // Create tower function
  function createTower(pose, img) {
    let tower = document.createElement('div')
    tower.className = 'tower '+pose
    tower.setAttribute('seed', img.getAttribute('seed'))
    document.body.appendChild(tower)
    design.towers.push(tower)
  }
}

design.updateTowers = () => {
  let towers = document.querySelectorAll('.tower')
  let scrollTop = document.querySelector('.iframe').scrollTop
  let html = textField.contentDocument.documentElement
  for (let tower of towers) {
    let seed = tower.getAttribute('seed')
    let img = textField.contentDocument.querySelector(`img[seed='${seed}']`)
    let pose = tower.classList.item(1)

    switch (pose) {
      case 'nw':
        tower.style.top = img.offsetTop + parseInt(html.style.top) + textField.offsetTop - 5 - scrollTop + 'px'
        tower.style.left = img.offsetLeft + parseInt(html.style.left) + textField.offsetLeft - 5 + 'px'
        break
      case 'sw':
        tower.style.top = img.offsetTop + parseInt(html.style.top) + textField.offsetTop + img.offsetHeight - 5 - scrollTop + 'px'
        tower.style.left = img.offsetLeft + parseInt(html.style.left) + textField.offsetLeft - 5 + 'px'
        break
      case 'ne':
        tower.style.top = img.offsetTop + parseInt(html.style.top) + textField.offsetTop - 5 - scrollTop + 'px'
        tower.style.left = img.offsetLeft + parseInt(html.style.left) + textField.offsetLeft + img.offsetWidth - 5 + 'px'
        break
      case 'se':
        tower.style.top = img.offsetTop + parseInt(html.style.top) + textField.offsetTop + img.offsetHeight - 5 - scrollTop + 'px'
        tower.style.left = img.offsetLeft + parseInt(html.style.left) + textField.offsetLeft + img.offsetWidth - 5 + 'px'
        break
    }
  }
}

// Update every 16 ms
setInterval( () => design.updateTowers(), 16)

window.addEventListener('click', e => design.clearSel(e))
textField.contentDocument.documentElement.addEventListener('click', e => design.clearSel(e))

design.clearSel = e => {
  let el = e.target
  if (el.getAttribute('seed') == null) {
    if (design.seed != undefined) {
      deselect()
    }
    design.seed = undefined
  }
  else if (el.getAttribute('seed') != design.seed) {
    if (design.seed != undefined) {
      deselect()
      select(el.getAttribute('seed'))
    } else {
      select(el.getAttribute('seed'))
    }
  }

  function deselect () {
    let img = textField.contentDocument.querySelector(`img[seed='${design.seed}']`)
    let towers = document.body.querySelectorAll(`.tower[seed='${design.seed}']`)
    img.style.border = `none`
    img.style.filter = `grayscale(100%) brightness(70%)`
    for (let tower of towers) {
      tower.style.display = `none`
    }
  }

  function select (seed) {
    let img = textField.contentDocument.querySelector(`img[seed='${seed}']`)
    let towers = document.querySelectorAll(`.tower[seed='${seed}']`)
    img.style.border = `1px solid orange`
    img.style.filter = `grayscale(0) brightness(100%)`
    for (let tower of towers) {
      tower.style.display = `inline-block`
    }
    design.seed = seed
  }
}
