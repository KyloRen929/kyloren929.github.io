
//(c) Ashhole Studios
//code by Oliver Kovacs, except marked places
//part of ashCoin.html



//variables ==>

var loggedInAddress;
var balanceOfAddress
var i;						//for loops
var b;						//boolen for if for loops


//classes ==>

class Transaction{
	constructor(fromAddress, toAddress, amount){
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}

class Block{
	constructor(index, timestamp, transactions, previousHash){
		this.index = index;
		this.timestamp = timestamp;
		this.transaction = transactions;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}
	
	calculateHash(){
		return SHA(this.index + this.timestamp + this.transaction + this.nonce + this.previousHash);
	}

	mineBlock(difficulty){
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
			this.nonce++;
			this.hash = this.calculateHash();
		}

		console.log("Block Mined: " + this.hash);
	}
}

class Blockchain{
	constructor(){
		this.chain = [this.createGenisisBlock()];
		this.difficulty = 3;						//difficulty 5 ==> 30 sec
		this.pendingTransactions = [];
		this.miningReward = 1;
	}
	
	createGenisisBlock(){
		return new Block(0, "genisisBlock", 0);
	}
	
	getLastestBlock(){
		return this.chain[this.chain.length - 1];
	}
	
	minePendingTransactions(miningRewardAdress){
		let Block = new Block(date.now(), this.pendingTransactions);
		block.mineBlock(this.difficulty);

		console.log("Block successfully mined!");
		this.chain.push(block);

		this.pendingTransactions = [
			new Transaction(null, miningRewardAdress, this.miningReward)
		];
	}

	createTransaction(fromAddress, toAddress, amount){
		this.fromAddress = fromAddress,
		this.toAddress = toAddress;
		this.amount = amount;
		this.pendingTransactions.push(new Transaction(fromAddress, toAddress, amount));
	}

	calculateBalanceOfAddress(address){
		balanceOfAddress = 0;

		for(i = 0; i < this.chain.length; i++){
			if(this.chain[i].transaction.fromAddress == address){
				balanceOfAddress -= this.chain[i].transaction.amount;
			}
			if(this.chain[i].transaction.toAddress == address){
				balanceOfAddress += this.chain[i].transaction.amount;
			}
		}
		return balanceOfAddress;
	}
}

class Address{
	constructor(username, password){
		this.username = username;
		this.password = password;
	}
}

class AddressList{
	constructor(){
		this.addressList = [this.adminAddress()];
	}

	adminAddress(){
		return new Address("ashholeStudios", SHA("ashCoinAdmin"));
	}
	
	addAddress(newAddress){
		newAddress.username = usernameCreateAddress;
		newAddress.password = SHA(passwordCreateAddress);
		this.addressList.push(newAddress);

		console.log(JSON.stringify(ashCoinAddresses));
	}
	
	isCreateAddressUsernameValid(usernameCreateAddress){
		this.usernameCreateAddress = usernameCreateAddress;
		b = true;
		for(i = 0; i < this.addressList.length; i++){
			if(this.usernameCreateAddress == ashCoinAddresses.addressList[i].username){
				b = false;
			}
		}
		if(b == true){
			return true;
		}
		else{
			alert("This Username exists already")
		}
		b = undefined;
	}

	verifyLogInAddress(usernameLogIn, passwordLogIn){
		this.usernameLogIn = usernameLogIn;
		this.passwordLogIn = SHA(passwordLogIn);
		b = false;
		for(i = 0; i < this.addressList.length; i++){
			if(this.usernameLogIn == ashCoinAddresses.addressList[i].username && this.passwordLogIn == ashCoinAddresses.addressList[i].password){
				loggedInAddress = this.usernameLogIn;	
				newGUI.reloadBlockChain();
				newGUI.reloadPendingTransactions();
				newGUI.reloadAddressBalance();
				newGUI.reloadCreateTransactionGUIFromAddress();
				b = true;
				alert("You are now logged in as " + this.usernameLogIn);
			}
		}
		if(b == false){
			alert("Username or Password incorrect!");
		}
		b = undefined;
	}
}

class ReloadGUI{
	constructor(){}
	reloadBlockChain(){
		document.getElementById("blockChainText").innerHTML = JSON.stringify(ashCoin);
	}
	reloadPendingTransactions(){
		document.getElementById("pendingTransactionText").innerHTML = JSON.stringify(ashCoin.pendingTransactions);
	}
	reloadAddressBalance(){
		document.getElementById("currentAddressBalance").innerHTML = "Current Address Ballance: " + JSON.stringify(ashCoin.calculateBalanceOfAddress(loggedInAddress));
	}
	reloadCreateTransactionGUIFromAddress(){
		document.getElementById("createTransactionGUIFromAddress").innerHTML = ("From: " + loggedInAddress);
	}
}

//functions ==>

//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//Secure Hash Algorithm (SHA256)
//Source: http://coursesweb.net/javascript/sha256-encrypt-hash_cs
//Original code by Angel Marin, Paul Johnston

function SHA(s){
	var chrsz   = 8;
	var hexcase = 0;
  
   function safe_add (x, y) {
	 var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	 var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	 return (msw << 16) | (lsw & 0xFFFF);
   }
  
   function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
   function R (X, n) { return ( X >>> n ); }
   function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
   function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
   function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
   function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
   function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
   function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
  
   function core_sha256 (m, l) {
	 var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
	 var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
	 var W = new Array(64);
	 var a, b, c, d, e, f, g, h, i, j;
	 var T1, T2;
  
	 m[l >> 5] |= 0x80 << (24 - l % 32);
	 m[((l + 64 >> 9) << 4) + 15] = l;
  
	 for ( var i = 0; i<m.length; i+=16 ) {
	   a = HASH[0];
	   b = HASH[1];
	   c = HASH[2];
	   d = HASH[3];
	   e = HASH[4];
	   f = HASH[5];
	   g = HASH[6];
	   h = HASH[7];
  
	   for ( var j = 0; j<64; j++) {
		 if (j < 16) W[j] = m[j + i];
		 else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
  
		 T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
		 T2 = safe_add(Sigma0256(a), Maj(a, b, c));
  
		 h = g;
		 g = f;
		 f = e;
		 e = safe_add(d, T1);
		 d = c;
		 c = b;
		 b = a;
		 a = safe_add(T1, T2);
	   }
  
	   HASH[0] = safe_add(a, HASH[0]);
	   HASH[1] = safe_add(b, HASH[1]);
	   HASH[2] = safe_add(c, HASH[2]);
	   HASH[3] = safe_add(d, HASH[3]);
	   HASH[4] = safe_add(e, HASH[4]);
	   HASH[5] = safe_add(f, HASH[5]);
	   HASH[6] = safe_add(g, HASH[6]);
	   HASH[7] = safe_add(h, HASH[7]);
	 }
	 return HASH;
   }
  
   function str2binb (str) {
	 var bin = Array();
	 var mask = (1 << chrsz) - 1;
	 for(var i = 0; i < str.length * chrsz; i += chrsz) {
	   bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
	 }
	 return bin;
   }
  
   function Utf8Encode(string) {
	 //string = string.replace(/\r\n/g,"\n");
	 var utftext = "";
  
	 for (var n = 0; n < string.length; n++) {
  
	   var c = string.charCodeAt(n);
  
	   if (c < 128) {
		 utftext += String.fromCharCode(c);
	   }
	   else if((c > 127) && (c < 2048)) {
		 utftext += String.fromCharCode((c >> 6) | 192);
		 utftext += String.fromCharCode((c & 63) | 128);
	   }
	   else {
		 utftext += String.fromCharCode((c >> 12) | 224);
		 utftext += String.fromCharCode(((c >> 6) & 63) | 128);
		 utftext += String.fromCharCode((c & 63) | 128);
	   }
  
	 }
  
	 return utftext;
   }
  
   function binb2hex (binarray) {
	 var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
	 var str = "";
	 for(var i = 0; i < binarray.length * 4; i++) {
	   str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
	   hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
	 }
	 return str;
   }
  
   s = Utf8Encode(s);
   return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}

//End of Secure Hash Algorithm (SHA256)
//End of code by Angel Marin, Paul Johnston
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------

function miningButtonClick(){
	if(loggedInAddress === undefined){
		alert("Please log in!")
	}
	else{

	}
}

function reloadText(){
	if(loggedInAddress === undefined){
		alert("Please log in!")
	}
	else{
		newGUI.reloadBlockChain();
		newGUI.reloadPendingTransactions();
		newGUI.reloadAddressBalance();
		newGUI.reloadCreateTransactionGUIFromAddress();
	}
}

function createTransactionButtonClick(){
	if(loggedInAddress === undefined){
		alert("Please log In!")
	}
	else{
		this.fromAddress = loggedInAddress;
		this.toAddress = document.getElementById("createTransactionToAddress").value;
		this.amount = document.getElementById("createTransactionAmount").value;
		ashCoin.createTransaction(this.fromAddress, this.toAddress, this.amount);
	}
}

function logIn(){
	this.usernameLogIn = document.getElementById("usernameLogIn").value;
	this.passwordLogIn = document.getElementById("passwordLogIn").value;
	ashCoinAddresses.verifyLogInAddress(this.usernameLogIn, this.passwordLogIn);
}

function logOut(){
	if(loggedInAddress === undefined){
		alert("You are already logged out!")
	}
	else{
		loggedInAddress = undefined;
		alert("You are now logged out!")
	}

}

function createAddress(){
	this.usernameCreateAddress = document.getElementById("usernameCreateAddress").value;
	this.passwordCreateAddress = document.getElementById("passwordCreateAddress").value;
	this.gtctChecked = document.getElementById("gtctCheckbox").checked;
	if(gtctChecked == true && ashCoinAddresses.isCreateAddressUsernameValid(this.usernameCreateAddress) == true){
		ashCoinAddresses.addAddress(new Address(this.usernameCreateAddress, this.passwordCreateAddress));
	}
	else if(gtctChecked == false){
		alert("Please read our General terms and conditions of trade");
	}
}


// objects ==>

let ashCoin = new Blockchain();
let ashCoinAddresses = new AddressList();
let newGUI = new ReloadGUI();

ashCoin.createTransaction(new Transaction("abc", "xyz", 100));
ashCoin.createTransaction(new Transaction("abc", "xyz", 100));
ashCoin.createTransaction(new Transaction("abc", "xyz", 100));

//document.write(JSON.stringify(ashCoin));
//console.log(JSON.stringify(ashCoinAddresses));
