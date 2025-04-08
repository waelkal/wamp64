// Dom7
var $$ = Dom7;

// getting normal settings and save it in a global var

function isEmpty(value){
  return (value == null || value.length === 0);
}


// if No local settings .. this is the first time to open .. Update the CurrentDBVersion
if (isEmpty(localStorage.getItem('CurrentDBVersion'))) {
  localStorage.setItem('CurrentDBVersion', '1');
}


if (isEmpty(localStorage.getItem('PendingUploads'))) {
  localStorage.setItem('PendingUploads', '0');
}

// We can consider Scenario1 is the default one if local storage is empty


if (isEmpty(localStorage.getItem('Scenario'))) {
  localStorage.setItem('Scenario', 'Scenario1');
}


if (isEmpty(localStorage.getItem('UpdateDataToOnlineServer'))) {
  //console.log("At App updateDataToOnlineServer setting UpdateDataToOnlineServer default to 1");
  localStorage.setItem('UpdateDataToOnlineServer', '1');
}

//Setting service worker if it exists in bowser navigator
if('serviceWorker' in navigator){
  //register the service worker

  navigator.serviceWorker.register('sw.js').then(function(result){
    // console.log(result.scope);
    /*result.addEventListener('updatefound', () => {
            // An updated service worker has appeared in reg.installing!
            newWorker = result.installing;
            newWorker.addEventListener('statechange', () => {
                // Has service worker state changed?
                switch (newWorker.state) {
                    case 'installed':
                        console.write("New Version!!");
                        // There is a new service worker available, show the notification
                        var toastBottom = app.toast.create({
                            text: ' New Version Available! Please refresh',
                            closeTimeout: 3000,
                        });
                        toastBottom.open();
                        break;
                }
            });
        });*/
    console.log('Service Worker Registered');
    //console.log('Scope: ' + result.scope);
  }, function(error){
    console.log('Service Worker Regiatration Failed');
    console.log(error);
  });
}else{
  console.log('Service Workers Not Supported');
}
/*

let refreshing;
// The event listener that is fired when the service worker updates
// Here we reload the page
navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
});
*/

// Sending message to sw to get the version
console.log('Sending message to sw to get the version');
send_message_to_sw('Version');

function send_message_to_sw(msg){
  return new Promise(function(resolve, reject){
    // Create a Message Channel
    //console.log("Create Message Channel to get the version")
    var msg_chan = new MessageChannel();

    // Handler for recieving message reply from service worker
    msg_chan.port1.onmessage = function(event){
      if(event.data.error){
        reject(event.data.error);
      }else{
        resolve(event.data);
        localStorage.setItem('CacheVersion', event.data);
        $$("#CacheVersion").text(localStorage.getItem("CacheVersion"));

      }
    };

    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      // Let's see if you have a subscription already
      return serviceWorkerRegistration.pushManager.getSubscription();
    })
        .then(function(subscription) {
          if (!subscription) {
            // You do not have subscription
          }
          // You have subscription.
          // Send data to service worker
          // Send message to service worker along with port for reply
          navigator.serviceWorker.controller.postMessage(msg, [msg_chan.port2]);

        })

  });
}




//console.log("Starting App..");
// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'com.unopwa', // App bundle ID
  name: 'unopwa', // App name
  theme: 'auto', // Automatic theme detection
  touch: {
    disableContextMenu: false
  },
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  // App root methods
  methods: {
    NewDatabase: function () {
      //console.log("New database");

      // Deleting unodbmobile the current local database
      // localStorage.getItem('CurrentDBVersion') must equal 1
      //https://github.com/jakearchibald/idb
      idb.delete('unodbmobile')
          .then(() => {
            const dbPromise = idb.open('unodbmobile', localStorage.getItem('CurrentDBVersion'), newDB => {
              // First let's create all the structure here
              newDB.createObjectStore('customer', { keyPath: 'customerid' });
              newDB.createObjectStore('warehouse', { keyPath: 'warehid' });
              newDB.createObjectStore('counter', { keyPath: 'type' });
              if (localStorage.getItem('replacement') === "1") {
                newDB.createObjectStore('stock', { keyPath: 'stkreplacebar' });
              }
              else {
                newDB.createObjectStore('stock', { keyPath: 'stkbar' });
              } 
              newDB.createObjectStore('stockprices', { keyPath: 'stkprice_id' });
              newDB.createObjectStore('smartcube', { keyPath: 'buttonId' });
              newDB.createObjectStore('invoice', { autoIncrement: true });
              newDB.createObjectStore('stockcalculatevalue', { keyPath: 'stkcv_id' });
              newDB.createObjectStore('ReceiptVouchers', { autoIncrement: true });
              var objectStore_group  = newDB.createObjectStore('group', {keyPath: 'sbg_id'});
              objectStore_group.createIndex("sbg_name", "sbg_name", { unique: false });
              var objectStore_allgroups  = newDB.createObjectStore('allgroups', {keyPath: 'groups_id'});
              objectStore_allgroups.createIndex("groupindex", ['gr_name','sbg_name','ssbg_name'], { unique: false });

            });

            dbPromise.then((db) => {
              var progress = 10;
              var dialog = app.dialog.progress('Downloading Database');
              progress += 10;
              dialog.setProgress(progress);
              dialog.setText('stockprices ' + ((progress) / 10) + ' of 5');
              app.methods.getAllstockpricesAndSave(db);

              progress += 10;
              dialog.setProgress(progress);
              dialog.setText('Stock ' + ((progress) / 10) + ' of 5');
              app.methods.getAllStockAndSave(db);

              progress += 10;
              dialog.setProgress(progress);
              dialog.setText('Customer ' + ((progress) / 10) + ' of 5');
              app.methods.getAllCustomerAndSave(db);
           
              progress += 10;
              dialog.setProgress(progress);
              dialog.setText('Warehouse ' + ((progress) / 10) + ' of 5');
              app.methods.getAllWarehousAndSave(db);

              progress += 10;
              dialog.setProgress(progress);
              dialog.setText('counter ' + ((progress) / 10) + ' of 5');
              app.methods.getAllcounterAndSave(db);

              progress += 10;
              dialog.setProgress(progress);
              dialog.setText('stockcalculatevalue ' + ((progress) / 10) + ' of 5');
              app.methods.getAllstockcalculatevalueAndSave(db);


              progress += 10;
              dialog.setProgress(progress);
              dialog.setText('group ' + ((progress) / 10) + ' of 5');
              app.methods.getOnlyMainGroupAndSave(db);

              progress += 10;
              dialog.setProgress(progress);
              dialog.setText('Groups ' + ((progress) / 10) + ' of 5');
              app.methods.getAllGroupsAndSave(db);
              // Update local database version as the online database version


              localStorage.setItem("CurrentDBVersion", localStorage.getItem('ServerDBVersion'));
              var interval = setInterval(function () {
                if (progress >= 60) {
                  app.dialog.close();
                }
              }, 500)
            })
          })
    },
    getAllCustomerAndSave: function (newDB) {
      console.log("getallCustomerAndSave");
      app.request({
        url: 'https://unopwa.app/api/getCustomers.php',
        crossDomain: true,
        async:true, // async processing
        data: {
          'dbhost': localStorage.getItem('Server'),
          'dbuser': localStorage.getItem('Username'),
          'dbpass': localStorage.getItem('Password'),
          'dbname': localStorage.getItem('Database'),
          'region': localStorage.getItem('region'),
          'Scenario': localStorage.getItem('Scenario'),
          'dbCashVanName': localStorage.getItem('CashVanName'),
          'dbsalesmanid':localStorage.getItem('salesmanid')
        },
        statusCode: {
          404: function (xhr) {
            alert('page not found');
          }
        },
        success: function (data, status, xhr) {
          //console.log(data);
          var JSONcustomer = JSON.parse(data);
          var tx_customer = newDB.transaction('customer', 'readwrite');
          for (var key in JSONcustomer) {
            if (JSONcustomer.hasOwnProperty(key)) {
              //console.log(JSONcustomer[key]["customerid"]);
              tx_customer.objectStore('customer').put(JSONcustomer[key]);
            }
          }
        },
        error:  function (xhr,status) {
          console.log('Error: ' + status);
        },
      })
    },
    getAllWarehousAndSave: function (newDB) {
      app.request({
        url: 'https://unopwa.app/api/getWarehouses.php',
        crossDomain: true,
        async:true, // async processing
        data: {
          'dbhost': localStorage.getItem('Server'),
          'dbuser': localStorage.getItem('Username'),
          'dbpass': localStorage.getItem('Password'),
          'dbname': localStorage.getItem('Database'),
          'dbwarehid':localStorage.getItem('warehid')
        },
        statusCode: {
          404: function (xhr) {
            alert('warehouse page not found');
          }
        },
        success: function (data, status, xhr) {
          var JSONwarehouse = JSON.parse(data);
          var tx_warehouse = newDB.transaction('warehouse', 'readwrite');
          for (var key in JSONwarehouse) {
            if (JSONwarehouse.hasOwnProperty(key)) {
              tx_warehouse.objectStore('warehouse').put(JSONwarehouse[key]);
            }
          }
        },
        error:  function (xhr,status) {
          console.log('Error: ' + status);
        },
      })
    },
    getAllcounterAndSave: function (newDB) {
      app.request({
        url: 'https://unopwa.app/api/getAllCounter.php',
        crossDomain: true,
        async: true, // async processing
        data: {
          'dbhost': localStorage.getItem('Server'),
          'dbuser': localStorage.getItem('Username'),
          'dbpass': localStorage.getItem('Password'),
          'dbname': localStorage.getItem('Database'),
          'dblocation': localStorage.getItem('locationcode')
        },
        statusCode: {
          404: function (xhr) {
            alert('counter page not found');
          }
        },

        success: function (data, status, xhr) {
          var JSONcounter = JSON.parse(data);
          var tx_counter = newDB.transaction('counter', 'readwrite');
          for (var key in JSONcounter) {
            if (JSONcounter.hasOwnProperty(key)) {
              tx_counter.objectStore('counter').put(JSONcounter[key]);
            }
          }
        },
        error: function (xhr, status) {
          console.log('Error: ' + status);
        },
      })
    },
    getAllstockcalculatevalueAndSave: function (newDB) {
      app.request({
        url: 'https://unopwa.app/api/getstockcalculatevalue.php',
        crossDomain: true,
        async: true, // async processing
        data: {
          'dbhost': localStorage.getItem('Server'),
          'dbuser': localStorage.getItem('Username'),
          'dbpass': localStorage.getItem('Password'),
          'dbname': localStorage.getItem('Database'),
          'dbwarehid': localStorage.getItem('warehid')
        },
        statusCode: {
          404: function (xhr) {
            alert('stockcalculatevalue not found');
          }
        },
        success: function (data, status, xhr) {
          var JSONstockcalculatevalue = JSON.parse(data);
          var tx_stockcalculatevalue = newDB.transaction('stockcalculatevalue', 'readwrite');
          for (var key in JSONstockcalculatevalue) {
            if (JSONstockcalculatevalue.hasOwnProperty(key)) {
              tx_stockcalculatevalue.objectStore('stockcalculatevalue').put(JSONstockcalculatevalue[key]);
            }
          }        
        },
        error: function (xhr, status) {
          console.log('Error: ' + status);
        },
      })
    },
    getOnlyMainGroupAndSave: function (newDB) {
      app.request({
        url: 'https://unopwa.app/api/getGroups.php', // Only getting the main groups
        crossDomain: true,
        async:true, // async processing
        data: {
          'dbhost': localStorage.getItem('Server'),
          'dbuser': localStorage.getItem('Username'),
          'dbpass': localStorage.getItem('Password'),
          'dbname': localStorage.getItem('Database')
        },
        statusCode: {
          404: function (xhr) {
            alert('Main Group page not found');
          }
        },
        success: function (data, status, xhr) {
          var JSONgroups = JSON.parse(data);
          var tx_groups = newDB.transaction('group', 'readwrite');
          //console.log(JSONgroups);
          for (var key in JSONgroups) {
            if (JSONgroups.hasOwnProperty(key)) {
              tx_groups.objectStore('group').put(JSONgroups[key]);
            }
          }
        },
        error:  function (xhr,status) {
          console.log('Error: ' + status);
        },
      })
    },
    getAllGroupsAndSave: function (newDB) {
      app.request({
        url: 'https://unopwa.app/api/getAllGroups.php',
        crossDomain: true,
        async:true, // async processing
        data: {
          'dbhost': localStorage.getItem('Server'),
          'dbuser': localStorage.getItem('Username'),
          'dbpass': localStorage.getItem('Password'),
          'dbname': localStorage.getItem('Database')
        },
        statusCode: {
          404: function (xhr) {
            alert('All Groups page not found');
          }
        },
        success: function (data, status, xhr) {
          var JSONallgroups = JSON.parse(data);
          var tx_allgroups = newDB.transaction('allgroups', 'readwrite');
          //console.log(JSONallgroups);
          for (var key in JSONallgroups) {
            if (JSONallgroups.hasOwnProperty(key)) {
              tx_allgroups.objectStore('allgroups').put(JSONallgroups[key]);
            }
          }
        },
        error:  function (xhr,status) {
          console.log('Error: ' + status);
        },
      })
    },
    getAllStockAndSave: function (newDB) {
      //console.log("getAllStockAndSave");
      app.request({
        url: 'https://unopwa.app/api/getStock.php',
        crossDomain: true,
        async:true, // async processing
        data: {
          'dbhost': localStorage.getItem('Server'),
          'dbuser': localStorage.getItem('Username'),
          'dbpass': localStorage.getItem('Password'),
          'dbname': localStorage.getItem('Database'),
          'dblimit': 5000,
          'dbwhcode': localStorage.getItem("whcode"),
          'Scenario': localStorage.getItem("Scenario")
        },
        statusCode: {
          404: function (xhr) {
            alert('Stock page not found');
          }
        },
        success: function (data, status, xhr) {
          //console.log("Dumping Stock data");
          //console.log(data);
          var JSONstock = JSON.parse(data);
          //console.log(JSONstock);      // Dump all data of the Object in the console
          // Create local indexeddb store table
          var tx_stock = newDB.transaction('stock', 'readwrite');
          for (var key in JSONstock) {
            if (JSONstock.hasOwnProperty(key)) {
              //console.log(JSONstock[key]["stkbar_id"]);
              tx_stock.objectStore('stock').put(JSONstock[key]);
            }
          }
          console.log("Stock data loaded");
          var toastBottom = app.toast.create({
            text: ' Stock Database loaded!!',
            closeTimeout: 3000,
          });
          toastBottom.open();
        },
        error:  function (xhr,status) {
          console.log('Error: ' + status);
        },
      })
    },
    getAllstockpricesAndSave: function (newDB) {      
      app.request({
        url: 'https://unopwa.app/api/getStockprices.php',
        crossDomain: true,
        async: true, // async processing
        data: {
          'dbhost': localStorage.getItem('Server'),
          'dbuser': localStorage.getItem('Username'),
          'dbpass': localStorage.getItem('Password'),
          'dbname': localStorage.getItem('Database'),                   
          'Scenario': localStorage.getItem("Scenario")
        },
        statusCode: {
          404: function (xhr) {
            alert('stockprices page not found');
          }
        },
        success: function (data, status, xhr) {
      
          var JSONstockprices = JSON.parse(data);    
          var tx_stockprices = newDB.transaction('stockprices', 'readwrite');
          for (var key in JSONstockprices) {
            if (JSONstockprices.hasOwnProperty(key)) {          
              tx_stockprices.objectStore('stockprices').put(JSONstockprices[key]);
            }
          }
          console.log("stockprices data loaded");
          var toastBottom = app.toast.create({
            text: ' stockprices Database loaded!!',
            closeTimeout: 3000,
          });
          toastBottom.open();
        },
        error: function (xhr, status) {
          console.log('Error: ' + status);
        },
      })
    },
    UpdateDatabase: function () {
      if (localStorage.getItem('PendingUploads') === "1") {
        console.log("Need to upload pending changes first!")
      }
      app.methods.NewDatabase();
    },
    getServerSettings: function () {
      app.request({
        url: 'https://unopwa.app/api/getSettings.php',
        crossDomain: true,
        async:true, // async processing
        data: {
          'dbhost': localStorage.getItem('Server'),
          'dbuser': localStorage.getItem('Username'),
          'dbpass': localStorage.getItem('Password'),
          'dbname': localStorage.getItem('Database')
        },
        statusCode: {
          404: function (xhr) {
            console.log('api getServerSettings not found');
          }
        },
        success: function (data, status, xhr) {
          //console.log('Get Online Server Settings getServerSettings');
          if (data != null && data != '') {
            //console.log(data);
            var JSONsettings = JSON.parse(data);

            for (var key in JSONsettings) {
              if (JSONsettings.hasOwnProperty(key)) {
                switch(JSONsettings[key].setting){
                  case "DatabaseVersion":
                    localStorage.setItem('ServerDBVersion',JSONsettings[key].value);
                    break;
                  case "UpdateDataToOnlineServer":
                    localStorage.setItem('UpdateDataToOnlineServer',JSONsettings[key].value);
                    break;
                  case "EnableGPSTracking":
                    localStorage.setItem('EnableGPSTracking',JSONsettings[key].value);
                    break;
                  default:
                    break;
                }
              }
            }
          }


          if (localStorage.getItem('ServerDBVersion') === localStorage.getItem('CurrentDBVersion')) {
            console.log("Local Database and Online Database matches. Online Version:" + localStorage.getItem('ServerDBVersion'));
          } else {
            console.log("Local Database and Online Database does not match. Online Version:" + localStorage.getItem('ServerDBVersion')
                + " offline Version:" + localStorage.getItem('CurrentDBVersion'));
            //UpdateDatabase(); // do we update or we add

          }

          return data;
        },
        error:  function (xhr,status) {
          console.log('Error: ' + status);
        },
      })
    },
  },
  // App routes
  routes: routes,
  on: {
    // each object key means same name event handler
    pageInit: function (page) {

    },
    popupOpen: function (popup) {
      // do something on popup open
    },
  },
});

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/'
});
var catalogView = app.views.create('#view-catalog', {
  url: '/catalog/'
});
var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
});


// Login Screen Demo

/*
$$('#my-login-screen .login-button').on('click', function () {
  var username = $$('#my-login-screen [name="username"]').val();
  var password = $$('#my-login-screen [name="password"]').val();

  // Close login screen
  app.loginScreen.close('#my-login-screen');

  // Alert username and password
  app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
});
*/



/*
app.on('pageInit', function (page) {
  // do something on page init
  console.log("app: pageInit " + page.name);
});*/



// Need the user settings for username and password
if (localStorage.getItem('Database') === null || localStorage.getItem('Server') === null
    || localStorage.getItem('Username') === null
    || localStorage.getItem('whcode') === null
    || localStorage.getItem('Password') === null
    || localStorage.getItem('warehid') === null)
{

  app.dialog.confirm('You need to setup your server. Please Open Settings page!', function () {
    settingsView.router.navigate('/settings/');
  });

} else {
  app.methods.getServerSettings();
};








