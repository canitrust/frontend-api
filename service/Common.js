/* ------------------------------------------------------------------------------------------------
 * Copyright (c) mgm security partners GmbH. All rights reserved.
 * Licensed under the AGPLv3 License. See LICENSE.md in the project root for license information.
 * ------------------------------------------------------------------------------------------------*/

const escapeStringRegexp = require('escape-string-regexp');

module.exports = {
  findByCaseInsensitive: (input) => {
    return { $regex: `^${escapeStringRegexp(input)}$`, $options: 'i' };
  },
};
