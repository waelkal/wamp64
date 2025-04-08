//var cacheName = '10651';
var cacheName = '40'
//self.localStorage.setItem("AppVersion", cacheName);


// note that sw.js is not included in the cache list
var cachedFiles = [
  'index.html',
  'manifest.json',
  'js/app.js',
  'js/framework7.min.js',
  'js/routes.js',
  'js/idb.js',
  'js/invoice.js',
  'js/print.min.js',
  'css/app.css',
  'css/framework7.min.css',
  'css/icons.css',
  'css/print.min.css',
  'fonts/Framework7Icons-Regular.eot',
  'fonts/Framework7Icons-Regular.ttf',
  'fonts/Framework7Icons-Regular.woff',
  'fonts/Framework7Icons-Regular.woff2',
  'fonts/MaterialIcons-Regular.eot',
  'fonts/MaterialIcons-Regular.svg',
  'fonts/MaterialIcons-Regular.ttf',
  'fonts/MaterialIcons-Regular.woff',
  'fonts/MaterialIcons-Regular.woff2',
  'pages/404.html',
  'pages/about.html',
  'pages/barcode.html',
  'pages/printtest.html',
  'pages/catalog.html',
  'pages/empty.html',
  'pages/page-loader-component.html',
  'pages/page-loader-template7.html',
  'pages/product.html',
  'pages/mylocation.html',
  'pages/request-and-load.html',
  'pages/settings.html',
  'pages/printsettings.html',
  'pages/customerlist.html',
  'pages/customerview.html',
  'pages/createcustomer.html',
  'pages/salesinvoice.html',
  'pages/stocklist.html',
  'pages/stockview.html',
  'pages/stockswipe.html',
  'pages/warehouselist.html',
  'pages/warehouseview.html',
  'pages/invoicelist.html',
  'apple-touch-icon.png',
  'android-chrome-144x144.png',
  'android-chrome-192x192.png',
  'android-chrome-256x256.png',
  'android-chrome-512x512.png'
];


// Adding Files to the cache when install for the first time
self.addEventListener('install', function(evt){
  console.log('Service Worker Install Event');
  //Add the file to the cache
  evt.waitUntil(
    caches.open(cacheName).then(function(cache){
      console.log('SW: install Caching Files ' + cacheName);
      return cache.addAll(cachedFiles);
    }).then(function(){
      return self.skipWaiting();
    }).catch(function(err){
      console.log('install: Cache Failed', err);
    })
  );
});


// use the activate event to delete the old cache when the cache name/version changed
self.addEventListener('activate', function(evt){
  console.log('SW: Service Worker Activated');
  evt.waitUntil(
    caches.keys().then(function(keyList){
      return Promise.all(keyList.map(function(key){
        if(key !== cacheName){
          console.log('Removing Old Cache', key);
          return caches.delete(key)
        }
      }));
    })
  );
  return self.clients.claim(); // to claim all the pages
});

// intercept the network and serve the cache files
// Here we are implementing Cache + Network Strategy (get the cache first or go to then network)

self.addEventListener('fetch', function(evt){
  //console.log('SW: Fetch Event' + evt.request.url);
  evt.respondWith(
    caches.match(evt.request).then(function(response){
      return response || fetch(evt.request); // if you prefect Network + Cache Strategy then swap the operators
    })
  );
});

self.addEventListener('message', function(event){
    //console.log("SW Received Message: " + event.data);
    event.ports[0].postMessage(cacheName);
});
