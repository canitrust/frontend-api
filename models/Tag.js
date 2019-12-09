/* ------------------------------------------------------------------------------------------------
 * Copyright (c) mgm security partners GmbH. All rights reserved.
 * Licensed under the AGPLv3 License. See LICENSE.md in the project root for license information.
 * ------------------------------------------------------------------------------------------------*/

const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema(
  {
    tagNumber: { type: Number, unique: true },
    tagText: { type: String },
  },
  { timestamps: true },
  { _id: false }
);

module.exports = mongoose.model('Tag', TagSchema);
