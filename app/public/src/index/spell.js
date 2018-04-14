// SpellChecker Laod
function spellLoad() {
  // Require the electron spellchecker
  const electronSpellchecker = require('electron-spellchecker');

  // Retrieve required properties
  const SpellCheckHandler = electronSpellchecker.SpellCheckHandler;
  const ContextMenuListener = electronSpellchecker.ContextMenuListener;
  const ContextMenuBuilder = electronSpellchecker.ContextMenuBuilder;

  // Configure the spellcheckhandler
  window.spellCheckHandler = new SpellCheckHandler();
  window.spellCheckHandler.attachToInput();

  // Start off as "US English, America"
  window.spellCheckHandler.switchLanguage('pl-PL');

  // Create the builder with the configured spellhandler
  let contextMenuBuilder = new ContextMenuBuilder(window.spellCheckHandler);

  // Add context menu listener
  let contextMenuListener = new ContextMenuListener((info) => {
      contextMenuBuilder.showPopupMenu(info);
  });
}
spellLoad()
