import {SpellCheckHandler, ContextMenuListener, ContextMenuBuilder} from 'electron-spellchecker';

window.spellCheckHandler = new SpellCheckHandler();
window.spellCheckHandler.attachToInput();

window.spellCheckHandler.switchLanguage('pl-PL');

let contextMenuBuilder = new ContextMenuBuilder(window.spellCheckHandler);
console.log(contextMenuBuilder);

let contextMenuListener = new ContextMenuListener((info) => {
  // Display only inside editor
  if (document.activeElement == textField) {
    contextMenuBuilder.showPopupMenu(info);
  }
});
