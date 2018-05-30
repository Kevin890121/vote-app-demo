/**
 * 2017/7/28.
 */

import React, {Component} from "react";
import * as Constants from './config/Constants';
export default class QuestionHeader extends Component {
    render(){
        return (
            <div className="am-list-header" style={{
                fontSize: '0.36rem',
                color: '#000',
                borderBottom: '1px solid #DDD',
                paddingBottom: '0.3rem',
            }}>
                {this.props.title}
                {this._renderTypeTag()}
                {this._renderTag()}
            </div>
        )
    }

    _renderTag(){
        if(this.props.tag === Constants.TAG_PENDING){
            return (
                <span style={{
                    marginLeft:"0.1rem",
                    display:"inline-block",
                    padding: '0.01rem 0.1rem 0.01rem 0.1rem',
                    fontSize: '0.26rem',
                    color: '#fff',
                    border: '1px solid #f7a90e',
                    backgroundColor:'#f7a90e',
                    borderRadius:'0.06rem'
                }}>{this.props.tag}</span>
            )
        } else if(this.props.tag === Constants.TAG_FINISH){
            return (
                <span style={{
                    marginLeft:"0.1rem",
                    display:"inline-block",
                    padding: '0.02rem 0.1rem',
                    fontSize: '0.26rem',
                    backgroundColor:'#f2f2f2',
                    color: '#999',
                    border: '1px solid #999',
                    borderRadius:'0.06rem'
                }}>{this.props.tag}</span>
            )
        }
        else{
            return null;
        }
    }

    _renderTypeTag() {
        let typeDesc = '';
        if(Constants.typeRadio === this.props.type){
            typeDesc = "单选";
        } else if (Constants.typeCheckbox === this.props.type){
            typeDesc = "多选";
        } else {
            typeDesc = "问答";
        }

        return (
            <span style={{
                marginLeft: "0.1rem",
                display: "inline-block",
                padding: '0.02rem 0.1rem',
                fontSize: '0.26rem',
                backgroundColor:'#f2f2f2',
                color: '#999',
                border: '1px solid #999',
                borderRadius: '0.06rem'
            }}>{typeDesc}</span>
        )
    }
}