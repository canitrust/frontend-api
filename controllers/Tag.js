/* ------------------------------------------------------------------------------------------------
 * Copyright (c) mgm security partners GmbH. All rights reserved.
 * Licensed under the AGPLv3 License. See LICENSE.md in the project root for license information.
 * ------------------------------------------------------------------------------------------------*/

const TestcaseService = require('../service/TestcaseService');
const TagService = require('../service/TagService');

const ERROR_TAG_NOT_FOUND = 'Unknown tag';
const ERROR_UNKNOWN = 'Unknown error';

module.exports.getAllTag = async (req, res) => {
  try {
    const data = { tags: await TagService.getAllTag() };
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json(null);
  }
};

/**
 * Find all testcases belong to a tag name
 * Route: /tag/{tagName}?page={pageNum}
 */
module.exports.getTestcasesByTagName = async (req, res) => {
  try {
    const tagName = req.swagger.params.tagName.value;
    const tag = await TagService.getTagByName(tagName);
    const pageNum = req.swagger.params.page.value;
    if (tag) {
      const testcases = await TestcaseService.searchTestcaseByTagNumber(
        tag.tagNumber,
        pageNum
      );
      return res.status(200).json(testcases);
    }
    return res.status(200).json({ error: ERROR_TAG_NOT_FOUND });
  } catch (error) {
    console.log(error);
    return res.status(405).json({ error: ERROR_UNKNOWN });
  }
};
