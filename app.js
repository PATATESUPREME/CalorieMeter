/**
 * Product class
 *
 * @param {string} id       Product's Id
 * @param {string} name     Product's name
 * @param {number} calories Product's calories
 * @param {number} salt     Product's salt
 * @param {int}    quantity Product's quantity
 * @constructor
 */
function Product(id, name, calories, salt, quantity = 1) {
    /** Self variable overrides bad behavior of this */
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
 * @param {string} name     Profile's name
 * @param {number} calories Profile's calories recommended
 * @param {number} salt     Profile's salt recommended
 * @constructor
 */
function Profile(name, calories, salt) {
    /** Self variable overrides bad behavior of this */
    let self = this;

    self.name = name;
    self.calories = calories;
    self.salt = salt;
}

/**
 * Paginate class
 *
 * @param {int}      page    Paginate's current page
 * @param {int}      nbPages Paginate's total pages
 * @param {function} handler Paginate's handler when changing page
 * @constructor
 */
function Paginate(page, nbPages, handler) {
    /** Self variable overrides bad behavior of this */
    let self = this;

    self.page = ko.observable(page);
    self.nbPages = ko.observable(nbPages);
    self.handler = handler;

    /**
     * Function to go to the first page
     */
    self.first = function () {
        self.page(1);
        self.handler();
    };
    /**
     * Function to go to the previous page
     */
    self.previous = function () {
        self.page(self.page() - 1);
        self.handler();
    };
    /**
     * Function to go to the next page
     */
    self.next = function () {
        self.page(self.page() + 1);
        self.handler();
    };
    /**
     * Function to go to the last page
     */
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
    /** Self variable overrides bad behavior of this */
    let self = this;

    /**
     * Search
     */
    /** Search's input for the product searched */
    self.productSearched = ko.observable();
    /** Search's input for the minimum calories wanted */
    self.minCalSearched = ko.observable(0);
    /** Search's input for the maximum calories wanted */
    self.maxCalSearched = ko.observable(50000);
    /** Number of products found */
    self.productFound = ko.observable(0);
    /** Product's list */
    self.productList = ko.observableArray();
    /** Product's paginate */
    self.productPaginate = new Paginate(1, 0, function() {
        return self.launchSearch();
    });

    /**
     * Function launching the research of a list of products
     */
    self.launchSearch = function () {
        /** Verify if its a new search */
        if ("search_button" === event.target.id ||
            "product_searched" === event.target.id ||
            "min_cal_searched" === event.target.id ||
            "max_cal_searched" === event.target.id) {
            self.productPaginate.page(1);
        }
        /** Number of elements in the table (Can be up to max 20 with nutritionix) */
        let interval = 5;
        /** Calculate the limit and offset of the request */
        let end = interval * self.productPaginate.page();
        let start = end - interval;
        /** Which fields we want to get in response (* to get everything) */
        let fields = "*";
        /** My appId and appKey to be able to access nutritionix */
        let appId = "d62702c9";
        let appKey = "3b33a35fc17e370e050895ced60c1798";
        /** The product searched in the search's input of the product */
        let product = self.productSearched();

        /** Verify if there is a product else we try to find all of them with * */
        if (null === product) {
            product = '*';
        } else if ("baguette".toUpperCase() === product.toUpperCase()) {
            /** Profile of Jonathan */
            let Jonathan = new Profile("Jonathan", 2500, 5);

            /** Get the profile by searching by name */
            let match = ko.utils.arrayFirst(self.availableProfiles(), function(item) {
                return Jonathan.name === item.name;
            });

            /** Check if it already exists */
            if(!match) {
                /** Add the product to the basket list */
                self.availableProfiles.push(Jonathan);
            }
        }

        /** A jQuery http request to get the products from nutritionix */
        $.getJSON("https://api.nutritionix.com/v1_1/search/" + product +
            "?results=" + start + "%3A" + end +
            "&cal_min=" + self.minCalSearched() +
            "&cal_max=" + self.maxCalSearched() +
            "&fields=" + fields +
            "&appId=" + appId +
            "&appKey=" + appKey,
            function(data) {
                /** Initialise a minimum number of pages */
                let nbPages = 1;

                /** Set the total of products found */
                self.productFound(data.total_hits);

                /** Verify if the total of products found is over 10000 because it's the limit of nutritionix's request */
                if (10000 < self.productFound()) {
                    /** Set the number of page to maximum */
                    nbPages = parseInt(10000 / interval) + 1;
                } else {
                    /** Set the number of page accordingly to the number of products found */
                    nbPages = parseInt(self.productFound() / interval) + 1;
                }
                /** Set the number of page of the pagination */
                self.productPaginate.nbPages(nbPages);

                /** Remove all existing product in the product list */
                self.productList.removeAll();

                /** Add the new products to the list */
                data.hits.forEach(function (product) {
                    /** Push a new Product object to the product list */
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

    /**
     * Basket
     */
    /** Basket's list */
    self.basketList = ko.observableArray();
    /** Basket's list start index */
    self.basketStartIndex = ko.observable(0);
    /** Basket's number of elements in table */
    self.basketInterval = ko.observable(5);
    /** Basket's paginate */
    self.basketPaginate = new Paginate(1, 0, function() {
        return self.changePageBasket();
    });
    /** Basket's list sliced, ready to be displayed */
    self.basketListSliced = ko.computed(function() {
        self.basketPaginate.nbPages(parseInt((self.basketList().length - 1) / self.basketInterval()) + 1);

        return self.basketList.slice(self.basketStartIndex(), self.basketStartIndex() + self.basketInterval());
    });

    /**
     * Function that handles the page changes
     */
    self.changePageBasket = function () {
        /** Set the start index of the basket */
        self.basketStartIndex(self.basketPaginate.page() * self.basketInterval() - self.basketInterval());
    };

    /**
     * Function adding a product to the basket
     *
     * @param product
     */
    self.addProductToBasket = function (product) {
        /** Get the index of the product */
        let index = self.basketList.indexOf(product);

        /** Check if it already exists */
        if(index > -1) {
            /** Augment the quantity of the existing product */
            self.basketList()[index].quantity(self.basketList()[index].quantity() + 1);
        } else {
            /** Add the product to the basket list */
            self.basketList.push(product);
        }
    };

    /**
     * Function removing a product of the basket
     *
     * @param product
     */
    self.removeProductOfBasket = function (product) {
        /** Get the index of the product */
        let index = self.basketList.indexOf(product);
        /** Get the quantity of the product */
        let quantity = self.basketList()[index].quantity();

        /** Check if there is more than one product in the basket list */
        if(quantity > 1) {
            /** Decrease the quantity of the product */
            self.basketList()[index].quantity(self.basketList()[index].quantity() - 1);
        } else {
            /** Remove the product of the list */
            self.basketList.remove(product);
        }
    };

    /**
     * Profile variables
     */
    /** Array of available profiles */
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
    /** Current profile selected */
    self.selectedProfile = ko.observable();
    /** Status of the calories of the current profile */
    self.caloriesProgress = ko.observable(0);
    /** Set the color according to the calories' status */
    self.caloriesStatus = ko.computed(function() {
        /** Check there is too much calories */
        if (self.caloriesProgress() > 100) {
            /** Announce to much calories */
            return "bg-danger";
        } else {
            /** The status is ok */
            return "bg-success";
        }
    });
    /** Status of the salt of the current profile */
    self.saltProgress = ko.observable(0);
    /** Set the color according to the salt's status */
    self.saltStatus = ko.computed(function() {
        /** Check there is too much salt */
        if (self.saltProgress() > 100) {
            /** Announce to much salt */
            return "bg-danger";
        } else {
            /** The status is ok */
            return "bg-success";
        }
    });
    /** Compute the quantity of calories in the basket */
    self.caloriesQuantity = ko.computed(function() {
        /** Initialise the quantity of calories */
        let quantity = 0;
        /** Initialise the maximum calories according to Wikipedia */
        let maxCalories = 2500;

        /** Calculate the quantity of calories in the basket */
        ko.utils.arrayForEach(self.basketList(), function(product) {
            quantity += product.calories * product.quantity();
        });

        /** Check if there is a profile selected */
        if (undefined != self.selectedProfile()) {
            /** Set the maximum according to the profile */
            maxCalories = self.selectedProfile().calories
        }

        /** Set the status of the calories */
        self.caloriesProgress(quantity * 100 / maxCalories);

        /** Returns the amount of calories in the basket */
        return quantity + " / " + maxCalories + "kcal";
    });
    /** Compute the quantity of salt in the basket */
    self.saltQuantity = ko.computed(function() {
        /** Initialise the quantity of salt */
        let quantity = 0;
        /** Initialise the maximum calories according to Wikipedia */
        let maxSalt = 5;

        /** Calculate the quantity of salt in the basket */
        ko.utils.arrayForEach(self.basketList(), function(product) {
            quantity += product.salt * product.quantity();
        });

        /** Check if there is a profile selected */
        if (undefined != self.selectedProfile()) {
            /** Set the maximum according to the profile */
            maxSalt = self.selectedProfile().salt
        }

        /** Set the status of the salt */
        self.saltProgress(quantity * 100 / maxSalt);

        /** Returns the amount of salt in the basket */
        return quantity + " / " + maxSalt + "g";
    });
    /**
     * Function checking the profile
     */
    self.checkProfile = function () {
        /** Jonathan's Baguette */
        let Baguette = new Product("666", "Jonathan's Baguette", 900, 2, 1);

        /** Get the product by searching by his name */
        let match = ko.utils.arrayFirst(self.basketList(), function(item) {
            return Baguette.name === item.name;
        });

        /** Is it Jonathan */
        if ("Jonathan" === self.selectedProfile().name) {
            /** Check if it already exists */
            if(!match) {
                /** Add the product to the basket list */
                self.basketList.push(Baguette);
            }
        } else {
            if(match) {
                /** Remove the product to the basket list */
                self.basketList.remove(match);
            }
        }
    };
}

/** Activates knockout.js */
ko.applyBindings(new AppModelView());
