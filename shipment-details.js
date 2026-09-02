(function shipmentDetails(){
  "use strict";

  var stylesheet=document.createElement("link");
  stylesheet.rel="stylesheet";
  stylesheet.href="shipment-details.css";
  document.head.appendChild(stylesheet);

  var dialog=document.createElement("dialog");
  dialog.id="shipmentDetailDialog";
  dialog.className="shipment-detail-dialog";
  dialog.setAttribute("aria-labelledby","shipmentDetailTitle");
  dialog.setAttribute("aria-describedby","shipmentDetailDescription");
  dialog.innerHTML='<div class="shipment-detail-shell"><header class="shipment-detail-head"><div><span class="shipment-detail-status" id="shipmentDetailStatus"></span><h2 id="shipmentDetailTitle">Shipment details</h2><p id="shipmentDetailDescription"></p></div><button class="shipment-detail-close" type="button" aria-label="Close shipment details">×</button></header><div class="shipment-detail-body"><p class="shipment-detail-notice">Read-only snapshot. Product cost, operations, and sales remain separate and opening this view never changes the shared ledger.</p><div class="shipment-detail-metrics"><div class="shipment-detail-metric"><span>Remaining inventory</span><strong id="shipmentDetailRemaining"></strong></div><div class="shipment-detail-metric"><span>Product cost</span><strong id="shipmentDetailCost"></strong></div><div class="shipment-detail-metric"><span>Operations</span><strong id="shipmentDetailOperations"></strong></div><div class="shipment-detail-metric"><span>Sales</span><strong id="shipmentDetailSales"></strong></div></div><section class="shipment-detail-section"><h3>Inventory reconciliation</h3><div class="shipment-detail-facts"><div class="shipment-detail-fact"><span>Initial inventory</span><strong id="shipmentDetailInitial"></strong></div><div class="shipment-detail-fact"><span>Recorded sold</span><strong id="shipmentDetailSold"></strong></div><div class="shipment-detail-fact"><span>Boxes recorded</span><strong id="shipmentDetailBoxes"></strong></div></div></section><section class="shipment-detail-section"><h3>Product lines</h3><div class="shipment-detail-lines" id="shipmentDetailLines"></div></section><section class="shipment-detail-section"><h3>Product ownership basis</h3><div class="shipment-detail-owners"><div class="shipment-detail-owner"><span>Clenny</span><strong id="shipmentDetailClenny"></strong></div><div class="shipment-detail-owner"><span>Clanny</span><strong id="shipmentDetailClanny"></strong></div><div class="shipment-detail-owner"><span>Combined investment basis</span><strong id="shipmentDetailBasis"></strong></div></div></section><section class="shipment-detail-section"><h3>Recorded activity</h3><div class="shipment-detail-facts"><div class="shipment-detail-fact"><span>Operation records</span><strong id="shipmentDetailOperationCount"></strong></div><div class="shipment-detail-fact"><span>Sale records</span><strong id="shipmentDetailSaleCount"></strong></div><div class="shipment-detail-fact"><span>Products</span><strong id="shipmentDetailProductCount"></strong></div></div></section></div></div>';
  document.body.appendChild(dialog);

  var tbody=document.getElementById("overviewShipments");
  var closeButton=dialog.querySelector(".shipment-detail-close");
  var lastTrigger=null;

  function setText(id,value){
    var node=document.getElementById(id);
    if(node)node.textContent=String(value);
  }

  function shipmentById(id){
    if(!window.state||!Array.isArray(window.state.shipments))return null;
    return window.state.shipments.find(function(shipment){return String(shipment.id)===String(id)})||null;
  }

  function decorateRows(){
    if(!tbody||!window.state||!Array.isArray(window.state.shipments))return;
    Array.from(tbody.children).forEach(function(row){
      var shipmentId=row.dataset.shipmentId;
      var shipment=shipmentId?shipmentById(shipmentId):null;
      if(!shipment||row.querySelector("td[colspan]"))return;
      row.classList.add("shipment-summary-row");
      var firstCell=row.cells[0];
      if(!firstCell||firstCell.querySelector(".shipment-detail-trigger"))return;
      var button=document.createElement("button");
      button.type="button";
      button.className="shipment-detail-trigger";
      button.dataset.shipmentId=shipment.id;
      button.setAttribute("aria-haspopup","dialog");
      button.setAttribute("aria-controls","shipmentDetailDialog");
      button.setAttribute("aria-label","View details for Shipment "+shipment.shortSeq);
      button.textContent="View details";
      firstCell.appendChild(button);
    });
  }

  function addLine(label,value,parent){
    var node=document.createElement("span");
    node.textContent=label+": "+value;
    parent.appendChild(node);
  }

  function openShipment(shipment,trigger){
    var operationTotal=sum(shipment.operations,function(operation){return operation.amount});
    var salesTotal=sum(shipment.sales,function(sale){return sale.grossSales});
    var initial=num(shipment.totalCans);
    var sold=sum(shipment.sales,function(sale){return sale.totalCans});
    var totalBasis=num(shipment.clennyInvest)+num(shipment.clannyInvest);
    var clennyPercent=totalBasis?num(shipment.clennyInvest)/totalBasis*100:0;
    var clannyPercent=totalBasis?num(shipment.clannyInvest)/totalBasis*100:0;
    var products=shipment.lines.map(function(line){return line.product||"Product"});

    setText("shipmentDetailStatus",shipment.status||"Shipment");
    setText("shipmentDetailTitle","Shipment "+shipment.shortSeq);
    setText("shipmentDetailDescription",products.join(" + "));
    setText("shipmentDetailRemaining",remainingCans(shipment).toLocaleString()+" cans");
    setText("shipmentDetailCost",money(shipmentCost(shipment)));
    setText("shipmentDetailOperations",money(operationTotal));
    setText("shipmentDetailSales",money(salesTotal));
    setText("shipmentDetailInitial",initial.toLocaleString()+" cans");
    setText("shipmentDetailSold",sold.toLocaleString()+" cans");
    setText("shipmentDetailBoxes",num(shipment.boxes).toLocaleString());
    setText("shipmentDetailClenny",money(shipment.clennyInvest)+" · "+clennyPercent.toFixed(2)+"%");
    setText("shipmentDetailClanny",money(shipment.clannyInvest)+" · "+clannyPercent.toFixed(2)+"%");
    setText("shipmentDetailBasis",money(totalBasis));
    setText("shipmentDetailOperationCount",shipment.operations.length.toLocaleString());
    setText("shipmentDetailSaleCount",shipment.sales.length.toLocaleString());
    setText("shipmentDetailProductCount",shipment.lines.length.toLocaleString());

    var lines=document.getElementById("shipmentDetailLines");
    lines.replaceChildren();
    shipment.lines.forEach(function(line){
      var item=document.createElement("div");
      item.className="shipment-detail-line";
      var name=document.createElement("strong");
      name.textContent=line.product||"Product";
      item.appendChild(name);
      addLine("Inventory",lineCans(line).toLocaleString()+" cans",item);
      addLine("Cost / case",money(line.costPerCase),item);
      addLine("Target / can",money(line.targetPrice),item);
      lines.appendChild(item);
    });

    lastTrigger=trigger;
    dialog.showModal();
    closeButton.focus();
  }

  function closeDialog(){
    if(dialog.open)dialog.close();
  }

  closeButton.addEventListener("click",closeDialog);
  dialog.addEventListener("click",function(event){
    if(event.target!==dialog)return;
    var bounds=dialog.getBoundingClientRect();
    var inside=event.clientX>=bounds.left&&event.clientX<=bounds.right&&event.clientY>=bounds.top&&event.clientY<=bounds.bottom;
    if(!inside)closeDialog();
  });
  dialog.addEventListener("close",function(){
    if(lastTrigger&&document.contains(lastTrigger))lastTrigger.focus();
  });

  if(tbody){
    tbody.addEventListener("click",function(event){
      var trigger=event.target.closest(".shipment-detail-trigger");
      if(!trigger)return;
      var shipment=shipmentById(trigger.dataset.shipmentId);
      if(shipment)openShipment(shipment,trigger);
    });
    new MutationObserver(decorateRows).observe(tbody,{childList:true});
    decorateRows();
  }
})();
