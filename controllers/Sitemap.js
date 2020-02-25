/* eslint-disable no-restricted-syntax */
/* ------------------------------------------------------------------------------------------------
 * Copyright (c) mgm security partners GmbH. All rights reserved.
 * Licensed under the AGPLv3 License. See LICENSE.md in the project root for license information.
 * ------------------------------------------------------------------------------------------------*/

const xmlbuilder = require('xmlbuilder');
const TagService = require('../service/TagService');
const TestcaseService = require('../service/TestcaseService');

module.exports.sitemapIndex = async (req, res) => {
  try {
    const PathDefault = 'http://canitrust.in/';
    const TagDefault = 'http://canitrust.in/tag/';
    const obj = {
      sitemapindex: {
        '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
        sitemap: [],
      },
    };
    const PathData = {
      testcases: await TestcaseService.getAllPageTestcase(),
    };
    for (const item of PathData.testcases) {
      // pathList.push(item.path,item.date_created);
      const elementPath = {
        loc: PathDefault.concat(item.path),
        lastmod: item.date_created.toString(),
      };
      obj.sitemapindex.sitemap.push(elementPath);
    }
    const TagData = {
      tags: await TagService.getAllTag(),
    };
    for (const item of TagData.tags) {
      const elementTag = {
        loc: TagDefault.concat(item.tagText),
        lastmod:
          'Mon July 17 2019 00:00:00 GMT+0000 (Coordinated Universal Time)',
      };
      obj.sitemapindex.sitemap.push(elementTag);
    }
    const feed = xmlbuilder.create(obj, { encoding: 'UTF-8' });
    const tmp = `${feed.end({ pretty: true })}\n`;
    res.setHeader('Content-Type', 'application/xml');
    res.removeHeader('Content-Security-Policy');
    return res.status(200).send(tmp);
  } catch (error) {
    console.log(error);
    return res.status(400).json(null);
  }
};
