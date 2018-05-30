/**
 * 2017/7/10.
 */
import React, {Component} from "react";
import {NavBar, } from "antd-mobile";
import ResultBody from "./ResultBody";

export default class ResultPage extends Component {

    render() {
        return (
            <div className="detail-main">
                <NavBar leftContent="返回"
                        mode="dark"
                        onLeftClick={() => this.props.back()}
                >查看结果</NavBar>
                <ResultBody questionnaireId={this.props.questionnaireId}  questionnaireInfo={this.props.questionnaireInfo}/>
            </div>
        )
    }

}