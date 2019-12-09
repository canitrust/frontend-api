/* ------------------------------------------------------------------------------------------------
 * Copyright (c) mgm security partners GmbH. All rights reserved.
 * Licensed under the AGPLv3 License. See LICENSE.md in the project root for license information.
 * ------------------------------------------------------------------------------------------------*/

const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema(
  {
    testNumber: { type: Number, index: true },
    browser: { type: String },
    browserVer: { type: Number },
    result: { type: Number, default: 1 },
    date_lasttest: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TestResult', TestResultSchema);
