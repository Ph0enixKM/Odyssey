// SpellChecker Laod
function spellLoad() {
  // Require the electron spellchecker
  const electronSpellchecker = require('electron-spellchecker');

  // Retrieve required properties
  const SpellCheckHandler = electronSpellchecker.SpellCheckHandler;
  const ContextMenuListener = electronSpellchecker.ContextMenuListener;
  const ContextMenuBuilder = electronSpellchecker.ContextMenuBuilder;

  // Configure the spellcheckhandler
  textField.contentWindow.spellCheckHandler = new SpellCheckHandler();
  textField.contentWindow.spellCheckHandler.attachToInput();

  // Start off as "US English, America"
  textField.contentWindow.spellCheckHandler.switchLanguage('pl-PL');

  // Create the builder with the configured spellhandler
  let contextMenuBuilder = new ContextMenuBuilder(textField.contentWindow.spellCheckHandler);

  // Add context menu listener
  // let contextMenuListener = new ContextMenuListener((info) => {
  //   contextMenuBuilder.showPopupMenu(info)
  // });
  // TODO: https://www.npmjs.com/package/electron-spell-check-provider
}
spellLoad()
