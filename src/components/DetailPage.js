/**
 * 2017/6/29.
 */

import React, {Component} from "react";
import {NavBar} from "antd-mobile";
import DetailBody from "./DetailBody";

export default class DetailPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id : this.props.id,
        }
    }

    render() {
        return (
            <div className="detail-main">
                <NavBar leftContent="返回"
                        mode="dark"
                        onLeftClick={() => {
                            this.props.back();
                        }}
                >问卷详情</NavBar>
                <DetailBody id={this.state.id} fromPush="false"/>
            </div>
        )
    }
}