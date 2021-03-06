/* App JS */
// Libraries concatenated & compressed by by jekyll-assets pipeline
//= require jquery.js
//= require modernizr.js
//= require bootstrap.js
//= require underscore.js
//= require underscore.string.js
//= require backbone.js
//= require backbone.paginator.js

// ===================================================================
// Utilities
// ===================================================================
App.updateMeta = function(model) {
    var title = model.get('businessName');
    var path  = model.get('id');
    var domain = App.rootUrl + '/letter/show/';
    var url = domain + path;
    $('title').remove();
    $('meta[property="og:title"]').remove();
    $('meta[property="DC.title"]').remove();
    $('meta[property="description"]').remove();
    $('meta[property="DC.description"]').remove();
    $('meta[property="og:description"]').remove();
    $('meta[property="og:image"]').remove();
    $('meta[property="og:image:url"]').remove();
    $('meta[property="og:url"]').remove();
    $('meta[property="og:type"]').remove();
    $('meta[property="og:site_name"]').remove();
    $('meta[property="fb:admins"]').remove();
    $('meta[property="twitter:image:src"]').remove();

    $("head").append('<title>' + title + '</title>');
    $("head").append('<meta property="og:title" content="Check out my holiday greeting to ' + title + '!">');
    $("head").append('<meta property="og:sitename" content="Thanks ' + title + '!">');
    $("head").append('<meta property="og:url" content=" ' + url + '">');
    $("head").append('<meta property="og:image" content="' + App.rootUrl + '/ui/img/share-letter.png">');
    $("head").append('<meta property="twitter:image:src" content="' + App.rootUrl + '/ui/img/share-letter.png">');
};


// ===================================================================
// Businesses
// ===================================================================
App.Business = Backbone.Model.extend({
    defaults: {
        "businessName": "",
        "businessLocation": "",
        "businessUrl": ""
    },
    initialize: function(){
    },
    parse: function(response, options) {
        var d = response;
        var slug = s.slugify(d.business_name);
        return {
            "businessSlug": slug,
            "businessName": d.business_name,
            "businessLocation": d.business_city,
            "businessUrl": d.business_url
        };
    },
});
App.Businesses = Backbone.Collection.extend({
    model: App.Business,
    url: App.apiUrl + '/api/v1/businesses',
    parse: function(response, options) {
        return response.data.businesses;
    }

});
App.businesses = new App.Businesses();

App.BusinessView = Backbone.View.extend({
    template: _.template( $('#tpl_businessView').html() ),
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

App.BusinessesListView = Backbone.View.extend({
    collection: App.businesses,
    el: '#business-listing',
    events: {
        "click .business": "showBusiness",
    },
    initialize: function () {
        this.listenTo(this.collection, 'update reset', this.render);
    },
    template: _.template( $('#tpl_businessListView').html() ),
    render: function () {
        this.el.innerHTML = this.template();
        var target = this.$el.find(".businesses");
        this.collection.forEach(function (business, index) {
            target.append(new App.BusinessView({
                model: business
            }).render().el);
        }, this);
        return this;
    },
    showBusiness: function(event) {
        event.preventDefault();
        window.scrollTo(0, 0);
        var el = $(event.currentTarget);
        var businessId = el.data("business");
        App.router.navigate('business/show/' + businessId, { trigger: true } );
    },
});

App.BusinessDetailView = Backbone.View.extend({
    el: '#business-detail',
    events: {
        "click .show-list": "showList"
    },
    initialize: function (options) {
        // TODO Update the meta when it makes sense to do so...
    },

    template: _.template( $('#tpl_businessDetailView').html() ),
    render: function() {
        this.$el.show();
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    hide: function() {
        this.$el.hide();
    },
    showList: function(event) {
        event.preventDefault();
        App.router.navigate('businesses', { trigger: true } );
    }
});


// ===================================================================
// Promotions
// ===================================================================
App.Promo = Backbone.Model.extend({
    defaults: {
        "Badge": "",
        "Business": "",
        "Image": "",
        "Link": "",
        "Text": "",
        "Twitter": ""
    },
    initialize: function(){

    }
});

App.Promos = Backbone.Collection.extend({
    model: App.Promo
});

App.promos = new App.Promos();

App.PromoView = Backbone.View.extend({
    tagName: 'section',
    events: {

    },
    initialize: function () {

    },
    template: _.template( $('#tpl_promoView').html() ),
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

// ===================================================================
// Cards / Love letters
// ===================================================================
App.Card = Backbone.Model.extend({
    defaults: {
        "businessName": "",
        "businessLocation": "",
        "businessUrl": "",
        "loveMessage": "",
        "submitterName": ""
    },
    parse: function(response, options) {
        var d;

        if (        _.isUndefined(response.data) ) {
            d = response;
        } else {
            d = response.data.letters;
        }
        //Date delivered is not ISO time and therefore compatible with moment. Set it so we can format it.
        var rawDate = d.date_created;
        //Trim string to just what is needed
        rawDate = rawDate.split(' ', 1);
        //Specify formatting
        var momentDate = moment(rawDate[0]).format("MMMM D, YYYY");
        return {
            "id": d.id,
            "businessName": d.business_name,
            "businessLocation": d.business_city,
            "businessUrl": d.business_url,
            "dateCreated": d.date_created,
            "loveMessage": d.letter_text,
            "submitterName": d.first_name,
            "momentDate": momentDate
        };
    },
    urlRoot: App.apiUrl + '/api/v1/letters',
    initialize: function(){
    }

});

App.Cards = Backbone.PageableCollection.extend({
    model: App.Card,
    mode: "infinite",
    url: App.apiUrl + '/api/v1/letters',
    parse: function(response, options) {
        return response.data.letters;
    },
    initialize: function(options) {
        if (!_.isUndefined(options)) {
            this.queryParams.filter = options.filter;
        }
    },
    state: {

        firstPage: 1,
        currentPage: 1,
        totalRecords: 200,
        pageSize: 18
    },
    queryParams: {
        currentPage: "page",
        pageSize: "limit",
        query: this.filter
    }
});

App.cards = new App.Cards();

App.CardView = Backbone.View.extend({
    events: {

    },
    initialize: function () {

    },
    template: _.template( $('#tpl_cardView').html() ),
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

App.CardDetailView = Backbone.View.extend({
    el: '#letter',
    events: {
        "click .show-list": "showList",
        "click .permalink": "copyCard"
    },
    initialize: function (options) {
        var model = options.model;
        App.updateMeta(model);
    },

    template: _.template( $('#tpl_cardDetailView').html() ),
    render: function() {
        this.$el.show();
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    hide: function() {
        this.$el.hide();
    },
    showList: function(event) {
        event.preventDefault();
        App.router.navigate('letters', { trigger: true } );
    },
    copyCard: function(){
        event.preventDefault();
        window.scrollTo(0, 0);
        var el = $(event.currentTarget);
        var cardId = el.data("card");
        var currentUrl = Backbone.history.fragment;
        App.router.navigate(currentUrl, { trigger: true } );
    },
});


App.CardDetailErrorView = Backbone.View.extend({
    el: '#letter',
    events: {
        "click .show-list": "showList",
        "click .permalink": "copyCard"
    },
    initialize: function (options) {
    },
    template: _.template( $('#tpl_cardDetailErrorView').html() ),
    render: function() {
        this.$el.show();
        this.$el.html(this.template());
        return this;
    },
    hide: function() {
        this.$el.hide();
    },
    showList: function(event) {
        event.preventDefault();
        App.router.navigate('letters', { trigger: true } );
    },
    copyCard: function(){
        event.preventDefault();
        window.scrollTo(0, 0);
        var currentUrl = Backbone.history.fragment;
        App.router.navigate(currentUrl, { trigger: true } );
    },
});

App.CardsListView = Backbone.View.extend({
    collection: App.cards,
    el: '#letters-list',
    events: {
        "click .card": "showCard",
        "click li.next": function() { this.collection.getNextPage(); },
        "click li.previous": function() { this.collection.getPreviousPage(); },
        "click li.first": function() { this.collection.getFirstPage(); },
        "click li.last": function() { this.collection.getLastPage(); },
    },
    initialize: function () {
        this.listenTo(this.collection.fullCollection, 'update reset', this.render);
        this.listenTo(App.promos, 'reset', this.render);
        this.on('render', this.afterRender());
    },
    template: _.template( $('#tpl_cardListView').html() ),
    render: function () {
        this.$el.show();
        this.el.innerHTML = this.template();
        var target = this.$el.find(".letters");
        var count = 0;
        this.collection.fullCollection.forEach(function (card, index) {
            target.append(new App.CardView({
                model: card
            }).render().el);
            // TODO
            // This could be re-written
            // Basically, it adds a promo view after every 6th element
            count++;
            if ( count === 6 && App.promos.length > 0 ) { // Only if there are promos
                var promo = App.promos.shift();
                target.append( new App.PromoView({
                    model: promo
                }).render().el);
                // Put the promo back for an infinite list
                App.promos.push(promo);
                count = 0;
            }
        }, this);
        return this;
    },
    afterRender: function() {
        // Not used, but useful! :-)
    },
    showCard: function(event) {
        event.preventDefault();
        window.scrollTo(0, 0);
        var el = $(event.currentTarget);
        var cardId = el.data("card");
        App.router.navigate('letter/show/' + cardId, { trigger: true } );
    },
    hide: function() {
        this.$el.hide();
    }
});

App.filteredCards = new App.Cards();
App.CardsListViewNoPromo = Backbone.View.extend({
    collection: App.filteredCards,
    el: '#business-letters-list',
    events: {
        "click .card": "showCard",
        "click li.next": "getMore"
    },
    initialize: function (options) {
        this.listenTo(this.collection.fullCollection, 'update reset', this.render);
        this.on('render', this.afterRender());
    },
    template: _.template( $('#tpl_cardListView').html() ),
    render: function () {
        this.$el.show();
        this.el.innerHTML = this.template();
        var target = this.$el.find(".letters");
        this.collection.fullCollection.forEach(function (card, index) {
            target.append(new App.CardView({
                model: card
            }).render().el);
        }, this);    
        return this;
    },
    afterRender: function() {
        // Not used, but useful! :-)
    },
    getMore: function() {
        var models = this.collection.fullCollection.length;
        var self = this;
        this.collection.getNextPage().done(function(res) {
            if (res.data.letters.length === 0) { // no more data
                $('#pagination').hide();
            }
        });
    },
    showCard: function(event) {
        event.preventDefault();
        window.scrollTo(0, 0);
        var el = $(event.currentTarget);
        var cardId = el.data("card");
        App.router.navigate('letter/show/' + cardId, { trigger: true } );
    },
    hide: function() {
        this.$el.hide();
    }
});

App.CardsPreviewListView = Backbone.View.extend({
    collection: App.cards,
    el: '#recent-letters',
    events: {
        "click .card": "showCard",
        "click .showFullList": "showList"
    },
    initialize: function () {
        this.listenTo(this.collection, 'update reset', this.render);
    },
    template: _.template( $('#tpl_cardPromoListView').html() ),
    render: function () {
        this.$el.show();
        this.el.innerHTML = this.template();
        var target = this.$el.find(".letters");
        var preview = this.collection.slice(0,3);
        preview.forEach(function (card, index) {
            target.append(new App.CardView({
                model: card
            }).render().el);
        }, this);
        return this;
    },
    showCard: function(event) {
        event.preventDefault();
        var el = $(event.currentTarget);
        window.scrollTo(0, 0);
        var cardId = el.data("card");
        App.router.navigate('letter/show/' + cardId, { trigger: true } );
    },
    showList: function(event) {
        window.scrollTo(0, 0);
        event.preventDefault();        
        App.router.navigate('letters', { trigger: true } );
    },
    hide: function() {
        this.$el.hide();
    }
});

// ===================================================================
// Router
// ===================================================================
App.Router = Backbone.Router.extend({
    initialize: function() { 
        // If running in production
        // track every route and call trackPage
        if ( App.siteMode === 'production' ) {
            this.bind('route', this.trackPageView);
        }
    },
    // Assume that any pages with cards or businesses showing are Backbone-powered
    // Static pages: /prizes, /about, etc. are not
    routes: {
        "":                   "showFront",
        "letters":            "showLetters",
        "businesses":            "showBusinesses",
        "letter/show/:id(/:mode)":    "letterShow",
        "business/show/:id":    "businessShow"
    },
    showFront: function() {
        //console.log('Front page');
        // Show only the front page panel
        //get user agent on the front page for IE specific styles
        var doc = document.documentElement;
        doc.setAttribute('data-useragent', navigator.userAgent);
        $('.panels').hide();
        $('.panel-front').show();
        var cardPreview = new App.CardsPreviewListView();
        cardPreview.render();
    },
    showLetters: function() {
       // console.log('Letters list');
        $('.panels').hide();
        $('.panel-letters').show();
        App.cardsListView = new App.CardsListView();
        App.cardsListView.render();
        if ( App.cardDetailView ) {
            // Hide it
            App.cardDetailView.hide();
        }
    },
    showBusinesses: function() {
        //console.log('Businesses list');
        $('.panels').hide();
        $('.panel-businesses').show();
        App.businessesListView = new App.BusinessesListView();
        App.businessesListView.render();
    },
    letterShow: function(id, mode) {
        //console.log('Card detail');
        $('.panels').hide();
        $('.panel-letter').show();
        var card = App.cards.get(id);
        // TODO Fix this silliness
        // If the card is accessed directly
        // it's probably not in the initial collection
        if (_.isUndefined(card) ) {
            // Thus it needs to be fetched from the server
            card = new App.Card({ "id": id });
            // Which is async, thus we need to render after we have the data
            card.fetch({
                "success": function(model, response, options) {
                    App.cardDetailView = new App.CardDetailView({ model: card });
                    App.cardDetailView.render();
                },
                "error": function(model, response, options) {
                    if ( response.status === 422 && mode === 'success' ) {
                        // If the card isn't there right now
                        // it might be in a moment, so show a message to the user
                        App.cardDetailErrorView = new App.CardDetailErrorView();
                        App.cardDetailErrorView.render();
                    }
                }
            });
        } else { // The card *is* in the collection, so just render the view
            App.cardDetailView = new App.CardDetailView({ model: card });
            App.cardDetailView.render();
        }
        if ( App.cardsListView ) {
            // Hide the list
            App.cardsListView.hide();
        }
    },
    businessShow: function(id) {
       // console.log('Business detail');
        $('.panels').hide();
        $('.panel-business').show();
        var business = App.businesses.findWhere({"businessSlug": id });
        App.businessDetailView = new App.BusinessDetailView({ model: business });
        App.businessDetailView.render();
        // Attach a card listing by business
        App.businessCardsListView = new App.CardsListViewNoPromo();
        // TODO should not be setting this directly!
        App.businessCardsListView.collection.queryParams.query = business.get('businessName');
        App.businessCardsListView.collection.fetch();
    },
    trackPageView: function() {
        var url = Backbone.history.getFragment();
        // Add a slash if neccesary
        if (!/^\//.test(url)) url = '/' + url;
                ga('send', {
            'hitType': 'pageview',
        'page': url
        });
    }
});
