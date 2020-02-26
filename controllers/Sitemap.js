/* eslint-disable func-names */
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
    const PathDefault = 'https://www.canitrust.in/';
    const TagDefault = 'https://www.canitrust.in/tag/';
    const obj = {
      urlset: {
        '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
        url: [],
      },
    };
    const PathData = await TestcaseService.getAllPageTestcase();
    let date = new Date('January 1, 2018');
    // Add testcase path in sitemap
    for (const item of PathData) {
      const elementPath = {
        loc: PathDefault.concat(item.path),
        lastmod: item.date_created.toISOString().substring(0, 10),
        changefreq: 'Monthly',
      };
      if (date <= item.date_created) date = item.date_created;
      obj.urlset.url.push(elementPath);
    }
    // Add hompage path in sitemap
    const homepageElement = {
      loc: PathDefault,
      lastmod: date.toISOString().substring(0, 10),
      changefreq: 'Weekly',
    };
    obj.urlset.url.unshift(homepageElement);
    // Add Tag path in sitemap
    const TagData = await TagService.getAllTag();
    for (const item of TagData) {
      const arr = [];
      // Check all testcases have same tag
      for (let i = 0; i < PathData.length - 1; i++) {
        const found = PathData[i].tagNums.find(function(element) {
          return element === item.tagNumber;
        });
        if (found) arr.push(PathData[i].date_created);
      }
      let lastest = new Date('January 1, 2018');
      for (let i = 0; i < arr.length; i++) {
        if (lastest <= arr[i]) lastest = arr[i];
      }
      const elementTag = {
        loc: TagDefault.concat(item.tagText),
        lastmod: lastest.toISOString().substring(0, 10),
        changefreq: 'Monthly',
      };
      obj.urlset.url.push(elementTag);
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
