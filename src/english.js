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
  html('#title[uno]','Dark Layout, Dusky design')
  html('#title[dos]','Freedom to manipulate pages')
  html('#title[tres]','Free usage')
  html('#title.havana','Contact in case of problems and bugs')
  html('.footer','Copyright © All rights reserved')
}
