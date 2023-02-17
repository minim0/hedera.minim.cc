// fetch Block Data
async function fBkC(){
  document.getElementById('netStaB').style.color = "var(--red)";
  ntSt();
  gSup();
  gStk();
  gTxn();
  //wBks();
};

async function fNetSta(){
  ntSt();
  gSup();
  gStk();
}
//get Network data
async function ntSt(dt){
  fRs = await fetch(bUrl+gBkC);
  fDt = await fRs.json();
  dt = await fDt.blocks;
  let bk00 = dt[0].number;
  let bk99 = dt[99].number;
  let txAr = []; // transactions array
  let gsAr = []; // gas used array
  let tmAr = []; // time array
  for (let i = 0; i < dt.length; i++) {
    txAr.push(dt[i].count); // push every transactions count to transaction array
    gsAr.push(dt[i].gas_used); // push every gas used to gas array
    tmAr.push((dt[i].timestamp.to-dt[i].timestamp.from)).toFixed(4); // push every time to time array
  };
  if (txAr.length == 100 && gsAr.length == 100 && tmAr.length == 100){
    txTt = txAr.reduce((a, b) => a + b, 0); // calculate average transaction per block
    gsTt = gsAr.reduce((a, b) => a + b, 0); // calculate average gas per block
    tmTt = tmAr.reduce((a, b) => a + b, 0); // calculate average time per block
    document.getElementById('l100Bk').innerHTML= bk00 +' ⇴ ' + bk99; // write tx data to html
    document.getElementById('l100Tx').innerHTML= (txTt/100).toFixed(0)+' x'; // write tx data to html
    document.getElementById('l100Gs').innerHTML= (gsTt/100/100000000).toFixed(8)+' ℏ';  // write gas data to html
    document.getElementById('l100Tm').innerHTML= (tmTt/100).toFixed(8)+' s';  // write time data to html
  }
};

// Get supply data
async function gSup(){

  fRs = await fetch(bUrl+gNtC+'supply');
  fDt = await fRs.json();
  document.getElementById("relSupPer").innerHTML =
    ((fDt.released_supply/fDt.total_supply)*100).toFixed(2)+"%";

  document.getElementById("relSup").innerHTML =
    (await tToH(fDt.released_supply)).toLocaleString('en-US', {maximumFractionDigits:0})+' ℏ'
  document.getElementById("totSup").innerHTML =
    (await tToH(fDt.total_supply)).toLocaleString('en-US', {maximumFractionDigits:0})+' ℏ';
};

// get staking data 
async function gStk(){
  fRs = await fetch(bUrl+gNtC+'stake');
  fDt = await fRs.json();
  tNow = Date.now();
  tSt = fDt.staking_period.to-((tNow/1000).toFixed(0))
  document.getElementById("totStk").innerHTML =
    (await tToH(fDt.stake_total)).toLocaleString('en-US', {maximumFractionDigits:0})+"ℏ";
  document.getElementById("rewPer").innerHTML =
    ((fDt.max_staking_reward_rate_per_hbar/100000000)*365*100).toFixed(2)+'% APY';
    // (await tToH(fDt.max_staking_reward_rate_per_hbar)).toLocaleString('en-US', {maximumFractionDigits:8})+"ℏ/1ℏ";
  nxRw = await cdTm(tSt);
  document.getElementById("rewTime").innerHTML = await nxRw;
  document.getElementById('netStaB').style.color = "var(--fg0)";
};



// Transactions Function 

async function gTxn(){
  document.getElementById('lastTransfers').innerHTML = "";
  document.getElementById('lCrTfB').style.color = "var(--red)";
  fRs = await fetch(bUrl+bTxT);
  fDt = await fRs.json();
  console.log(fDt.transactions);
  wTxn(await fDt.transactions)
};


async function wTxn(dt){
  for (let i = 0; i < dt.length; i++) {
    if(dt[i].result === 'SUCCESS'){
      tSt = '<span class="sccs">[v]</span>';
      tStDt = '<span class="sccs">'+dt[i].result+'</span>' ;
    } else {
      tSt = '<span class="fail">[x]</span>'
      tStDt = '<span class="sccs">'+dt[i].result+'</span>' ;
    }
    tId = dt[i].transaction_id;
    let tfDt=[];
    if(dt[i].token_transfers){
      for (let tk = 0; tk < dt[i].token_transfers.length; tk++){
        tTp='Token Transfer '+'[T ID: '+dt[i].token_transfers[tk].token_id+']'
        tfDt.push([
          dt[i].token_transfers[tk].account,
          (dt[i].token_transfers[tk].amount).toFixed(8),
          "[T]"
        ])};
      } else {
        tTp="HBAR Transfer"
        for (let tk = 0; tk < dt[i].transfers.length; tk++){
        tfDt.push([
          dt[i].transfers[tk].account,
          (dt[i].transfers[tk].amount/100000000).toFixed(8),
          "[ℏ]"
        ])};
      };
    
    // Write to HTML //
    nDiv = document.createElement('div');
    nDiv.setAttribute("id",tId);
    document.getElementById('lastTransfers').appendChild(nDiv);
    document.getElementById(tId).innerHTML =
    '<div class="tbox imp"><span>TX '+tId+'</span><span class="tar">'+tSt+'</span></div>'+
    '<table class="w100"><tbody id="'+tId+'tx"></tbody></table>'+
    '<div><small>'+tStDt+' ['+await cvTm(dt[i].consensus_timestamp)+']</small></div><hr>';
    await cTf(tId,tfDt);  
  };
};

async function cTf(tId,tfDt){
  for (let k = 0; k < tfDt.length; k++) {
    if(tfDt[k]){
      nRow = document.createElement('tr');
      nRow.setAttribute("id",tId+'tx'+tfDt[k]);
      nRow.setAttribute("class","w100");
      document.getElementById(tId+'tx').appendChild(nRow);
      document.getElementById(tId+'tx'+tfDt[k]).innerHTML=
        '<td>'+tfDt[k][0]+'</a></td><td class="tar">'+tfDt[k][1]+'</td><td class="tar">'+tfDt[k][2]+'</td>';
    } else {
      nRow = document.createElement('tr');
      nRow.setAttribute("id",tId+'failed');
      nRow.setAttribute("class","w100");
      document.getElementById(tId+'tx').appendChild(nRow);
      document.getElementById(tId+'tx'+tfDt[k]).innerHTML=
        '<td>'+'as'+'</td>';
    }

      /*
        document.getElementById(tId+'tx'+tfDt[k]).innerHTML=
      '<td><a href="./ac?'+tfDt[k][0]+'">'+tfDt[k][0]+'</a></td><td class="tar">'+tfDt[k][1]+'</td><td class="tar">'+tfDt[k][2]+'</td>';
      */
  };
  document.getElementById('lCrTfB').style.color = "var(--fg0)";
};


/*
async function wTxn(dt){
  for (let i = 0; i < dt.length; i++) {
    if(dt[i].result === 'SUCCESS'){
      tSt = '<span class="sccs">v</span>'
    } else {
      tSt = '<span class="fail">x</span>'
    }
    tId = await dt[i].transaction_id;
    let tfDt=[];
    if(dt[i].token_transfers){
      for (let tk = 0; tk < dt[i].token_transfers.length; tk++){
        tTp='Token Transfer '+'[T ID: '+dt[i].token_transfers[tk].token_id+']'
        tfDt.push([
          dt[i].token_transfers[tk].account,
          (dt[i].token_transfers[tk].amount).toFixed(8),
          "[T]"
        ])};
      } else {
        tTp="HBAR Transfer"
        for (let tk = 0; tk < dt[i].transfers.length; tk++){
        tfDt.push([
          dt[i].transfers[tk].account,
          (dt[i].transfers[tk].amount/100000000).toFixed(8),
          "[ℏ]"
        ])};
      };
    await wTxID(tId,tSt,tfDt);
  };
};
async function wTxID(tId,tSt,tfDt){
  // Write to HTML //
  nDiv0=document.createElement('div');
  nDiv0.setAttribute("id",tId+'0');
  nDiv0.setAttribute("class",'tbox');
  document.getElementById('lastTransfers').appendChild(await nDiv0);
  document.getElementById(await tId+'0').innerHTML =
    '<div> ID: '+tId+'</div>'+
    '<div class="tar">['+tSt+']</div>';
  await cTf(tId,tfDt);
};
async function cTf(tId,tfDt){
  for (let k = 0; k < tfDt.length; k++) {
    nRow = document.createElement('tr');
    nRow.setAttribute("id",tId+'tx'+tfDt[k]);
    document.getElementById(tId+'tx').appendChild(nRow);
    document.getElementById(tId+'tx'+tfDt[k]).innerHTML=
      '<td><a href="./ac?'+tfDt[k][0]+'">'+tfDt[k][0]+'</a></td><td class="tar">'+tfDt[k][1]+'</td><td class="tar">'+tfDt[k][2]+'</td>'
  };
};
*/