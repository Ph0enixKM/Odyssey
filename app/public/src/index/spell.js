import {SpellCheckHandler, ContextMenuListener, ContextMenuBuilder} from 'electron-spellchecker';

window.spellCheckHandler = new SpellCheckHandler();
window.spellCheckHandler.attachToInput();

if (lang === 'PL') window.spellCheckHandler.switchLanguage('pl-PL')
if (lang === 'EN') window.spellCheckHandler.switchLanguage('en-US')

let contextMenuBuilder = new ContextMenuBuilder(window.spellCheckHandler)

let contextMenuListener = new ContextMenuListener((info) => {
  // Display only inside editor
  if (document.activeElement == textField) {
    contextMenuBuilder.showPopupMenu(info);
  }
});
