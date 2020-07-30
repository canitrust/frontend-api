/* ------------------------------------------------------------------------------------------------
 * Copyright (c) mgm security partners GmbH. All rights reserved.
 * Licensed under the AGPLv3 License. See LICENSE.md in the project root for license information.
 * ------------------------------------------------------------------------------------------------*/

const Testcase = require('../models/Testcase');
const TestResult = require('../models/TestResult');
const TagService = require('./TagService');
const { findByCaseInsensitive } = require('./Common');
const {
  generatePaginationParams,
  structurePaginationData,
} = require('./PaginationService');

const TestcaseService = {
  getAllTestcase: async (pageNumber) => {
    try {
      const paginationParams = await generatePaginationParams(pageNumber);
      const paginatedData = await Testcase.aggregate([
        {
          $lookup: {
            from: 'tags',
            localField: 'tagNums',
            foreignField: 'tagNumber',
            as: 'tags',
          },
        },
        {
          $facet: {
            paginatedResults: [
              { $skip: paginationParams.offset },
              { $limit: paginationParams.limit },
            ],
            totalCount: [{ $count: 'count' }],
          },
        },
      ]);
      const paginationData = await structurePaginationData(
        paginationParams.currentPage,
        paginationParams.limit,
        paginationParams.offset,
        paginatedData[0].totalCount[0].count,
        paginatedData[0].paginatedResults
      );
      return paginationData;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  getAllPageTestcase: async () => {
    const data = await Testcase.find();
    return data;
  },

  searchTestcase: async (name) => {
    const findTags = await TagService.getTagByName(name);
    let data = [];
    let addedData = [];
    if (findTags) {
      data = await Testcase.find({
        tagNums: { $elemMatch: { $eq: findTags.tagNumber } },
      }).populate('tags');
      addedData = await Testcase.find(
        { $text: { $search: name } },
        { score: { $meta: 'textScore' } }
      )
        .populate('tags')
        .sort({
          score: { $meta: 'textScore' },
        });

      data = data.concat(addedData);
      data = data.filter((elem) => {
        /* eslint-disable no-underscore-dangle */
        if (!data[elem._id]) {
          data[elem._id] = true;
          return true;
        }
        /* eslint-enable no-underscore-dangle */
        return false;
      }, Object.create(null));
    } else {
      data = await Testcase.find(
        { $text: { $search: name } },
        { score: { $meta: 'textScore' } }
      )
        .sort({
          score: { $meta: 'textScore' },
        })
        .populate('tags');
    }
    return data;
  },

  /**
   * Find testcases for a given tag (tagNumber)
   * @param {Int} tagNumber
   * @param {Int} page: page for pagination
   * @return {Object} mongoose-paginate object containing an array of testcases found
   */
  searchTestcaseByTagNumber: async (tagNumber, pageNumber) => {
    try {
      const query = {
        tagNums: { $elemMatch: { $eq: parseInt(tagNumber, 10) } },
      };
      const paginationParams = await generatePaginationParams(pageNumber);
      const options = {
        offset: paginationParams.offset,
        limit: paginationParams.limit,
        populate: 'tags',
      };
      const data = await Testcase.paginate(query, options);
      const paginationData = await structurePaginationData(
        paginationParams.currentPage,
        paginationParams.limit,
        paginationParams.offset,
        data.total,
        data.docs
      );
      return paginationData;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  getTestcaseById: async (testcaseId) => {
    const data = await Testcase.aggregate([
      { $match: { testNumber: { $eq: testcaseId } } },
      {
        $lookup: {
          from: 'tags',
          localField: 'tagNums',
          foreignField: 'tagNumber',
          as: 'tags',
        },
      },
    ]);
    let detailData = null;
    if (data && data.length > 0) {
      const testresults = await TestResult.find({
        testNumber: testcaseId,
      }).sort({ browser: -1, browserVer: -1 });
      detailData = JSON.parse(JSON.stringify(data[0]));
      detailData.testResults = testresults;
    }
    return detailData;
  },

  getTestcaseByPath: async (path) => {
    const data = await Testcase.aggregate([
      { $match: { path: findByCaseInsensitive(path) } },
      {
        $lookup: {
          from: 'tags',
          localField: 'tagNums',
          foreignField: 'tagNumber',
          as: 'tags',
        },
      },
    ]);
    let detailData = null;
    if (data && data.length > 0) {
      const testresults = await TestResult.find({ path }).sort({
        browser: -1,
        browserVer: -1,
      });
      detailData = JSON.parse(JSON.stringify(data[0]));
      detailData.testResults = testresults;
    }
    return detailData;
  },

  getVariantTestcaseById: async (testcaseId, variantTestcaseId) => {
    const data = await Testcase.aggregate([
      { $match: { testNumber: { $eq: testcaseId } } },
      {
        $lookup: {
          from: 'tags',
          localField: 'tagNums',
          foreignField: 'tagNumber',
          as: 'tags',
        },
      },
    ]);
    let detailData = null;
    if (
      data &&
      data.length > 0 &&
      data[0].variations &&
      data[0].variations.length > 0
    ) {
      data[0].variations.forEach((variationItem) => {
        if (variationItem.id === variantTestcaseId)
          data[0].variation = variationItem;
      });
      const testresults = await TestResult.find({
        testNumber: testcaseId,
        variationId: variantTestcaseId,
      }).sort({ browser: -1, browserVer: -1 });
      if (!testresults.length) return null;
      detailData = JSON.parse(JSON.stringify(data[0]));
      detailData.variation.testResults = testresults;
    }
    return detailData;
  },
};
module.exports = TestcaseService;
