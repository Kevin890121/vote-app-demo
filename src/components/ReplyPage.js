/**
 * 2017/7/3.
 */
import '../css/ReplyPage.css';
import React, {Component} from "react";
import {NavBar, Modal,} from "antd-mobile";
import ReplyBody from "./ReplyBody";

export default class ReplyPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            questionnaireId : this.props.questionnaireId,
            pageSize: this.props.pageSize,
        }
    }

    render() {
        return (
            <div className="detail-main">
                <NavBar leftContent="返回"
                        mode="dark"
                        onLeftClick={() => Modal.alert(
                            <div className="success-title">确定要放弃答题吗?</div>,
                            <div className="tips">本次答题数据将不会保存</div>,
                            [
                                {
                                    text: '取消',
                                    onPress: () => {},
                                    style:{
                                        WebkitTouchCallout: 'none',
                                        boxSizing: 'border-box',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        outline: 'none',
                                        color: '#000',
                                        marginBottom: '0.3rem',
                                        marginTop: '0.3rem',
                                        marginLeft: '0.3rem',
                                        marginRight: '0.15rem',
                                        border: '1PX solid #ddd',
                                        backgroundColor:'#fff',
                                        borderRadius: '0.1rem',
                                        fontSize: '0.3rem',
                                        height: '0.8rem',
                                        lineHeight: '0.8rem',
                                        display: 'block',
                                        width: '49%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    },
                                },
                                {
                                    text: '确定',
                                    onPress: () => {this.props.back()},
                                    style:{
                                        WebkitTouchCallout: 'none',
                                        boxSizing: 'border-box',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        outline: 'none',
                                        color: '#fff',
                                        marginBottom: '0.3rem',
                                        marginTop: '0.3rem',
                                        marginLeft: '0.15rem',
                                        marginRight: '0.3rem',
                                        backgroundColor: '#108ee9',
                                        border:'1px solid ddd',
                                        borderRadius: '0.1rem',
                                        fontSize: '0.3rem',
                                        height: '0.8rem',
                                        lineHeight: '0.8rem',
                                        display: 'block',
                                        width: '49%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    },
                                }
                            ]
                            )
                        }
                >答题/投票</NavBar>
                <ReplyBody questionnaireId={this.state.questionnaireId} pageSize={this.state.pageSize} doReload={this._doReload.bind(this)} completeTips={this.props.completeTips}/>
            </div>
        )
    }

    _doReload(){
        this.props.back();
        this.props.doReload();
    }


}