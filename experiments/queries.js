const request = require("request");

const apiURL = "https://en.wikipedia.org/w/api.php?action=query";

module.exports = {

  getRandomArticle() {
    const params = {
      list: "random",
      rnnamespace: 0,
      rnlimit: 1
    };

    return wikiQuery(params);
  },

  getLinksHere(articleId) {
    const params = {
      prop: "linkshere",
      pageids: articleId,
      lhnamespace: 0,
      lhlimit: 30
    };

    return wikiQuery(params);
  },

  getCategories(articleId) {

    const params = {
      prop: "categories",
      pageids: articleId
    };

    return wikiQuery(params);
  },

  getLinksTo(articleId) {

    const params = {
      prop: "links",
      plnamespace: 0,
      pllimit: 10,
      pageids: articleId
    };

    return wikiQuery(params);

  },

  getWikiText(articleId) {
    ///w/api.php?action=parse&format=json&pageid=18702834&prop=categories%7Clinks%7Cimages%7Csections%7Cdisplaytitle%7Ciwlinks%7Cproperties%7Cwikitext
    const params = {
      action: "parse",
      pageid: articleId,
      prop: "categories|links|images|sections|displaytitle|iwlinks|properties|wikitext"
    };

    return wikiQuery(params);
  }

};

// Adapted from
// https://github.com/jtessler/studio-wiki-race/blob/master/src/WikiApi.js
function wikiQuery(queryParams) {

  const params = [apiURL, "&format=json"];
  Object.keys(queryParams).forEach((param) => {
    params.push(`&${param}=${queryParams[param]}`);
  });

  const query = params.join("");

  return new Promise((resolve, reject) => {
    request(query,
      ((err, res, body) => {
        (err) ? reject(err) : resolve(JSON.parse(body));
      })
    );
  });
}
