routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/about/',
    url: './pages/about.html',
  },
  {
    path: '/barcode/',
    url: './pages/barcode.html',
  },
  {
    path: '/printtest/',
    componentUrl: './pages/printtest.html',
  },
  {
    path: '/empty/',
    url: './pages/empty.html',
  },
  {
    path: '/catalog/',
    componentUrl: './pages/catalog.html',
  },
  {
    path: '/createcustomer/',
    componentUrl: './pages/createcustomer.html',
  },

  
 
  {
    path: '/product/:id/',
    componentUrl: './pages/product.html',
  },
  {
    path: '/mylocation/',
    componentUrl: './pages/mylocation.html',
  },
  {
    path: '/settings/',
    componentUrl: './pages/settings.html'
  },
  {
    path: '/printsettings/',
    componentUrl: './pages/printsettings.html'
  },
  // Page Loaders & Router
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
  },
  {
    path: '/customerlist/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;
      // App instance
      var app = router.app;
      var customerlist;
      var dblocalversion = localStorage.getItem("CurrentDBVersion");
      idb.open('unodbmobile', dblocalversion).then(function(db) {
        var tx = db.transaction(['customer'], 'readonly');
        var tblcustomer = tx.objectStore('customer');
        return tblcustomer.getAll();
      }).then(function(items) {
        //console.log('items:' + items);
        var custlist=[];
        for(var k in items){
          //console.log("key:" + k);
          //console.log("items:" + items[k]);
          //custlist.push(app.utils.extend({key:k},items[k]));
          custlist.push(items[k]);
        }
        //console.log(custlist);

        resolve(
            {
              componentUrl: './pages/customerlist.html',
            },
            {
              context: {
                customerlist: custlist,
              }
            }
        );
      });
    }

  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
            {
              componentUrl: './pages/request-and-load.html',
            },
            {
              context: {
                user: user,
              }
            }
        );
      }, 1000);
    },
  },

  {
    name: 'customerview',
    path: '/customerview/:customer/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // get the cust guid customerid
      var cust = routeTo.params.customer;
      var dblocalversion = localStorage.getItem("CurrentDBVersion");
      // Show Preloader
      app.preloader.show();
      idb.open('unodbmobile', dblocalversion).then(function(db) {
        var tx = db.transaction(['customer'], 'readonly');
        var tblcustomer = tx.objectStore('customer');
        return tblcustomer.get(cust);
      }).then(function(custret) {
        //console.log(custret);
        resolve(
            {
              componentUrl: './pages/customerview.html',
            },
            {
              context: {
                customer: custret,
              }
            }
        );
      });

      app.preloader.hide();

    }
  },

  { //https://flaviocopes.com/indexeddb/
    path: '/warehouselist/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;
      // App instance
      var app = router.app;
      var dblocalversion = localStorage.getItem("CurrentDBVersion");
      idb.open('unodbmobile', dblocalversion).then(function(db) {
        var tx = db.transaction(['warehouse'], 'readonly');
        var tblWarehouse = tx.objectStore('warehouse');
        return tblWarehouse.getAll();
      }).then(function(items) {
        //console.log('items:' + items);
        var whlist=[];
        for(var k in items){
          whlist.push(items[k]);
        }
        //console.log(custlist);
        resolve(
            {
              componentUrl: './pages/warehouselist.html',
            },
            {
              context: {
                warehouselist: whlist,
              }
            }
        );
      });
    }

  },

  {
    name: 'warehouseview',
    path: '/warehouseview/:warehouse/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // get the cust guid customerid
      var wh = routeTo.params.warehouse;
      var dblocalversion = localStorage.getItem("CurrentDBVersion");
      // Show Preloader
      app.preloader.show();
      idb.open('unodbmobile', dblocalversion).then(function(db) {
        var tx = db.transaction(['warehouse'], 'readonly');
        var tblwarehouse = tx.objectStore('warehouse');
        return tblwarehouse.get(wh);
      }).then(function(whret) {
        //console.log(custret);
        resolve(
            {
              componentUrl: './pages/warehouseview.html',
            },
            {
              context: {
                warehouse: whret,
              }
            }
        );
      });

      app.preloader.hide();

    }
  },

  { //https://flaviocopes.com/indexeddb/
    path: '/stocklist/',
    async: function (routeTo, routeFrom, resolve, reject) {
      app.preloader.show();
      var dblocalversion = localStorage.getItem("CurrentDBVersion");
      idb.open('unodbmobile', dblocalversion).then(function(db) {
        var tx = db.transaction(['stock'], 'readonly');
        var tblstock = tx.objectStore('stock');
        return tblstock.getAll();
      }).then(function(items) {
        //console.log('items:' + items);
        var stklist=[];
        for (var k in items) {        
          if (items[k]['qun_onhand'] >= 0 ) {
            stklist.push(items[k]);
          }
        };
        app.preloader.hide();
        resolve(
            {
              componentUrl: './pages/stocklist.html',
            },
            {
              context: {
                stocklist: stklist,
              }
            }
        );
      });
    }

  },

  { //https://flaviocopes.com/indexeddb/
    path: '/stocksearch/',
     async: async function (routeTo, routeFrom, resolve, reject) {
       let InvoiceData = await PrapreInvoiceData()
       var replacement = localStorage.getItem("replacement");
       var isreplacement = false;
       if (replacement == "1") {
         isreplacement = true;
       }
       app.preloader.hide();   
       resolve(
        {
          componentUrl: './pages/stocksearch.html',
        },
        {
          context: {
            stocklist: InvoiceData.stklist,
            pricelist: InvoiceData.pricelist,
            customerlist: InvoiceData.custlist,
            invtype: 'SA',
            replacement: isreplacement,
            counterlist: InvoiceData.countlist,
            isEditInvoice: false,
            cubelist: InvoiceData.cubes,
            maingroups: InvoiceData.maingroups,
            allgroups: InvoiceData.allgroups,
            allregion: InvoiceData.allregion,
          }
        }
      );
    }

  },



  { //https://flaviocopes.com/indexeddb/
    path: '/Damagelist/',
    async: function (routeTo, routeFrom, resolve, reject) {
      app.preloader.show();
      var dblocalversion = localStorage.getItem("CurrentDBVersion");
      idb.open('unodbmobile', dblocalversion).then(function (db) {
        var tx = db.transaction(['stock'], 'readonly');
        var tblstock = tx.objectStore('stock');
        return tblstock.getAll();
      }).then(function (items) {
        //console.log('items:' + items);
        var DMlist = [];
        for (var k in items) {
          if (items[k]['DMQTy'] > 0) {
            DMlist.push(items[k]);
          }
        };
        app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/Damagelist.html',
          },
          {
            context: {
              Damagelist: DMlist,
            }
          }
        );
      });
    }

  },

  {
    name: 'stockview',
    path: '/stockview/:stock/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // get the cust guid customerid
      var stk = routeTo.params.stock;
      var dblocalversion = localStorage.getItem("CurrentDBVersion");
      // Show Preloader
      app.preloader.show();
      idb.open('unodbmobile', dblocalversion).then(function(db) {
        var tx = db.transaction(['stock'], 'readonly');
        var tblstock = tx.objectStore('stock');
        return tblstock.get(stk);
      }).then(function(stockRet) {
        resolve(
            {
              componentUrl: './pages/stockview.html',
            },
            {
              context: {
                stock: stockRet,
              }
            }
        );
      });

      app.preloader.hide();

    }
  },


  

  {
    path: '/salesinvoice/',
    async: async function (routeTo, routeFrom, resolve, reject) {
      let InvoiceData = await PrapreInvoiceData();    
      var stklist = [];
      var replacement = localStorage.getItem("replacement");
      var isreplacement = false;
      if (replacement == "1") {
        isreplacement = true;
      }
      for (var k in InvoiceData.stklist) {
        if (InvoiceData.stklist[k]['qun_onhand'] >= 0) {
          stklist.push(InvoiceData.stklist[k]);
          }
        };
      
      app.preloader.hide();
      resolve(
          {
            componentUrl: './pages/salesinvoice.html',
          },
          {
            context: {
              stocklist: stklist,
              pricelist: InvoiceData.pricelist,
              customerlist: InvoiceData.custlist,        
              invtype: 'SA',
              replacement: isreplacement,
              counterlist: InvoiceData.countlist,
              isEditInvoice: false,
              cubelist: InvoiceData.cubes,
              maingroups:  InvoiceData.maingroups,
              allgroups: InvoiceData.allgroups,
              allregion: InvoiceData.allregion,
            }
          }
      );
    }

  },


  {
    path: '/salesLocal/',
    async: async function (routeTo, routeFrom, resolve, reject) {
      let InvoiceData = await PrapreInvoiceData();
      var replacement = localStorage.getItem("replacement");
      var isreplacement = false;
      if (replacement == "1") {
        isreplacement = true;
      }
      app.preloader.hide();
      resolve(
        {
          componentUrl: './pages/salesinvoice.html',
        },
        {
          context: {
            stocklist: InvoiceData.stklist,
            customerlist: InvoiceData.custlist,
            invtype: 'SL',
            replacement: isreplacement,
            isEditInvoice: false,
            cubelist: InvoiceData.cubes,
            counterlist: InvoiceData.countlist,
            maingroups: InvoiceData.maingroups,
            allgroups: InvoiceData.allgroups,
            allregion: InvoiceData.allregion,
          }
        }
      );
    }

  },

   {
    path: '/Damageinvoice/',
    async: async function (routeTo, routeFrom, resolve, reject) {
      let InvoiceData = await PrapreInvoiceData();
      var replacement = localStorage.getItem("replacement");
      var isreplacement = false;
      if (replacement == "1") {
        isreplacement = true;
      }
      app.preloader.hide();
      resolve(
        {
          componentUrl: './pages/salesinvoice.html',
        },
        {
          context: {
            stocklist: InvoiceData.stklist,
            pricelist: InvoiceData.pricelist,
            customerlist: InvoiceData.custlist,
            invtype: 'DM',
            replacement: isreplacement,
            isEditInvoice: false,
            counterlist: InvoiceData.countlist,
            cubelist: InvoiceData.cubes,
            maingroups: InvoiceData.maingroups,
            allgroups: InvoiceData.allgroups,
            allregion: InvoiceData.allregion,
          }
        }
      );
    }

  },

  {
    path: '/orderinvoice/',
    async: async function (routeTo, routeFrom, resolve, reject) {
      let InvoiceData = await PrapreInvoiceData();
      var replacement = localStorage.getItem("replacement");
      var isreplacement = false;
      if (replacement == "1") {
        isreplacement = true;
      }
      app.preloader.hide();
      resolve(
          {
            componentUrl: './pages/salesinvoice.html',
          },
          {
            context: {
              stocklist: InvoiceData.stklist,
              pricelist: InvoiceData.pricelist,
              customerlist: InvoiceData.custlist,
              invtype: 'SO',
              replacement: isreplacement,
              isEditInvoice: false,
              cubelist: InvoiceData.cubes,
              counterlist: InvoiceData.countlist,
              maingroups:  InvoiceData.maingroups,
              allgroups: InvoiceData.allgroups,
              allregion: InvoiceData.allregion,
            }
          }
      );
    }
  },

  {
    path: '/returninvoice/',
    async: async function (routeTo, routeFrom, resolve, reject) {
      let InvoiceData = await PrapreInvoiceData();    
      app.preloader.hide();
      var replacement = localStorage.getItem("replacement");
      var isreplacement = false;
      if (replacement == "1") {
        isreplacement = true;
      }
      resolve(
          {
            componentUrl: './pages/salesinvoice.html',
          },
          {
            context: {
              stocklist: InvoiceData.stklist,
              pricelist: InvoiceData.pricelist,
              customerlist: InvoiceData.custlist,
              invtype: 'SR',
              replacement: isreplacement,
              isEditInvoice: false,
              cubelist: InvoiceData.cubes,
              counterlist: InvoiceData.countlist,
              maingroups:  InvoiceData.maingroups,
              allgroups: InvoiceData.allgroups,
              allregion: InvoiceData.allregion,
            }
          }
      );

    }

  },

  { //https://flaviocopes.com/indexeddb/
    path: '/invoicelist/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;
      // App instance
      var app = router.app;
      var invparentlist=[];
      var invkeys=[];
      var dblocalversion = localStorage.getItem("CurrentDBVersion");
      idb.open('unodbmobile', dblocalversion).then(function(db) {
        var tx = db.transaction(['invoice'], 'readonly');
        var tblinvoice = tx.objectStore('invoice');
        return tblinvoice.getAllKeys();
      }).then(function(items) {
        for(var k in items){
          invkeys.push(items[k]);
        }
      });

      //console.log(invkeys);

      idb.open('unodbmobile', dblocalversion).then(function(db) {
        var tx = db.transaction(['invoice'], 'readonly');
        var tblinvoice = tx.objectStore('invoice');
        return tblinvoice.getAll();
      }).then(function(items) {
        for(var k in items){
          //console.log("k=" + k + "invkeys[k]=" + invkeys[k]);
          // adding PK from prev. array
          items[k][0]["PK_key"] = invkeys[k];
          invparentlist.push(items[k][0]);
          //console.log(invparentlist);
        }
        resolve(
            {
              componentUrl: './pages/invoicelist.html',
            },
            {
              context: {
                invparentlist: invparentlist,
              }
            }
        );
      });

    }

  },

  {
    path: '/CheckInOut/',    
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;
      // App instance
      var app = router.app;
      var customerlist;
      var dblocalversion = localStorage.getItem("CurrentDBVersion");
      idb.open('unodbmobile', dblocalversion).then(function (db) {
        var tx = db.transaction(['customer'], 'readonly');
        var tblcustomer = tx.objectStore('customer');
        return tblcustomer.getAll();
      }).then(function (items) {
        //console.log('items:' + items);
        var custlist = [];
        for (var k in items) {
          //console.log("key:" + k);
          //console.log("items:" + items[k]);
          //custlist.push(app.utils.extend({key:k},items[k]));
          custlist.push(items[k]);
        }
        //console.log(custlist);

        resolve(
          {
            componentUrl: './pages/CheckInOut.html',
          },
          {
            context: {
              customerlist: custlist,
            }
          }
        );
      });
    }

  },

  { //https://flaviocopes.com/indexeddb/
    path: '/ReceiptVoucher/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;
      // App instance
      //let InvoiceData = await PrapreInvoiceData();
      var app = router.app;
      var invparentlist = [];
      var invkeys = [];
      var custlist = [];
      var dblocalversion = localStorage.getItem("CurrentDBVersion");
      idb.open('unodbmobile', dblocalversion).then(function (db) {
        var tx = db.transaction(['invoice'], 'readonly');
        var tblinvoice = tx.objectStore('invoice');
        return tblinvoice.getAllKeys();
      }).then(function (items) {
        for (var k in items) {
          invkeys.push(items[k]);
        }
        });

      idb.open('unodbmobile', dblocalversion).then(function (db) {
        var tx_customer = db.transaction(['customer'], 'readonly');
        var tblcustomer = tx_customer.objectStore('customer');
        return tblcustomer.getAll();
      }).then(function (items){
        for (var cust in items) {
          custlist.push(items[cust]);
        }
      });

      //console.log(invkeys);

      idb.open('unodbmobile', dblocalversion).then(function (db) {
        var tx = db.transaction(['invoice'], 'readonly');
        var tblinvoice = tx.objectStore('invoice');
        return tblinvoice.getAll();
      }).then(function (items) {
        for (var k in items) {
          //console.log("k=" + k + "invkeys[k]=" + invkeys[k]);
          // adding PK from prev. array
          items[k][0]["PK_key"] = invkeys[k];
          invparentlist.push(items[k]);
          //console.log(invparentlist);
        }
        //app.preloader.hide();
        resolve(
          {
            componentUrl: './pages/ReceiptVoucher.html',
          },
          {
            context: {
              invparentlist: invparentlist,
              customerlist: custlist,
              invtype: 'RV',
              isEditInvoice: false,
            }
          }
        );
      });

    }

  },



  { //https://flaviocopes.com/indexeddb/
    path: '/VouchersList/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;
      // App instance
      var app = router.app;
      var JVlist = [];
      var JVkeys = [];
      var dblocalversion = localStorage.getItem("CurrentDBVersion");
      idb.open('unodbmobile', dblocalversion).then(function (db) {
        var tx = db.transaction(['ReceiptVouchers'], 'readonly');
        var tblJV = tx.objectStore('ReceiptVouchers');
        return tblJV.getAllKeys();
      }).then(function (items) {
        for (var k in items) {
          JVkeys.push(items[k]);
        }
      });

      //console.log(invkeys);

      idb.open('unodbmobile', dblocalversion).then(function (db) {
        var tx = db.transaction(['ReceiptVouchers'], 'readonly');
        var tblJV = tx.objectStore('ReceiptVouchers');
        return tblJV.getAll();
      }).then(function (items) {
        for (var k in items) {
          //console.log("k=" + k + "invkeys[k]=" + invkeys[k]);
          // adding PK from prev. array
          items[k][0]["PK_key"] = JVkeys[k];
          JVlist.push(items[k][0]);
          //console.log(invparentlist);
        }
        resolve(
          {
            componentUrl: './pages/VouchersList.html',
          },
          {
            context: {
              JVlist: JVlist,
            }
          }
        );
      });

    }

  },
  {
    path: '/editsalesinvoice/:invpk/',
    async: async function (routeTo, routeFrom, resolve, reject) {
      // need to send customer list and stock list to the invoice
      const invoicelist = [];
      var replacement = localStorage.getItem("replacement");
      var isreplacement = false;
      if (replacement == "1") {
        isreplacement = true;
      }
      let InvoiceData = await PrapreInvoiceData();
      const invID =parseFloat(routeTo.params.invpk);

      // Adding the current invoice
      let lstinvoice = await getInvoice(invID);

      for(var inv in lstinvoice){
        invoicelist.push(lstinvoice[inv]);
      }
      app.preloader.hide();
      resolve(
          {
            componentUrl: './pages/salesinvoice.html',
          },
          {
            context: {
              stocklist: InvoiceData.stklist,
              customerlist: InvoiceData.custlist,
              invtype: invoicelist[0]["inv_type"],
              replacement: isreplacement,
              invoicelist: invoicelist,
              counterlist: InvoiceData.countlist,
              isEditInvoice: true,
              invoiceKey:invID,
              cubelist: InvoiceData.cubes,
              maingroups:  InvoiceData.maingroups,
              allgroups: InvoiceData.allgroups,
            }
          }
      );
    }

  },
  {
    path: '/editReceiptvoucher/:JVpk/',
    async: async function (routeTo, routeFrom, resolve, reject) {
      // need to send customer list and stock list to the invoice
      const JVlist = [];
      let JVData = await PrapreInvoiceData();
      const JVID = parseFloat(routeTo.params.JVpk);

      // Adding the current invoice
      let lstJV = await getJV(JVID);

      for (var inv in lstJV) {
        JVlist.push(lstJV[inv]);
      }
      app.preloader.hide();
      resolve(
        {
          componentUrl: './pages/ReceiptVoucher.html',
        },
        {
          context: {
           
            customerlist: JVData.custlist,
            invtype: JVlist[0]["inv_type"],
            JVlist: JVlist,
            isEditJV: true,
            JVKey: JVID,

          }
        }
      );
    }

  },

  { //https://flaviocopes.com/indexeddb/
    path: '/stockcube/',
    async: function (routeTo, routeFrom, resolve, reject) {
      app.preloader.show;
      const stklist = [];
      const cubes = [];
      var dblocalversion = localStorage.getItem("CurrentDBVersion");
      idb.open('unodbmobile', dblocalversion).then(function (db) {
        var tx = db.transaction(['stock'], 'readonly');
        var tblstock = tx.objectStore('stock');
        return tblstock.getAll();
      }).then(function (items) {
        for (var k in items) {
          stklist.push(items[k]);
        }
      }).then(function () {
        idb.open('unodbmobile', dblocalversion).then(function (db) {
          var tx = db.transaction(['smartcube'], 'readonly');
          var tblcubes = tx.objectStore('smartcube');
          return tblcubes.getAll();
        }).then(function (items) {
          for (var k in items) {
            cubes.push(items[k]);
          }
          app.preloader.hide();
          //console.log(cubes);
          resolve(
              {
                componentUrl: './pages/stockswipe.html',
              },
              {
                context: {
                  stocklist: stklist,
                  cubelist: cubes,
                }
              }
          );
        });
      });
    }
  },
  {
    path: '/PrintPreview/:invpk/',
    async: async function (routeTo, routeFrom, resolve, reject) {
      // need to send customer list and stock list to the invoice
      const invoicelist = [];
      var replacement = localStorage.getItem("replacement");
      var isreplacement = false;
      if (replacement == "1") {
        isreplacement = true;
      }
      let InvoiceData = await PrapreInvoiceData();
      const invID = parseFloat(routeTo.params.invpk);

      // Adding the current invoice
      let lstinvoice = await getInvoice(invID);

      for (var inv in lstinvoice) {
        invoicelist.push(lstinvoice[inv]);
      }
      app.preloader.hide();
      resolve(
        {
          componentUrl: './pages/salesinvoice.html',
        },
        {
          context: {
            stocklist: InvoiceData.stklist,
            customerlist: InvoiceData.custlist,
            invtype: invoicelist[0]["inv_type"],
            replacement: isreplacement,
            invoicelist: invoicelist,
            counterlist: InvoiceData.countlist,
            isEditInvoice: true,
            invoiceKey: invID,
            cubelist: InvoiceData.cubes,
            maingroups: InvoiceData.maingroups,
            allgroups: InvoiceData.allgroups,
            isPrintPreview: true,

          }
        }
      );
    }

  },

  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
