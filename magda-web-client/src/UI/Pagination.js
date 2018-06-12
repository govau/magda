import React, { Component } from "react";
import { config } from "../config";
import left_arrow from "../assets/left-arrow.svg";
import right_arrow from "../assets/right-arrow.svg";
import "./Pagination.css";

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.renderNextButton = this.renderNextButton.bind(this);
        this.renderPrevButton = this.renderPrevButton.bind(this);
    }

    onClick(page) {
        this.props.onPageChange(page);
    }
    renderPrevButton(currentIndex) {
        return (
            <button
                onClick={this.onClick.bind(this, currentIndex - 1)}
                className="btn-prev"
            >
                {" "}
                <img src={left_arrow} alt="previous page" />{" "}
            </button>
        );
    }

    renderNextButton(currentIndex) {
        return (
            <button
                onClick={this.onClick.bind(this, currentIndex + 1)}
                className="btn-nexty"
            >
                {" "}
                <img src={right_arrow} alt="next page" />{" "}
            </button>
        );
    }

    renderDisabledButton() {
        return <button disabled={true}>...</button>;
    }

    renderPageList(max, current) {
        //--- make sure values always stay in range
        if (!(current >= 1)) current = 1;
        if (!(max >= current)) {
            if (max >= 1) current = max;
            else max = current;
        }

        //-- Rule 1: detail see my issue comment on github
        const maxPageButtonNum = 7;
        //-- Rule 2
        const minPageButtonNum = Math.min(max, 5);
        const currentPageButtonNum = Math.min(
            current - 1 + minPageButtonNum,
            max,
            maxPageButtonNum
        );

        const pageButtons = new Array(currentPageButtonNum);
        //-- Rule 4: first button always be page 1
        pageButtons[0] = 1;

        //-- Rule 3
        const minButtonsOnRight = 2;

        //-- current page button is freely move within 1 to currentPageButtonNum
        //-- plus it must not beyond `maxPageNo` and must meet Rule 3
        let currentButtonPos = Math.min(current, currentPageButtonNum);
        if (currentPageButtonNum - currentButtonPos < minButtonsOnRight) {
            currentButtonPos =
                currentPageButtonNum -
                Math.min(minButtonsOnRight, max - current);
        }

        //-- how many buttons aren't filled yet on the left (excluding current)
        let leftButtonsNum = currentPageButtonNum;
        //-- fill buttons on the right (including current)
        for (let i = 0; currentButtonPos - 1 + i < pageButtons.length; i++) {
            pageButtons[currentButtonPos - 1 + i] = current + i;
            leftButtonsNum--;
        }

        //-- first button has been taken -- always be 1 (Rule 4)
        //-- thus, take 1 off
        leftButtonsNum--;
        //-- fill buttons on the left
        if (leftButtonsNum > 0) {
            //-- We need to leave one place for potential `...` button
            let nextPageNum = current - 1;
            for (let i = 0; i < leftButtonsNum - 1; i++) {
                pageButtons[currentButtonPos - 1 - 1 - i] = nextPageNum;
                nextPageNum--;
            }
            //-- if more than 1 place to fill, create `...` button (use 0 stands for `...`)
            if (nextPageNum - 1 > 1) pageButtons[1] = 0;
            else pageButtons[1] = nextPageNum;
        }

        return (
            <ul className="pagination-list">
                {current > 1 && this.renderPrevButton(current)}
                {pageButtons.map(i => (
                    <li key={i}>
                        <button
                            onClick={this.onClick.bind(
                                this,
                                //-- if i===0 then it's `...` button, Rule 6 applies
                                i === 0 ? current - 4 : i
                            )}
                            className={`${
                                i === current ? "current" : "non-current"
                            }`}
                        >
                            {i === 0 ? "..." : i}
                        </button>
                    </li>
                ))}
                {current < max && this.renderNextButton(current)}
            </ul>
        );
    }

    render() {
        let currentPage = this.props.currentPage;

        return (
            <div className="pagination">
                {this.renderPageList(this.props.maxPage, currentPage)}
                <div className="pagination-summray">
                    {" "}
                    {(currentPage - 1) * config.resultsPerPage + 1} -{" "}
                    {Math.min(
                        currentPage * config.resultsPerPage,
                        this.props.totalItems
                    )}{" "}
                    of {this.props.totalItems} results
                </div>
            </div>
        );
    }
}

export default Pagination;
