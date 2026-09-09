(function operationsWorkspace(){
  "use strict";

  var page=document.getElementById("operations");
  var grid=page&&page.querySelector(".grid.dashboard");
  var rows=document.getElementById("operationRows");
  var count=document.getElementById("ledgerCount");
  var form=document.getElementById("operationForm");
  if(!page||!grid||!rows||!count||!form||typeof window.render!=="function")return;

  var cards=Array.from(grid.children).filter(function(node){return node.classList.contains("card")});
  var ledgerCard=cards.find(function(card){return card.contains(rows)});
  var entryCard=cards.find(function(card){return card.contains(form)});
  if(!ledgerCard||!entryCard)return;

  var stylesheet=document.createElement("link");
  stylesheet.rel="stylesheet";
  stylesheet.href="operations-workspace.css";
  document.head.appendChild(stylesheet);

  var pageSize=8;
  var currentPage=1;
  var lastTrigger=null;

  var addButton=document.createElement("button");
  addButton.type="button";
  addButton.className="btn primary operations-add-button";
  addButton.textContent="Add operation";
  page.querySelector(".page-head").appendChild(addButton);

  var pulse=document.createElement("section");
  pulse.className="operations-pulse";
  pulse.setAttribute("aria-label","Operations summary");
  pulse.innerHTML='<div class="operations-pulse-item"><span>Approved business operations</span><strong id="operationsApprovedTotal">$0.00</strong></div><div class="operations-pulse-item"><span>Shared business funds</span><strong id="operationsSharedTotal">$0.00</strong></div><div class="operations-pulse-item"><span>Separate personal money</span><strong id="operationsPersonalTotal">$0.00</strong></div><div class="operations-pulse-item"><span>Personal withdrawals</span><strong id="operationsWithdrawalTotal">$0.00</strong></div>';
  grid.insertAdjacentElement("beforebegin",pulse);

  ledgerCard.classList.add("operations-ledger");
  var table=rows.closest("table");
  var tableWindow=document.createElement("div");
  tableWindow.className="operations-table-window";
  table.parentNode.insertBefore(tableWindow,table);
  tableWindow.appendChild(table);

  var toolbar=document.createElement("div");
  toolbar.className="operations-ledger-toolbar";
  toolbar.innerHTML='<input id="operationsSearch" type="search" placeholder="Search category, description, or treatment" aria-label="Search operations"><select id="operationsShipmentFilter" aria-label="Filter operations by shipment"><option value="">All shipments</option></select><select id="operationsOwnerFilter" aria-label="Filter operations by owner"><option value="">Both partners</option><option value="Clenny">Clenny</option><option value="Clanny">Clanny</option></select>';
  tableWindow.insertAdjacentElement("beforebegin",toolbar);

  var pagination=document.createElement("footer");
  pagination.className="operations-pagination";
  pagination.innerHTML='<span class="operations-page-status" id="operationsPageStatus" aria-live="polite"></span><div class="operations-page-actions"><button class="operations-page-button" id="operationsPreviousPage" type="button">Previous</button><button class="operations-page-button" id="operationsNextPage" type="button">Next</button></div>';
  tableWindow.insertAdjacentElement("afterend",pagination);

  var dialog=document.createElement("dialog");
  dialog.className="operations-entry-dialog";
  dialog.setAttribute("aria-labelledby","operationsEntryTitle");
  entryCard.classList.add("operations-entry-card");
  var entryTitle=entryCard.querySelector("h2");
  entryTitle.id="operationsEntryTitle";
  var closeButton=document.createElement("button");
  closeButton.type="button";
  closeButton.className="operations-dialog-close";
  closeButton.setAttribute("aria-label","Close operation entry");
  closeButton.textContent="×";
  entryCard.querySelector(".card-head").appendChild(closeButton);
  dialog.appendChild(entryCard);
  document.body.appendChild(dialog);

  var search=document.getElementById("operationsSearch");
  var shipmentFilter=document.getElementById("operationsShipmentFilter");
  var ownerFilter=document.getElementById("operationsOwnerFilter");
  var previous=document.getElementById("operationsPreviousPage");
  var next=document.getElementById("operationsNextPage");

  function total(items,predicate){
    return sum(items.filter(predicate),function(operation){return operation.amount});
  }

  function allOperations(){
    return typeof window.ops==="function"?window.ops():[];
  }

  function updatePulse(items){
    var approved=function(operation){return operation.kind!=="withdrawal"&&operation.included===true};
    el("operationsApprovedTotal").textContent=money(total(items,approved));
    el("operationsSharedTotal").textContent=money(total(items,function(operation){return approved(operation)&&operation.fundingSource!=="personal"}));
    el("operationsPersonalTotal").textContent=money(total(items,function(operation){return approved(operation)&&operation.fundingSource==="personal"}));
    el("operationsWithdrawalTotal").textContent=money(total(items,function(operation){return operation.kind==="withdrawal"}));
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

  function filteredOperations(){
    var query=search.value.trim().toLowerCase();
    var shipment=shipmentFilter.value;
    var owner=ownerFilter.value;
    return allOperations().filter(function(operation){
      if(shipment&&String(operation.shipment)!==shipment)return false;
      if(owner&&operation.owner!==owner)return false;
      if(!query)return true;
      return [operation.category,operation.description,operation.treatment,operation.owner,"SHP #"+operation.shipment]
        .join(" ").toLowerCase().includes(query);
    }).sort(function(a,b){return String(b.date).localeCompare(String(a.date))});
  }

  function renderLedger(resetPage){
    var all=allOperations();
    if(resetPage)currentPage=1;
    updatePulse(all);
    updateShipmentFilter();
    var filtered=filteredOperations();
    var pageCount=Math.max(1,Math.ceil(filtered.length/pageSize));
    currentPage=Math.min(Math.max(1,currentPage),pageCount);
    var start=(currentPage-1)*pageSize;
    var visible=filtered.slice(start,start+pageSize);
    rows.innerHTML=visible.map(opRow).join("")||emptyRow(5,"No operations match these filters.");
    count.textContent=filtered.length+" of "+all.length+" entries";
    el("operationsPageStatus").textContent=filtered.length
      ? "Showing "+(start+1)+"–"+(start+visible.length)+" of "+filtered.length+" · Page "+currentPage+" of "+pageCount
      : "No matching operations";
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
  [search,shipmentFilter,ownerFilter].forEach(function(control){control.addEventListener("input",function(){renderLedger(true)})});
  previous.addEventListener("click",function(){if(currentPage>1){currentPage-=1;renderLedger(false)}});
  next.addEventListener("click",function(){currentPage+=1;renderLedger(false)});

  var priorRender=window.render;
  window.render=function(){
    priorRender();
    renderLedger(false);
  };
  renderLedger(true);
})();
