var invline = 0;
var updated_invline = 0;
var invoicetype;
var allcustomerlist1 = [];
var disc = 0;


function btnRemove(rowNum, invoicetype) {
  //console.log(rowNum);
  var $$ = Dom7;
  app.dialog.confirm('Are you sure?', function () {
    var link = $$(rowNum).remove();
  
    refreshTotals(invoicetype,disc,1);
  });
};

function invoice_line(inv_id, rowid, item, stkbar, stkbar_id, qty, price, cost, total,vat) {
  this.inp_id = inv_id;
  this.rowid = rowid;
  this.inc_id = app.utils.id('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  this.item = item;
  this.inc_qty = qty;
  this.inc_price = price;
  this.inc_cost = cost;
  this.stkbar = stkbar;
  this.stkbar_id = stkbar_id;
  this.total = total;
  this.inc_vat = vat;

}

function invoice_parent_line(inv_id, inv_type, client_id, client_name, description, whcode, warehid, salesmanid, locationid,locationcode,disc) {

  this.inp_id = inv_id;
  this.IsUploaded = false; // the default is not uploaded - this should be changed at save
  this.inv_type = inv_type;
  this.client_id = client_id;
  this.client_name = client_name;
  this.description = description;
  this.whcode = whcode;
  this.warehid = warehid;
  this.inv_edate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  this.salesmanid = salesmanid;
  this.locationid = locationid;
  this.locationcode = locationcode;
  this.disc = disc;

}
function receipt_parent_line(trans_pid, inv_type, voucher_total, customer_id, customer_name, trp_desc, salesmanid, locationid, locationcode) {

  this.inp_id = trans_pid;
  this.IsUploaded = false; // the default is not uploaded - this should be changed at save
  this.inv_type = inv_type;
  this.voucher_total = voucher_total;
  this.client_id = customer_id;
  this.client_name = customer_name;
  this.description = trp_desc;
  this.inv_edate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  this.description = trp_desc;
  this.salesmanid = salesmanid;
  this.locationid = locationid;
  this.locationcode = locationcode;

}

function refreshVoucherTotal(inv_type, Amount) {
  var $$ = Dom7;
  var receiptvoucher = [];
  var voucher_total = 0;

  var trp_desc = $$("#txtInvoiceDescription").val();
  var customer_id = $$("#cbocustomer").val();
  var customer_name = document.getElementById("cbocustomer").options[document.getElementById("cbocustomer").selectedIndex].text;
  var salesmanid = localStorage.getItem("salesmanid");
  var locationid = localStorage.getItem("locationid");
  var locationcode = localStorage.getItem("locationcode");
  var Scenario = localStorage.getItem("Scenario");
  var trans_pid = app.utils.id('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  // adding parent receipt voucher data
  if (Amount != 0) {
    voucher_total = Amount;
    receiptvoucher.push(new receipt_parent_line(trans_pid, inv_type, voucher_total, customer_id, customer_name, trp_desc, salesmanid, locationid, locationcode));
  }
  voucher_total = 0;
  return receiptvoucher;
}

function counterline(sysref, invtype, locationcode, year){
  this.sysref=sysref;
  this.invtype = invtype;
  this.locationcode = locationcode;
  this.year = year;
}

//function refreshcounter(sysref,invtype,locationcode) {
//  var $$ = Dom7;
//  var counter = [];
//  var year = "2020";
//  counter.push(new counterline(sysref, invtype, locationcode, year));
  
//  return counter;
//}

function stock_line(stkbar_id, stkbar_name, stkbar, stkbar_URL, stkbar_price, stkbar_cost, gr_id, sbg_id, ssbg_id, stk_code, stk_name, stk_id, stk_vat, qun_onhand, warehid, whcode, whname) {
  this.stkbar_id = stkbar_id; 
  this.stkbar_name = stkbar_name;
  this.stkbar = stkbar;
  this.stkbar_URL = stkbar_URL;
  this.stkbar_price = stkbar_price;
  this.stkbar_cost = stkbar_cost;
  this.gr_id = gr_id;
  this.sbg_id = sbg_id;
  this.sbg_id = sbg_id;
  this.ssbg_id = ssbg_id;
  this.stk_code = stk_code;
  this.stk_name = stk_name;
  this.stk_id = stk_id;
  this.stk_vat = stk_vat;
  this.qun_onhand = qun_onhand;
  this.warehid = warehid;
  this.whcode = whcode;
  this.whname = whname;

}
function Getcategoryid(currentCustomer, allcustomerlist) {
  var category = [];
  for (var k in allcustomerlist) {
    if (allcustomerlist[k]['customerid'] == currentCustomer) {
      category.push(allcustomerlist[k]);     
    }
  }
  return category;
}

function Getpricelist(stocklist, pricelist, categoryID) {
  var stocklist1 = [];
  var price;
  for (var x in categoryID) {
    for (var i in stocklist) {
      price = 0;
      for (var k in pricelist) {
        if (stocklist[i]['stkbar_id'] == pricelist[k]['stkbar_id'] && pricelist[k]['StockPricesCatID'] == categoryID[x]['StockPricesCatID']) {
          price = pricelist[k]['stkprice'];
          stocklist1.push(new stock_line(stocklist[i]['stkbar_id'], stocklist[i]['stkbar_name'], stocklist[i]['stkbar'], stocklist[i]['stkbar_URL'], price, stocklist[i]['stkbar_cost'], stocklist[i]['gr_id'], stocklist[i]['sbg_id'], stocklist[i]['ssbg_id'], stocklist[i]['stk_code'], stocklist[i]['stk_name'], stocklist[i]['stk_id'], stocklist[i]['stk_vat'], stocklist[i]['qun_onhand'], stocklist[i]['warehid'], stocklist[i]['whcode'], stocklist[i]['whname']));     
        }       
      }
      if (price == 0) {
        stocklist1.push(new stock_line(stocklist[i]['stkbar_id'], stocklist[i]['stkbar_name'], stocklist[i]['stkbar'], stocklist[i]['stkbar_URL'], stocklist[i]['stkbar_price'], stocklist[i]['stkbar_cost'], stocklist[i]['gr_id'], stocklist[i]['sbg_id'], stocklist[i]['ssbg_id'], stocklist[i]['stk_code'], stocklist[i]['stk_name'], stocklist[i]['stk_id'], stocklist[i]['stk_vat'], stocklist[i]['qun_onhand'], stocklist[i]['warehid'], stocklist[i]['whcode'], stocklist[i]['whname']));
      }
     
    }
  }
  return stocklist1;
}
function getdisc(customer_id, allcustomerlist) {
  var disc = 0;
  for (var k in allcustomerlist) {
    if (allcustomerlist[k]['customerid'] == customer_id) {
      disc = allcustomerlist[k]['custdisc'];
    }

  }
  return disc;
}
function refreshTotals(inv_type, disc,counter) {
  var $$ = Dom7;
  var invoice = [];
  var inv_line = 0;
  var inv_rowid;
  var inv_item = "";
  var inv_qty;
  var stkbar;
  var inv_vat;
  var stkbar_id;
  var inv_price;
  var inv_cost;
  var inv_total;
  var grand_total = 0;
  var qty_totals = 0;
  var totalvat = 0;
  var gtotalvat = 0;
 

  //var link = $$('#addbutton').attr('href');
  //console.log(invoice);
  // First we need to add the parent
 
  //var inv_desc = $$("#txtInvoiceDescription").val();
  var customer_id = $$("#cbocustomer").val();
  //var customer_name = $$("#cbocustomer").text();
  // not using Dom7 due to error
  var customer_name = document.getElementById("cbocustomer").options[document.getElementById("cbocustomer").selectedIndex].text;
  
  //customer_disc = document.get('data-disc');
  if (inv_type == 'DM') {
    var warehid = localStorage.getItem("Dwarehid");
      var whcode  = '05'
      
  }
  if (inv_type != 'DM') {
    var whcode = localStorage.getItem("whcode");
    var warehid = localStorage.getItem("warehid"); 
  }

  var salesmanid = localStorage.getItem("salesmanid");
  var locationid = localStorage.getItem("locationid");
  var locationcode = localStorage.getItem("locationcode");
  var Scenario = localStorage.getItem("Scenario");
  if ($$("#txtInvoiceDescription").val() != '') {
    var inv_desc = $$("#txtInvoiceDescription").val();
  }
  if ($$("#txtInvoiceDescription").val() == '') {
    var inv_desc = inv_type + "-" + locationcode + "-" + counter;
  }
  
  // Create a guid
  var inv_id = app.utils.id('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  // adding parent invoice data
  invoice.push(new invoice_parent_line(inv_id, inv_type, customer_id, customer_name, inv_desc, whcode, warehid, salesmanid, locationid, locationcode,disc));

  var table = document.getElementById('InvoiceTable');
  var rowLength = table.rows.length;
  for (var i = 0; i < rowLength; i += 1) {
    var row = table.rows[i];
    if (row.id.startsWith("row")) {
      inv_line += 1;
      inv_rowid = row.id;
    }
    var cellLength = row.cells.length;
    for (var y = 0; y < cellLength; y += 1) {
      var cell = row.cells[y];
      if (cell.tagName === 'TD') {
        //console.log(cell);
        if (cell.id === 'col_item') {
          inv_item = cell.innerText;
          stkbar = cell.attributes['tag'].value;
          inv_cost = parseFloat(cell.attributes['data-cc'].value);
          inv_vat = parseFloat(cell.attributes['data-stk_vat'].value);
          if (isNaN(inv_cost) === true) {
            inv_cost = 0;
          }
          stkbar_id = cell.attributes['data-stkbar_id'].value;
        }
        if (cell.id === 'col_qty') {
          inv_qty = parseFloat(cell.innerText);
          qty_totals += inv_qty;
        }
        if (cell.id === 'col_price') {
          inv_price = parseFloat(cell.innerText);
        }
        if (cell.id === 'col_total') {
          inv_total = parseFloat(cell.innerText);
          if (inv_vat != 0) {
            totalvat = inv_total * 0.11;
          }
          grand_total += inv_total;

        }
      }

    }
    if (inv_total > 0) {
      invoice.push(new invoice_line(inv_id, inv_rowid, inv_item, stkbar, stkbar_id, inv_qty, inv_price, inv_cost, inv_total, totalvat));
      gtotalvat += totalvat;
      totalvat = 0;
    }



    // reset values for each row
    inv_rowid = "";
    inv_item = "";
    stkbar = "";
    inv_qty = 0;
    inv_price = 0;
    inv_cost = 0;
    inv_total = 0;
    stkbar_id = "";
    inv_vat = 0;
    

  }
  var str_qty_totals = qty_totals.toFixed(2);
  var str_total = grand_total.toFixed(2);
  var str_total_vat = gtotalvat.toFixed(2);
  //var str_grand_total = (str_total.value + str_total_vat.value).toFixed(2);
  $$("#txtQTotals").val(str_qty_totals);
  $$("#txtTotalVAT").val(str_total_vat); 
  $$("#txtGTotals").val(str_total);
  //console.log(invoice);
  return invoice;
}

function UpdateLocalData(data, keyid) {
  // Saving data to local database first
  const dbPromise = idb.open('unodbmobile', localStorage.getItem('CurrentDBVersion'));
  dbPromise.then(db => {
    const tx = db.transaction('invoice', 'readwrite');
    tx.objectStore('invoice').put(data, keyid);
    return tx.complete;
  });
}
function UpdateLocalDataJV(data, keyid) {
  // Saving data to local database first
  const dbPromise = idb.open('unodbmobile', localStorage.getItem('CurrentDBVersion'));
  dbPromise.then(db => {
    const tx = db.transaction('ReceiptVouchers', 'readwrite');
    tx.objectStore('ReceiptVouchers').put(data, keyid);
    return tx.complete;
  });
}
//function UpdatestockvalueLocalData(data, keyid) {
  // Saving data to local database first
  //const dbPromise = idb.open('unodbmobile', localStorage.getItem('CurrentDBVersion'));
  //dbPromise.then(db => {
    //const tx = db.transaction('invoice', 'readwrite');
    //tx.objectStore('invoice').put(data, keyid);
    //return tx.complete;
  //});
///}

 
async function generateJV(mainId, current_JV) {
  var parent_inv_data = current_JV[0];
  $$("#Print_Date").val(parent_inv_data["inv_edate"]);
  $$("#Print_InvNumber").val(parent_inv_data["inv_type"] + "-" + parent_inv_data["locationcode"] + "-" + mainId);
  $$("#clientID").val(parent_inv_data["client_name"]);  
  $$("#amount").val(parent_inv_data["voucher_total"]);
  var table = document.getElementById("invoiceTable");
  //var date = document.getElementById("Print_Date");
  var starting_row = 2;nerateInvoice
  var inv_detail = current_JV[0];
  console.log(inv_detail);
  var total = inv_detail["voucher_total"];
  var row = table.insertRow(starting_row);
  var col1 = row.insertCell(0);
  col1.innerHTML = "Amount: <h3>" + total + " LBP</h3>";
  starting_row++;
}
async function getcustomerdetails() {
  const custlist = [];
  var dblocalversion = localStorage.getItem("CurrentDBVersion");
  let db = await idb.open('unodbmobile', dblocalversion);
  let tx_customer = db.transaction(['customer'], 'readonly');
  let objStore_customer = tx_customer.objectStore('customer');
  let lstcustomers = await objStore_customer.getAll();
  for (var cust in lstcustomers) {   
    custlist.push(lstcustomers[cust]);
  }
  db.close()

  return {
    custlist: custlist,   
  };
}
async function generateInvoice(mainId, current_inv) {
  var parent_inv_data = current_inv[0];
  let customerlist = await getcustomerdetails();
  $$("#Print_Date").val(parent_inv_data["inv_edate"]);
  //$$("#Print_InvNumber").val(parent_inv_data["inv_type"] + "-" + parent_inv_data["locationcode"] + "-" + mainId);
  $$("#Print_InvNumber").val(parent_inv_data["description"]);
  $$("#clientID").val(parent_inv_data["client_name"]);
  for (var x in customerlist.custlist) {
    if (customerlist.custlist[x]['customerid'] == parent_inv_data["client_id"]) {
      $$("#Vatid").val(customerlist.custlist[x]['VatID']);
     // $$("#Address").val(customerlist.custlist[x]['BusinessAddress']);
      $$("#Phone").val(customerlist.custlist[x]['BusinessPhone1']);
      break;
    }
  }
  //console.log(parent_inv_data);
  var table = document.getElementById("invoiceTable");
  //var date = document.getElementById("Print_Date");
  var starting_row = 2;
  var total = 0;
  var total1 = 0;
  var totalVAT = 0;
  var Gtotal = 0;
  var disc = parent_inv_data["disc"];
  for (i = 1; i < current_inv.length; i++) {
    var inv_detail = current_inv[i];
    console.log(inv_detail);
    var row = table.insertRow(starting_row);
    var colitem = row.insertCell(0);
    var colqty = row.insertCell(1);
    var colprice = row.insertCell(2);
    var coltotal = row.insertCell(3);
    if (inv_detail["inc_vat"] != 0) {
      
      colitem.innerHTML = "<small>" + inv_detail["stkbar"] + "<br/>" + "* " + inv_detail["item"] + "</small>";            
    }
    if (inv_detail["inc_vat"] == 0) {
      colitem.innerHTML = "<small>" + inv_detail["stkbar"] + "<br/> " + inv_detail["item"] + "</small>" ;       
    }   
    colqty.innerHTML = "<small>" + " &nbsp; &nbsp; " + inv_detail["inc_qty"] + "</small>" ;
    colqty.className = 'tb_invoice_center';
    colprice.innerHTML = "<small>" + inv_detail["inc_price"] + "</small>" ;
    colprice.className = 'tb_invoice_center';
    coltotal.innerHTML = "<small>" + inv_detail["total"] + "</small>" ;
    coltotal.className = 'tb_invoice_center';
    starting_row++;

    total += inv_detail["total"];
    totalVAT += inv_detail["inc_vat"];

  }
  if (disc != 0) {
    totalVAT = totalVAT - (totalVAT * (disc / 100));
    total1 = total - (total * (disc / 100));
    Gtotal = total1 + totalVAT;
    }
    else {    
      Gtotal = total + totalVAT;
    }  

  // Add HR row
  var row = table.insertRow(starting_row);
  var col1 = row.insertCell(0);
  var col2 = row.insertCell(1);
  var col3 = row.insertCell(2);
  var col4 = row.insertCell(3);
  col1.innerHTML = "<hr>";
  col2.innerHTML = "<hr>";
  col3.innerHTML = "<hr>";
  col4.innerHTML = "<hr>";
  starting_row++;

  // Add Total row
  var row = table.insertRow(starting_row);
  var col1 = row.insertCell(0);
  var col2 = row.insertCell(1);
  var col3 = row.insertCell(2);
  var col4 = row.insertCell(3);
  col1.innerHTML = "";
  col2.innerHTML = "<small>TotalLBP:</small>";
  col3.innerHTML = "&nbsp;&nbsp;" + total + "";
  col4.innerHTML = "";
  col4.className = 'tb_invoice_center';
  starting_row++;

  //add disc
  var row = table.insertRow(starting_row);
  var col1 = row.insertCell(0);
  var col2 = row.insertCell(1);
  var col3 = row.insertCell(2);
  var col4 = row.insertCell(3);
  col1.innerHTML = "";
  col2.innerHTML = "<small>Disc:</small>";
  col3.innerHTML = "&nbsp;&nbsp;" + disc + "%";
  col4.innerHTML = "";
  col4.className = 'tb_invoice_center';
  starting_row++;

   // Adding VAT Row
  var row = table.insertRow(starting_row);
  var col1 = row.insertCell(0);
  var col2 = row.insertCell(1);
  var col3 = row.insertCell(2);
  var col4 = row.insertCell(3);
  col1.innerHTML = "";
  col2.innerHTML = "<small>VAT(11%)</small>";
  col3.innerHTML = "&nbsp;&nbsp;" + totalVAT.toFixed(2) + "";
  col4.innerHTML = ""; 
  starting_row++;

  var row = table.insertRow(starting_row);
  var col1 = row.insertCell(0);
  var col2 = row.insertCell(1);
  var col3 = row.insertCell(2);
  var col4 = row.insertCell(3);
  col1.innerHTML = "";
  col2.innerHTML = "<small>NET LBP:</small>";
  col3.innerHTML = "&nbsp;&nbsp;" + Gtotal.toFixed(2) + "";
  col4.innerHTML = "";
  col4.className = 'tb_invoice_center';
  starting_row++;


}
async function generateDamagestock(Damagelist) {
  //var parent_inv_data = current_inv[0];
  //$$('#Print_Date').val(parent_inv_data["inv_edate"]);
  //$$('#Print_InvNumber').val(parent_inv_data["inv_type"] + "-" + mainId);
  //console.log(parent_inv_data);
  var table = document.getElementById("stockTable");
  var starting_row = 2;
  //var total = 0;
  for (i = 0; i < Damagelist.length; i++) {
    var stock_detail = Damagelist[i];
    console.log(stock_detail);
    var row = table.insertRow(starting_row);
    var colitem = row.insertCell(0);
    var colqty = row.insertCell(1);

    colitem.innerHTML = stock_detail["stkbar_name"];
    colqty.innerHTML = stock_detail["DMQTy"];
    //colqty.className = 'tb_invoice_center';

    starting_row++;

  }

  // Add HR row
  var row = table.insertRow(starting_row);
  var col1 = row.insertCell(0);
  var col2 = row.insertCell(1);

  col1.innerHTML = "<hr>";
  col2.innerHTML = "<hr>";

  starting_row++;


}
async function generatestock(stocklist) {
  //var parent_inv_data = current_inv[0];
  //$$('#Print_Date').val(parent_inv_data["inv_edate"]);
  //$$('#Print_InvNumber').val(parent_inv_data["inv_type"] + "-" + mainId);
  //console.log(parent_inv_data);
  var table = document.getElementById("stockTable");
  var starting_row = 2;
  //var total = 0;
  for (i = 0; i < stocklist.length; i++) {
    var stock_detail = stocklist[i];
    console.log(stock_detail);
    var row = table.insertRow(starting_row);
    var colitem = row.insertCell(0);
    var colqty = row.insertCell(1);
    
    colitem.innerHTML = stock_detail["stkbar_name"];
    colqty.innerHTML = stock_detail["qun_onhand"];
    //colqty.className = 'tb_invoice_center';
    
    starting_row++;
 
  }
  
  // Add HR row
  var row = table.insertRow(starting_row);
  var col1 = row.insertCell(0);
  var col2 = row.insertCell(1);
  
  col1.innerHTML = "<hr>";
  col2.innerHTML = "<hr>";
 
  starting_row++;


}

async function printInvoice(mainId, current_inv) {

  await generateInvoice(mainId, current_inv);

  $$('#invoicePOS').css('display', 'block');
  printJS('invoicePOS', 'html');
  $$('#invoicePOS').css('display', 'none'); 
  // need to remove add rows in case

}
async function printJV(mainId, current_jv) {

  await generateJV(mainId, current_jv);

  $$('#invoicePOS').css('display', 'block');
  printJS('invoicePOS', 'html');
  $$('#invoicePOS').css('display', 'none');
  // need to remove add rows in case

}


async function printstock(stocklist) {

  await generatestock(stocklist);

  $$('#stocklistRpt').css('display', 'block');
  printJS('stocklistRpt', 'html');
  $$('#stocklistRpt').css('display', 'none');
  // need to remove add rows in case

}
async function printDamagestock(Damagelist) {

  await generateDamagestock(Damagelist);

  $$('#DamagelistRpt').css('display', 'block');
  printJS('DamagelistRpt', 'html');
  $$('#DamagelistRpt').css('display', 'none');
  // need to remove add rows in case

}

function saveonlinecounter(current_counter) {
  app.request({
    url: 'https://unopwa.app/api/getCounter.php',
    crossDomain: true,
    async: true, // async processing
    data: {
      'dbhost': localStorage.getItem('Server'),
      'dbuser': localStorage.getItem('Username'),
      'dbpass': localStorage.getItem('Password'),
      'dbname': localStorage.getItem('Database'),
      'counter': current_counter,    
    },
    statusCode: {
      404: function (xhr) {
        alert('counter not found');
      }
    },
    success: function (data, status, xhr) {
      
      if (data === "1") {         
        var toastBottom = app.toast.create({
          text: 'Counter Uploaded Online',
          closeTimeout: 1000,
        });
        toastBottom.open();
        //Savecounter(current_counter,invtype);
        localStorage.setItem("PendingUploads", "0");
      } else {
        var toastBottom = app.toast.create({
          text: data,
          closeTimeout: 2000,
        });
        toastBottom.open();
      }
      return data;


    },
    error: function (xhr, status) {
      //console.log('saveDataOnline Error: ' + status);
      var toastBottom = app.toast.create({
        text: 'No Connection!',
        closeTimeout: 1000,
      });
      toastBottom.open();

    },

  });
}

function saveDataOnline(mainId, current_inv) {
  app.request({
    type: 'POST', // This may cause the problem as it may be using GET!!
    datatype:"text",
    url: 'https://unopwa.app/api/sinvoice.php',
    crossDomain: true,
    async: true, // async processing
    data: {
      'dbhost': localStorage.getItem('Server'),
      'dbuser': localStorage.getItem('Username'),
      'dbpass': localStorage.getItem('Password'),
      'dbname': localStorage.getItem('Database'),
      'invoice': current_inv,
      //'dbwarehid': localStorage.getItem('warehid'),
      //'dbdwarehid': localStorage.getItem('Dwarehid'),
      //'dblocationcode': localStorage.getItem('locationcode'),
    },
    statusCode: {
      404: function (xhr) {
        alert('page not found');
      }
    },
    success: function (data, status, xhr) {
      // Here we can update the local data that it is upload
      console.log("Save invoice data:" + data);
      console.log("Save invoice status:" + status);
      if (data === "1") { // it means the server transaction is working ok
        // Then upload the local database
        var parent_inv_data = current_inv[0];
        parent_inv_data['IsUploaded'] = true;
        var toastBottom = app.toast.create({
          text: 'Invoice Uploaded Online',
          closeTimeout: 1000,
        });
        toastBottom.open();
        UpdateLocalData(current_inv, mainId);
        localStorage.setItem("PendingUploads", "0");
      } else {
        var toastBottom = app.toast.create({
          text: data,
          closeTimeout: 2000,
        });
        toastBottom.open();
      }
      return data;


    },
    error: function (xhr, status) {
      console.log('saveDataOnline Error: ' + status);          
      var toastBottom = app.toast.create({
        text: 'No Connection!',
        closeTimeout: 1000,
      });
      toastBottom.open();

    },

  });
}
function saveJVOnline(mainId, current_JV) {
  var dialog = app.dialog.preloader('Loading..', 'blue');
  dialog.open();
  app.request({
    //type: 'POST', // This may cause the problem as it may be using GET!!
    url: 'https://unopwa.app/api/setReceipt.php',
    crossDomain: true,
    async: true, // async processing
    data: {
      'dbhost': localStorage.getItem('Server'),
      'dbuser': localStorage.getItem('Username'),
      'dbpass': localStorage.getItem('Password'),
      'dbname': localStorage.getItem('Database'),
      'ReceiptVouchers': current_JV[0],
    },
    statusCode: {
      404: function (xhr) {
        alert('page not found');
      }
    },
    success: function (data, status, xhr) {
      // Here we can update the local data that it is upload
      //console.log("Save invoice data:" + data);
      //console.log("Save invoice status:" + status);
      if (data === "1") { // it means the server transaction is working ok
        // Then upload the local database
        var parent_JV_data = current_JV[0];
        parent_JV_data['IsUploaded'] = true;
        //UpdateLocalDataJV(current_JV, mainId);
        dialog.close();
        app.dialog.alert('Voucher Created. Thank you!');
        localStorage.setItem("PendingUploads", "0");
        $$('#Amount').val('');
      } else {
        var toastBottom = app.toast.create({
          text: data,
          closeTimeout: 2000,
        });
        toastBottom.open();
      }
      return data;


    },
    error: function (xhr, status) {
      //console.log('saveDataOnline Error: ' + status);
      var toastBottom = app.toast.create({
        text: 'No Connection!',
        closeTimeout: 1000,
      });
      toastBottom.open();

    },

  });
}

function savestockvalueonline(mainId, current_inv) {
  app.request({
    url: 'https://unopwa.app/api/sstockvalue.php',
    //url: 'api/sstockvalue.php',
    crossDomain: true,
    async: true, // async processing
    data: {
      'dbhost': localStorage.getItem('Server'),
      'dbuser': localStorage.getItem('Username'),
      'dbpass': localStorage.getItem('Password'),
      'dbname': localStorage.getItem('Database'),
      'invoice': current_inv,      
      'dbwarehid': localStorage.getItem('warehid'),
      'dbdwarehid': localStorage.getItem('Dwarehid'),
      'dblocationcode': localStorage.getItem('locationcode'),
    },
    statusCode: {
      404: function (xhr) {
        alert('page not found');
      }
    },
    success: function (data, status, xhr) {
      // Here we can update the local data that it is upload
      //console.log("Save invoice data:" + data);
      //console.log("Save invoice status:" + status);
      if (data === "1") { // it means the server transaction is working ok
        // Then upload the local database
        var parent_inv_data = current_inv[0];
        parent_inv_data['IsUploaded'] = true;
        var toastBottom = app.toast.create({
          text: 'stock calculated value uploaded',
          closeTimeout: 1000,
        });
        toastBottom.open();
        //UpdatestockvalueLocalData(current_inv, mainId);
        localStorage.setItem("PendingUploads", "0");
      } else {
        var toastBottom = app.toast.create({
          text: data,
          closeTimeout: 2000,
        });
        toastBottom.open();
      }
      return data;


    },
    error: function (xhr, status) {
      //console.log('saveDataOnline Error: ' + status);
      var toastBottom = app.toast.create({
        text: 'No Connection!',
        closeTimeout: 1000,
      });
      toastBottom.open();

    },

  });
}


/*
async function waitInsert(data) {
    const quote = await InsertLocalData(data);
    quote.then(evt =>{
        console.log("At waitInsert " + evt);
        return evt;
    });


}
*/

function clearInvoice(verbose) {

  if (verbose == 1) {
    app.dialog.confirm('Are you sure you want to clear?', function () {
      clearItems();
    });
  } else {
    clearItems();
  }


}

function checkDuplicates(item) {
  var table = document.getElementById('InvoiceTable');
  var isFound = false;
  var crow;
  var rowLength = table.rows.length;
  for (var i = 0; i < rowLength; i += 1) {
    var row = table.rows[i];
    crow = row.id;
    var cellLength = row.cells.length;
    for (var y = 0; y < cellLength; y += 1) {
      var cell = row.cells[y];
      if (cell.id === 'col_item') {
        if (cell.innerText === item) {
          isFound = true;
        }
      }
      if (cell.id === 'col_qty' && isFound) {
        return [crow, cell.innerText];
      }
    }
  }
}

function getcounterinvoice(counterlist,invoicetype,locationcode) {
  //var table = document.getElementById('InvoiceTable');
  var counter = 0;
  var rowLength = counterlist.length;
  if (rowLength != 0) {
    for (var i = 0; i < rowLength; i += 1) {
      var row = counterlist[i];
      if (row["type"] === invoicetype && row["Location_code"] === locationcode) {
        counter = parseFloat(row["Sys_Ref"]);
      }
    }
  }
  return counter;   
}


//function getlocalcounter(invoicetype ) {
//  //let invoiceList = await getInvoiceListNoKeys();
//  var max_counter = 0;
//  for (var inv in invlist) {
//    if (invlist[inv][0]["inv_type"] === invoicetype) {
//      max_counter += 1;     
//    }  
//  }
  
//   return max_counter;
//}


function clearItems() {
  invline = 0;
  $$('#tblbody').empty();
  $$("#txtQTotals").val(0);
  $$("#txtGTotals").val(0);
  for (i = 1; i < 61; i++) {
    $$('#badge' + "Item" + i).remove();
  }
}

function onchangeItem(selectObject) {
  if (selectObject.selectedIndex > 0) {
    var objprice = selectObject.options[selectObject.selectedIndex].attributes['tag'].value;
    if (objprice != null) {
      $$("#txtPrice").val(objprice);
      //console.log(objprice);
    } else {
      $$("#txtPrice").val(0);
      //console.log("0");
    }
  }
}

function onchangeBarcode() {
  if ($$("#txtbarcode").val() != null) {
    $$("#selectedItem").val($$("#txtbarcode").val());
    $$("#selectedItem").change();
    //$$("#selectedItem").prop("selected", true);
  }

}

function editItem(stkbar, qty, price, cost, line) {
  $$("#stocksheetTitle").text("Edit Item");
  updated_invline = line;
  //console.log("editItem Invoice updated_invline: " + updated_invline);
  //$$("#stocksheetTitleLeft").text(invline);
  $$("#selectedItem").val(stkbar);
  $$("#selectedItem").change();
  $$("#txtqty").val(qty);
  $$("#txtPrice").val(price);
  
}

function addItem() {

  $$("#stocksheetTitle").text("Add Item");
 // console.log(stocklist1);

}

function btnUpdate() {
  //console.log("btnUpdate invline = " + invline);
  var stkbar = $$("#selectedItem").val();
  var item = document.getElementById("selectedItem").options[document.getElementById("selectedItem").selectedIndex].text;
  var cost = parseFloat(document.getElementById("selectedItem").options[document.getElementById("selectedItem").selectedIndex].getAttribute("data-cc"));
  var vat = parseFloat(document.getElementById("selectedItem").options[document.getElementById("selectedItem").selectedIndex].getAttribute("data-stk_vat"));
  if (isNaN(cost) === true) {
    cost = 0;
  }
  if (isNaN(vat) === true) {
    vat = 0;
  }

  var stkbar_id = document.getElementById("selectedItem").options[document.getElementById("selectedItem").selectedIndex].getAttribute("data-stkbar_id");

  var qty = parseFloat($$("#txtqty").val());
  var price = parseFloat($$("#txtPrice").val());
  var total = qty * price;
  //var currentln = this.$route.context.invoiceLine;
  invline += 1;

  if ($$("#stocksheetTitle").text() == "Add Item") {
    var arrRet = checkDuplicates(item);
    if (arrRet != null) {
      app.dialog.alert("Item Already exits!");
      return;
    }
  } else {
    // in edit more remove the row
    //console.log("Remove item at Edit (updated_invline): " + updated_invline);
    var rowTodelete = "#row" + updated_invline;
    $$(rowTodelete).remove();
    updated_invline = 0;
  }
  // Check if this item already exists in the table
  //console.log(invline);
  if (total >= 0) {
    //var itemlink = "<a id = \"editbutton\" href=\"#\" onclick=\"editItem()\">" + item + "</a>";
    var itemlink = "<a id = \"editbutton\" href=\"#\" " +
        "onclick=\"editItem('" + stkbar + "'," + qty + "," + price + "," + cost + "," + invline + ")\" class=\"link sheet-open\" data-sheet=\".stocksearch\">" + item + "</a>";

    var rowHTML = "<tr id=\"row" + invline + "\">\n" +
      " <td id=\"col_item\" data-stkbar_id=\"" + stkbar_id + "\" data-cc=\"" + cost + "\" data-stk_vat=\"" + vat + "\" tag=\"" + stkbar + "\" class=\"label-cell\">" + itemlink + "</td>\n" +
        " <td id=\"col_qty\" class=\"numeric-cell\">" + qty + "</td>\n" +
        " <td id=\"col_price\" class=\"numeric-cell\">" + price + "</td>\n" +
        " <td id=\"col_total\" class=\"numeric-cell\">" + total + "</td>\n" +
        " <td class=\"actions-cell\">\n" +
        "   <a class=\"link icon-only\">\n" +
        "     <i class=\"icon f7-icons ios-only color-red\" onclick=\"btnRemove('#row" + invline + "')\">trash</i>\n" +
        "     <i class=\"icon material-icons md-only color-red\" onclick=\"btnRemove('#row" + invline + "','" +
        invoicetype + "')\">delete</i>\n" +
        "   </a>\n" +
        " </td>\n" +
        "</tr>";

    //console.log(rowHTML);
    $$('#tblbody').append($$(rowHTML));
    refreshTotals(invoicetype,disc,1);

    // Always revert to additem
    $$("#stocksheetTitle").text("Add Item");

  } else {
    app.dialog.alert("Total must be bigger than zero!");
  }

}

// List the main category
function ListMainGroups(groups, allgroups, stocklist1) {
  goFirstPage(); // Slider First page
  clearCube(1); // to remove old code
  var icount = 0;
  var count = 0;


  $$("#cubeTitle").html("&nbsp;&nbsp;<i class='f7-icons size-10'>document_text_fill</i>&nbsp; Invoice > Main Category");

  //console.log("groups:" + groups);
  //console.log(groups);
  for (var k in groups) {
    count += 1;
    removeOnClick(count); // remove current click event
    $$("#Item" + count).html(groups[k]["sbg_name"]);
    $$("#Item" + count).data('sbg_id', groups[k]["sbg_id"]);
    $$('#Item' + count).on('click', function () {
      ListSubGroups(groups, allgroups, stocklist1, $$(this));
    });
  }


}

// List Sub Category - if not exists will list all Category items
function ListSubGroups(groups, allgroups, stocklist1, but) {

  //console.log("Sub groups");

  goFirstPage(); // Slider First page
  var count = 1;
  var gr_id = but.data('sbg_id');
  var cubes = [];
  var duplicates = [];
  var bitemExits = false;

  // adding the title here
  $$("#cubeTitle").html("&nbsp;&nbsp;<i class='f7-icons size-10'>document_text_fill</i>&nbsp; Invoice > Sub Category");

  //Adding Go Back button to main group
  removeOnClick(count);
  $$("#Item" + count).html("<i class='f7-icons size-12 color-green'>home_fill</i>");
  $$('#Item' + count).on('click', function () {
    ListMainGroups(groups, allgroups, stocklist1);
  });


  // Main assignment code
  if (gr_id != null) {
    // Get Sub level 1
    for (var gitem in allgroups) {
      if (allgroups[gitem]["sbg_id"] != "" && allgroups[gitem]['gr_id'] === gr_id && !duplicates.includes(allgroups[gitem]["sbg_id"])) {
        count += 1;
        bitemExits = true;
        duplicates.push(allgroups[gitem]["sbg_id"]);
        removeOnClick(count); // remove old onclick to add a new one (this before any assignment)
        $$("#Item" + count).html(allgroups[gitem]["sbg_name"]);
        $$("#Item" + count).data('sbg_id', allgroups[gitem]["sbg_id"]);
        $$('#Item' + count).on('click', function () {
          ListSubSubGroups($$(this), groups, allgroups, stocklist1);
        });
      }

    }

    if (bitemExits == false) { // no sub group item exists, so we get all items belonging to this group


      var istkcount = 0
      for (var stkitem in stocklist1) {
        if (stocklist1[stkitem]['sbg_id'] === gr_id) {
          // only take 61 items
          if (istkcount < 61) {
            istkcount += 1;
            cubes.push(stocklist1[stkitem]);
          }
        }
      }



      if (cubes.length > 0) {
        assignMainStockButtons(cubes, groups, allgroups, stocklist1);
        //assignStockButtonsOld(cubes, groups, allgroups, stocklist1);

      } else {
        var toastBottom = app.toast.create({
          text: 'No Category items exits!!',
          closeTimeout: 1000,
        });
        toastBottom.open();
      }


    } else {
      // Clear all the remaining items - from old cube
      count += 1;
      clearCube(count)
    }

  }
}

// List Sub Sub Category - if not exists will list all Sub Category items
function ListSubSubGroups(but, groups, allgroups, stocklist1) {

  //console.log("Sub Sub groups");

  goFirstPage(); // Slider First page
  //console.log(but.data('sbg_id'));
  var cubes = [];
  var duplicates = [];
  var subcount = 1;
  var sbg_id = but.data('sbg_id');
  var bSubSubGroupExits = false;


  $$("#cubeTitle").html("&nbsp;&nbsp;<i class='f7-icons size-10'>document_text_fill</i>&nbsp; Invoice > Sub Sub Category");
  //Adding Back button
  removeOnClick(subcount);
  $$("#Item" + subcount).html("<i class='f7-icons size-12 color-green'>home_fill</i>");
  $$('#Item' + subcount).on('click', function () {
    ListMainGroups(groups, allgroups, stocklist1);
  });


  if (sbg_id != null) {
    for (var gitem in allgroups) {
      if (allgroups[gitem]["ssbg_id"] != "" && allgroups[gitem]['sbg_id'] === sbg_id && !duplicates.includes(allgroups[gitem]["ssbg_id"])) {
        subcount += 1;
        bSubSubGroupExits = true;
        duplicates.push(allgroups[gitem]["ssbg_id"]);
        removeOnClick(subcount); // remove old onclick to add a new one - before anyassignment
        $$("#Item" + subcount).html(allgroups[gitem]["ssbg_name"]);
        $$("#Item" + subcount).data('ssbg_id', allgroups[gitem]["ssbg_id"]);
        // This is the last drill down - here we call items only
        $$('#Item' + subcount).on('click', function () {
          // calling sub sub group items (only)
          ListSubSubGroupsItems($$(this), stocklist1, groups, allgroups);
        });
      }
    }


    //console.log(subcount);
    // Here we check if we have stock item when no groups exits from above code
    // no group item exists - so we list all stock items (Max:61)
    // no group item exists - so we list all stock items (Max:61)
    if (bSubSubGroupExits == false) {
      // calling stock items directly in case no sub category

      var istkcount = 0
      for (var stkitem in stocklist1) {
        if (stocklist1[stkitem]['sbg_id'] === sbg_id) {
          // only take 61 items
          if (istkcount < 61) {
            istkcount += 1;
            cubes.push(stocklist1[stkitem]);
          }
        }
      }
      if (cubes.length > 0) {
        assignMainStockButtons(cubes, groups, allgroups, stocklist1);
      } else {
        var toastBottom = app.toast.create({
          text: 'No SubCategory items exits!!',
          closeTimeout: 1000,
        });
        toastBottom.open();
      }


    } else {
      // Clear all the remaining items - from old cube
      subcount += 1;
      clearCube(subcount)
    }

  }


}

function ListSubSubGroupsItems(but, stocklist1, groups, allgroups) {
  var istkcount = 0
  var subStocklist = [];

  for (var stkitem in stocklist1) {
    if (stocklist1[stkitem]['ssbg_id'] === but.data('ssbg_id')) {
      // only take 61 items
      if (istkcount < 61) {
        istkcount += 1;
        subStocklist.push(stocklist1[stkitem]);
      }
    }
  }
  if (subStocklist.length > 0) {
    //assignStockButtons(subStocklist, groups, allgroups, stocklist);
    assignMainStockButtons(cubes, groups, allgroups, stocklist1);
  } else {
    var toastBottom = app.toast.create({
      text: 'No items exits!!',
      closeTimeout: 1000,
    });
    toastBottom.open();
  }
}

function removeOnClick(buttonId) {
  // different methods to remove the click event
  document.getElementById("Item" + buttonId).onclick = null;
  document.getElementById("Item" + buttonId).removeAttribute('onclick');
  $$("#Item" + buttonId).off('click');
  $$("#Item" + buttonId).html("");
  $$("#Item" + buttonId).data('stkbar', "");
  $$("#Item" + buttonId).data('stkname', "");
  $$("#Item" + buttonId).data('stkbar_price', 0);
  $$("#Item" + buttonId).data('stkbar_cost', 0);
  $$("#Item" + buttonId).data('stkbar_id', "");
  $$("#Item" + buttonId).data('stk_vat', 0);
  $$("#Item" + buttonId).data('gr_id', "");
  $$("#Item" + buttonId).data('sbg_id', "");
  $$("#Item" + buttonId).data('ssbg_id', "");
  $$("#Item" + buttonId).data('sssbg_id', "");

  // remove the badge
  $$('#badge' + "Item" + buttonId).remove();

}

// To clear the label and data for all items in the group
function clearCube(fromId) {
  for (i = fromId; i < 61; i++) {
    removeOnClick(i);
  }
}

function goFirstPage() {
  var mySwiper = app.swiper.get('.swiper-container');
  mySwiper.slideTo(0);
}

function assignCubeButtons(cubes) {
  // dynamically add click event to each item in the cube
  //console.log("assignCubeButtons");
  var butcount = 0;
  $$("#cubeTitle").html("&nbsp;&nbsp;<i class='f7-icons size-10'>document_text_fill</i>&nbsp; Invoice > Fav. Cube");
  goFirstPage();
  clearCube(1);
  // for (i = 1; i < 61; i++) {
  //   document.getElementById("Item" + i).onclick = cubeAddItem;
  // }
  //console.log(cubes);
  for (var k in cubes) {
    //console.log(cubes[k]);
    butcount += 1;
    document.getElementById("Item" + butcount).onclick = cubeAddItem;

    $$("#" + cubes[k]["buttonId"]).html(cubes[k]["smartcube"]["stkname"] + "" + cubes[k]["smartcube"]["stkbar_price"]);
    $$("#" + cubes[k]["buttonId"]).data('stkbar', cubes[k]["smartcube"]["stkbar"]);
    $$("#" + cubes[k]["buttonId"]).data('stkname', cubes[k]["smartcube"]["stkname"]);
    $$("#" + cubes[k]["buttonId"]).data('stkbar_price', cubes[k]["smartcube"]["stkbar_price"]);
    $$("#" + cubes[k]["buttonId"]).data('stkbar_cost', cubes[k]["smartcube"]["stkbar_cost"]);
    $$("#" + cubes[k]["buttonId"]).data('stkbar_id', cubes[k]["smartcube"]["stkbar_id"]);
    $$("#" + cubes[k]["buttonId"]).data('stk_vat', cubes[k]["smartcube"]["stk_vat"]);
  }
}


function assignMainStockButtons(subStocklist, groups, allgroups, stocklist1) {
  // dynamically add click event to each item in the cube
  //console.log("assignCubeButtons");

  console.log("assignMainStockButtons");
  console.log(subStocklist);

  var duplicates = [];
  var butCount = 1;

  $$("#cubeTitle").html("&nbsp;&nbsp;<i class='f7-icons size-10'>document_text_fill</i>&nbsp; Invoice > Main Items");
  goFirstPage();
  clearCube(1);

  $$("#Item" + butCount).html("<i class='f7-icons size-12 color-green'>home_fill</i>");
  $$('#Item' + butCount).on('click', function () {
    ListMainGroups(groups, allgroups, stocklist1);
  });


  // Only adding main Stock items
  for (var k in subStocklist) {
    if (!duplicates.includes(subStocklist[k]["stk_id"])) {
      //console.log(cubes[k]);
      duplicates.push(subStocklist[k]["stk_id"]);

      console.log("Item " + k);
      console.log(subStocklist[k]["stk_id"]);

      butCount += 1;
      bMainStockExits = true;
      removeOnClick(butCount); // remove old onclick to add a new one - before anyassignment
      
      $$("#Item" + butCount).data('stk_id', subStocklist[k]["stk_id"]);
      document.getElementById("Item" + butCount).onclick = cubeAddItem;
    
      $$("#Item" + butCount).html(subStocklist[k]["stk_name"] + " (" + subStocklist[k]["stkbar_price"] + ") " + " * " + subStocklist[k]["qun_onhand"]);
      $$("#Item" + butCount).data('stkbar', subStocklist[k]["stkbar"]);
      $$("#Item" + butCount).data('stkname', subStocklist[k]["stkbar_name"]);
      $$("#Item" + butCount).data('stkbar_price', subStocklist[k]["stkbar_price"]);
      $$("#Item" + butCount).data('stkbar_cost', subStocklist[k]["stkbar_cost"]);
      $$("#Item" + butCount).data('stkbar_id', subStocklist[k]["stkbar_id"]);
      $$("#Item" + butCount).data('stk_vat', subStocklist[k]["stk_vat"]);

      // This is the last drill down - here we call items only
      //$$('#Item' + butCount).on('click', function () {
        // calling sub sub group items (only)

       // assignStockButtonsOld(groups, allgroups, $$(this), stocklist1);
       //    });
    }
  }
}

function assignStockButtons(groups, allgroups, but, stocklist1) {
  // dynamically add click event to each item in the cube
  //console.log("assignCubeButtons");
  var butCount = 1;
  var stockitems = [];
  //console.log("assignStockButtons stk_id:");
  //console.log(but.data("stk_id"));


  $$("#cubeTitle").html("&nbsp;&nbsp;<i class='f7-icons size-10'>document_text_fill</i>&nbsp; Invoice > Items");
  goFirstPage();
  clearCube(1);

  $$("#Item" + butCount).html("<i class='f7-icons size-12 color-green'>home_fill</i>");
  $$('#Item' + butCount).on('click', function () {
    ListMainGroups(groups, allgroups, stocklist1);
  });

  var istkcount = 0;
  for (var stkitem in stocklist1) {
    if (stocklist1[stkitem]['stk_id'] === but.data("stk_id")) {
      // only take 61 items
      istkcount += 1;
      if (istkcount < 61) {
        istkcount += 1;
        stockitems.push(stocklist1[stkitem]);
      }
    }
  }


  for (var k in stockitems) {
    //console.log(cubes[k]);
    butCount += 1;

    document.getElementById("Item" + butCount).onclick = cubeAddItem;
    if (stockitems[k]["stkbar_price"]) {
      $$("#Item" + butCount).html(stockitems[k]["stkbar_name"] + " (" + stockitems[k]["stkbar_price"] + ")");
    } else {
      $$("#Item" + butCount).html(stockitems[k]["stkbar_name"] + " (0)");
    }

    $$("#Item" + butCount).data('stkbar', stockitems[k]["stkbar"]);
    $$("#Item" + butCount).data('stkname', stockitems[k]["stkbar_name"]);
    $$("#Item" + butCount).data('stkbar_price', stockitems[k]["stkbar_price"]);
    $$("#Item" + butCount).data('stkbar_cost', stockitems[k]["stkbar_cost"]);
    $$("#Item" + butCount).data('stkbar_id', stockitems[k]["stkbar_id"]);
    $$("#Item" + butCount).data('stk_vat', stockitems[k]["stk_vat"]);
  }
}

function assignStockButtonsOld(subStocklist, groups, allgroups, stocklist1) {
  // dynamically add click event to each item in the cube
  //console.log("assignCubeButtons");
  var butCount = 1;
  $$("#cubeTitle").html("&nbsp;&nbsp;<i class='f7-icons size-10'>document_text_fill</i>&nbsp; Invoice > Items");
  goFirstPage();
  clearCube(1);

  $$("#Item" + butCount).html("<i class='f7-icons size-12 color-green'>home_fill</i>");
  $$('#Item' + butCount).on('click', function () {
    ListMainGroups(groups, allgroups, stocklist1);
  });

  /*
 for (i = 2; i < 61; i++) {
   document.getElementById("Item" + i).onclick = cubeAddItem;
 }*/


  for (var k in subStocklist) {
    //console.log(cubes[k]);
    butCount += 1;

    document.getElementById("Item" + butCount).onclick = cubeAddItem;


    $$("#Item" + butCount).html(subStocklist[k]["stkbar_name"] + " (" + subStocklist[k]["stkbar_price"] + ") " + " qty=" + subStocklist[k]["qun_onhand"]);
    $$("#Item" + butCount).data('stkbar', subStocklist[k]["stkbar"]);
    $$("#Item" + butCount).data('stkname', subStocklist[k]["stkbar_name"]);
    $$("#Item" + butCount).data('stkbar_price', subStocklist[k]["stkbar_price"]);
    $$("#Item" + butCount).data('stkbar_cost', subStocklist[k]["stkbar_cost"]);
    $$("#Item" + butCount).data('stkbar_id', subStocklist[k]["stkbar_id"]);
    $$("#Item" + butCount).data('stk_vat', stockitems[k]["stk_vat"]);
  }
}

var cubeAddItem = function () {
  if ($$("#" + this.id).data('stkbar') != null) {
    //console.log($$("#" + this.id).data('stkbar'));
    var my_elem = document.getElementById(this.id);
    var stkbar = $$("#" + this.id).data('stkbar');
    var item = $$("#" + this.id).data('stkname');
    item = item.substring(0, 25); // taking only 15 chars
    var cost = $$("#" + this.id).data('stkbar_cost');
    var vat = $$("#" + this.id).data('stk_vat');
    if (isNaN(cost) === true) {
      cost = 0;
    }
    var stkbar_id = $$("#" + this.id).data('stkbar_id');


    var qty = 0;
    var arrReturn = checkDuplicates(item);
    if (arrReturn != null) {
      qty = parseFloat(arrReturn[1]) + 1;
      $$("#" + arrReturn[0]).remove();
    } else {
      qty = 1;
    }
    //console.log('#badge' + this.id); // item1 2 3 4 ..
    $$('#badge' + this.id).remove();

    var span = document.createElement('span');
    span.id = 'badge' + this.id;
    span.innerHTML = qty;
    span.className = 'badge color-red badgeOrder';
    my_elem.parentNode.insertBefore(span, my_elem);

    var price = 1;
    if ($$("#" + this.id).data('stkbar_price') != null) {
      price = $$("#" + this.id).data('stkbar_price');
    }
    if (price == 0) {
      price = 1;
    }

    var total = qty * price;
    var str_total = total.toFixed(2);

    invline += 1;
    //console.log(total);
    if (total > 0) {
      var itemlink = "<a id = \"editbutton\" href=\"#\" " +
          "onclick=\"editItem('" + stkbar + "'," + qty + "," + price + "," + cost + "," + invline + ")\" class=\"link sheet-open\" data-sheet=\".stocksearch\">" + item + "</a>";

      var rowHTML = "<tr id=\"row" + invline + "\">\n" +
        " <td id=\"col_item\" data-stkbar_id=\"" + stkbar_id + "\" data-stk_vat=\"" + vat + "\" data-cc=\"" + cost + "\" tag=\"" + stkbar + "\" class=\"label-cell\">" + itemlink + "</td>\n" +
          " <td id=\"col_qty\" class=\"numeric-cell\">" + qty + "</td>\n" +
          " <td id=\"col_price\" class=\"numeric-cell\">" + price + "</td>\n" +
          " <td id=\"col_total\" class=\"numeric-cell\">" + str_total + "</td>\n" +
          " <td class=\"actions-cell\">\n" +
          "   <a class=\"link icon-only\">\n" +
          "     <i class=\"icon f7-icons ios-only color-red\" onclick=\"btnRemove('#row" + invline + "')\">trash</i>\n" +
          "     <i class=\"icon material-icons md-only color-red\" onclick=\"btnRemove('#row" + invline + "','" +
          invoicetype + "')\">delete</i>\n" +
          "   </a>\n" +
          " </td>\n" +
          "</tr>";

      //console.log(rowHTML);
      $$('#tblbody').append($$(rowHTML));
      refreshTotals(invoicetype,disc,1);
    }

  }


}

function swipeDelete(pkid) {
  app.dialog.confirm('Are you sure?', function () {
    const invPkid = parseFloat(pkid);
    const dbPromise = idb.open('unodbmobile', localStorage.getItem('CurrentDBVersion'));
    dbPromise.then(db => {
      const tx = db.transaction('invoice', 'readwrite');
      //console.log(invPkid);
      tx.objectStore('invoice').delete(invPkid);
      return tx.complete;
    }).then(function () {
      var liRow = "#" + pkid;
      $$(liRow).remove();
    });

  });
}

function addTocube(item, stkbar, stkname, price, cost, stkbar_id) {
  /* var cubesdetails = [];
   cubesdetails.push(new smartswipeItem(item, stkbar, stkname,price));*/

  var cubesdetails = { // Set the maps properties
    stkbar: stkbar,
    stkname: stkname,
    item: item,
    stkbar_price: price,
    stkbar_cost: cost,
    stkbar_id: stkbar_id
  };


  var cubeitem = [];

  var cubeitem = { // Set the maps properties
    buttonId: item,
    smartcube: cubesdetails
  };


  //console.log("addTocube cubeitem: " + cubeitem);


  const dbPromise = idb.open('unodbmobile', localStorage.getItem('CurrentDBVersion'));
  dbPromise.then(db => {
    const tx = db.transaction('smartcube', 'readwrite');
    tx.objectStore('smartcube').delete(item);
    return tx;
  }).then(function (tx) {
    tx.objectStore('smartcube').add(cubeitem);
    return tx.complete;
  });

}

async function PrapreInvoiceData() {

  // need to send customer list and stock list to the invoice
  const pricelist = [];
  const countlist = [];
  const stklist = [];
  const custlist = [];
  const cubes = [];
  const maingroups = [];
  const allgroups = [];
  const allregionduplicate = [];
  const allregion = [];
  const stkcalculatevaluelist = [];
  const warehouselist = [];
  const invoicelist = [];
  const JVlist = [];
  

  var dblocalversion = localStorage.getItem("CurrentDBVersion");

  //use idb for async / wait added features
  //https://github.com/jakearchibald/idb

  let db = await idb.open('unodbmobile', dblocalversion);

  //get stock calculate value
  let tx_stkvalue = db.transaction(['stockcalculatevalue'], 'readonly');
  let objstore_stkvalue = tx_stkvalue.objectStore('stockcalculatevalue');
  let lststkvalues = await objstore_stkvalue.getAll();
  for (var value in lststkvalues) {
    stkcalculatevaluelist.push(lststkvalues[value]);
  }

  //get invoices
  let tx_invoices = db.transaction(['invoice'], 'readonly');
  let objstore_invoices = tx_invoices.objectStore('invoice');
  let lstinvoices = await objstore_invoices.getAll();
  for (var value in lstinvoices) {
    invoicelist.push(lstinvoices[value]);
  }

  //get JV
  let tx_JV = db.transaction(['ReceiptVouchers'], 'readonly');
  let objstore_JV = tx_JV.objectStore('ReceiptVouchers');
  let lstJV = await objstore_JV.getAll();
  for (var value in lstJV) {
    JVlist.push(lstJV[value]);
  }

  //get warehouses
  let tx_warehouse = db.transaction(['warehouse'], 'readonly');
  let objstore_warehouse = tx_warehouse.objectStore('warehouse');
  let lstwarehouses = await objstore_warehouse.getAll();
  for (var value in lstwarehouses) {
    warehouselist.push(lstwarehouses[value]);
  }

  //Opening Customer table using await/Sync
  let tx_customer = db.transaction(['customer'], 'readonly');
  let objStore_customer = tx_customer.objectStore('customer');
  let lstcustomers = await objStore_customer.getAll();



  for (var cust in lstcustomers) {
    allregionduplicate.push(lstcustomers[cust]['region']);
    custlist.push(lstcustomers[cust]);
  }
  //console.log(custlist);

  //Remove the duplicate value in allregion
  allregionduplicate.forEach(function (reg) {
    if (allregion.indexOf(reg) < 0) {
      allregion.push(reg);
    }
  });

  let tx_counter = db.transaction(['counter'], 'readonly');
  let objStore_counter = tx_counter.objectStore('counter');
  let lstcounter = await objStore_counter.getAll();
  for (var co in lstcounter) {
    countlist.push(lstcounter[co]);
  }


  //Get Stocklist
  let tx_stock = db.transaction(['stock'], 'readonly');
  let objStore_stock = tx_stock.objectStore('stock');
  let lststock = await objStore_stock.getAll();
  for (var stock in lststock) {
    stklist.push(lststock[stock]);
  }
  //console.log(stklist);
  //Get counter
  
  //get pricelist
  let tx_stockprices = db.transaction(['stockprices'], 'readonly');
  let objStore_stockprices = tx_stockprices.objectStore('stockprices');
  let lststockprices = await objStore_stockprices.getAll();
  for (var stock in lststockprices) {
    pricelist.push(lststockprices[stock]);
  }


  let tx_group = db.transaction(['group'], 'readonly');
  let tblmaingroup = tx_group.objectStore('group');
  let Index_gr_name = tblmaingroup.index('sbg_name');
  let cursor_group = await Index_gr_name.openCursor();
  while (cursor_group) {
    //console.log(cursor_group.key, cursor_group.value);
    //console.log(JSON.stringify(cursor_group.value));
    maingroups.push(cursor_group.value);
    cursor_group = await cursor_group.continue();
  }
  //console.log(maingroups);


  //Get Stocklist
  let tx_smartcube = db.transaction(['smartcube'], 'readonly');
  let objStore_smartcube = tx_smartcube.objectStore('smartcube');
  let lstsmartcube = await objStore_smartcube.getAll();
  for (var smartcube in lstsmartcube) {
    cubes.push(lstsmartcube[smartcube]);
  }
  //console.log(cubes);


  //allgroups
  let tx_allgroups = db.transaction(['allgroups'], 'readonly');
  let objStore_allgroups = tx_allgroups.objectStore('allgroups');
  let Index_allgroups = objStore_allgroups.index('groupindex');
  let cursor_allgroups = await Index_allgroups.openCursor();
  while (cursor_allgroups) {
    //console.log(cursor_group.key, cursor_group.value);
    //console.log(JSON.stringify(cursor_group.value));
    allgroups.push(cursor_allgroups.value);
    cursor_allgroups = await cursor_allgroups.continue();
  }
  //console.log(allgroups);


  db.close()

  return {
    stklist: stklist,
    pricelist: pricelist,
    custlist: custlist,
    countlist: countlist,
    stkcalculatevaluelist: stkcalculatevaluelist, 
    cubes: cubes,
    invoicelist: invoicelist,
    JVlist: JVlist,
    maingroups: maingroups,
    allgroups: allgroups,
    allregion: allregion,
    warehouselist: warehouselist
  };

}

// return invoice list with the keys
async function getInvoiceList() {
  let invkeys = [];
  var invparentlist = [];
  var dblocalversion = localStorage.getItem("CurrentDBVersion");
  let db = await idb.open('unodbmobile', dblocalversion);
  //Opening Customer table using await/Sync
  let tx_invoice = db.transaction(['invoice'], 'readonly');
  let objStore_invoice = tx_invoice.objectStore('invoice');
  let lstinvoice_keys = await objStore_invoice.getAllKeys();

  for (var keyitem in lstinvoice_keys) {
    invkeys.push(lstinvoice_keys[keyitem]);
  }

  let lstinvoice = await objStore_invoice.getAll();

  for (var k in lstinvoice) {
    //console.log("k=" + k + "invkeys[k]=" + invkeys[k]);
    // adding PK from prev. array
    lstinvoice[k][0]["PK_key"] = invkeys[k];
    invparentlist.push(lstinvoice[k][0]);
    //console.log(invparentlist);
  }


  return invparentlist;
}

async function getInvoiceListNoKeys() {
  var dblocalversion = localStorage.getItem("CurrentDBVersion");
  let db = await idb.open('unodbmobile', dblocalversion);
  //Opening Customer table using await/Sync
  let tx_invoice = db.transaction(['invoice'], 'readonly');
  let objStore_invoice = tx_invoice.objectStore('invoice');
  let lstinvoice_keys = await objStore_invoice.getAll();
  return lstinvoice_keys;
}

async function getInvoice(InvoiceId) {
  var dblocalversion = localStorage.getItem("CurrentDBVersion");
  let db = await idb.open('unodbmobile', dblocalversion);
  //Opening Customer table using await/Sync
  let tx_invoice = db.transaction(['invoice'], 'readonly');
  let objStore_invoice = tx_invoice.objectStore('invoice');
  let lstinvoice = await objStore_invoice.get(InvoiceId);
  return lstinvoice;

}




async function getJV(JVId) {
  var dblocalversion = localStorage.getItem("CurrentDBVersion");
  let db = await idb.open('unodbmobile', dblocalversion);
  //Opening Customer table using await/Sync
  let tx_JV = db.transaction(['ReceiptVouchers'], 'readonly');
  let objStore_JV = tx_JV.objectStore('ReceiptVouchers');
  let lstJV = await objStore_JV.get(JVId);
  return lstJV;
}

async function IsInvoiceOffline() {
  let invoiceList = await getInvoiceListNoKeys();
  var isOffline = false;
  for (var inv in invoiceList) {
    if (invoiceList[inv]["IsUploaded"] === false) {
      isOffline = true;
    }
  }
  return isOffline;
}

function SaveEditedInvoice(invoiceKey, current_inv) {
  const dbPromise = idb.open('unodbmobile', localStorage.getItem('CurrentDBVersion'));
  dbPromise.then(db => {
    const tx = db.transaction('invoice', 'readwrite');
    tx.objectStore('invoice').delete(invoiceKey);
    return tx;
  }).then(function (tx) {
    //const tx = db.transaction('invoice', 'readwrite');
    const request = tx.objectStore('invoice').add(current_inv);
    request.then(mainId => {
      //console.log("mainId: " + mainId);
      //localStorage.setItem("PendingUploads", "1"); // set it to true before upload
      if (localStorage.getItem("UpdateDataToOnlineServer") === "1") {
        saveDataOnline(mainId, current_inv);
      }
    })
  });

}
/*function UpdateLocalCustomer(data, keyid) {
  // Saving data to local database first
  console.log(data);
  const dbPromise = idb.open('unodbmobile', localStorage.getItem('CurrentDBVersion'));
  dbPromise.then(db => {
    const tx = db.transaction('customer', 'readwrite');
    tx.objectStore('customer').put(data[0]);
    return tx.complete;
  });
}*/
function Savecounter(current_counter,keyid) {
  console.log(current_counter);
  const dbPromise = idb.open('unodbmobile', localStorage.getItem('CurrentDBVersion'));
  dbPromise.then(db => {
    const tx = db.transaction('counter', 'readwrite');
    tx.objectStore('counter').add(current_counter,keyid);
    return tx;
  });
}

function SaveEditedJV(invoiceKey, current_JV) {
  const dbPromise = idb.open('unodbmobile', localStorage.getItem('CurrentDBVersion'));
  dbPromise.then(db => {
    const tx = db.transaction('ReceiptVouchers', 'readwrite');
    tx.objectStore('ReceiptVouchers').delete(invoiceKey);
    return tx;
  }).then(function (tx) {
    //const tx = db.transaction('invoice', 'readwrite');
    const request = tx.objectStore('ReceiptVouchers').add(current_JV);
    request.then(mainId => {
      //console.log("mainId: " + mainId);
      //localStorage.setItem("PendingUploads", "1"); // set it to true before upload
      if (localStorage.getItem("UpdateDataToOnlineServer") === "1") {
        saveJVOnline(mainId, current_JV);
      }
    })
  });

}


function AddCustomer(NameOfCustomer, BusAdr, BusMob, BusPhn, region) {
  //create guid
  var cust_id = app.utils.id('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  var dialog = app.dialog.preloader('Loading..', 'blue');
  dialog.open();
  //console.log($$('#NameOfCustomer').val());
  app.request({
    //url: 'https://unopwa.com/api/sinvoice.php',
    //url: 'https://unopwa.com/api/AddCustomer.php',
    //url: 'api/addcustomer.php',  
    url: 'https://unopwa.app/api/addcustomer.php',     
    crossDomain: true,
    async: true, // async processing
    data: {
      'dbhost': localStorage.getItem('Server'),
      'dbuser': localStorage.getItem('Username'),
      'dbpass': localStorage.getItem('Password'),
      'dbname': localStorage.getItem('Database'),
      'custsalesmanid': localStorage.getItem('salesmanid'),
      'CompanyCode': localStorage.getItem('CompanyCode'),
      'NameOfCustomer': NameOfCustomer,
      'BusAdr': BusAdr,
      'BusMob': BusMob,
      'BusPhn': BusPhn,
      'region': region,
      'customer_id': cust_id,
    },
    statusCode: {
      404: function (xhr) {
        alert('page not found');
      }
    },
    success: async function (data, status, xhr) {
      // Here we can update the local data that it is upload
      //console.log("Save invoice data:" + data);
      //console.log("Save invoice status:" + status);



      if (data == "1") {
        //console.log(data);

        var cust = [];
        cust.push(new customer_line(cust_id, NameOfCustomer, NameOfCustomer, 0.00, localStorage.getItem('salesmanid'), 'Null', BusPhn, BusMob, region,BusAdr,'', '', localStorage.getItem('CompanyCode')));
        //console.log(cust);
        UpdateLocalCustomer(cust, cust_id);

        dialog.close();
        app.dialog.alert('Customer Created. Thank you!');

        $$('#NameOfCustomer').val('');
        $$('#BusAdr').val('');
        $$('#BusMob').val('');
        $$('#BusPhn').val('');
        $$('#region').val('');

      } else {
        dialog.close();
        console.log(data);
        app.dialog.alert('Failed to Create Customer!');
      }

      /* if (data === "1") { // it means the server transaction is working ok
         // Then upload the local database
         var parent_inv_data = current_inv[0];
         parent_inv_data['IsUploaded'] = true;
         var toastBottom = app.toast.create({
           text: 'Invoice Uploaded Online',
           closeTimeout: 1000,
         });
         toastBottom.open();
         UpdateLocalData(current_inv, mainId);
         localStorage.setItem("PendingUploads", "0");
       } else {
         var toastBottom = app.toast.create({
           text: data,
           closeTimeout: 2000,
         });
         toastBottom.open();
       }*/

      //return data;


    },
    error: function (xhr, status) {
      console.log('AddCustomerOnline Error: ' + status);
      var toastBottom = app.toast.create({
        text: 'No Connection!',
        closeTimeout: 1000,
      });
      toastBottom.open();

    },

  });
}




function customer_line(customerid, acname, Firm, balanceLL, custsalesmanid, salesmanname, BusinessPhone1, BusinessMobile, region, BusinessAddress, lat, lng, companycode) {
  this.customerid = customerid;
  this.acname = acname;
  this.Firm = Firm;
  this.balanceLL = balanceLL;
  this.custsalesmanid = custsalesmanid;
  this.salesmanname = salesmanname;
  this.BusinessPhone1 = BusinessPhone1;
  this.BusinessMobile = BusinessMobile;
  this.region = region;
  this.BusinessAddress = BusinessAddress;
  this.lat = lat;
  this.lng = lng;
  this.companycode = companycode;
}


function UpdateLocalCustomer(data, keyid) {
  // Saving data to local database first
  console.log(data);
  const dbPromise = idb.open('unodbmobile', localStorage.getItem('CurrentDBVersion'));
  dbPromise.then(db => {
    const tx = db.transaction('customer', 'readwrite');
    tx.objectStore('customer').put(data[0]);
    return tx.complete;
  });
}

function getcustomerbalance(customer_id, invoices) {
  var Currentbalance = 0;
  var balanceSA = 0;
  var balanceSR = 0;
  var totalSA = 0;
  var totalSR = 0;
  for (var x in invoices) {
    if (invoices[x][0]['client_id'] == customer_id) {
      if (invoices[x][0]['inv_type'] == 'SA') {
        for (var y in invoices[x]) {
          if (y != '0') {
            totalSA += invoices[x][y]['inc_qty'] * invoices[x][y]['inc_price'];
          }
          balanceSA += totalSA;
        }
      }
      else {
        for (var z in invoices[x]) {
          if (z != '0') {
            totalSR += invoices[x][z]['inc_qty'] * invoices[x][z]['inc_price'];
          }
          balanceSR += totalSR;
        }

      }

    }
  }
  Currentbalance = totalSA - totalSR;

  return Currentbalance;

}
function updatelocalcounter(counter,invtype,counterlist) {
  for (var x in counterlist) {
    if (counterlist[x]['type'] == invtype) {
      counterlist[x]['Sys_Ref'] = counter;
      console.log(counterlist[x]);
      updatecounter(counterlist[x], counterlist[x]['type']);
      break; 
    }
  }
}
function updatecounter(data, key) {
  const dbPromise = idb.open('unodbmobile', localStorage.getItem('CurrentDBVersion'));
  dbPromise.then(db => {
    const tx = db.transaction('counter', 'readwrite');
    tx.objectStore('counter').put(data);
    return tx.complete;
  });
}

function checkqty(currentinv, stocklist) {
  var qty = 1;
  for (var x in currentinv) {
    if (x != '0') {
      for (var y in stocklist) {
        if (stocklist[y]['qun_onhand'] < currentinv[x]['inc_qty'] && stocklist[y]['stkbar'] == currentinv[x]['stkbar']) {
          qty = 0;
          break;
        }
      }
    }
  }
  return qty;
}
function UpdateLocalstock(currentinv,stocklist, invtype) {
  // Saving data to local database first inc_qty , qun_onhand
  var qty = 0;
 
  for (var x in currentinv) {
    if (x != '0') {
      for (var y in stocklist) {
        if (stocklist[y]['stkbar'] == currentinv[x]['stkbar']) {

          if (invtype == 'SA') {
            qty = parseFloat(stocklist[y]['qun_onhand']) - currentinv[x]['inc_qty'];
            stocklist[y]['qun_onhand'] =qty;
          }
          if (invtype == 'SR') {
            qty = parseFloat(stocklist[y]['qun_onhand']) + currentinv[x]['inc_qty'];
            stocklist[y]['qun_onhand'] = qty;
          }
          //if (invtype == 'DM') {
          //  qty = parseFloat(stocklist[y]['qun_onhand']) + currentinv[x]['inc_qty'];          
          //  stocklist[y]['qun_onhand'] = qty;
          //}
          console.log(stocklist[y]);
          updatestock(stocklist[y], stocklist[y]['stkbar']);
          break;                   
        }
      }
    }
  }  
}

function updatestock(data,key){
  const dbPromise = idb.open('unodbmobile', localStorage.getItem('CurrentDBVersion'));
  dbPromise.then(db => {
    const tx = db.transaction('stock', 'readwrite');
    tx.objectStore('stock').put(data);
    return tx.complete;
  });
}
function UpdateDamagestock(currentinv, stocklist, invtype) {
  // Saving data to local database first inc_qty , qun_onhand
  var qty = 0;

  for (var x in currentinv) {
    if (x != '0') {
      for (var y in stocklist) {
        if (stocklist[y]['stkbar'] == currentinv[x]['stkbar']) {
         
          if (invtype == 'DM') {
            qty = parseFloat(stocklist[y]['DMQTy']) + currentinv[x]['inc_qty'];          
            stocklist[y]['DMQTy'] = qty;
          }
          console.log(stocklist[y]);
          updatedamagestock(stocklist[y], stocklist[y]['stkbar']);
          break;
        }
      }
    }
  }
}

function updatedamagestock(data, key) {
  const dbPromise = idb.open('unodbmobile', localStorage.getItem('CurrentDBVersion'));
  dbPromise.then(db => {
    const tx = db.transaction('stock', 'readwrite');
    tx.objectStore('stock').put(data);
    return tx.complete;
  });
}
//function getstockfrominvoice(current_inv) {
//  var stock = [];
//  for (var i+1 in current_inv) {
//    stock.push(new stock_line(current_inv[i]['stkbar_id'], current_inv[i]['stkbar_name'], current_inv[i]['stkbar'], current_inv[i]['stkbar_URL'], current_inv[i]['stkbar_price'], current_inv[i]['stkbar_cost'], current_inv[i]['gr_id'], current_inv[i]['sbg_id'], current_inv[i]['ssbg_id'], current_inv[i]['stk_code'], current_inv[i]['stk_name'], current_inv[i]['stk_id'], current_inv[i]['stk_vat'], current_inv[i]['qun_onhand'], current_inv[i]['warehid'], current_inv[i]['whcode'], current_inv[i]['whname']));     
  
//  }
//  return stock;
//}




