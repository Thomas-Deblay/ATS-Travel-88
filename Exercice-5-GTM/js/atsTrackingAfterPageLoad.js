$(function(){
	
	var userId = getCookie('55ID'),
	login = $('#login55'),
	mdp = $('#password55'),
	cnx = $('#cnx55'),
	msg = $('#msg'),
	form=$('#signInForm'),
	deconnexion = $('#decnx55');
	nav = $('#cnxDcnx');
	
	// If the 55Id cookie returns a value, we change the text of the link in the nav
	if(!!userId && userId.length > 0){
		nav.text('Sign-out');
	}
	// DISCONNECT (we delete the cookie containing the ID. The link clicked to for text "sign-out")
	nav.click(function(e){
		if(this.text == 'Sign-out'){
			e.preventDefault();
			document.cookie = '55ID=;path=/';
			document.location.href="login.html";
			/* tracking of sign out begin
			*/

			// tracking of sign out end
		}
	});

	if(/login\.html/.test(window.location.pathname)){
		
		// Connection
		cnx.click(function(e){
			
			e.preventDefault();
			
			// We check that the login entered is in the list of users
			for(var i = 0; i<usersList.length; i++){
				if(usersList[i]['login'] == login.val()){
					var connected_user_id = usersList[i];
				}
			}
			
			// If this is the case, we compare the entered password with the saved one.
			if(!!connected_user_id){
				// If it matches we connect the user (creation of a cookie containing the ID)
				if(mdp.val()==connected_user_id.password){
					document.cookie = '55ID=' + connected_user_id.id+ ';path=/';
					document.location.href="index.html";
					/* tracking of login begin
					*/

					// tracking of login end
				} else { // If the password does not match
					msg.html('<p style="color:red;font-weight:bold;">Authentication failed : check your username and password and try again</p>');
				}
				
			} else { // If the user is not found in the list
				msg.html('<p style="color:red;font-weight:bold;">Authentication failed : check your username and password and try again</p>');
			}

		});
	}

	if(/index\.html/.test(window.location.pathname)){
		var promotions = [],
			index =0;
		document.querySelectorAll("#myCarousel div.carousel-inner div.item a").forEach(
			function(element){
				for(var v=0;v<travelDestinations.length;v++)
				{
					if(element.getAttribute("href").match(travelDestinations[v].hashName)!==null)
					{
						promotions.push(
							{
								'item_name': travelDestinations[v].name, // Name or ID is required.
								'item_id': travelDestinations[v].id,
								'price': '33.75',
								'item_category': travelDestinations[v].category,
								"item_variant": "6 nights",
								'promotion_id': travelDestinations[v].id,
								'promotion_name': 'carousel',
								'creative_name': travelDestinations[v].hashName,
								'creative_slot': index,
								'location_id': index,
								'index': index,
								'quantity': '1'
							}
						);
						index++;
						break;
					}
				}
			}
		);
		/* tracking of Ecommerce promotion views action begin
		* use promotions JS variable to get promotions details
		*/

		var binaryCoin = false; // Here to not have doublons
		const carouselItems = document.querySelectorAll('#myCarousel .item'); // The promos that we are listening to see what's one screen or not
		let sentPromos = [];

		//GET THE PROMO DATA FROM promotions RELATED TO THE PROMO ON SCREEN TO SEND IT TO THE GTAG 
		function getActivePromo(){
		const active = document.querySelector('#myCarousel div.carousel-inner div.active ');
		if (binaryCoin) {
    		const href = active.querySelector('a').hash.substring(1); // Cela récupère ce qu'il y a après le # dans la destination page
    		promotions.forEach(promo => {
				promo.item_name.toLocaleLowerCase() === href 
					? sendPromoTag(promo) 
					: '';
			})
		}}

		// CHARGE AND SEND THE TAG FOR THE FIRST SLIDE OF THE CAROUSEL
		window.addEventListener('load', function () {
			binaryCoin = !binaryCoin;
			getActivePromo();
			
		});

		// SEND ONSCREEN PROMO TAG WHEN CAROUSEL IS CHANGING WHATS ON SCREEN, AND VIEWED BY THE USER
		carouselItems.forEach((item) => {
			
			item.ontransitionend = () => {
				binaryCoin = !binaryCoin;
				getActivePromo();
			}
		});

		
		// SEND THE APPROPRITE GTAG IN THE CORRECT FORMAT!
		function sendPromoTag(promo){
			const eventParamter = {
				creative_name: promo.creative_name, 
				creative_slot: promo.creative_slot.toString(),
				promotion_id: promo.promotion_id, 
				promotion_name: promo.promotion_name,
				items: [{
					item_id: promo.item_id,
					item_name: promo.item_name,
					index: promo.index,
					item_category: promo.item_category,
					item_variant: promo.item_variant,
					location_id: promo.location_id.toString(),
					price: Number(promo.price),
					quantity: Number(promo.quantity)
			}]
		}
		// Faire une function pour checker si la promotion n'a pas déjà été envoyé
		const isNotSent = !sentPromos.includes(eventParamter.items[0].item_id);
		if(eventParamter && isNotSent) {
			dataLayer.push({event: "view_promotion", ecommerce: eventParamter});
			sentPromos = [...sentPromos, eventParamter.items[0].item_id];
		};
	}

		// tracking of Ecommerce promotion views action end

		$(".carousel-inner a").on('click',function(e){
			var destination = $(this).attr('href').split('#');
			for(var v=0; v<promotions.length;v++){
				if(promotions[v].creative_name.match(destination[1])!== null)
				{
					/* tracking of Ecommerce promotion click action begin
                    * use promotions[v] JS variable to get promotions details
                    */

					dataLayer.push( {event: "select_promotion", ecommerce:  {
	
						items: [{
						item_id: promotions[v].item_id,
						item_name: promotions[v].item_name,
						creative_name: promotions[v].creative_name, 
						creative_slot: promotions[v].creative_slot.toString(),
						index: promotions[v].index,
						item_category: promotions[v].item_category,
						item_variant: promotions[v].item_variant,
						location_id: promotions[v].location_id.toString(),
						price: Number(promotions[v].price),
						promotion_id: promotions[v].promotion_id, 
						promotion_name: promotions[v].promotion_name,
						quantity: Number(promotions[v].quantity)
						}]
					}, _clear: true
				})

					// tracking of Ecommerce promotion click action end
					break;
				}
			}
		});

		$("#viewDestination a").on('click',function(e){
			/* tracking of View Destinations button click begin
			*/
			window.dataLayer.push({'event': 'cta_click', 'click_category':'home', 'click_action': 'click','click_label': 'view destinations' });
			// tracking of View Destinations button click end
		});
		
	}

	if(/destinations\.html/.test(window.location.pathname)){
		
		$('.videos').on('click',function(e){
			
			e.preventDefault();
			
			for(var j=0; j<travelDestinations.length;j++){
				
				if(travelDestinations[j].name.toLowerCase() === $(this).data("name")){
						var videoLink = travelDestinations[j].video;
				}
			}

			$('#destinationsVideos').css('top', $(window).scrollTop());
			
			$('#destinationsVideos').html('<iframe id="player" type="text/html" width="960" height="540" src="'+videoLink+'?enablejsapi=1&rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>"');
			
			$('#destinationsVideos').fadeIn(500);
				
		});
		
		$('#destinationsVideos').on('click', function(){
			$(this).html('');
			$(this).fadeOut(500);
		});
			
		var location = window.location.search.replace('?search=',''), list="all", cat;
		
		// Addition of the parameter in the url during a search
		 $('#search_destination').on('submit', function(e){
			 e.preventDefault();
			 var kw = $(this).find('input[type="search"]').val();
			 window.location.href = "destinations.html?search="+kw;
			 /* tracking of search begin
			 * use kw JS variable to get the search keyword
			 */

			 // tracking of search end
		});
		
		var regex = new RegExp(location, 'gi');
		// Sort by destination category
		if(/cat=button/.test(location)){
			
			var matches = [];
			
			if(/islands/.test(location)){
				list = 'islands';
				cat = 'island';
			} else if(/cities/.test(location)){
				list = 'cities';
				cat = 'city';
			}	
			
			for(var j=0; j<travelDestinations.length;j++){
				
				if(travelDestinations[j].category === cat){
						matches.push(travelDestinations[j].name);
				}
			}
			var regex = new RegExp(matches.join('|'), 'gi');
		} 
		else if (/search=.*/.test(window.location.search)){
			list = "search";
		}
		

		var index = 0,products = [];
			 
		 $('h2').each(function(data) {
			 
			 var element = $( this ),
			 parent = element.parent(),
			 name = element.html().split('<small>');
			 name = name[0].replace(/^\s+|\s+$/gm,'');
			
			if(!element.text().match(regex)){
				parent.hide();
				parent.next().hide();
			}
			
			if(parent.css('display') === "block"){
				for(var v=0; v<travelDestinations.length;v++){
					if(name === travelDestinations[v].name){
						products.push({
							"item_list_name":list,
							"index": index,
							"item_id": travelDestinations[v].id,
							"item_category": travelDestinations[v].category,
							"price": travelDestinations[v].price.toString(),
							"item_name": travelDestinations[v].name,
							"item_variant": "6 nights"
						});
					}
				}
				index++;
			 }
		});
		/* tracking of Ecommerce product views in list action begin
		* use products JS variable to get products details
		* use list JS variable to set list value in products.
		*/

		let viewItemList = []
		products.forEach((item) =>{
			const itemConfigure = {
				item_id: item.item_id,
				item_name: item.item_name,
				index: item.index,
				item_category: item.item_category ,
				item_variant: item.item_variant,
				price: Number(item.price),
				
			}
			 viewItemList = [...viewItemList, itemConfigure]
			} )


// ============ VIEW_ITEM_LIST --- BATCH QUEU SENDING DATA THAT HAVE BEEN REALLY SEEN BY USER ================
let batchQueu = []
// Definir ou se trouve les articles dans la DOM
const vignettes = document.querySelectorAll('[data-productid]');

// Creez une fonction pour recuperer les informations des articles
function getDestinationId(article) {
  const getId = article.getAttribute('data-productid');

  if (getId) {
    const id = getId.trim();
    return id;
  }
  return null;
}

// Creez une fonction pour envoyer les élément vue dans une batch queu avec toutes les informations nécéssaire
function displayArticleId(article) {
  const info = getDestinationId(article);
  const getItemInfo = viewItemList.filter(item => item.item_id === info)
  if (info) {
    batchQueu = [...batchQueu, getItemInfo[0]];
	console.log(batchQueu);
  }
}

// Creer notre observer pour savoir quand un article s'affiche sur l'ecran et l'afficher dans la console (*1)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const destination = entry.target;
        // Verifie si l'article n'a pas deja ete affiché
        if (!destination.getAttribute('data-displayed')) {
          displayArticleId(destination);
          console.log('');
          // Marquez l'article comme affiché pour éviter les doublons
          destination.setAttribute('data-displayed', 'true');
        }
      }
    });
  },
  {
    // Juste histoire de rendre l'experience un petit peu plus smooth (operraatooorrrrrr)
    threshold: 0.7,
  }
);

// Creer une fonction permerttant d'observer le chargement de nouveaux articles dans la DOM et lancer notre observer (*2)
function theAnswer(vignettes) {
  // Creer un mutationObserver pour capter le chargement de nouveaux articles dans la DOM
  const mutationObserver = new MutationObserver((mutations) => {
    if (mutations) {
      //Si oui, on relance la fonction avec les nouveaux articles de la DOM mise a jour
      vignettes = document.querySelectorAll('[data-productid]');
      theAnswer(vignettes);
    }
  });

  // Definir le Node parent des articles
  const vignettesParent = document.querySelector('#content-chooser');

  //Lancer le mutation observer qui verifie un changement dans la liste des articles
  mutationObserver.observe(vignettesParent, { childList: true });
  // Lancer notre observer avec la bonne liste d'article actualise
  vignettes.forEach((vignette) => {
    observer.observe(vignette);
  });
}

theAnswer(vignettes);

// ==================== END OF BATCH QUEU VIEW_ITEM_LIST =======================

// ========= Sending the product seen as view_item_list event =====================
// ------- Note: for now, we are just sending when the user leaves the page. We Should have : 
//					- When user leave the page
//					- When 10 items are in the batchQueu
// 					- when the user is inactive for 60 secondes
// =================================================

// ==== When user leaves the page
	window.addEventListener('beforeunload', (event) => {
    // Process the batch queue
    	dataLayer.push({event: "view_item_list", ecommerce:  {
				item_list_name: products[0].item_list_name,
				items: batchQueu
			  }, _clear: true
			});

});


// When 10 items are in the batch Queu

// When user is inactive for 60 secondes
			

		// tracking of Ecommerce product views in list end

		// Add a listener on each button details to send an event dL select_item on the click
		document.querySelectorAll('a[href*="details.html"]').forEach(
			function(element){
				element.addEventListener('click', function(event){
					for(var v=0; v<products.length;v++){
						if( event.target.getAttribute("href").match( products[v].item_name.toLocaleLowerCase() )!==null )
						{
							/* tracking of Ecommerce product click in list action begin
							* use products[v] JS variable to get products details
							* use list JS variable to set list value in actionField.
							*/
							
							dataLayer.push({event: "select_item", ecommerce: {
								item_list_name: products[v].item_list_name,
								items: [
								  {
									item_id: products[v].item_id,
									item_name: products[v].item_name,
									index: products[v].index,
									item_category: products[v].item_category ,
									item_variant: products[v].item_variant,
									price: Number(products[v].price),
								  }
								]
							  }, _clear: true
							});

							// tracking of Ecommerce product click in list end
							break;
						}
					}
				});
			});
	}

	if(/details\.html/.test(window.location.pathname)){
				
		$('#destinations > *').hide();

		var hash = window.location.hash.substr(1);
		
		if(!!hash){
			$('#content-' + hash).fadeIn();
		} else {
			document.location.href="destinations.html"; 
		}
	
		// If the basket is not defined, we create it
		var cart55 = getCookie('55Basket') ? JSON.parse(getCookie('55Basket')) : [];

		$('a.btn-primary').on('click', function(e){
			
			e.preventDefault();

			// We retrieve the name of the opinion clicked in the data-name attribute and the quantity chosen
			var name = document.location.hash.substr(1),
			quantity = parseInt($(this).parent().find('select').val());
			
			// We browse the table of destinations to retrieve the information of the destination
			for(var i = 0; i<travelDestinations.length; i++){
				
				var destinationDetails = travelDestinations[i]['name'];
				
				if(destinationDetails.replace(' ','').toLowerCase() == name){
					var travelD = travelDestinations[i];
				}
			}
			
			name = travelD.name;
			id= travelD.id;
			price = travelD.price;
			category = travelD.category;
			img = travelD.img;
			
			// Control variable to determine whether to add to the basket or increase the quantity
			var newItem = true;
			
			// If the item already exists in the cart, the quantity is increased and the indicator is set to false
			cart55.forEach(function(travel){
				if(travel.name===name){
						travel.quantity = quantity;
						newItem = false;
				}
			});
			
			// If the control variable is still true, it means that it is a new article to add
			if(newItem === true){
				cart55.push({id:id,category:category,name:name,price:price,quantity:quantity,img:img});
			}
			
			if(cart55.length > 0){
				$('#navBasketItems span').text(' ('+cart55.length+')');
			} else {
				$('#navBasketItems span').text('');
			}
			
			document.cookie = '55Basket=' + JSON.stringify(cart55)+ ';path=/';
			
			 $('#continueShoppingOverlay').fadeIn().delay(5000).fadeOut();
			/* tracking of Ecommerce product add to cart action begin
            * use id JS variable to get product id
            * use category JS variable to get product category
            * use name JS variable to get product name
            * use price JS variable to get product price
            * use quantity JS variable to get product quantity
            */

			dataLayer.push({
				event: "add_to_cart", ecommerce: {
					currency: "USD",
					value: Number(price) * Number(quantity),
					items: [
					{
						item_id: id,
						item_name: name,
						item_category: category,
						price: Number(price),
						quantity: Number(quantity)
					}
					]
			  }, _clear: true
			});

			// tracking of Ecommerce product add to cart action end
		});
			
	}
	
	if(/basket\.html/.test(window.location.pathname)){
		
		var page =$('#basket_content'),
		panier = $('#basket_content table');
		
		page.css('display','block');

		var cart55 = getCookie('55Basket') ? JSON.parse(getCookie('55Basket')) : [];

		if(!JSON.parse(getCookie('55Basket')) || cart55.length <1){
			page.html('<p id="emptyCart">No items in your cart : <a href="destinations.html">Select your destination</a></p>');
		}
		
		cart55.forEach(function(travel){
				
			$('#basket_content table').append('<tr>\
					<td><img width="100px" src="img/'+travel.img+'_1.jpg"></td>\
					<td>'+capitalizeFirstLetter(travel.name)+'</td>\
					<td>'+travel.quantity+'</td>\
					<td class="totalPrice">$'+travel.price * travel.quantity+'</td>\
					<td class="action"><a href="details.html#'+travel.name.toLowerCase()+' "><i class="icon-pencil"></i></a> - \
					<i  data-name="'+travel.name+'" class="icon-trash remove"></i></td>\
				</tr>');
				
		});
		var totalPrice = calculate($('.totalPrice')) ;

		panier.append(
			'<tr>\
				<td id="basketPrice" colspan=3>Total : $'+totalPrice+'</td>\
				<td id="basketCheckout" colspan=2><a href="checkout.html">Checkout</a></td>\
			</tr>'
		);
		var cart55 = getCookie('55Basket') ? JSON.parse(getCookie('55Basket')) : [];
		var products=[];
		if(JSON.parse(getCookie('55Basket')) || cart55.length <1) {

			cart55.forEach(function (travel) {
				products.push({
					"item_id": travel.id,
					"item_category": travel.category,
					"price": travel.price,
					"item_name": travel.name,
					"quantity": travel.quantity,
					"item_variant": "6 nights"
				});
			});
			/* tracking of Ecommerce product view cart action begin
			* use totalPrice JS variable to get the total basket price
			* use products JS variable to get products details
			*/

			// tracking of Ecommerce product view cart action end
			$('.remove').on('click', function(e){
				e.preventDefault();

				var cart55 = JSON.parse(getCookie('55Basket'));

				// Name of the destination you want to delete
				var name = $(this).data().name;

				// We loop in the way to find the index of the object to which the name belongs in the array
				var productRemoved = {};
				for(var i = 0; i < cart55.length; i++) {
					if(cart55[i].name==name){
						// We remove the found object from the array
						productRemoved= cart55.splice(i, 1)[0];
					}
				}
				// If more than one article we delete the line, if it is the only article we delete the table containing the basket
				if(JSON.parse(getCookie('55Basket')).length === 1){
					$(this).parent().parent().parent().remove();
				} else {
					$(this).parent().parent().remove();
				}

				// We recalculate the amount of the basket
				panier = $('#basket_content table #basketPrice').html('$'+calculate($('.totalPrice')));

				// We store the new array in the cookie
				document.cookie = '55Basket=' + JSON.stringify(cart55)+ ';path=/';

				// Modification of the number of items in the nav menu
				if(cart55.length > 0){
					$('#navBasketItems span').text(' ('+cart55.length+')');
				} else {
					$('#basket_content').html('<p id="emptyCart">No items in your cart : <a href="destinations.html">Select your dream destinations</a></p>');
					$('#navBasketItems span').text('');
				}
				/* tracking of Ecommerce product remove from cart action begin
                * use productRemoved JS variable to get removed product detail
                */

				dataLayer.push({event: "remove_from_cart", ecommerce:  {
					currency: "USD",
					value: Number(productRemoved.price) * Number(productRemoved.quantity),
					items: [
					  {
						item_id: productRemoved.id,
						item_name: productRemoved.name,
						item_category: productRemoved.category,
						price: Number(productRemoved.price),
						quantity: Number(productRemoved.quantity)
					  }
					]
				  }, _clear: true
				});
				
				// tracking of Ecommerce product remove from cart action end
			});
		}

	} // End of basket secton script
	
	// Checkout (payment and shipping option)
	if(/checkout\.html/.test(window.location.pathname)){
		
		// Retrieving basket information from the 55Basket cookie
		var cart55 = JSON.parse(getCookie('55Basket'));
		
		// If cart55 return null, the cart is empty, we return to destinations
		if(cart55 ==null){
			window.location.href="destinations.html";
		} 
		
		// If an address has already been entered, we retrieve it to display it in the form otherwise empty object
		var userInformations  = getCookie('55UserInformations') ? JSON.parse(getCookie('55UserInformations')) : {};
		
		if(typeof userInformations.name != 'undefined'){
		
			$('#shippingForm #name').val(userInformations.name);
			$('#shippingForm #adress').val(userInformations.adress);
			$('#shippingForm #zip').val(userInformations.zip);
			$('#shippingForm #city').val(userInformations.city);
			
		}

		// Loop to display all the products in the basket
		cart55.forEach(function(travel){
			$('#checkoutTable').append('<tr>\
					<td>'+travel.id+'</td>\
					<td>'+travel.category+'</td>\
					<td>'+capitalizeFirstLetter(travel.name)+'</td>\
					<td class="singlePrice">$'+travel.price+'</td>\
					<td>'+travel.quantity+'</td>\
					<td class="totalPrice">$'+travel.price * travel.quantity+'</td>\
				</tr>');
		});
		
		// Calculation of the total basket price
		$('#checkoutTable').append(
			'<tr><td id="checkoutPrice" colspan=6>Total Price : $'+calculate($('.totalPrice'))+'</td></tr>');
		
		$('#confirmReservation').html('<a  class="btn btn-primary" href="thankyou.html?price='+calculate($('.totalPrice'))+'">Continue to payment</a>');
		
		$('#confirmReservation').on('click', function(e){
			if($('#paymentMethod').css('display') ==='block'){

				var cardNum =parseInt($('#paymentMethod #cardNum').val()),
				expiration =parseInt($('#paymentMethod #expiration').val()),
				security =parseInt($('#paymentMethod #security').val());
				
				if(!cardNum || !expiration || !security || cardNum == '' || expiration =='' || security == ''){
					e.preventDefault();
					$("#errareMSG").html('<p>Please fill the payment informations correctly</p>');
					$("#errareMSG").show(500).delay(5000).hide(500);
				}
				
			} else{
			
			e.preventDefault();
			var name = $('#shippingForm #name').val(),
			adress = $('#shippingForm #adress').val(),
			zip = $('#shippingForm #zip').val(),
			city = $('#shippingForm #city').val();
			
			if(name != '' && adress!='' && zip != '' && city != ''){
				userInformations = {
					'name':name,
					'adress':adress,
					'zip':zip,
					'city':city
				}

				document.cookie = '55UserInformations=' + JSON.stringify(userInformations)+ ';path=/';

				$('#shippingForm #name').attr('readonly', true);
				$('#shippingForm #adress').attr('readonly', true);
				$('#shippingForm #zip').attr('readonly', true);
				$('#shippingForm #city').attr('readonly', true);

				$('#confirmReservation').html(
					'<a  class="btn btn-primary" id="submitButton" href="thankyou.html?price='+calculate($('.totalPrice'))+'"><h3>Confirm order</h3></a></td>');

				$('#paymentMethod').slideDown();

				/* tracking of virtual page view on payment page begin
				*/
				window.dataLayer = window.dataLayer || [];
				window.dataLayer.push({'event': 'page_view', 'page_type':'Payment','page_name': '/payment.html' });

				// tracking of virtual page view on payment page end
				history.pushState({}, 'Payment | ATS Travel Website', 'payment.html');
				var cart55 = getCookie('55Basket') ? JSON.parse(getCookie('55Basket')) : [];
				var products=[];
				cart55.forEach(function(travel){
					products.push({
						"item_id":travel.id,
						"item_category":travel.category,
						"price": travel.price,
						"item_name": travel.name,
						"quantity": travel.quantity,
						"item_variant":"6 nights"
					});
				});
				/* tracking of Ecommerce second checkout step action begin
				* use products JS variable to get the basket products details
				*/

				dataLayer.push({event: "begin_checkout", ecommerce: {
					currency: "USD",
					value: products.reduce((acc,curr) => acc + (curr.price * curr.quantity), 0),
					items: products
				  }, clear: true
				});
				

				dataLayer.push({event: "add_shipping_info", ecommerce: {
					currency: "USD",
					value: products.reduce((acc,curr) => acc + (curr.price * curr.quantity), 0),
					items: products
				  }, _clear: true});

				// tracking of Ecommerce second checkout step action end
				document.getElementById('submitButton').addEventListener('click',function(){
					/* tracking of Ecommerce payment checkout option action begin
					* use products JS variable to get the basket products details
					*/

					  dataLayer.push({event: "add_payment_info", ecommerce: {
						currency: "USD",
						value: products.reduce((acc,curr) => acc + (curr.price * curr.quantity), 0),
						payment_type: "Credit Card",
						step: "3",
						items: products
					  }, _clear: true
					});

					// tracking of Ecommerce payment checkout option action end
				});
			} else {
				$("#errareMSG").html('<p>Please complete all the required fields</p>');
				$("#errareMSG").show(500).delay(5000).hide(500);
			}
			
			}
			
		});
	}

	// Order confirmation
	if(/thankyou\.html/.test(window.location.pathname)){
		$('#navBasketItems span').text('');
		$('#orderConfirmed').prepend('<p>Order Reference : '+order55[order55.length -1].orderRef+'</p>');

		// Order cancellation
		$('#cancelOrder').on('click', function(e){
			var order55 = JSON.parse(getCookie('order55'));
			e.preventDefault();
			document.cookie = "55T=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
			$('#orderConfirmed').css('color','red').css('font-size','20px').html('<p>Order canceled<p>');
			$('#orderConfirmed').append(' <p><a href="destinations.html">Select destinations</a><p>');
			var cancelOrder = order55.pop();
			document.cookie = 'order55=' + JSON.stringify(order55)+ ';path=/';
			/* tracking of Ecommerce refund action begin
			* use cancelOrder.orderRef JS variable to get the canceled order Id
			*/

			dataLayer.push({event: "refund", ecommerce: {
				currency: "USD",
				transaction_id: cancelOrder.orderRef, // Transaction ID. Required for purchases and refunds.
				value: Number(top.totalPrice)
			  }, _clear: true
			});

			// tracking of Ecommerce refund action end
		});
	}
		
	// Global script
	if(!!getCookie('55Basket')){
		var cart55 = JSON.parse(getCookie('55Basket'));
		if(cart55.length > 0){
			$('#navBasketItems span').text(' ('+cart55.length+')');
		} else {
			$('#navBasketItems span').text('');
		}
	} 
	
	// Newsletter subscription
	var input = $('#newsletter-form input[type="text"]');
	reponse = $('footer #reponse'),
	patt = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
	
	$('#newsletter-form form').on('submit', function(e){
		
		e.preventDefault();
		
		if(!!patt.test(input.val())){
			reponse.html('<p class="ok_msg">Thank you for joining our mailing list').fadeIn(500).delay(1500).fadeOut(500);
			/* tracking of newsletter subscription begin
			*/

			// tracking of newsletter subscription end
		} else {
			reponse.html('<p class="error_msg">Subscription failed, check your email adress').fadeIn(500).delay(1500).fadeOut(500);
		}
	 });
});