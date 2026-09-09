(function capitalHistory(){
  "use strict";

  var ownership=document.getElementById("ownership");
  var card=ownership&&ownership.querySelector(".draw-card");
  var head=card&&card.querySelector(".draw-head");
  var planner=card&&card.querySelector(":scope > .card-body");
  if(!card||!head||!planner||typeof window.render!=="function")return;

  var stylesheet=document.createElement("link");
  stylesheet.rel="stylesheet";
  stylesheet.href="capital-history.css";
  document.head.appendChild(stylesheet);

  var heading=head.querySelector("h2");
  var subtitle=head.querySelector("div > span");
  var modeBadge=head.querySelector(":scope > .badge");
  var selectedId="";
  head.classList.add("capital-history-head");

  var controls=document.createElement("div");
  controls.className="capital-history-controls";
  controls.innerHTML='<label for="capitalShipmentSelect">View capital by shipment</label><button class="capital-history-step" id="capitalPreviousShipment" type="button" aria-label="View previous shipment">‹</button><select class="capital-history-select" id="capitalShipmentSelect" aria-label="Capital shipment"></select><button class="capital-history-step" id="capitalNextShipment" type="button" aria-label="View next shipment">›</button>';
  head.insertBefore(controls,modeBadge||null);

  var history=document.createElement("section");
  history.className="capital-history-view";
  history.hidden=true;
  history.setAttribute("aria-live","polite");
  history.innerHTML='<div class="capital-history-intro"><div><h3 id="capitalHistoryTitle">Shipment capital snapshot</h3><p id="capitalHistorySubtitle"></p></div><span class="badge gray" id="capitalHistoryStatus"></span></div><div class="capital-history-grid"><div class="capital-history-metric"><span>Product cost</span><strong id="capitalHistoryCost"></strong></div><div class="capital-history-metric"><span>Approved operations</span><strong id="capitalHistoryOperations"></strong></div><div class="capital-history-metric"><span>Recorded sales</span><strong id="capitalHistorySales"></strong></div><div class="capital-history-metric"><span>Remaining inventory</span><strong id="capitalHistoryRemaining"></strong></div><div class="capital-history-metric"><span>Clenny ownership</span><strong id="capitalHistoryClennyShare"></strong></div><div class="capital-history-metric"><span>Clenny rolled capital</span><strong id="capitalHistoryClennyCapital"></strong></div><div class="capital-history-metric"><span>Clanny rolled capital</span><strong id="capitalHistoryClannyCapital"></strong></div><div class="capital-history-metric"><span>Company reserve</span><strong id="capitalHistoryCompany"></strong></div></div><p class="capital-history-foot" id="capitalHistoryFoot"></p>';
  head.insertAdjacentElement("afterend",history);

  var select=document.getElementById("capitalShipmentSelect");
  var previous=document.getElementById("capitalPreviousShipment");
  var next=document.getElementById("capitalNextShipment");

  function shipmentLabel(shipment){
    var products=shipment.lines.map(function(line){return line.product}).filter(Boolean).join(" + ");
    return "SHP #"+shipment.shortSeq+(products?" — "+products:"");
  }

  function setText(id,value){
    var node=document.getElementById(id);
    if(node)node.textContent=String(value);
  }

  function populateSelect(){
    var shipments=window.state&&Array.isArray(window.state.shipments)?window.state.shipments:[];
    var latest=shipments.at(-1);
    if(!shipments.length){
      select.replaceChildren();
      selectedId="";
      previous.disabled=true;
      next.disabled=true;
      return null;
    }
    if(!shipments.some(function(shipment){return String(shipment.id)===String(selectedId)}))selectedId=String(latest.id);
    var priorValue=select.value;
    select.replaceChildren();
    shipments.forEach(function(shipment){
      var option=document.createElement("option");
      option.value=String(shipment.id);
      option.textContent=shipmentLabel(shipment)+(shipment===latest?" (active)":"");
      select.appendChild(option);
    });
    select.value=selectedId||priorValue||String(latest.id);
    selectedId=select.value;
    var index=shipments.findIndex(function(shipment){return String(shipment.id)===String(selectedId)});
    previous.disabled=index<=0;
    next.disabled=index<0||index>=shipments.length-1;
    return shipments[index]||latest;
  }

  function renderHistory(){
    var shipments=window.state&&Array.isArray(window.state.shipments)?window.state.shipments:[];
    var latest=shipments.at(-1);
    var selected=populateSelect();
    if(!selected||!latest)return;
    var isActive=String(selected.id)===String(latest.id);

    planner.hidden=!isActive;
    history.hidden=isActive;
    heading.textContent=isActive?"Partner reinvestment & meeting decision":"Capital history";
    subtitle.textContent=isActive?"Build the next shipment by partner, product, and case count":"Review a prior shipment without changing the active plan";
    if(modeBadge){
      modeBadge.textContent=isActive?"Active planning":"Historical snapshot";
      modeBadge.className="badge "+(isActive?"green":"gray");
    }
    if(isActive)return;

    var settlement=trackerSettlement(selected);
    var recordedSales=sum(selected.sales,function(sale){return sale.grossSales});
    var products=selected.lines.map(function(line){return line.product}).filter(Boolean).join(" + ")||"No product label";
    setText("capitalHistoryTitle","SHP #"+selected.shortSeq+" capital snapshot");
    setText("capitalHistorySubtitle",products);
    setText("capitalHistoryStatus",selected.status||"Shipment");
    setText("capitalHistoryCost",money(shipmentCost(selected)));
    setText("capitalHistoryOperations",money(settlement.totalOps));
    setText("capitalHistorySales",money(recordedSales));
    setText("capitalHistoryRemaining",remainingCans(selected).toLocaleString()+" cans");
    setText("capitalHistoryClennyShare",(settlement.clennyPct*100).toFixed(2)+"%");
    setText("capitalHistoryClennyCapital",money(settlement.clennyPayout));
    setText("capitalHistoryClannyCapital",money(settlement.clannyPayout));
    setText("capitalHistoryCompany",money(settlement.companyRevenue));
    setText("capitalHistoryFoot",selected.operations.length.toLocaleString()+" operation records and "+selected.sales.length.toLocaleString()+" sale records loaded from the shared tracker ledger. This view is read-only.");
  }

  function step(direction){
    var shipments=window.state&&Array.isArray(window.state.shipments)?window.state.shipments:[];
    var index=shipments.findIndex(function(shipment){return String(shipment.id)===String(selectedId)});
    var target=shipments[index+direction];
    if(!target)return;
    selectedId=String(target.id);
    renderHistory();
    select.focus();
  }

  select.addEventListener("change",function(){selectedId=select.value;renderHistory()});
  previous.addEventListener("click",function(){step(-1)});
  next.addEventListener("click",function(){step(1)});

  var priorRender=window.render;
  window.render=function(){
    priorRender();
    renderHistory();
  };
  renderHistory();
})();
