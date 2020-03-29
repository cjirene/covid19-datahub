import React from "react";
// import PropTypes from "prop-types";
import ArticleRoll from "../components/ArticleRoll";
import { makePage } from "../components/Layout";
import { graphql, Link } from "gatsby";

export const IndexPageCore = ({ data, errors }) => {
  console.log(data);
  const config = data.pageIndexYml;
  return (
    <div>
      <div>
        <h1>全球院校追踪</h1>
        <div>
          {config.highlightAreas.map(area => {
            return (
              <Link to={area.link} key={area.link}>
                {area.name}
              </Link>
            );
          })}
        </div>
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

const Page = makePage(IndexPageCore);
export default Page;

export const pageQuery = graphql`
  query IndedxPage {
    pageIndexYml {
      highlightAreas {
        name
        link
      }
    }
    covid19Summary(Countries: { elemMatch: { TotalConfirmed: { gt: 0 } } }) {
      Countries {
        Country
        NewConfirmed
        TotalConfirmed
        Slug
        NewDeaths
      }
    }
  }
`;
