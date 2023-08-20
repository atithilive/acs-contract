const { TokenModule, DPoSModule, KeysModule, SequenceModule, genesis, passphrase, cryptography, configDevnet } = require('lisk-sdk');
const { AtithiModule } = require('./module/index');

// Create the accountAssetSchemas
const token = new TokenModule(configDevnet.genesisConfig).accountSchema;
const dpos = new DPoSModule(configDevnet.genesisConfig).accountSchema;
const keys = new KeysModule(configDevnet.genesisConfig).accountSchema;
const sequence = new SequenceModule(configDevnet.genesisConfig).accountSchema;
const myModule = new AtithiModule().accountSchema;

// Add fieldNumber starting from 2. Field number 1 is assigned to address of the account
token.fieldNumber = 2;
dpos.fieldNumber = 3;
keys.fieldNumber = 4;
sequence.fieldNumber = 5;
AtithiModule.fieldNumber = 6;

const accountAssetSchemas = {
  token,
  dpos,
  keys,
  sequence,
  AtithiModule
};

// Generating the genesis delegates

const newCredentials = () => {
  const pass = passphrase.Mnemonic.generateMnemonic();
  const keys = cryptography.getPrivateAndPublicKeyFromPassphrase(pass);
  const credentials = {
    address: cryptography.getBase32AddressFromPassphrase(pass),
    binaryAddress: cryptography.getAddressFromPassphrase(pass).toString("hex"),
    passphrase: pass,
    publicKey: keys.publicKey.toString("hex"),
    privateKey: keys.privateKey.toString("hex")
  };
  return credentials;
};

const credentials = [];


const newDelegate = (name) => {
  const cred = newCredentials();
  credentials.push(cred);
  const delegate = {
    address: Buffer.from(cred.binaryAddress, 'hex'),
    token: { balance: BigInt(100000000) },
    dpos: { delegate: { username: name } }
  };
  return delegate;
};

const generateDelegates = (amount) => {
  const delegates = [];
  const name = 'genesisDelegate';
  for (let i = 1; i <= amount; i++) {
    let nameNumber = name + i;
    delegates.push(newDelegate(nameNumber))
  }
  return delegates;
};

const delegates = generateDelegates(5);

// Creating the genesis account list

const newAccount = () => {
  const cred = newCredentials();
  credentials.push(cred);
  const account = {
    address: Buffer.from(cred.binaryAddress, 'hex'),
    token: { balance: BigInt(25000000000) }
  };
  return account;
};

const generateAccounts = (amount) => {
  const accounts = [];
  for (let i = 1; i <= amount; i++) {
    accounts.push(newAccount())
  }
  return accounts;
};

const genesisAccounts = generateAccounts(3);

const accounts = [...delegates, ...genesisAccounts];

// Creating the genesis block

const genesisBlockParams = {
  initDelegates: delegates.map(a => a.address),
  accounts,
  accountAssetSchemas,
};

const genesisBlock = genesis.createGenesisBlock(genesisBlockParams);

console.log(genesisBlock);