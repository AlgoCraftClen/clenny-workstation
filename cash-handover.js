(function cashHandoverPlan(){
  "use strict";

  var stylesheet=document.createElement("link");
  stylesheet.rel="stylesheet";
  stylesheet.href="cash-handover.css";
  document.head.appendChild(stylesheet);

  var shipmentMix=document.querySelector(".shipment-mix");
  if(!shipmentMix||typeof window.renderMeetingPlanner!=="function")return;

  var plan=document.createElement("section");
  plan.className="cash-handover-plan";
  plan.dataset.ready="false";
  plan.setAttribute("aria-label","Clenny cash handover plan");
  plan.innerHTML='<div class="cash-handover-lead"><span class="cash-handover-label">Cash to hand over after Clenny takes profit</span><strong id="cashHandoverTotal">Pending</strong><span class="cash-handover-note" id="cashHandoverNote">Choose Clenny’s next-shipment cases to calculate the handover.</span></div><div class="cash-handover-fact"><span class="cash-handover-label">Projected business cash</span><strong id="cashHandoverBusiness">—</strong></div><div class="cash-handover-fact"><span class="cash-handover-label">Keep for Clenny’s selected stock</span><strong id="cashHandoverReserve">Pending</strong></div><div class="cash-handover-fact"><span class="cash-handover-label">Clenny may take as profit</span><strong id="cashHandoverProfit">Pending</strong></div>';
  shipmentMix.insertAdjacentElement("afterend",plan);

  function updateCashHandover(settlement){
    function currency(value){return Math.round(num(value)*100)/100}
    var clennyCases=meetingCases("clennyGrizzlyCases")+meetingCases("clennyCopenhagenCases");
    var clennyReserve=currency(meetingCases("clennyGrizzlyCases")*meetingCaseCost("Grizzly")+meetingCases("clennyCopenhagenCases")*meetingCaseCost("Copenhagen"));
    var projectedBusinessCash=currency(num(settlement.clennyPayout)+num(settlement.clannyPayout)+num(settlement.companyRevenue));
    var clennyProfit=currency(Math.max(0,num(settlement.clennyPayout)-clennyReserve));
    var handover=currency(Math.max(0,projectedBusinessCash-clennyProfit));
    var ready=clennyCases>0;

    plan.dataset.ready=ready?"true":"false";
    el("cashHandoverBusiness").textContent=money(projectedBusinessCash);
    el("cashHandoverReserve").textContent=ready?money(clennyReserve):"Pending";
    el("cashHandoverProfit").textContent=ready?money(clennyProfit):"Pending";
    el("cashHandoverTotal").textContent=ready?money(handover):"Pending";
    el("cashHandoverNote").textContent=!ready
      ? "Choose Clenny’s next-shipment cases to calculate the handover."
      : num(settlement.clennyPayout)<clennyReserve
        ? "Clenny is short "+money(clennyReserve-num(settlement.clennyPayout))+" for the selected stock, so no profit is available. Planning only; no withdrawal is recorded."
        : "Includes Clenny’s retained stock capital, Clanny’s projected reinvestment, and the company reserve. Planning only; no withdrawal is recorded.";
  }

  var priorRenderMeeting=window.renderMeetingPlanner;
  window.renderMeetingPlanner=function(settlement){
    priorRenderMeeting(settlement);
    updateCashHandover(settlement);
  };

  if(window.state&&Array.isArray(window.state.shipments)&&window.state.shipments.length){
    updateCashHandover(trackerSettlement(window.state.shipments.at(-1)));
  }
})();
