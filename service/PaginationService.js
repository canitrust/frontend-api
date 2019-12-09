/* ------------------------------------------------------------------------------------------------
 * Copyright (c) mgm security partners GmbH. All rights reserved.
 * Licensed under the AGPLv3 License. See LICENSE.md in the project root for license information.
 * ------------------------------------------------------------------------------------------------*/

module.exports = {
  generatePaginationParams: async (pageNum) => {
    const limit = Number(process.env.PAGINATION_ITEMS_PER_PAGE) || 5;
    const currentPage = parseInt(pageNum, 10) || 1;
    const offset = (currentPage - 1) * limit || 0;
    const paginationParams = {
      limit,
      offset,
      currentPage,
    };
    return paginationParams;
  },
  structurePaginationData: async (currentPage, limit, offset, total, items) => {
    const paginationData = {
      currentPage,
      itemsPerPage: limit,
      offset,
      totalItems: total,
      items,
    };
    return paginationData;
  },
};
