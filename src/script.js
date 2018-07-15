window.onload = () => {
  if (navigator.language != 'pl-PL') {
    english()
  }
  let arrow = document.querySelector('#arrow')
  arrow.addEventListener('click', () => {
    let el = document.querySelector('#bg')
    let top = el.offsetHeight - 75
    window.scroll({
      left : 0,
      top,
      behavior: 'smooth'
    })
  })
}
