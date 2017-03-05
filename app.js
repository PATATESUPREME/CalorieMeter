/**
 * Product class
 *
 * @param id
 * @param name
 * @param calories
 * @param salt
 * @param quantity
 * @constructor
 */
function Product(id, name, calories, salt, quantity = 1) {
    let self = this;

    self.id = id;
    self.name = name;
    self.calories = calories;
    self.salt = salt;
    self.quantity = ko.observable(quantity);
}

/**
 * Profile class
 *
 * @param name
 * @param calories
 * @param salt
 * @constructor
 */
function Profile(name, calories, salt) {
    let self = this;

    self.name = name;
    self.calories = calories;
    self.salt = salt;
}

/**
 * Paginate class
 *
 * @param page
 * @param nbPages
 * @param handler
 * @constructor
 */
function Paginate(page, nbPages, handler) {
    let self = this;

    self.page = ko.observable(page);
    self.nbPages = ko.observable(nbPages);
    self.handler = handler;

    self.first = function () {
        self.page(1);
        self.handler();
    };
    self.previous = function () {
        self.page(self.page() - 1);
        self.handler();
    };
    self.next = function () {
        self.page(self.page() + 1);
        self.handler();
    };
    self.last = function () {
        self.page(self.nbPages());
        self.handler();
    };
}

/**
 * Application model view
 *
 * @constructor
 */
function AppModelView() {
    let self = this;

    /** Search variables */
    self.productSearched = ko.observable();
    self.minCalSearched = ko.observable(0);
    self.maxCalSearched = ko.observable(50000);
    self.productFounded = ko.observable(0);
    self.productList = ko.observableArray();
    self.productPaginate = new Paginate(1, 0, function() {
        return self.launchSearch();
    });

    /** Basket variables */
    self.basketList = ko.observableArray();
    self.basketPaginate = new Paginate(1, 0, function() {
        return self.launchSearch();
    });

    /** Profile variables */
    self.selectedProfile = ko.observable();
    self.caloriesProgress = ko.observable(0);
    self.caloriesStatus = ko.computed(function() {
        if (self.caloriesProgress() > 100) {
            return "bg-danger";
        } else {
            return "bg-success";
        }
    });
    self.saltProgress = ko.observable(0);
    self.saltStatus = ko.computed(function() {
        if (self.saltProgress() > 100) {
            return "bg-danger";
        } else {
            return "bg-success";
        }
    });
    self.availableProfiles = ko.observableArray([
        new Profile("Child", 1600, 5),
        new Profile("Teenage boy", 2900, 5),
        new Profile("Teenage girl", 2400, 5),
        new Profile("Man", 2800, 5),
        new Profile("Woman", 2200, 5),
        new Profile("Pregnant woman", 2400, 5),
        new Profile("Athletic man", 3300, 5),
        new Profile("Athletic woman", 2500, 5),
        new Profile("Old man", 2000, 5),
        new Profile("Old woman", 1800, 5),
    ]);
    self.saltQuantity = ko.computed(function() {
        let total = 0;
        let maxSalt = 5;

        ko.utils.arrayForEach(self.basketList(), function(product) {
            total += product.salt * product.quantity();
        });

        if (undefined != self.selectedProfile()) {
            maxSalt = self.selectedProfile().salt
        }

        self.saltProgress(total * 100 / maxSalt);

        return total + " / " + maxSalt + "g";
    });
    self.caloriesQuantity = ko.computed(function() {
        let total = 0;
        let maxCalories = 2500;

        ko.utils.arrayForEach(self.basketList(), function(product) {
            total += product.calories * product.quantity();
        });

        if (undefined != self.selectedProfile()) {
            maxCalories = self.selectedProfile().calories
        }

        self.caloriesProgress(total * 100 / maxCalories);

        return total + " / " + maxCalories + "kcal";
    });

    /**
     * Function adding a product to the basket
     *
     * @param product
     */
    self.addProductToBasket = function (product) {
        let index = self.basketList.indexOf(product);
        if(index > -1) {
            self.basketList()[index].quantity(self.basketList()[index].quantity() + 1);
        } else {
            self.basketList.push(product);
        }
    };

    /**
     * Function removing a product of the basket
     *
     * @param product
     */
    self.removeProductOfBasket = function (product) {
        let index = self.basketList.indexOf(product);
        let quantity = self.basketList()[index].quantity();
        if(quantity > 1) {
            self.basketList()[index].quantity(self.basketList()[index].quantity() - 1);
        } else {
            self.basketList.remove(product);
        }
    };

    /**
     * Function launching the research of a list of products
     */
    self.launchSearch = function () {
        if ("search_button" == event.target.id ||
            "product_searched" == event.target.id ||
            "min_cal_searched" == event.target.id ||
            "max_cal_searched" == event.target.id) {
            self.productPaginate.page(1);
        }
        let interval = 5;
        let end = interval * self.productPaginate.page();
        let start = end - interval;
        let fields = "*";
        let appId = "d62702c9";
        let appKey = "3b33a35fc17e370e050895ced60c1798";
        let product = self.productSearched();

        if (null == product) {
            product = '*';
        }

        $.getJSON("https://api.nutritionix.com/v1_1/search/" + product +
            "?results=" + start + "%3A" + end +
            "&cal_min=" + self.minCalSearched() +
            "&cal_max=" + self.maxCalSearched() +
            "&fields=" + fields +
            "&appId=" + appId +
            "&appKey=" + appKey,
            function(data) {
                console.log(data);
                let nbPages = 1;

                self.productFounded(data.total_hits);
                if (10000 < data.total_hits) {
                    nbPages = 10000 / interval;
                } else {
                    nbPages = data.total_hits / interval;
                }
                self.productPaginate.nbPages(nbPages);

                self.productList.removeAll();
                data.hits.forEach(function (product) {
                    self.productList.push(
                        new Product(
                            product.fields.item_id,
                            product.fields.brand_name + ", " + product.fields.item_name,
                            product.fields.nf_calories,
                            product.fields.nf_sodium/1000
                        ));
                })
            })
        ;
    };
}

// Activates knockout.js
ko.applyBindings(new AppModelView());
