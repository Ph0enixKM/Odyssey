const english = () => {
  let ver = ''
  let qs = document.querySelector.bind(document)
  let html = (element, html) => {
    qs(element).innerHTML = html
  }

  html('#jumbotron', 'The Dark text editor')
  html('#label','Odyssey')
  html('#title','A text editor created especially for your writing <b>comfort</b>')
  qs('#download').innerHTML.split(' ').forEach((item, key) => {
    if (key != 0) ver += item + ' '
  })
  qs('#download').innerHTML = 'Version ' + ver
  html('#title[uno]','Come to the dark side, the dark layout will not strain your eyes')
  html('#title[dos]','Manipulate pages as if they were pieces of paper')
  html('#title[tres]','Enjoy your own text editor, for which you do not have to pay anything')
  html('#title.havana','Contact in case of problems and bugs')
  html('.footer','Copyright © All rights reserved')
}
