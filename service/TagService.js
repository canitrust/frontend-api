/* ------------------------------------------------------------------------------------------------
 * Copyright (c) mgm security partners GmbH. All rights reserved.
 * Licensed under the AGPLv3 License. See LICENSE.md in the project root for license information.
 * ------------------------------------------------------------------------------------------------*/

const Tag = require('../models/Tag');
const { findByCaseInsensitive } = require('./Common');

const TagService = {
  getAllTag: async () => {
    const data = await Tag.find();
    return data;
  },
  getTagByName: async (tagName) =>
    Tag.findOne({ tagText: findByCaseInsensitive(tagName) }),
};
module.exports = TagService;
