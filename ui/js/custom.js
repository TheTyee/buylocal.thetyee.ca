$(document).ready(function(){

	//Initialize partner ads through tabletop
  	
  	var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1bpwVmVv4J7ZpXi0BZeG8sH93jhHFD6CCTxtzmin3SeA/pubhtml';
	  function init() {
	    var tabletop = Tabletop.init( { key: public_spreadsheet_url, callback: showInfo } )
	  }

	  function showInfo(data, tabletop) {
	  	
	  	all_partners = data.Sheet1.elements;
		total_partners = all_partners.length;

		randomizer = Math.floor((Math.random() * total_partners) + 1);
		var template;
		var each_rendered;
		var view;
		view = all_partners[randomizer];
		template = $('#partner_template').html();
		each_rendered = Mustache.render(template, view);
		//console.log(template);
		$('#partners').html(each_rendered);
	}

	init();

	//Initialize footer content through tabletop

	var footer_content = 'https://docs.google.com/spreadsheets/d/1OHdC2tYZz--Q3ksP2qk8AzBd8jSNp8qSElsBB3sCsGY/pubhtml';

	 function footer_init() {
	    var tabletop = Tabletop.init( { key: footer_content, callback: footer_showInfo } )
	  }

	  function footer_showInfo(data, tabletop) {
	  	
	  		all_partners = data.Sheet1.elements;

	  		$.each(all_partners, function(key, value){
				var template;
				var each_rendered;
				var view;
				view = value;
				template = $('#footer_template').html();
				each_rendered = Mustache.render(template, view);
				//console.log(template);
				$('#footer').append(each_rendered);
			});
	}

	footer_init();

	var rawDate = '2013-11-18 10:57:51';
	var trimmedDate = rawDate.split(" ")[0];
	//alert(testTime);
	var cleanedDate = moment(trimmedDate, 'YYYY-MM-DD').format('MMMM DD, YYYY');
	console.log(cleanedDate);
});