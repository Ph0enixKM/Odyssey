window.textField = qs("iframe")[0] //Just to remind the compiler

window.design = {
  addImageBtn : qs("#design #image")[0],
  canvas : document.createElement("canvas"),
  context : function() {return this.canvas.getContext("2d")},
  findImages : new Function(),
  towers : [],
  tower : undefined,
  seed : undefined,
  clearSel : new Function(),
  updateTowers : new Function(),
  mouse : {x : null, y : null},
  imgSize : []
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
    tower.addEventListener('mousedown', () => towerDown ({pose, img}))
    tower.addEventListener('mousemove', e => towerActive(e, true))
    tower.addEventListener('mouseup', () => towerInactive())
  }

  function towerDown (query) {
    let seed = query.img.getAttribute('seed')
    let { pose } = query
    design.imgSize = [query.img.width, query.img.height]
    design.tower = document.querySelector(`.tower.${pose}[seed='${seed}']`)
  }
}

function towerInactive () {
  design.tower = undefined
}

function towerActive (event, offset) {
  let scrollTop = document.querySelector('.iframe').scrollTop
  if (design.tower == null) {
    design.mouse.x = null
    design.mouse.y = null
    return false
  } else if (offset) {
    design.mouse.x = event.x - textField.offsetLeft
    design.mouse.y = event.y - textField.offsetTop + scrollTop
    return true
  }
  design.mouse.x = event.x
  design.mouse.y = event.y
}
textField.contentWindow.addEventListener('mousemove', e => towerActive(e))
textField.contentWindow.addEventListener('mouseup', () => towerInactive())

design.updateTowers = () => {
  let towers = document.querySelectorAll('.tower')
  let scrollTop = document.querySelector('.iframe').scrollTop
  let html = textField.contentDocument.documentElement
  for (let tower of towers) {
    let seed = tower.getAttribute('seed')
    let img = textField.contentDocument.querySelector(`img[seed='${seed}']`)
    let pose = tower.classList.item(1)
    let moving = (design.mouse.x != null && design.mouse.y != null && design.tower != null)
      ? true
      : false
    let top
    let left
    let cPose = (moving) ? design.tower.classList.item(1) : null
    let cSeed = (moving) ? design.tower.getAttribute('seed') : null
    // console.log(Array.from(document.querySelectorAll('.tower.nw')).map(item => {
    //   return item.style.top
    // }))
    if (img == null) {
      design.findImages()
      return false
    }

    switch (pose) {
      case 'nw':
        top = img.offsetTop + parseInt(html.style.top) + textField.offsetTop - 5 - scrollTop
        left = img.offsetLeft + parseInt(html.style.left) + textField.offsetLeft - 5
        tower.style.top = top + 'px'
        tower.style.left = left + 'px'
        imageResize({pose, cPose, seed, cSeed, img, moving, html})
        break
      case 'sw':
        top = img.offsetTop + parseInt(html.style.top) + textField.offsetTop + img.offsetHeight - 5 - scrollTop
        left = img.offsetLeft + parseInt(html.style.left) + textField.offsetLeft - 5
        tower.style.top = (!moving || cPose != pose || cSeed != seed) ? top + 'px' : design.mouse.y + textField.offsetTop - 5 - scrollTop + 'px'
        tower.style.left = left + 'px'
        imageResize({pose, cPose, seed, cSeed, img, moving, html})
        break
      case 'ne':
        top = img.offsetTop + parseInt(html.style.top) + textField.offsetTop - 5 - scrollTop
        left = img.offsetLeft + parseInt(html.style.left) + textField.offsetLeft + img.offsetWidth - 5
        tower.style.top = top + 'px'
        tower.style.left = (!moving || cPose != pose || cSeed != seed) ? left + 'px' : design.mouse.x + textField.offsetLeft - 5 + 'px'
        imageResize({pose, cPose, seed, cSeed, img, moving, html})
        break
      case 'se':
        top = img.offsetTop + parseInt(html.style.top) + textField.offsetTop + img.offsetHeight - 5 - scrollTop
        left = img.offsetLeft + parseInt(html.style.left) + textField.offsetLeft + img.offsetWidth - 5
        tower.style.top = (!moving || cPose != pose || cSeed != seed) ? top + 'px' : design.mouse.y + textField.offsetTop - 5 - scrollTop + 'px'
        tower.style.left = (!moving || cPose != pose || cSeed != seed) ? left + 'px' : design.mouse.x + textField.offsetLeft - 5 + 'px'
        imageResize({pose, cPose, seed, cSeed, img, moving, html})
        break
    }
  }
}

function imageResize (query) {
  let { moving, cPose, pose, cSeed, seed, img, html } = query
  if (moving && cPose == pose && cSeed == seed) {
    switch (pose) {
      case 'nw':
        img.width = (img.offsetLeft + design.imgSize[0] + parseInt(html.style.left) - design.mouse.x)
        img.height = (img.offsetTop + design.imgSize[1] + parseInt(html.style.top) - design.mouse.y)
        break
      case 'sw':
        img.width = (img.offsetLeft + design.imgSize[0] + parseInt(html.style.left) - design.mouse.x)
        img.height = -(img.offsetTop + parseInt(html.style.top) - design.mouse.y)
        break
      case 'ne':
        img.width = -(img.offsetLeft + parseInt(html.style.left) - design.mouse.x)
        img.height = (img.offsetTop + design.imgSize[1] + parseInt(html.style.top) - design.mouse.y)
        break
      case 'se':
        img.width = -(img.offsetLeft + parseInt(html.style.left) - design.mouse.x)
        img.height = -(img.offsetTop + parseInt(html.style.top) - design.mouse.y)
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
  let caret = document.querySelector('.caret')
  if (el.getAttribute('seed') == null) {
    if (design.seed != undefined) {
      deselect()
    }
    design.seed = undefined
    caret.style.visibility = 'visible'
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
    try {
      let img = textField.contentDocument.querySelector(`img[seed='${design.seed}']`)
      let towers = document.body.querySelectorAll(`.tower[seed='${design.seed}']`)
      img.style.border = `none`
      img.style.filter = `grayscale(100%) brightness(70%)`
      for (let tower of towers) {
        tower.style.display = `none`
      }
    } catch (e) {
      caret.style.visibility = 'visible'
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
    textField.contentDocument.body.blur()
    window.focus()
    caret.style.visibility = 'hidden'
  }
}
