import React from "react";
import { graphql, Link } from "gatsby";

const Page = ({ data }) => {
  console.log(data);
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
  query AreaPage($id: String!) {
    area(id: { eq: $id }) {
      id
      countryCode
      title
    }
  }
`;
