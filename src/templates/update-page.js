import React from "react";
import { graphql, Link } from "gatsby";

const Page = ({ data }) => {
  const { markdownRemark } = data;
  const article = data?.markdownRemark;
  console.log(markdownRemark);
  return (
    <div>
      <div>
        <Link to="/">返回首页</Link>
      </div>
      <h1>{article?.frontmatter?.title}</h1>
      <p>
        链接：<a href={article?.frontmatter?.link}>link</a>
      </p>
    </div>
  );
};

export default Page;

export const pageQuery = graphql`
  query UpdateByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        tags
        link
      }
    }
  }
`;
