/**
 * 2017/7/4.
 */

import '../css/Common.css';
import '../css/ReplyBody.css';
import React, {Component} from "react";
import {Modal, Toast, Progress, List, Button, WhiteSpace,} from "antd-mobile";
import HttpUtil from './utils/HttpUtil';
import * as AppUrl from './config/AppUrl';
import Question from './Question';

export default class ReplyBody extends Component {

    constructor(props){
        super(props);
        this.replyData = [];// init empty row data
        this.questionCount = 0;
        this.pageNo = 1;// 页数
        this.pageSize = this.props.pageSize;// 每页记录数
        this.startIndex = (this.pageNo - 1) * this.pageSize + 1;
        this.completeTips = this.props.completeTips||"感谢您参与此次问卷调查";
        this.state = {
            questionList : [],
            questionnaireId: this.props.questionnaireId,
            lastPage: false,
            percent: 0,
        }
    }

    componentWillMount() {
        // 查询题目总数后，查询题目
        this._getTotalCount();
        // this._getData();
    }

    // 查询题目列表
    _getData(pageNo = 1){
        if(pageNo === 1){
            this.replyData = [];
            this.pageNo = 1;// 页数
            this.pageSize = this.props.pageSize;// 每页记录数
        }
        this.startIndex = (this.pageNo - 1) * this.pageSize + 1;
        let condition = {
            pageNo: pageNo,
            pageSize: this.pageSize,
            questionnaireId: this.props.questionnaireId,
        };

        // 获取题目列表
        Toast.loading("加载中...", 0);
        HttpUtil.get(AppUrl.URL_QUESTION_LIST, condition).then((json={})=>{
            Toast.hide();
            let list = json.bizVO || [];
            // console.log(json, list);
            // let options = this.state.questionList[0].options;

            this.setState({
                questionList: list,
                lastPage: pageNo * this.pageSize >= this.questionCount,
            })

        }).catch(err => {
            Toast.hide();
            Toast.info(err.message, 2);
        });

    }

    // 查询问卷题目总数
    _getTotalCount(){
        let condition = {
            questionnaireId: this.props.questionnaireId,
        };
        HttpUtil.get(AppUrl.URL_QUESTION_COUNT, condition).then((rstjson={})=>{
            let bizVO = rstjson.bizVO || [];
            // console.log(json, list);
            let percent = (this.replyData.length) * 100 / bizVO.questionCount;
            this.questionCount = bizVO.questionCount;
            this.setState({
                percent: percent===100?100:percent.toFixed(2),
            })

            this._getData();

        }).catch(err => Toast.info(err.message, 2));
    }

    // 提交答卷
    _onSubmit(){
        if(this.replyData.length !== this.questionCount){
            Toast.info("当前答题数据异常，请退出后重试");
        } else {
            Toast.loading("提交答卷...", 0);
            HttpUtil.post(AppUrl.URL_QUESTIONNAIRE_REPLY, this.replyData).then((json = {}) =>{
                Toast.hide();
                this._showResult();

            }).catch(err => {
                Toast.hide();
                this.completeTips = err.message || "答题失败，请重试";
                this._showResult('答题/投票失败','#f86e21','1px solid ddd','failure-title');
            });

        }

    }

    // 查询下一页题目
    _nextPage(){
        this._getData(++this.pageNo);
        this.scrollDiv.scrollTop = 0;
    }

    render(){

        return (
            <div>

                <div className="progress-container" style={{marginRight:'0.22rem',marginLeft:'0.28rem'}}>
                    <div className="show-info">
                        <div className="progress"><Progress percent={this.state.percent || 0} position="normal" /></div>
                        {/*<div aria-hidden="true">{(this.replyData.length) + "/" + this.questionCount }</div>*/}
                        <div className="percent" aria-hidden="true">{this.state.percent + "%"}</div>
                    </div>
                </div>
                <div className="overflow-scrolling" style={{height: document.documentElement.clientHeight - 80,overflowY : 'auto', backgroundColor:'#f5f5f5'}} ref={c => this.scrollDiv = c}>
                {this._renderQuestion()}
                    {
                        this.state.lastPage ? (
                            <List.Item style={{backgroundColor:'#f5f5f5'}}>
                                <Button type="primary" onClick={()=>this._onSubmit()} inline style={{ width:'100%' }} disabled={this.state.percent !== 100}>提交</Button>
                            </List.Item>
                        ):(
                            <List.Item style={{backgroundColor:'#f5f5f5'}}>
                                <Button type="primary" onClick={()=>this._nextPage()} inline style={{ width:'100%' }} disabled={this.replyData.length !== this.pageNo*this.pageSize}>继续</Button>
                            </List.Item>
                        )
                    }
                    <WhiteSpace size="xl" />
                </div>
            </div>
        )
    }

    /**
     * 渲染题目
     * @private
     */
    _renderQuestion(){
        if(this.state.questionList && this.state.questionList.length > 0){
            return(
                <div>
                    {
                        this.state.questionList.map((question, index) => (
                            <Question key={question.id} question={question} index={this.startIndex + index} changeAnswer={(reply) => this._changeAnswer(reply) } />
                        ))
                    }
                </div>
            )
        } else {
            return null;
        }
    }

    /**
     * 修改答题结果
     * @param replys
     * @private
     */
    _changeAnswer(reply){
        let questionId = null;

        // 先删除旧的答案
        if(reply && reply.questionId){
            questionId = reply.questionId;
            this.replyData = this.replyData.filter(item => item.questionId !== questionId);
        }

        // 答题内容不为空，则保存修改后的答案
        if(this._isAnswerNotEmpty(reply)){
            this.replyData.push(reply);
        }
        let percent = (this.replyData.length * 100) / this.questionCount;
        // console.log("before:" + percent);
        this.setState({
            percent: percent===100?100:percent.toFixed(2),
        })
        // console.log("after:" + this.state.percent);
        // console.log(this.replyData);
        //this.scrollDiv.reset();
        //this.scrollDiv.resize();
    }

    _isAnswerNotEmpty(reply){
        let result = false;
        let questionId = reply.questionId;
        if(questionId && reply.answers && reply.answers.length > 0 ){

            // 问答题可能输入“”的答案
            let answer = reply.answers[0];
            if(answer.optionId || answer.answer ){
                result = true;
            }
        }
        // console.log("result : " + result);
        return result;
    }

    _showResult(title='答题/投票成功', bgColor='#108ee9', border = '0px solid ddd',titleClass='success-title'){
        Modal.alert(
            <div className={titleClass} >{title}</div>,
            <div className="tips">{this.completeTips}</div>,
            [{
                text: '确定',
                onPress: () => {this.props.doReload()},
                style:{
                    WebkitTouchCallout: 'none',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    textDecoration: 'none',
                    outline: 'none',
                    color: '#fff',
                    margin: '0.3rem',
                    backgroundColor: bgColor,
                    border: border,
                    borderRadius: '0.1rem',
                    fontSize: '0.3rem',
                    height: '0.8rem',
                    lineHeight: '0.8rem',
                    display: 'block',
                    width: '90%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                },

            }]
        )
    }

}