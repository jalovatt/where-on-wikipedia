const apiURL = "https://en.wikipedia.org/w/api.php?action=query";

module.exports = function(request) {

  /*
    Build and send a request to Wikipedia's query api

    Adapted from:
    https://github.com/jtessler/studio-wiki-race/blob/master/src/WikiApi.js
  */
  function wikiQuery(queryParams) {

    const params = [apiURL, "&format=json"];

    if (!queryParams.action) params.push("&action=query");

    Object.keys(queryParams).forEach((param) => {
      params.push(`&${param}=${queryParams[param]}`);
    });

    const query = params.join("");

    return new Promise((resolve, reject) => {
      request(query,
        ((err, res, body) => {

          if (err) {
            console.log("WikiQuery failed")
            console.log("query:");
            console.log(query);
            console.log("error:");
            console.log(err);

            reject(err);

          } else {
            resolve(JSON.parse(body));
          }
        })
      );
    });
  }

  return {

    async getArticleById(articleId) {
      const data = await this.getArticleData(articleId);
      if (!articleId) return 1 / 0;

      return data;
    },

    getRandomArticleId() {
      const params = {
        list: "random",
        rnnamespace: 0,
        rnlimit: 1
      };

      return wikiQuery(params)
        .then((data) => data.query.random[0].id);
    },

    getArticleParseData(articleId) {
      const params = {
        action: "parse",
        pageid: articleId,
        prop: "images|sections|displaytitle|wikitext"
      };

      return wikiQuery(params)
        .then((data) => data.parse);
    },

    getArticleData(articleId) {
      const params = {
        action: "query",
        format: "json",
        prop: "links|linkshere|categories|info",
        pageids: articleId,
        plnamespace: "0",
        pllimit: "100",
        pldir: "ascending",
        lhprop: "pageid|title",
        lhnamespace: "0",
        lhshow: "!redirect",
        lhlimit: "100",
        clshow: "!hidden",
        cllimit: "50",
        inprop: "url"
      };

      return wikiQuery(params)
        .then((data) => data.query.pages[articleId]);
    },

    getArticleIdFromTitle(title) {
      const params = {
        titles: title
      };

      return wikiQuery(params)
        .then((data) => Object.values(data.query.pages)[0].pageid);
    }
  };

};
