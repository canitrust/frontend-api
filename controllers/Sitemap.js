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
    const PathDefault = 'https://canitrust.in/';
    const TagDefault = 'https://canitrust.in/tag/';
    const obj = {
      urlset: {
        '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
        url: [],
      },
    };
    const PathData = {
      testcases: await TestcaseService.getAllPageTestcase(),
    };
    const homepageElement = {
      loc: PathDefault,
      lastmod: formatDate(
        PathData.testcases[PathData.testcases.length - 1].date_created
      ),
      changefreq: 'Weekly',
    };
    obj.urlset.url.push(homepageElement);
    for (const item of PathData.testcases) {
      // pathList.push(item.path,item.date_created);
      const elementPath = {
        loc: PathDefault.concat(item.path),
        lastmod: formatDate(item.date_created),
        changefreq: 'Monthly',
      };
      obj.urlset.url.push(elementPath);
    }
    const TagData = {
      tags: await TagService.getAllTag(),
    };
    for (const item of TagData.tags) {
      const elementTag = {
        loc: TagDefault.concat(item.tagText),
        lastmod: formatDate('Mon July 1,2019'),
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

function formatDate(date) {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
}
