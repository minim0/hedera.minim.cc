// fetch Block Data
async function fBkC(){
  document.getElementById('netStaB').style.color = "var(--red)";
  ntSt('100');
  gSup();
  gStk();
  gTxn();
  gBlk('5');
};

async function fNetSta(){
  document.getElementById('netStaB').style.color = "var(--red)";
  ntSt('100');
  gSup();
  gStk();
}
//get Network data
async function ntSt(lmt){
  fRs = await fetch(bUrl+gBkC+lmt);
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

// Blocks
async function gBlk(lmt){
  document.getElementById('lBkB').style.color = "var(--red)";
  document.getElementById('lastBlocks').innerHTML = "";
  fRs = await fetch(bUrl+gBkC+lmt);
  fDt = await fRs.json();
  wBks(await fDt.blocks);
}

async function wBks(dt){
  console.log(dt);
  for (let i = 0; i < dt.length; i++) {
    bId = dt[i].number;
    
    
    // Write to HTML //
    nDiv = document.createElement('div');
    nDiv.setAttribute("id",bId);
    document.getElementById('lastBlocks').appendChild(nDiv);
    document.getElementById(bId).innerHTML =
    '<div class="tbox"><span class="imp">NO '+bId+'</span><span class="tar">['+await cvTm(dt[i].timestamp.to)+']</span></div>'+
    '<table><tbody id="'+bId+'tbl"></tbody></table><hr>';
    
    nRow0= document.createElement('tr');
    nRow0.setAttribute("id",bId+'tr0');
    document.getElementById(bId+'tbl').appendChild(nRow0);

    document.getElementById(bId+'tr0').innerHTML=
    '<td>Tx: '+dt[i].count+'</td><td class="tar">Gas: '+(dt[i].gas_used/100000000).toFixed(8)+' ℏ</td></tr>'
  };
  document.getElementById('lBkB').style.color = "var(--fg0)";
}


// Transactions 
async function gTxn(){
  document.getElementById('lCrTfB').style.color = "var(--red)";
  document.getElementById('lastTransfers').innerHTML = "";
  fRs = await fetch(bUrl+bTxT);
  fDt = await fRs.json();
  console.log(fDt.transactions);
  wTxn(await fDt.transactions);
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
        tTp='Token Transfer '+'[ID: '+dt[i].token_transfers[tk].token_id+']'
        tfDt.push([
          dt[i].token_transfers[tk].account,
          (dt[i].token_transfers[tk].amount).toFixed(8),
          "T"
        ])};
      } else {
        tTp="HBAR Transfer"
        for (let tk = 0; tk < dt[i].transfers.length; tk++){
        tfDt.push([
          dt[i].transfers[tk].account,
          (dt[i].transfers[tk].amount/100000000).toFixed(8),
          "ℏ"
        ])};
      };
    
    // Write to HTML //
    nDiv = document.createElement('div');
    nDiv.setAttribute("id",tId);
    document.getElementById('lastTransfers').appendChild(nDiv);
    document.getElementById(tId).innerHTML =
    '<div class="tbox imp"><span>TX '+tId+'</span><span class="tar">'+tSt+'</span></div>'+
    '<div class="tbox"><span>'+tTp+'</span></div>'+
    '<table><tbody id="'+tId+'tx"></tbody></table>'+
    '<div><small>'+tStDt+' ['+await cvTm(dt[i].consensus_timestamp)+']</small></div><hr>';
    await cTf(tId,tfDt);  
  };
};

async function cTf(tId,tfDt){
  for (let k = 0; k < tfDt.length; k++) {
    if(tfDt[k]){
      nRow = document.createElement('tr');
      nRow.setAttribute("id",tId+'tx'+tfDt[k]);
      document.getElementById(tId+'tx').appendChild(nRow);
      document.getElementById(tId+'tx'+tfDt[k]).innerHTML=
        '<td>'+tfDt[k][0]+'</a></td><td class="tar">'+tfDt[k][1]+' '+tfDt[k][2]+'</td>';
    } else {
      nRow = document.createElement('tr');
      nRow.setAttribute("id",tId+'failed');
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

