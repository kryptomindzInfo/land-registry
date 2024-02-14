/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const path = require("path");
const { Gateway, Wallets, Transaction } = require("fabric-network");

const { buildCCPOrg, buildWallet } = require("./AppUtil.js");

const config = require("./config.json");
const channelName = config.channel;
const chaincodeName = config.cc_name;

const walletPath = path.join(__dirname, "wallet");

class Fabric {
  gateway = null;
  contract = null;
  user_id = config.org.userId;
  tx = null;
  network = null;

  async connectNetwork() {
    try {
      // build an in memory object with the network configuration (also known as a connection profile)
      const ccp = buildCCPOrg();

      // setup the wallet to hold the credentials of the application user
      const wallet = await buildWallet(Wallets, walletPath);

      // Create a new gateway instance for interacting with the fabric network.
      // In a real application this would be done as the backend server session is setup for
      // a user that has been verified.
      this.gateway = new Gateway();

      try {
        // setup the gateway instance
        // The user will now be able to create connections to the fabric network and be able to
        // submit transactions and query. All transactions submitted by this gateway will be
        // signed by this user using the credentials stored in the wallet.
        await this.gateway.connect(ccp, {
          wallet,
          identity: this.user_id,
          discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
        });

        // Build a network instance based on the channel where the smart contract is deployed
        this.network = await this.gateway.getNetwork(channelName);

        // Get the contract from the network.
        this.contract = this.network.getContract(chaincodeName);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error(`******** FAILED to run the application: ${error}`);
      process.exit(1);
    }
  }

  async invoke(func_name, args) {
    try {
      console.log("\n--> Submit Transaction: ", func_name, ...args);
      this.tx = this.contract.createTransaction(func_name);
      var result = await this.tx.submit(...args);
      let data = result.toString();
      if (`${result}` !== "") {
        console.log(`*** Result: `, data);
      }
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      this.gateway?.disconnect();
    }
  }

  async query(func_name, args) {
    try {
      console.log("\n--> Evaluate Transaction: ", func_name, ...args);
      this.tx = this.contract.createTransaction(func_name);
      let result = await this.tx.evaluate(...args);
      let data = JSON.parse(result.toString());
      console.log(`*** Result: `, data);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      this.gateway?.disconnect();
    }
  }

  getTxId() {
    return this.tx.getTransactionId();
  }
}

exports.Fabric = Fabric;
