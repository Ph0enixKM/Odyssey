function spellCheck() {
  let words = textField.contentDocument.body.innerHTML
    .replace(/[>]/igm,"␢>")
    .replace(/[<]/igm,"<␢")
    .replace(/[< >]/igm,"␤")
    .split("␤")

  let count = -1
  for (let word of words) {
    count += word.length + 1
    //If the word isn' HTML
    let sugg = spell.suggest(word)
    if (!word.match(/[␢]/ && sugg[0] != undefined)) {
      let isClear = false
      for (let s of sugg) {
        if (s.word == word){
          isClear = true
        }
      }
      if (!isClear) {
        console.log(textField.contentDocument.body.innerHTML.insert(count,0,"<>"));
      }
    }
  }

  // TODO: Finish it
  // spell.suggest()
}
