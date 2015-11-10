$(document).ready(function(){
  	var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1bpwVmVv4J7ZpXi0BZeG8sH93jhHFD6CCTxtzmin3SeA/pubhtml';
	  function init() {
	    var tabletop = Tabletop.init( { key: public_spreadsheet_url, callback: showInfo } )
	  }

	  function showInfo(data, tabletop) {
	  	
	  	all_partners = data.Sheet1.elements;
		total_partners = all_partners.length;

		randomizer = Math.floor((Math.random() * 10) + 1);



			var template;
			var each_rendered;
			var view;
	
			//Math.floor((Math.random() * 10) + 1);
			view = all_partners[randomizer];
			template = $('#partner_template').html();
			//Mustache.parse(template);   // optional, speeds up future uses
			each_rendered = Mustache.render(template, view);
			console.log(template);
			$('#partners').html(each_rendered);

/*
		$.each(all_partners, function(index, value){
			//console.log(value);
	
			var template;
			var each_rendered;
			var view;
	
			//Math.floor((Math.random() * 10) + 1);
			view = value;
			template = $('#partner_template').html();
			//Mustache.parse(template);   // optional, speeds up future uses
			each_rendered = Mustache.render(template, view);
			console.log(template);
			$('#partners').html(each_rendered);
			});*/
		}

init();

});