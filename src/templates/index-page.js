import React from "react";
// import PropTypes from "prop-types";
import ArticleRoll from "../components/ArticleRoll";
// import { Link, graphql } from "gatsby";

export const IndexPageTemplate = () => {
  return (
    <div>
      <div>
        <h1>全球院校追踪</h1>
      </div>
      <div>
        <a href="/">
          <div>资料区</div>
          <div>政策汇总</div>
        </a>
        <a href="/">留学生问题征集</a>
      </div>
      <div>
        <h1>全球资讯</h1>
        <ArticleRoll />
      </div>
    </div>
  );
};

const IndexPage = ({ data }) => {
  // const { frontmatter } = data.markdownRemark;
  return <IndexPageTemplate />;
};

// IndexPage.propTypes = {
//   data: PropTypes.shape({
//     markdownRemark: PropTypes.shape({
//       frontmatter: PropTypes.object
//     })
//   })
// };

export default IndexPage;
