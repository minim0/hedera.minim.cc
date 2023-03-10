// Variable Set
const bUrl = 'https://mainnet-public.mirrornode.hedera.com/api/v1/'; // base URL
const sAc0 = 'accounts?account.id='; // look for single account
const sTx0 = 'transactions/' // look for single transaction
const sBk0 = 'blocks/' // look for single block

const bTx0 = 'transactions?'; // base URL for transactions
const bTxA = 'limit=10&order=desc&account.id=' // look for transactions from account ID
const bTxT = 'transactions?limit=10&order=desc&transactiontype=CRYPTOTRANSFER';
const bTxC = 'transactions?limit=5&order=desc&transactiontype=CRYPTOCREATEACCOUNT';
const bTxR = 'transactions?limit=5&order=desc&transactiontype=CRYPTODELETE';

const gAc0 = 'accounts?limit=5&order=desc'; // just input the address

const gBkC = 'blocks?order=desc&limit='; // look for last 100 blocks
const gNtC = 'network/'; // look for current Network data
const gTk0 = 'tokens/'; // look for single token

//---- Helpers ----//

// convert epoch to readable time
async function cvTm(tEpo){
  dDT = new Date(0);
  dDT.setUTCSeconds(tEpo);
  cTm = dDT.toLocaleTimeString('en-US',{hour12: false});
  cDt = dDT.toLocaleDateString('id');
  nTm = cTm +' '+ cDt;
  return nTm;
};

// convert tinybar to hbar
async function tToH(tbar){
  nAm = tbar / 100000000;
  return nAm;
};

// get transaction source
async function txSrc(tID){
  txSr = tID.split('-');
  return txSr[0];
};

// get token data
async function gTkId(tID){
  console.log('get token data')
  tRs = await fetch(bUrl+oTkn+tID);
  tDt = await tRs.json();
  return tDt;
};

// count down time
async function cdTm(tSt) {
  tDd = parseInt(tSt / 86400);
  nTd = tSt - (tDd * 86400);
  tHr = parseInt(nTd / 3600);
  nTh = nTd - (tHr * 3600);
  tMm = parseInt(nTh / 60);
  tSc = nTh - (tMm * 60);
  return tDd + 'd ' + tHr + 'h ' + tMm + 'm ' + tSc + 's';
};

// Check search string
async function cSrc(srInp){
  let ifAcc = await isAc(srInp);
  console.log(ifAcc);
};
async function isAc(nAc){
  fRs = await fetch(bUrl+sAc0+nAc);
  fDt = await fRs.json();
  console.log(await fDt);
  if(fDt.accounts){
    window.location.replace("./ac?"+nAc);
  } else {
    isTx(nAc);
  }
};
async function isTx(nTx){
  fRs = await fetch(bUrl+sTx0+nTx);
  fDt = await fRs.json();
  console.log(await fDt);
  if(fDt.transactions){
   console.log('its a transactions');
   window.location.replace("./tx?"+nTx);
  } else {
    // isTx(nAc);
    console.log('nottttt');
  }
};
//--------------------------------------------//

async function gPrice(){
  fRs = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd");
  fDt = await fRs.json();
  console.log(fDt)
  document.getElementById("cPrice").innerHTML= "$"+await (fDt['hedera-hashgraph'].usd).toFixed(5);
}