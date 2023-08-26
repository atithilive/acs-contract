const express = require("express");
const cors = require("cors");
const { BasePlugin, codec } = require("lisk-sdk");
const pJSON = require("../package.json");
const { getDBInstance, getNFTHistory, getAllTransactions, saveNFTHistory, saveTransactions,saveUserHistory } = require("./db");

// 1.plugin can be a daemon/HTTP/Websocket service for off-chain processing
class AtithiAPIPlugin extends BasePlugin {
  _server = undefined;
  _app = undefined;
  _channel = undefined;
  _db = undefined;
  _nodeInfo = undefined;

  static get alias() {
    return "AtithiHttpApi";
  }

  static get info() {
    return {
      author: pJSON.author,
      version: pJSON.version,
      name: pJSON.name,
    };
  }

  get defaults() {
    return {};
  }

  get events() {
    return [];
  }

  get actions() {
    return {};
  }

  async load(channel) {
    this._app = express();
    this._channel = channel;
    this._db = await getDBInstance();
    this._nodeInfo = await this._channel.invoke("app:getNodeInfo");


    this._app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT"] }));
    this._app.use(express.json());

    this._app.get("/api/atithi_hotels_tokens", async (_req, res) => {
      const nftTokens = await this._channel.invoke("atithi:getAllTokens");
      const {hotels,...rest}=nftTokens
      let data={};
      for(let i=0;i<hotels.length;i++){
        if (data[hotels[i].cityId]){
          data[[hotels[i].cityId]].push({"id":hotels[i].id,"name":hotels[i].name,"location":hotels[i].location,"managers":hotels[i].managers,"users":hotels[i].users})
        }else{
          data[[hotels[i].cityId]]=[{"id":hotels[i].id,"name":hotels[i].name,"location":hotels[i].location,"managers":hotels[i].managers,"users":hotels[i].users}]
        }
      }
      res.json({ data });
    });

    this._app.get("/api/atithi_cities_tokens", async (_req, res) => {
        const nftTokens = await this._channel.invoke("atithi:getAllTokens");
        const {cities,...rest}=nftTokens
        let data=[]
        // for(let i=0;i<cities.length;i++){
        //   data.push({"id":cities[i].id,"name":cities[i].name,"state":cities[i].state,"country":cities[i].country})
        // }
        if (Array.isArray(cities)) {
          for (let i = 0; i < cities.length; i++) {
            data.push({
              "id": cities[i].id,
              "name": cities[i].name,
              "state": cities[i].state,
              "country": cities[i].country
            });
          }
        }
        res.json({ data });
      });

    this._app.get("/api/atithi_users_tokens", async (_req, res) => {
        const nftTokens = await this._channel.invoke("atithi:getAllTokens");
        const {users,...rest}=nftTokens  
        let data=[]
        if (Array.isArray(users)) {
          for (let i = 0; i < users.length; i++) {
            data.push({
              "awn": users[i].awn,
              "name": users[i].name,
              "mobileNumber": users[i].mobileNumber,
              "email": users[i].email,
              "status": users[i].status,
              "hotelId": users[i].hotelId,
              "isVerified": users[i].isVerified,
            });
          }
        }
        res.json({ data });
      });

    this._app.get("/api/atithi_cities_tokens/:id", async (req, res) => {
      const nftTokens = await this._channel.invoke("nft:getAllNFTTokens");
      const {cities,...rest}=nftTokens
      const token = cities.find((t) => t.id === req.params.id);
      const dbKey = `atithi:${token.id}`;
      let tokenHistory = await getNFTHistory(this._db, dbKey);
      tokenHistory = tokenHistory.map(h => h.toString('binary'));

      res.json({ data: { ...token, tokenHistory } });
    });

    this._app.get("/api/atithi_hotels_tokens/:id", async (req, res) => {
        const nftTokens = await this._channel.invoke("nft:getAllNFTTokens");
        const {hotels,...rest}=nftTokens
        const token = hotels.find((t) => t.id === req.params.id);
        const dbKey = `atithi:${token.id}`;
        let tokenHistory = await getNFTHistory(this._db, dbKey);
        tokenHistory = tokenHistory.map(h => h.toString('binary'));
  
        res.json({ data: { ...token, tokenHistory } });
    });

    this._app.get("/api/atithi_users_tokens/:awn", async (req, res) => {
        const nftTokens = await this._channel.invoke("nft:getAllNFTTokens");
        const {users,...rest}=nftTokens
        const token = users.find((t) => t.awn === req.params.awn);
        const dbKey = `atithi:${token.awn}`;
        let tokenHistory = await getNFTHistory(this._db, dbKey);
        tokenHistory = tokenHistory.map(h => h.toString('binary'));
  
        res.json({ data: { ...token, tokenHistory } });
    });

    this._app.get("/api/transactions", async (_req, res) => {
      const transactions = await getAllTransactions(this._db, this.schemas);

      const data = transactions.map(trx => {
        const module = this._nodeInfo.registeredModules.find(m => m.id === trx.moduleID);
        const asset = module.transactionAssets.find(a => a.id === trx.assetID);
        return {
          ...trx,
          ...trx.asset,
          moduleName: module.name,
          assetName: asset.name,
        }
      })
      res.json({ data });
    });

    this._subscribeToChannel();

    this._server = this._app.listen(8080, "0.0.0.0");
  }

  _subscribeToChannel() {
    // listen to application events and enrich blockchain data for UI/third party application
    this._channel.subscribe('app:block:new', async (data) => {
      const { block } = data;
      const { payload } = codec.decode(
        this.schemas.block,
        Buffer.from(block, 'hex'),
      );
      if (payload.length > 0) {
        await saveTransactions(this._db, payload);
        const decodedBlock = this.codec.decodeBlock(block);
        // save NFT transaction history
        // await saveNFTHistory(this._db, decodedBlock, this._nodeInfo.registeredModules, this._channel);
      }
    });
  }

  async unload() {
    // close http server
    await new Promise((resolve, reject) => {
      this._server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
    // close database connection
    await this._db.close();
  }
}

module.exports = { AtithiAPIPlugin };