const rssPlugin = require('@11ty/eleventy-plugin-rss');

// Filters
const dateFilter = require('./src/filters/date-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');

// Transforms
const htmlMinTransform = require('./src/transforms/html-min-transform.js');

// Create a helpful production flag
const isProduction = process.env.NODE_ENV === 'production';

module.exports = config => {
  // Only minify HTML if we are in production because it slows builds _right_ down
  // REPLACED FILE COPY PASSTHROUGH
  if (isProduction) {
    config.addTransform('htmlmin', htmlMinTransform);
  }

  // Add filters
  config.addFilter('dateFilter', dateFilter);
  config.addFilter('w3DateFilter', w3DateFilter);

  // Plugins
  config.addPlugin(rssPlugin);

  // ///////////
  // COLLECTIONS
  // ///////////
  const sortByDisplayOrder = require('./src/utils/sort-by-display-order.js');

  // Returns work items, sorted by display order
  config.addCollection('work', collectionApi => {
    return sortByDisplayOrder(collectionApi.getFilteredByGlob('./src/work/*.md'));
  });

  // Returns work items, sorted by display order then filtered by featured
  config.addCollection('featuredWork', collectionApi => {
    return sortByDisplayOrder(collectionApi.getFilteredByGlob('./src/work/*.md')).filter(
    x => x.data.featured
    );
  });

  // Returns a list of people ordered by filename
  config.addCollection('people', collection => {
    return collection.getFilteredByGlob('./src/people/*.md').sort((a, b) => {
      return Number(a.fileSlug) > Number(b.fileSlug) ? 1 : -1;
    });
  });

  // Returns a collection of blog posts in reverse date order
  config.addCollection('blog', collectionApi => {
    return [...collectionApi.getFilteredByGlob('./src/posts/*.md')].reverse();
  });

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);  

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
        input: 'src',
        output: 'dist'
    }
  };
};