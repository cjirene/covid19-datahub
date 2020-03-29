import { Link, graphql, StaticQuery } from "gatsby";
import React from "react";

const ArticleRoll = data => {
  console.log(data);
  const articles = data?.data?.allMarkdownRemark?.edges ?? [];
  console.log(articles);
  return (
    <div>
      {articles.map(artData => {
        const art = artData?.node?.frontmatter;
        return (
          <Link key={artData?.id} to={artData?.node?.fields?.pathname}>
            <h2>{art?.title}</h2>
          </Link>
        );
      })}
    </div>
  );
};

export default () => (
  <StaticQuery
    query={graphql`
      query ArticleQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "update-page" } } }
        ) {
          edges {
            node {
              excerpt(pruneLength: 400)
              id
              fields {
                pathname
              }
              frontmatter {
                title
                templateKey
                date(formatString: "MMMM DD, YYYY")
                featuredpost
                featuredimage {
                  childImageSharp {
                    fluid(maxWidth: 120, quality: 100) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={data => {
      return <ArticleRoll data={data} />;
    }}
  />
);
