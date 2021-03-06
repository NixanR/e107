$(document).ready(function()
{
		// Change hash when a tab changes
		$('.nav-tabs a').on('shown', function (event) {
			var hash = event.target.href.toString().split('#')[1], form = $(event.target).parents('form')[0];
		    window.location.hash = '/' + hash;
		    if(form) {
				$(form).attr('action', $(form).attr('action').split('#')[0] + '#/' + hash);
		    }
		});
		
		// tabs hash
		if(/^#\/\w+/.test(window.location.hash)) {
			var hash = window.location.hash.substr(2);
			if(hash.match('^tab')){ $('.nav-tabs a[href=#' + hash + ']').tab('show'); }
		}
	
		$('.e-typeahead').each( function(){ 		
	
			var id = $(this).attr("id");
			var name = '#' + id.replace('-usersearch', '');
			var newval = $(this).attr("data-value");
			
			$(this).typeahead({
			source: $(this).attr("data-source"), 
			updater: function(text, type){
				if(type === 'value')
				{
					$(name).val(text);	
				}
				return text;	
				}
			});
		});
	
		/* Switch to Tab containing invalid form field. */
		$('input[type=submit],button[type=submit]').on('click', function() {
			
			var id 		= $(this).closest('form').attr('id');
			var found 	= false;
		       
			 $('#'+id).find('input:invalid,select:invalid,textarea:invalid').each(function(index, node) {
			
				var tab = $('#'+node.id).closest('.tab-pane').attr('id');
			
				if(tab && (found === false))
				{
					$('a[href="#'+tab+'"]').tab('show');
					found = true;
				//	alert(node.id+' : '+tab + ' '.index);
				}
			//   var label = $('label[for=' + node.id + ']');
            });
            
            return true;
		});
	
	

		// run tips on title attribute. 
		$(".e-tip").each(function() {
						
			
			var tip = $(this).attr('title');
			if(!tip)
			{
				return;
			}
			
			var pos = $(this).attr('data-placement'); 
			if(!pos)
			{
				pos = 'top';	
			}
			
			$(this).tooltip({opacity:1.0,fade:true, placement: pos});
			// $(this).css( 'cursor', 'pointer' )
		});
		
		
		$("#uiModal").draggable({
   			 handle: ".modal-header"
		}); 
		
	
		$('div.e-container').editable({
			selector: '.e-editable'
		});
		
//		$('.e-editable').editable();
		
		// Fix for boostrap modal cache. 
		
	//	$('.modal').on('hidden',function(){
	//	    $(this).removeData('.modal');
		 //   $('#uiModal .modal-label').text('Loading');
		 //   $('#uiModal .modal-body').html('default_body');
	//	});
		
		$('body').on('hidden', '.modal', function () {
			$(this).removeData('modal');
			 $('#uiModal .modal-label').text('Loading...');
			$('#uiModal .modal-body').html('&nbsp;');
			});
		
		
		
			
		$('a[data-toggle="modal"]').on('click', function()
			{
				var link = $(this).attr('href');
				var caption  = $(this).attr('data-modal-caption');
				var height 		= ($(window).height() * 0.9) - 50;
				
				 $('#uiModal .modal-caption').text(caption);
				 $('.modal').height(height);
				// $('#uiModal .modal-label').text('Loading...');
				// $('#uiModal .modal-body').html(link);
				// alert(caption);
			}
		);
		
		
		$('button[data-loading-text],a[data-loading-text]').on('click', function()
			{
				var caption  = $(this).attr('data-loading-text');
				$(this).removeClass('btn-success');	
				$(this).removeClass('btn-primary');		
				$(this).html(caption);
				if($(this).attr('data-disable') == 'true')
				{	
					$(this).attr('disabled', 'disabled');
				}
				return true;
			}
		);
		
		$('input[data-loading-text]').on('click', function()
			{
				var caption  = $(this).attr('data-loading-text');	
				$(this).val(caption);
				$(this).removeClass('btn-success');	
				$(this).removeClass('btn-primary');		
				//$(this).attr('disabled', 'disabled').val(caption);
				return true;
			}
		);


		/* InfoPanel Comment approval and deletion */
		$(document).on("click", "button[data-comment-action]", function(){
				
				var url 	= $(this).attr("data-target");
				var action 	= $(this).attr('data-comment-action');	
				var id 		= $(this).attr("data-comment-id");
				var next	= $('#comment-'+ id).nextAll('.hide').attr("id");	
				
				$.ajax({
				  type: 'POST',
				  url: url + '?ajax_used=1&mode='+action,
				  data: { itemid: id },
				  success: function(data) {
				  	var a = $.parseJSON(data);
				 // 	alert(data);
					if(!a.error)
					{
						$('#comment-'+ id).hide(800, function () {
							$('#'+next).show('slow');
							$('#'+next).removeClass('hide');
						});

					}
	
				  }
				});
				
				return false;
	
		});











		
		
		/*  Bootstrap Modal window within an iFrame */
		$('.e-modal').on('click', function(e) 
		{
    		e.preventDefault();
    		var url 		= $(this).attr('href');
    		var caption  	= $(this).attr('data-modal-caption');
			var height 		= ($(window).height() * 0.7) - 50;
			
    		$('.modal-body').html('<div class="well"><iframe width="100%" height="'+height+'px" frameborder="0" scrolling="auto" style="display:block;background-color:transparent" allowtransparency="true" src="' + url + '"></iframe></div>');
    		$('.modal-caption').text(caption);
    		$('.modal').modal('show');
    	});	

		

		var progresspump = null;

		$('.e-progress-cancel').on('click', function(e) 
		{
			clearInterval(progresspump);
			var target	= $(this).attr('data-progress-target');
			$("#"+target).closest('.progress').removeClass("active");
			progresspump = null;
			alert('stopped');
		});

		$('.e-progress').on('click', function(e) 
		{
		//	alert('Process Started');

			var target	= $(this).attr('data-progress-target');
			var script 	= $(this).attr('data-progress');
			var show 	= $(this).attr('data-progress-show');
			var hide 	= $(this).attr('data-progress-hide');
			var mode 	= $(this).attr('data-progress-mode');
			var interval = $(this).attr('data-progress-interval');
			
			if(interval === undefined)
			{
				interval = 1000;	
			}
			
			$("#"+target).css('width','1%'); // so we know it's running.   
			
			progresspump = setInterval(function(){
		
			$.get(script, { mode: mode }).done( function(data){		  	  	
		  
				//	alert(data);
				$("#"+target).css('width', data+'%');   	// update the progress bar width */
				$("#"+target).html(data+'%');     		// display the numeric value */
		    
				if(data > 99.999) {
				
					clearInterval(progresspump);
			        $("#"+target).closest('.progress').removeClass("active");

			        $("#"+target).html("Done");
			        
			        if(hide !== 'undefined')
			        {
						$('#'+hide).hide();	
			        }
			        
			        if(show !== 'undefined')
			        {
						$('#'+show).show('slow');	
			        }
			      
		        
					}
		    
		     });  

		  }, interval);
		});
		
		
		
		
		

	/*
		
		$('a[data-toggle="modal"]').on('click', function()
		{
			$(this).removeData('modal');
			$('#uiModal .modal-header').text($(this).attr('title'));
			var link = $(this).attr('href');
			alert(link);
			$('#uiModal .modal-body').html( 'table' );
			//return false;
			
			return this;
			
			$('#uiModal .modal-body').load(link, function(response, status, xhr) 
		        {
		            if (status === 'error') 
		            {
		                //console.log('got here');
		                $('#uiModal .modal-body').html('<h2>Oh boy</h2><p>Sorry, but there was an error:' + xhr.status + ' ' + xhr.statusText+ '</p>');
		            }
		return false;
		            return this;
		        }
		    )
			
		});
		
		*/

		
		
	
		
		
		$('.e-noclick').click(function(e) {
	    	e.stopPropagation();
	  	});
	

		// BC Compatible 
		$("select.tbox").each(function() {
			
			var multi = $(this).attr('multiple');
			
			if(multi === undefined)
			{
			//	 $(this).selectpicker();	// causes HTML5 validation alert to be hidden. 
				return;
			}
			else
			{
				$(this).multiselect();	
			}
			
		});
		
			// run tips on .field-help 
		$("div.tbox,input,textarea,select,label,.e-tip").each(function(c) {
						
			var t = $(this).nextAll(".field-help");
			
			var placement = 'right';	
			
			if($(this).is("textarea"))
			{
				var placement = 'top';	
			}
			
			
			t.hide();
		//	alert('hello');
			$(this).tooltip({
				title: function() {
					var tip = t.html();			
					return tip; 
				},
				fade: true,
				html: true,
				opacity: 1.0,
				placement: placement,
				delay: { show: 300, hide: 600 } 
			});
		
		});
	
	//	 $(".e-spinner").spinner(); //FIXME breaks tooltips etc. 


    $(document).on("click", ".e-alert", function(){
			
			var message = $(this).html();
			alert(message);
			$("#uiAlert").val(message);
			$("#uiAlert").alert();
			$("#uiAlert").fadeIn('slow');
			window.setTimeout(function() { 	$("#uiAlert").alert('close'); }, 4000);
				
		});
		
	
	
	
	
		$(".e-radio-multi").each(function() {
		//	$(this).nextAll(".field-help").hide();
		//	$(this).nextAll(":input").tipsy({title: 'hello'});
			
		});
		
		$(".e-tags").tag();
		
		

		// Decorate		
		$(".adminlist tr:even").addClass("even");
		$(".adminlist tr:odd").addClass("odd");
		$(".adminlist tr:first").addClass("first");
  		$(".adminlist tr:last").addClass("last");
				
		
		
		// Admin Prefs Navigation
		
		 $(".plugin-navigation a").click(function () {
		 	$(".plugin-navigation a").each(function(index) {
    			var ot = $(this).attr("href");
				$(ot).hide().removeClass('e-hideme');
				$(this).closest("li").removeClass("active");
				$(this).switchClass( "link-active", "link", 0 );
			});
	   		var id = $(this).attr("href"), hash = id.split('#')[1], form = $('.admin-menu')[0]; // FIXME - a better way to detect the page form
	   		
			$(this).switchClass( "link", "link-active", 30 );
			$(this).closest("li").addClass("active");
			$(id).removeClass('e-hideme').show({
				effect: "slide"
			});
			// 'remember' the active navigation pane
			if(hash) {
				window.location.hash = 'nav-' + hash;
			  	if(form) {
			    	$(form).attr('action', $(form).attr('action').split('#')[0] + '#nav-' + hash);
			    }
			    return false; 
			}
		}); 
		
		// plugin navigation hash
		if(/^#nav-+/.test(window.location.hash)) {
			$("a[href='" + window.location.hash.replace('nav-', '') + "']").click();
		}
		
		// backend 
		$(".e-password").pwdMeter({
	            minLength: 6,
	            displayGeneratePassword: true,
	            generatePassText: "Generate",
	            randomPassLength: 12
	    });
		
		
		
		// Sorting
		var fixHelper = function(e, ui) {
			ui.closest("tr").switchClass( "odd", "highlight-odd e-sort", 0 );
			ui.closest("tr").switchClass( "even", "highlight-even e-sort", 0 );
			ui.children().each(function() {
				$(this).width($(this).width());
			// 	$(this).closest("tr").switchClass( "odd", "highlight-odd", 0 );
			//	$(this).closest("tr").switchClass( "even", "highlight-even", 0 );
			});
			return ui;
		};
		
		$("#e-sort").sortable({
			helper: fixHelper,
			cursor: "move",
			opacity: 0.9,
			handle: ".e-sort",
			distance: 20,
			containment: "parent",
			stop: function(e,ui) {
			    var allItems = $(this).sortable("toArray");
			    var newSortValue = allItems.indexOf( $(ui.item).attr("id") );
			 //   alert($(ui.item).attr("id") + " was moved to index " + newSortValue);
			 	$(".highlight-even").switchClass( "highlight-even", "even", 600 );
				$(".highlight-odd").switchClass( "highlight-odd", "odd", 600 );
				$("tr.e-sort").removeClass( "e-sort");  
				  
			},
			
			update: function(event, ui) {         	
				var allItems = $(this).sortable("toArray");
			//	console.log(allItems);
				var neworder = allItems.indexOf( $(ui.item).attr("id") );
				var linkid = $(ui.item).attr("id"); 
			//	 $("td").removeClass("e-moving","slow"); 
			     	
				var script = $(".sort-trigger:first").attr("data-target"); 

				$.ajax({
				  type: "POST",
				  url: script,
				  data: { all: allItems, linkid: linkid, neworder: neworder }
			//	  data: { linkid: linkid, neworder: neworder }
				}).done(function( msg ) {
				
				// alert("Posted: "+allItems+" Updated: "+ msg );
				});

 			}
		
		});	
	//	}).disableSelection(); // causes issue with admin->users drop-down selection. 
	
		
		// Check ALl Button
		$("#e-check-all").click(function(){
			$('input[type="checkbox"]').attr("checked", "checked");
		});
		
		// Uncheck all button. 
		$("#e-uncheck-all").click(function(){
			$('input[type="checkbox"]').removeAttr("checked");
		});
		
		
		
		// Check-All checkbox toggle
		$("input.toggle-all").click(function(evt) {
			var selector = 'input[type="checkbox"].checkbox';
			if($(this).val().indexOf('jstarget:') === 0) {
				selector = 'input[type="checkbox"][name^="' + $(this).val().split(/jstarget\:/)[1] + '"]';
			}
			
			if($(this).is(":checked")){
				$(selector).attr("checked", "checked");
			}
			else{
				$(selector).removeAttr("checked");
			}
		});
		
		// highlight checked row
		$(".adminlist input[type='checkbox']").click(function(evt){
					
			if(this.checked)
			{
				$(this).closest("tr.odd").switchClass( "odd", "highlight-odd", 50 );	
				$(this).closest("tr.even").switchClass( "even", "highlight-even", 50 );	
    		}
			else
			{
				$(this).closest("tr.highlight-odd").switchClass( "highlight-odd", "odd", 300 );	
				$(this).closest("tr.highlight-even").switchClass( "highlight-even", "even", 300 );	
			}	
			
		});
		
			
		
	
		// Basic Delete Confirmation	
		$("input.delete,button.delete").click(function(){
  			var answer = confirm($(this).attr("data-confirm"));
  			return answer // answer is a boolean
		});
		
		$("e-confirm").click(function(){
  			var answer = confirm($(this).attr("title"));
  			return answer // answer is a boolean
		});    
		

		
		// Menu Manager Layout drop-down options
		$("#menuManagerSelect").change(function(){
			var link = $(this).val();
			$("#menu_iframe").attr("src",link);			
			return false;		
		});
		
		$('#menu_iframe').load(function() {
		   this.style.height = this.contentWindow.document.body.offsetHeight + 100 + 'px';
		});
			
		
		
		$(".e-shake" ).effect("shake",{times: 10, distance: 2},20);
		
		
		$("select.filter").change(function() {
			$(this).closest("form").submit();
		});
		
		
		$("div.e-autocomplete").keyup(function() { //TODO. 
				
			
		});


	$(function() {
		
		//$(".e-menumanager-delete").live("click", function(e){
		
			
			$( ".column" ).sortable({
				connectWith: ".column",
				constain: 'table',
		//	stop: function(e,ui) {
		//	    var allItems = $(this).sortable("toArray");
		//	    var newSortValue = allItems.indexOf( $(ui.item).attr("id") );
		//	   // alert($(ui.item).attr("id") + " was moved to index " + newSortValue);
	
		//	},
			cursor: "move",
			opacity: 0.9,
			handle: ".portlet-header",
			distance: 20,
			remove: function(event, ui) {
               // ui.item.clone().appendTo(this);
               //  $(this).sortable('cancel');
           },
			stop: function(event, ui) {         	
				
				var linkid = $(ui.item).attr("id"); 
			    var area = $('#'+linkid).closest('.column').attr('id'); 
				var areaList = $('#'+linkid).closest('.column').sortable("toArray");
			    //  alert(areaList);
			    
			    $(ui.item).attr("id")
			    
			    var layout = $('#dbLayout').attr("value");
			    //	alert(layout);
			    	
			    var opt = linkid.split('-');
			    
			    if(area == 'remove')
			    {	// alert(area);
			    	var remove = linkid;
			    	areaList = '';
			    	$('#check-' + opt[1]).show('fast');
			    	$('#option-' + opt[1]).hide('fast');
			    	$('#status-' + opt[1]).text('remove');
			    }	
			    else
			    {	
			    	if($('#status-' + opt[1]).text() == 'insert' || $('#status-' + opt[1]).text() == 'update')
			    	{
			    		var stat = 'update';	
			    	}
			    	else
			    	{ 
			    		var stat = 'insert';
			    		
			    	}
			    	var aId = area.split('-');
			    	var newId =  linkid + '-' + aId[1];
			    	
			    	var remId = $('#'+linkid).find(".delete").attr('id') + aId[1];
			    	$('#'+linkid).find(".delete").attr('id',remId);
			    	var hidem = "block-" + opt[1] +'-' + aId[1];
			    	$('#'+linkid).attr('id',hidem);  	   	
	
			    	$('#check-' + opt[1]).hide('fast');
			    	$('#option-' + opt[1]).show('fast');
			    	$('#status-' + opt[1]).text(stat);	
			    }
			    		    
				$.ajax({
				  type: "POST",
				  url: "menus.php?ajax_used=1",
				  data: { removeid: remove, insert:linkid, mode: stat, list: areaList, area: area, layout: layout }
			//	  data: { linkid: linkid, neworder: neworder }
				}).done(function( msg ) {
				
				// alert(" Updated: "+ msg );
				});

 			}
		});

		$( ".portlet" ).addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
	//	$( ".portlet" ).addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
			.find( ".portlet-header" )
				.addClass( "ui-widget-header ui-corner-all" )
				.prepend( "<span class='ui-icon ui-icon-minusthick'></span>")
				.end()
			.find( ".portlet-content" );

		$( ".portlet-header .ui-icon" ).click(function() {
			$( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );
			$( this ).parents( ".portlet:first" ).find( ".portlet-content" ).toggle();
		});

		$( ".column" ).disableSelection();
		});



	



		$.fn.extend({
    	insertAtCaret: function(myValue) {
	        if (document.selection) {
	                this.focus();
	                sel = document.selection.createRange();
	                sel.text = myValue;
	                this.focus();
	        }
	        else if (this.selectionStart || this.selectionStart == '0') {
	            var startPos = this.selectionStart;
	            var endPos = this.selectionEnd;
	            var scrollTop = this.scrollTop;
	            this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
	            this.focus();
	            this.selectionStart = startPos + myValue.length;
	            this.selectionEnd = startPos + myValue.length;
	            this.scrollTop = scrollTop;
		        } else {
		            this.value += myValue;
		            this.focus();
		        }
	    }
    	
  	
    	
})

				// Text-area AutoGrow
	//	$("textarea.e-autoheight").elastic();
});



