module.exports = () => {
  let get = document.querySelector.bind(document)
  // Translate HTML
  get('.bar t').innerHTML = 'Odyssey'
  get('.bar span').innerHTML = '&lt;Untitled&gt;'
  get('#ctx-menu').title = 'Change mode'
  get('#ctx-menu').innerHTML = 'Tools'
  get('#bold').title = 'Bold'
  get('#italic').title = 'Italic'
  get('#underline').title = 'Underline'
  get('input[font-size]').title = 'Font size'
  get('.justify').title = 'Text placement'
  get('#design #image').title = 'Insert image'
  get('#design #fg-text').title = 'Text color'
  get('#design #bg-text').title = 'Text background color'
  get('#view #full-view').title = 'Full view'
  get('#pages #merge-all').title = 'Merge all pages'
  get('#pages #print').title = 'Print'
  get('#pages #print-view').title = 'Print preview'
  get('#project #title').title = 'Title'
  get('#project #keys').title = 'Keywords (space separated)'
  get('#project #author').title = 'Author'
  get('#project #title').placeholder = '<Untitled>'
  get('#project #keys').placeholder = '<No Keys>'
  get('#project #author').placeholder = '<No Author>'
  get('.menu #reload').title = 'Renovate Document'
  get('.menu #open-file').title = 'Open File'
  get('.menu #save-file').title = 'Save File As'
  get('.menu #quick-save').title = 'Save File'
  get('.menu #settings').title = 'Settings'
  get('.menu[ctx] button[tools]').innerHTML = 'Tools'
  get('.menu[ctx] button[design]').innerHTML = 'Design'
  get('.menu[ctx] button[view]').innerHTML = 'View'
  get('.menu[ctx] button[pages]').innerHTML = 'Pages'
  get('.menu[ctx] button[project]').innerHTML = 'Project'
  get('.full-view .fv-tools p').innerHTML = 'Full view'
  get('.full-view .fv-tools span#trash').title = 'Delete pages'
  get('.full-view .fv-tools disabled#move').title = 'You have to select a sequence of pages in succession'
  get('.full-view .fv-tools disabled#merge').title = 'You have to select a sequence of pages in succession'
  get('.full-view .fv-tools span#chapter-view').title = 'All chapter view'
  get('.full-view .fv-tools span#move-btn').title = 'Chain editor'
  get('.full-view .fv-tools span#merge-sel').title = 'Merge selected pages'
  get('.full-view .fv-tools #move-bg p').innerHTML = 'Chain editor'
  get('.full-view .fv-tools #chapter-bg p').innerHTML = 'Chapters'
  get('.full-view .fv-tools #chapter-bg input').title = 'Chapter name'
  get('.full-view .fv-tools #chapter-bg #trash').title = 'Delete chapter'
  get('#compiling p').innerHTML = 'Processing'
  get('.settings .general').innerHTML = 'General'
  get('.settings .themes').innerHTML = 'Theme'
  get('.settings #options h1').innerHTML = 'General'
  get('.settings #options .autosave span').innerHTML = 'Autosave backup'
  get('.settings #options .img-quality span').innerHTML = 'JPG image quality'
  get('.settings #options .scroll-past-end span').innerHTML = 'Scroll past end'
  get('.settings #options .choose-spell span').innerHTML = 'Choose dictionary language'
}
