module.exports = function (node) {
  console.log('context node', node);
  return {
    apiSlugs: node.highlightAreas.map(area => {
      return area.apiSlug;
    }),
  };
}