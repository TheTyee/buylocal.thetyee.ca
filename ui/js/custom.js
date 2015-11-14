$(document).ready(function(){

	//Initialize partner ads through tabletop
  	
  	var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1bpwVmVv4J7ZpXi0BZeG8sH93jhHFD6CCTxtzmin3SeA/pubhtml';
	function init() {
		var tabletop = Tabletop.init( { key: public_spreadsheet_url, callback: showInfo } )
	}

	function showInfo(data, tabletop) {
		all_partners = data.Sheet1.elements;
		total_partners = all_partners.length;
	//Create an array of 3 unmatching numbers that i can retrieve from the spreadsheet onpage load

		for (var a=[],i=0;i<total_partners;++i) a[i]=i;	
			function shuffle(array) {
			  var tmp, current, top = array.length;
			  if(top) while(--top) {
			    current = Math.floor(Math.random() * (top + 1));
			    tmp = array[current];
			    array[current] = array[top];
			    array[top] = tmp;
			  }
			  return array;
		}
		a = shuffle(a);
		//limit it to 3, since that's all we'll show
		randomizer = a.slice(0,3);

		$.each(randomizer, function(key, value){
			var template;
			var each_rendered;
			var view;
			view = all_partners[value];
			template = $('#partner_template').html();
			each_rendered = Mustache.render(template, view);
				$('.partner-'+key).html(each_rendered);
			});
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


	//$(".letters > div:nth-child(9)").css('background', 'green');
	//$('.dateCreated').css('background', 'blue');
	
});