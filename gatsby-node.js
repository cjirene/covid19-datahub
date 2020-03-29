const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const { createFilePath } = require("gatsby-source-filesystem");
const { fmImagesToRelative } = require("gatsby-remark-relative-images");

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              pathname
              templateKey
            }
            frontmatter {
              tags
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    result.errors.forEach(e => console.error(e.toString()));
    return Promise.reject(result.errors);
  }

  const posts = result.data.allMarkdownRemark.edges;

  posts.forEach(edge => {
    const id = edge.node.id;
    const pathname = edge.node.fields.pathname;
    const templateKey = edge.node.fields.templateKey;
    createPage({
      path: pathname,
      tags: edge.node.frontmatter.tags,
      component: path.resolve(
        `src/templates/${templateKey}.js`
      ),
      // additional data can be passed via context
      context: {
        id
      }
    });
  });

  // Tag pages:
  let tags = [];
  // Iterate through each post, putting all found tags into `tags`
  posts.forEach(edge => {
    if (_.get(edge, `node.frontmatter.tags`)) {
      tags = tags.concat(edge.node.frontmatter.tags);
    }
  });
  // Eliminate duplicate tags
  tags = _.uniq(tags);

  // Make tag pages
  tags.forEach(tag => {
    const tagPath = `/tags/${_.kebabCase(tag)}/`;

    createPage({
      path: tagPath,
      component: path.resolve(`src/templates/tags.js`),
      context: {
        tag
      }
    });
  });
};

// function foreignListField({ type, field, fieldFrom, fieldTo, orderBy }) {
//   console.log(type);
//   fieldFrom = fieldFrom || field;
//   fieldTo = fieldTo || field;
//   return {
//     type: `[${type}]`,
//     resolve: (source, args, context, info) => {
//       return context.nodeModel
//         .getAllNodes({ type: type })
//         .filter(d => d[fieldTo] === source[fieldFrom])
//         .sort((da, db) => {
//           return da[orderBy] < db[orderBy];
//         });
//     }
//   };
// }

// function foreignEntityField({ type, field, fieldFrom, fieldTo }) {
//   console.log(type);
//   fieldFrom = fieldFrom || field;
//   fieldTo = fieldTo || field;
//   return {
//     type: type,
//     resolve: (source, args, context, info) => {
//       return context.nodeModel
//         .getAllNodes({ type: type })
//         .find(d => d[fieldTo] === source[fieldFrom]);
//     }
//   };
// }

// exports.createSchemaCustomization = ({ actions, schema }) => {
//   const { createTypes } = actions;
//   function extendFields(type, fields) {
//     return schema.buildObjectType({
//       name: type,
//       interfaces: ["Node"],
//       fields: fields
//     });
//   }

//   const typeDefs = [
//     //"type area implements Node { institutes: [institute] }",
//     extendFields("Area", {
//       institutes: foreignListField({
//         type: "Institute",
//         field: "countryCode",
//         orderBy: "name"
//       })
//       // updates: {
//       //   type: '',
//       //   resolve: (source, args, context, info) => {
//       //     return context.nodeModel
//       //       .getAllNodes({ type: type })
//       //       .find(d => d[fieldTo] === source[fieldFrom]);
//       //   }
//       // },
//       // updates: foreignListField({
//       //   type: "Update",
//       //   field: "countryCode",
//       //   orderBy: "date"
//       // })
//     }),
//     extendFields("Institute", {
//       area: foreignEntityField({
//         type: "Area",
//         field: "countryCode"
//       })
//     })
//   ];
//   createTypes(typeDefs);
// };

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField, createPage } = actions;
  fmImagesToRelative(node); // convert image paths for gatsby images
  if (node.internal.owner === `gatsby-transformer-yaml`) {
    const templateKey =
      node.templateKey || `${_.kebabCase(node.internal.type)}-page`;

    const pathname = createFilePath({ node, getNode });
    console.log(pathname, node.slug);

    const contextFn = path.resolve(`src/templates/${templateKey}-context.js`);
    let context = {};
    if (fs.existsSync(contextFn)) {
      const makeContext = require(contextFn);
      context = makeContext(node);
    }

    createPage({
      path: pathname,
      // tags: edge.node.frontmatter.tags,
      component: path.resolve(`src/templates/${templateKey}.js`),
      // additional data can be passed via context
      context: Object.assign({
        id: node.id,
        // countryCode: node.countryCode,
        // instituteSlug: node.instituteSlug,
        // slug: node.slug
      }, context),
    });
    createNodeField({
      node: node,
      name: `pathname`,
      value: pathname
    });
  }
  if (node.internal.type === `MarkdownRemark`) {
    const pathname = createFilePath({ node, getNode });
    createNodeField({
      name: `pathname`,
      node: node,
      value: pathname
    });
    const templateKey = node.frontmatter.templateKey ||
      `${_.kebabCase(pathname.split('/')[1])}-page`;
    console.log('templateKey', templateKey);
    createNodeField({
      name: `templateKey`,
      node: node,
      value: templateKey
    });
  }

  // node =
  // { title: '美国',
  //   countryCode: 'us',
  //   id: '2c450cb2-67dd-5f89-8348-3a943cdeba10',
  //   children: [],
  //   parent: 'c2e6d4cf-ddc5-5658-91a7-ecb4dd720424',
  //   internal:
  //    { contentDigest: 'a8e9402d4e2950675a8047cbc7317a29',
  //      type: 'Yaml',
  //      counter: 117,
  //      owner: 'gatsby-transformer-yaml' } }
};
