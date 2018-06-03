function contAnim () {
  let cont = document.querySelector('#cont')
  setTimeout(() => {
    cont.style.opacity = 1
    cont.style.transform = 'translate(0,0)'
  }, 3000);
}
contAnim()
