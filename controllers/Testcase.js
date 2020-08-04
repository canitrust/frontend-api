/* ------------------------------------------------------------------------------------------------
 * Copyright (c) mgm security partners GmbH. All rights reserved.
 * Licensed under the AGPLv3 License. See LICENSE.md in the project root for license information.
 * ------------------------------------------------------------------------------------------------*/

const TestcaseService = require('../service/TestcaseService');

module.exports.getAllTestcase = async (req, res) => {
  try {
    const pageNumber = req.swagger.params.page.value;
    const data = {
      testcases: await TestcaseService.getAllTestcase(pageNumber),
    };
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json(null);
  }
};

module.exports.searchTestcase = async (req, res) => {
  try {
    const body = req.swagger.params.body.value;
    const data = {
      searchresult: await TestcaseService.searchTestcase(body.name),
    };
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json(null);
  }
};

module.exports.getTestcaseById = async (req, res) => {
  try {
    const testcaseId = req.swagger.params.testcaseId.value;
    const data = await TestcaseService.getTestcaseById(testcaseId);
    if (data) {
      return res.status(200).json(data);
    }
    return res.status(404).json(null);
  } catch (error) {
    console.log(error);
    return res.status(400).json(null);
  }
};

module.exports.getTestcaseByPath = async (req, res) => {
  try {
    const path = req.swagger.params.path.value;
    const data = await TestcaseService.getTestcaseByPath(path);
    if (data) {
      return res.status(200).json(data);
    }
    return res.status(404).json(null);
  } catch (error) {
    console.log(error);
    return res.status(400).json(null);
  }
};

module.exports.getVariantTestcaseById = async (req, res) => {
  try {
    const testcaseId = req.swagger.params.testcaseId.value;
    const variantTestcaseId = req.swagger.params.variantTestcaseId.value;
    const data = await TestcaseService.getVariantTestcaseById(
      testcaseId,
      variantTestcaseId
    );
    if (data) {
      return res.status(200).json(data);
    }
    return res.status(404).json(null);
  } catch (error) {
    console.log(error);
    return res.status(400).json(null);
  }
};
