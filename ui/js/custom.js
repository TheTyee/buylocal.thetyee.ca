$(document).ready(function(){
  	var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1bpwVmVv4J7ZpXi0BZeG8sH93jhHFD6CCTxtzmin3SeA/pubhtml';

	  function init() {
	    var tabletop = Tabletop.init( { key: public_spreadsheet_url, callback: showInfo } )
	  }

	  function showInfo(data, tabletop) {
	  	
	  		all_partners = data.Sheet1.elements;
		console.log(all_partners);

		$.each(all_partners, function(index, value){
			console.log(value);
	
			var template;
			var each_rendered;
			var view;

			view = value;
			template = $('#partner_template').html();
			//Mustache.parse(template);   // optional, speeds up future uses
			each_rendered = Mustache.render(template, view);
			console.log(template);
			$('#partners').append(each_rendered);
			});
		}

init();

});