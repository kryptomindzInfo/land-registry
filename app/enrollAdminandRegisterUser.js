/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} = require("./fabric-utils/CAUtil.js");
const { buildCCPOrg, buildWallet } = require("./fabric-utils/AppUtil.js");
const config = require("./fabric-utils/config.json");
const mspOrg = config.org.mspID;
const walletPath = path.join(__dirname, "fabric-utils", "wallet");
const orgUserId = config.org.userId;
const caName = config.org.caName;

async function main() {
  // build an in memory object with the network configuration (also known as a connection profile)
  const ccp = buildCCPOrg();

  // build an instance of the fabric ca services client based on
  // the information in the network configuration
  const caClient = buildCAClient(FabricCAServices, ccp, caName);

  // setup the wallet to hold the credentials of the application user
  const wallet = await buildWallet(Wallets, walletPath);

  // in a real application this would be done on an administrative flow, and only once
  await enrollAdmin(caClient, wallet, mspOrg);

  // in a real application this would be done only when a new user was required to be added
  // and would be part of an administrative flow
  await registerAndEnrollUser(
    caClient,
    wallet,
    mspOrg,
    orgUserId,
    config.org.department
  );
}

main();
