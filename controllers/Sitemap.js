/* ------------------------------------------------------------------------------------------------
 * Copyright (c) mgm security partners GmbH. All rights reserved.
 * Licensed under the AGPLv3 License. See LICENSE.md in the project root for license information.
 * ------------------------------------------------------------------------------------------------*/

const xmlbuilder = require('xmlbuilder');
const express = require('express');
const TagService = require('../service/TagService');
const TestcaseService = require('../service/TestcaseService');

const router = express.Router();

router.get('/', async function sitemapIndex(req, res) {
  const PathDefault = 'https://www.canitrust.in/';
  const TagDefault = 'https://www.canitrust.in/tag/';
  const sitemap = {
    urlset: {
      '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      url: [],
    },
  };
  const tagModified = [];
  try {
    const testcaseData = await TestcaseService.getAllPageTestcase();
    let testcaseLastModifiedDate = new Date('2018-01-01');
    // Add testcase path in sitemap
    testcaseData.forEach((item) => {
      sitemap.urlset.url.push({
        loc: PathDefault.concat(item.path),
        lastmod: item.date_created.toISOString().substring(0, 10),
        changefreq: 'monthly',
      });
      // Check some testcase have than one tags
      item.tagNums.forEach((i) => {
        if (!tagModified[i] || tagModified[i] < item.date_created)
          tagModified[i] = item.date_created;
      });
      if (testcaseLastModifiedDate <= item.date_created)
        testcaseLastModifiedDate = item.date_created;
    });
    // Add hompage path in sitemap
    sitemap.urlset.url.unshift({
      loc: PathDefault,
      lastmod: testcaseLastModifiedDate.toISOString().substring(0, 10),
      changefreq: 'weekly',
    });
    // Add Tag path in sitemap
    const TagData = await TagService.getAllTag();
    TagData.forEach((item) => {
      // Check this tag has any testcase yet in case some tag don't have any testcase
      if (!tagModified[item.tagNumber])
        tagModified[item.tagNumber] = new Date('2018-01-01');
      sitemap.urlset.url.push({
        loc: TagDefault.concat(item.tagText),
        lastmod: tagModified[item.tagNumber].toISOString().substring(0, 10),
        changefreq: 'monthly',
      });
    });
    const feed = xmlbuilder.create(sitemap, { encoding: 'UTF-8' });
    const tmp = feed.end({ pretty: true });
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'none'; style-src 'unsafe-inline'"
    );
    return res.status(200).send(tmp);
  } catch (error) {
    console.log(error);
    return res.status(400).json(null);
  }
});

module.exports = router;
