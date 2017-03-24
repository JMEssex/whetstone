console.log(`👋👉🌎`)

$(document).ready(function() {
  $('#mdn-wiki-content').load(`${$('#mdn-wiki-content').attr('data')} #wiki-content`)
})
