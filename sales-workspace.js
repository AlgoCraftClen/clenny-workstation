(function salesWorkspace(){
  "use strict";

  var page=document.getElementById("sales");
  var grid=page&&page.querySelector(".grid.dashboard");
  var rows=document.getElementById("saleRows");
  var count=document.getElementById("salesLedgerCount");
  var form=document.getElementById("saleForm");
  if(!page||!grid||!rows||!count||!form||typeof window.render!=="function")return;

  var cards=Array.from(grid.children).filter(function(node){return node.classList.contains("card")});
  var ledgerCard=cards.find(function(card){return card.contains(rows)});
  var entryCard=cards.find(function(card){return card.contains(form)});
  if(!ledgerCard||!entryCard)return;

  var stylesheet=document.createElement("link");
  stylesheet.rel="stylesheet";
  stylesheet.href="sales-workspace.css";
  document.head.appendChild(stylesheet);

  var pageSize=8;
  var currentPage=1;
  var lastTrigger=null;

  var addButton=document.createElement("button");
  addButton.type="button";
  addButton.className="btn primary sales-add-button";
  addButton.textContent="Add sale";
  page.querySelector(".page-head").appendChild(addButton);

  var pulse=document.createElement("section");
  pulse.className="sales-pulse";
  pulse.setAttribute("aria-label","Sales summary");
  pulse.innerHTML='<div class="sales-pulse-item"><span>Total recorded sales</span><strong id="salesGrossTotal">$0.00</strong></div><div class="sales-pulse-item"><span>Paid sales</span><strong id="salesPaidTotal">$0.00</strong></div><div class="sales-pulse-item"><span>Marked unpaid or partial</span><strong id="salesOutstandingTotal">$0.00</strong></div><div class="sales-pulse-item"><span>Total cans sold</span><strong id="salesCansTotal">0</strong></div>';
  grid.insertAdjacentElement("beforebegin",pulse);

  ledgerCard.classList.add("sales-ledger");
  var table=rows.closest("table");
  var tableWindow=document.createElement("div");
  tableWindow.className="sales-table-window";
  table.parentNode.insertBefore(tableWindow,table);
  tableWindow.appendChild(table);

  var toolbar=document.createElement("div");
  toolbar.className="sales-ledger-toolbar";
  toolbar.innerHTML='<input id="salesSearch" type="search" placeholder="Search customer, product, or notes" aria-label="Search sales"><select id="salesShipmentFilter" aria-label="Filter sales by shipment"><option value="">All shipments</option></select><select id="salesCollectorFilter" aria-label="Filter sales by collector"><option value="">All collectors</option><option value="Clenny">Clenny</option><option value="Clanny">Clanny</option></select><select id="salesStatusFilter" aria-label="Filter sales by payment status"><option value="">All payment states</option><option value="Paid">Paid</option><option value="Unpaid">Unpaid</option><option value="Partial">Partial</option></select>';
  tableWindow.insertAdjacentElement("beforebegin",toolbar);

  var pagination=document.createElement("footer");
  pagination.className="sales-pagination";
  pagination.innerHTML='<span class="sales-page-status" id="salesPageStatus" aria-live="polite"></span><div class="sales-page-actions"><button class="sales-page-button" id="salesPreviousPage" type="button">Previous</button><button class="sales-page-button" id="salesNextPage" type="button">Next</button></div>';
  tableWindow.insertAdjacentElement("afterend",pagination);

  var dialog=document.createElement("dialog");
  dialog.className="sales-entry-dialog";
  dialog.setAttribute("aria-labelledby","salesEntryTitle");
  entryCard.classList.add("sales-entry-card");
  var entryTitle=entryCard.querySelector("h2");
  entryTitle.id="salesEntryTitle";
  var closeButton=document.createElement("button");
  closeButton.type="button";
  closeButton.className="sales-dialog-close";
  closeButton.setAttribute("aria-label","Close sale entry");
  closeButton.textContent="×";
  entryCard.querySelector(".card-head").appendChild(closeButton);
  dialog.appendChild(entryCard);
  document.body.appendChild(dialog);

  var search=document.getElementById("salesSearch");
  var shipmentFilter=document.getElementById("salesShipmentFilter");
  var collectorFilter=document.getElementById("salesCollectorFilter");
  var statusFilter=document.getElementById("salesStatusFilter");
  var previous=document.getElementById("salesPreviousPage");
  var next=document.getElementById("salesNextPage");

  function allSales(){
    return typeof window.sales==="function"?window.sales():[];
  }

  function updatePulse(items){
    var paid=items.filter(function(sale){return (sale.paymentStatus||"Paid")==="Paid"});
    var outstanding=items.filter(function(sale){return (sale.paymentStatus||"Paid")!=="Paid"});
    el("salesGrossTotal").textContent=money(sum(items,function(sale){return sale.grossSales}));
    el("salesPaidTotal").textContent=money(sum(paid,function(sale){return sale.grossSales}));
    el("salesOutstandingTotal").textContent=money(sum(outstanding,function(sale){return sale.grossSales}));
    el("salesCansTotal").textContent=sum(items,function(sale){return sale.totalCans}).toLocaleString();
  }

  function updateShipmentFilter(){
    var value=shipmentFilter.value;
    shipmentFilter.replaceChildren();
    var all=document.createElement("option");
    all.value="";
    all.textContent="All shipments";
    shipmentFilter.appendChild(all);
    (window.state&&Array.isArray(window.state.shipments)?window.state.shipments:[]).forEach(function(shipment){
      var option=document.createElement("option");
      option.value=String(shipment.shortSeq);
      option.textContent="SHP #"+shipment.shortSeq;
      shipmentFilter.appendChild(option);
    });
    if(Array.from(shipmentFilter.options).some(function(option){return option.value===value}))shipmentFilter.value=value;
  }

  function filteredSales(){
    var query=search.value.trim().toLowerCase();
    var shipment=shipmentFilter.value;
    var collector=collectorFilter.value;
    var status=statusFilter.value;
    return allSales().filter(function(sale){
      if(shipment&&String(sale.shipment)!==shipment)return false;
      if(collector&&sale.collectedBy!==collector)return false;
      if(status&&(sale.paymentStatus||"Paid")!==status)return false;
      if(!query)return true;
      return [sale.customer,sale.product,sale.notes,sale.collectedBy,sale.paymentStatus,"SHP #"+sale.shipment]
        .join(" ").toLowerCase().includes(query);
    }).sort(function(a,b){return String(b.date).localeCompare(String(a.date))});
  }

  function renderLedger(resetPage){
    var all=allSales();
    if(resetPage)currentPage=1;
    updatePulse(all);
    updateShipmentFilter();
    var filtered=filteredSales();
    var pageCount=Math.max(1,Math.ceil(filtered.length/pageSize));
    currentPage=Math.min(Math.max(1,currentPage),pageCount);
    var start=(currentPage-1)*pageSize;
    var visible=filtered.slice(start,start+pageSize);
    rows.innerHTML=visible.map(saleRow).join("")||emptyRow(6,"No sales match these filters.");
    count.textContent=filtered.length+" of "+all.length+" entries";
    el("salesPageStatus").textContent=filtered.length
      ? "Showing "+(start+1)+"–"+(start+visible.length)+" of "+filtered.length+" · Page "+currentPage+" of "+pageCount
      : "No matching sales";
    previous.disabled=currentPage<=1;
    next.disabled=currentPage>=pageCount;
  }

  function openDialog(){
    lastTrigger=document.activeElement;
    dialog.showModal();
    var first=form.querySelector("select,input,textarea,button");
    if(first)first.focus();
  }

  function closeDialog(){
    if(dialog.open)dialog.close();
  }

  addButton.addEventListener("click",openDialog);
  closeButton.addEventListener("click",closeDialog);
  dialog.addEventListener("close",function(){if(lastTrigger&&document.contains(lastTrigger))lastTrigger.focus()});
  dialog.addEventListener("click",function(event){
    if(event.target!==dialog)return;
    var bounds=dialog.getBoundingClientRect();
    var inside=event.clientX>=bounds.left&&event.clientX<=bounds.right&&event.clientY>=bounds.top&&event.clientY<=bounds.bottom;
    if(!inside)closeDialog();
  });
  [search,shipmentFilter,collectorFilter,statusFilter].forEach(function(control){control.addEventListener("input",function(){renderLedger(true)})});
  previous.addEventListener("click",function(){if(currentPage>1){currentPage-=1;renderLedger(false)}});
  next.addEventListener("click",function(){currentPage+=1;renderLedger(false)});

  var priorRender=window.render;
  window.render=function(){
    priorRender();
    renderLedger(false);
  };
  renderLedger(true);
})();
