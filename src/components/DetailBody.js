/**
 * 2017/6/29.
 */
import '../css/Common.css';
import React, {Component} from "react";
import {Toast, List, DatePicker, Button, Modal, WhiteSpace, Flex, ActionSheet} from "antd-mobile";
import HttpUtil from "./utils/HttpUtil";
import * as AppUrl from "./config/AppUrl";
import DateUtils from './utils/DateUtils';
import moment from 'moment';
import ReplyPage from "./ReplyPage";
import ResultPage from "./ResultPage";
import * as Constants from './config/Constants';

const CustomChildren = props => (
    <div
        onClick={props.onClick}
        className="am-list-item am-textarea-item"
    >
        <div className="am-textarea-label am-textarea-label-5" style={{fontSize:'0.3rem',color:'#888'}}>{props.children}</div>
        <div className="am-textarea-control" style={{fontSize:'0.3rem',color:props.color}}>{props.extra}</div>
    </div>
);

export default class DetailBody extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: {creator: {},participateCount:0,totalParticipantCount:0,questionCount:0,canReply:false,},
            showReply: false,
            showResult:false,
            status: null,
            date: null,
            notified: false,
            count: 60,
            btnText: "提醒未参与人",
            replied: false,
            pageSize: 1,
        }
    }


    componentWillMount() {
        // load data
        this._getData();
    }

    componentWillUnmount () {
        this.timer && clearInterval(this.timer);
    }

    render() {
        let height = document.documentElement.clientHeight;
        if(this.props.fromPush==="true"){

        } else {
            height = document.documentElement.clientHeight - 45;
        }

        let showReplyBtn = false;
        let replyBtnText = "开始答题/投票";
        // 进行中的问卷才允许答题,用户在此次问卷调查范围内，同时用户还未参与问卷
        if(this.state.status === Constants.QUESTIONNAIRE_STATUS_START && this.state.data.canReply && !this.state.replied ){
            showReplyBtn = true;
        // 问卷发起者不在问卷调查范围内，可以体验答题，但是答题无法成功提交
        } else if (this.state.status === Constants.QUESTIONNAIRE_STATUS_START && this.state.data.isAuthor && !this.state.data.canReply){
            showReplyBtn = true;
            replyBtnText = "体验答题/投票";
        }
        let disableViewResult = false;
        if(this.state.data.statisticsVisibility !== Constants.VISIBLE && !this.state.data.isAuthor){
            disableViewResult = true;
        }

        // 管理员btn
        let showAdminBtn = false;
        if(this.state.data.isAuthor && this.state.status === Constants.QUESTIONNAIRE_STATUS_START){
            showAdminBtn = true;
        }
        return (
            <div>
                <div style={{height: height, overflowY : 'auto', }} className="overflow-scrolling">
                    <List>
                        <div className="row-box" style={{padding:'0.3rem 0.2rem'}}>
                            <div className="row-left" style={{paddingLeft:'0.05rem'}}>
                                <img style={{width: '0.7rem', height: '0.7rem',borderRadius:'0.7rem',padding:'0.03rem',border:'1px solid #ddd',}} alt="icon"
                                     src={this.state.data.creator.photo || require("../img/default_user.png")}/>
                            </div>

                            <div className="row-body">
                                <div className="content" style={{ fontSize:'0.3rem',color:'#000'}}>
                                    <span >{this.state.data.creator.name}</span>
                                </div>

                                <div className="content" style={{fontSize:'0.3rem',color:'#888'}}>
                                    <span >{DateUtils.format(this.state.data.updateDate|| new Date(), 'yyyy-MM-dd')}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{marginLeft: '0.3rem', borderBottom: '1PX solid #ddd'}} />
                        <TextItem label="标题" value={this.state.data.title}/>
                        <TextItem label="描述" value={this.state.data.description}/>
                        <TextItem label="问卷类型" value={this.state.data.anonymousFlag !== Constants.ANONYMOUS ? "非匿名问卷" : "匿名问卷"}/>
                        <TextItem label="题目数量" value={this.state.data.questionCount}/>
                        <TextItem label="状态" value={Constants.status.getDesc(this.state.data.status)}/>
                        {this._renderDeadline()}
                        <div style={{marginLeft: '0.3rem', borderBottom: '1PX solid #ddd'}} />
                        {this._renderImg()}
                        <List.Item>
                            <Button className="btn detail-btn" style={{color:'#888'}}>目前参与人数 {this.state.data.participateCount+"/"+this.state.data.totalParticipantCount}</Button>
                        </List.Item>
                    </List>
                    <List.Item>
                        <Flex>
                            {
                                // 进行中的问卷才允许答题
                                showReplyBtn ? (
                                    <Flex.Item>
                                        <Button type="primary" className="detail-btn" onClick={this._showActionSheet}>{replyBtnText}</Button>
                                    </Flex.Item>
                                ):null
                            }
                            <Flex.Item>
                                <Button type="ghost" className="detail-btn" onClick={this._showResult.bind(this)} disabled={disableViewResult} >查看结果</Button>
                            </Flex.Item>
                        </Flex>

                    </List.Item>

                    {
                        // 进行中的问卷才允许关闭问卷
                        showAdminBtn ? (
                            <List.Item>
                                <Flex>
                                    <Flex.Item>
                                        <Button type="ghost" className="detail-btn" onClick={this._notify.bind(this)}
                                                disabled={this.state.notified}>{this.state.btnText || "提醒未参与人"}</Button>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <Button type="warning" className="detail-btn"
                                                onClick={() => Modal.alert('确定要关闭问卷吗？', <div></div>, [
                                                    {text: '取消', onPress: () => {}},
                                                    {text: '确定', onPress: () => this._closeQuestionnaire()}
                                                ])}
                                        >关闭问卷</Button>
                                    </Flex.Item>
                                </Flex>
                            </List.Item>

                        ):null
                    }
                    <WhiteSpace size="xl" style={{backgroundColor:'#fff'}}/>

                </div>
                {this._renderReply()}
                {this._renderResult()}
            </div>
        )

    }

    /**
     * 获取问卷详情
     */
    _getData() {

        Toast.loading("加载中...", 0);
        HttpUtil.get(AppUrl.URL_QUESTIONNAIRE_DETAIL + "?id=" + this.props.id).then((json = {}) => {
            Toast.hide();
            let detailData = json.bizVO || {creator: {}, deadline:moment().locale('zh-cn')};
            let deadline = detailData.deadline;
            if(!deadline ){
                deadline = moment().locale('zh-cn');
            } else {
            //    console.log(DateUtils.format(deadline, 'yyyy-MM-dd hh:mm'));
                deadline = moment(deadline).locale('zh-cn');
            }

            if(detailData.image !== '' && detailData.image != null){
                detailData.image = AppUrl.SERVER_DOMAIN + detailData.image;
            }

            // console.log(detailData);
            this.setState({
                data: detailData,
                date: deadline,
                status: detailData.status,
                replied: detailData.replied,
            });
        }).catch(err => {
            Toast.hide();
            Toast.info(err.message, 2)
        });
    }

    /**
     * 渲染截止时间
     * @returns {*}
     */
    _renderDeadline(){

        if(this.state.date === undefined){
            return null;
        }

        let color = this.state.data.isAuthor ? '#108ee9' : '#000';

        // console.log(this.state.date);
        return (
            <DatePicker
                mode="datetime"
                title="选择日期"
                extra="请选择"
                value={this.state.date}
                onChange={this.onChange}
                disabled={this.state.data.isAuthor?false:true}
            >
                <CustomChildren date={this.state.date} color={color}>截止时间</CustomChildren>
            </DatePicker>
        )
    }

    /**
     * 修改问卷截止时间
     * @param date
     */
    onChange = (date) => {
        let _data = this.state.data;
        _data.deadline = new Date(date._d).getTime();
        // 修改截止日期
        HttpUtil.post(AppUrl.URL_UPDATE_DEADLINE, _data).then((json = {}) => {
            Toast.info("已成功修改截止时间");
            this._getData();
        }).catch(err => Toast.info(err.message, 2));


    }

    /**
     * 答题方式按钮组
     * @private
     */
    _showActionSheet = () => {
        const BUTTONS = ['一页一题', '一页五题', '一页十题', '取消'];
        ActionSheet.showActionSheetWithOptions({
                options: BUTTONS,
                cancelButtonIndex: BUTTONS.length - 1,
                // title: '选择答题类型',
                // message: '',
                maskClosable: true,
                'data-seed': 'logId',
            },
            (buttonIndex) => {
                if(0 === buttonIndex){
                    this._chooseAnswerType(1);
                } else if (1 === buttonIndex){
                    this._chooseAnswerType(5);
                } else if (2 === buttonIndex){
                    this._chooseAnswerType(10);
                } else {

                }
            });
    }

    /**
     * 选择答题类型
     * @param pageSize
     * @private
     */
    _chooseAnswerType(pageSize=1){
        this.setState({
            showReply: true,
            pageSize: pageSize,
        });
    }

    /**
     * 渲染答题页
     */
    _renderReply(){
        if(!this.state.showReply){
            return null;
        } else {
            let completeTips = this.state.data.completeTips;
            return (
                <ReplyPage back={()=>this.setState({showReply: false})} questionnaireId={this.props.id} pageSize={this.state.pageSize} doReload={this._getData.bind(this)} completeTips={completeTips}/>
            )
        }

    }

    /**
     * 渲染结果页
     */
    _renderResult(){
        if(!this.state.showResult){
            return null;
        } else {
            return (
               <ResultPage back={()=>this.setState({showResult:false})} questionnaireId={this.props.id} questionnaireInfo={this.state.data}  />
            )
        }

    }

    /**
     * 查看答题结果
     */
    _showResult(pageSize=1){
        this.setState({
            showResult: true,
            pageSize: pageSize,
        });
    }

    /**
     * 提醒未答题用户
     */
    _notify(){
        // 还未推送提醒
        if(!this.state.notified){

            let questionnaireVO = this.state.data;
            Toast.loading("正在推送提醒...", 0);
            HttpUtil.post(AppUrl.URL_QUESTIONNAIRE_NOTIFY, questionnaireVO).then((json = {}) =>{
                Toast.hide();
                Toast.info("消息已推送");

                // 推送后开始倒计时
                this.timer = setInterval(()=> {
                    let count = this.state.count;
                    count -= 1;
                    if (count < 1) {
                        this.setState({
                            notified: false,
                            count: 60,
                            btnText:"提醒未参与人",
                        });
                        count = 60;
                        clearInterval(this.timer);
                    } else {
                        this.setState({
                            notified: true,
                            count: count,
                            btnText: count + "秒后可再提醒",
                        });
                    }

                }, 1000);

            }).catch(err => {
                Toast.hide();
                Toast.info(err.message, 2);
            });
        }

    }

    /**
     * 关闭问卷
     */
    _closeQuestionnaire(){
        let questionnaireVO = this.state.data;
        // console.log(questionnaireVO);
        Toast.loading("关闭问卷...", 0);
        HttpUtil.post(AppUrl.URL_QUESTIONNAIRE_CLOSE, questionnaireVO).then((json = {}) =>{
            Toast.hide();
            questionnaireVO.status = Constants.QUESTIONNAIRE_STATUS_ClOSED;
            Toast.info("问卷已关闭");
            this.setState({
                status: Constants.QUESTIONNAIRE_STATUS_ClOSED,
                data: questionnaireVO,
            })
        }).catch(err => {
            Toast.hide();
            Toast.info(err.message, 2)
        });
    }

    /**
     * 问卷封面图片
     * @returns {*}
     * @private
     */
    _renderImg(){
        if(this.state.data.image) {
            return (
                <div style={{margin: '0.2rem 0.3rem', }}>
                    <img style={{width:'100%',height:'auto',border: '#999 1px solid'}} src={this.state.data.image} alt="icon"/>
                </div>
            )
        } else {
            return null
        }
    }
}


/**
 * 详情item组件
 */
class TextItem extends Component {

    render(){
        return (
            <div className="am-list-item am-textarea-item">
                <div className="am-textarea-label am-textarea-label-5" style={{fontSize:'0.3rem',color:'#888'}}>{this.props.label}</div>
                <div className="am-textarea-control">
                    <span style={{wordBreak:'normal',display:'block',whiteSpace:'pre-wrap',overflow:'hidden',fontSize:'0.3rem',color:'#000',}}>{this.props.value}</span>
                </div>
            </div>
        )
    }
}