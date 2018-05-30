/**
 * 2017/7/5.
 */

import React, {Component} from "react";
import {Checkbox, TextareaItem, Popup, Button, Toast} from "antd-mobile";
import * as AppUrl from './config/AppUrl';
import * as Constants from './config/Constants';
import QuestionHeader from "./QuestionHeader";
import '../css/Question.css';

/**
 * function
 * 用于判断(设定)每一个选项组件的选中状态
 *
 * @param ckDoCheck  选项组件状态：是否选中
 * @param maxChoice  问题组件状态：最大选择数
 * @param curCount   问题组件状态：选中选项总数
 * @param onChangVal 问题组件状态：正在操作的选项值
 * @param optVal     选项组件状态：选项值
 * @returns {boolean}
 */
function shouldChecked(ckDoCheck, maxChoice, curCount, onChangVal, optVal){
    let result = false;

    if(ckDoCheck === true){
        if ( onChangVal === optVal && maxChoice < curCount ){
            result = false;
        } else {
            result = true;
        }
    } else {
        result = false;
    }
    // console.log(optVal, onChangVal, "ckDoCheck:"+ ckDoCheck, "checked: " + result);
    return result;
}

/**
 * 图片URL转换
 * @param imgUrl
 * @returns {*}
 * @private
 */
function _chgImgUrl(imgUrl){
    if(imgUrl){
        imgUrl = AppUrl.SERVER_DOMAIN + imgUrl;
    }
    return imgUrl;
}

/**
 * 题目组件(单选题，多选题，问答题)
 * @type {string}
 */
let placehoder = "请在此输入...";
export default class Question extends Component {

    constructor(props){
        super(props);
        this.onChangVal=null;
        this.minChoice = this.props.question.minChoice || 1;
        let options =  this.props.question.options || [];
        this.maxChoice = this.props.question.maxChoice || options.length;
        this.multiSelected=[];
        this.index = this.props.index;
        this.state = {
            question: this.props.question,
            answer: placehoder,
            color: "#888",
            // borderColor:"#ddd",
            radioSelectedValue: null,
            ckSelectedCount:0,
            tag: Constants.TAG_PENDING,
        }
    }

    render(){
        let question = this.props.question;
        let options = question.options || [];
        let minChoice = this.minChoice;
        let maxChoice = this.maxChoice;
        // 单选
        if(Constants.typeRadio === question.type){
            // 使用文字类型的题目,文字类型的选项
            if(Constants._false === question.questionUseImg && Constants._false === question.optionUseImg){
                return (
                    <div className="question">
                            <QuestionHeader title={this._renderHeader(question.name, Constants.typeRadio)}
                                            type={Constants.typeRadio}
                                            tag={this.state.tag}/>
                            {
                                options.map((option) =>
                                    (
                                        <Checkbox.CheckboxItem key={option.id} checked={this.state.radioSelectedValue === option.id} onChange={() => this._radioOnChange(option.id)}>
                                            <span style={{wordBreak:'normal',display:'block',whiteSpace:'pre-wrap',overflow:'hidden',}}>{option.name}</span>
                                        </Checkbox.CheckboxItem>
                                    )
                                )
                            }

                    </div>
                )
            } else if (Constants._false === question.questionUseImg && Constants._true === question.optionUseImg) { // 使用文字类型的题目，图片类型选项
                return (
                    <div className="question">
                            <QuestionHeader title={this._renderHeader(question.name, Constants.typeRadio)}
                                            type={Constants.typeRadio}
                                            tag={this.state.tag} />
                            {
                                options.map((option) =>
                                    (
                                        <Checkbox.CheckboxItem key={option.id} checked={this.state.radioSelectedValue === option.id} onChange={() => this._radioOnChange(option.id)}>
                                            <img alt="图片选项" src={_chgImgUrl(option.imgUrl)} style={{width:'99%',height:'auto',border:'1px solid #999'}}/>
                                           <div style={{}}>
                                               <span style={{wordBreak:'normal',display:'block',whiteSpace:'pre-wrap',overflow:'hidden'}}>{option.imgDesc}</span>
                                           </div>
                                        </Checkbox.CheckboxItem>
                                    )
                                )
                            }

                    </div>
                )
            } else if (Constants._true === question.questionUseImg && Constants._false === question.optionUseImg) { // 使用图片类型的题目，文字类型选项
                return null
            } else { // 使用图片类型的题目,图片类型的选项
                return null
            }

        } else if (Constants.typeCheckbox === question.type){// 多选
            // 使用文字类型的题目,文字类型的选项
            if(Constants._false === question.questionUseImg && Constants._false === question.optionUseImg){
                return (
                    <div className="question">
                            <QuestionHeader title={this._renderHeader(question.name, Constants.typeCheckbox, minChoice, maxChoice, options.length)}
                                            type={Constants.typeCheckbox}
                                            tag={this.state.tag}/>

                            {
                                options.map((option) =>
                                    (
                                        <CheckBoxTxtOpt key={option.id}
                                                        option={option}
                                                        maxChoice={maxChoice}
                                                        onChg={(value,e) => this._ckOnChange(value,e)}
                                                        totalSelectedCount={this.state.ckSelectedCount}
                                                        onChangVal={this.onChangVal}
                                        />
                                    )
                                )
                            }

                    </div>
                )
            } else if (Constants._false === question.questionUseImg && Constants._true === question.optionUseImg) { // 使用文字类型的题目，图片类型选项
                return (
                    <div className="question">
                            <QuestionHeader title={this._renderHeader(question.name, Constants.typeCheckbox, minChoice, maxChoice, options.length)}
                                            type={Constants.typeCheckbox}
                                            tag={this.state.tag}/>
                            {
                                options.map((option) =>
                                    (
                                        <CheckBoxImgOpt key={option.id}
                                                        option={option}
                                                        maxChoice={maxChoice}
                                                        onChg={(value,e) => this._ckOnChange(value,e)}
                                                        totalSelectedCount={this.state.ckSelectedCount}
                                                        onChangVal={this.onChangVal}
                                        />
                                    )
                                )
                            }

                    </div>
                )
            } else if (Constants._true === question.questionUseImg && Constants._false === question.optionUseImg) { // 使用图片类型的题目，文字类型选项
                return null
            } else { // 使用图片类型的题目,图片类型的选项
                return null
            }


        } else if (Constants.typeEssay === question.type){// 问答
            // 使用文字类型的题目
            if(Constants._false === question.questionUseImg){
                return (
                    <div className="question">
                            <QuestionHeader title={this._renderHeader(question.name, Constants.typeEssay)}
                                            type={Constants.typeEssay}
                                            tag={this.state.tag}/>
                            <div style={{
                                    color: this.state.color,
                                    margin: "0.3rem",
                                    minHeight: '3rem',
                                    height: 'auto',
                                }}
                                 onClick={this._showPopupAnswer.bind(this)} >
                                <span style={{margin:'0.1rem',display:"block",wordBreak:'break-all',whiteSpace:'pre-wrap',overflow:'hidden',fontSize:'0.34rem',lineHeight:'0.51rem'}}>
                                    {this.state.answer}
                                </span>
                            </div>
                    </div>
                )
            } else {
                return null;
            }

        } else {
            return null;
        }
    }

    _pubAnswer = (answer) => {
        Popup.hide();
        let color = "#000";
        let presentAnswer = answer;
        if(answer === ''){
            presentAnswer = placehoder;
            color = "#888";
        }
        this.setState({
            // borderColor :"#ddd",
            answer: presentAnswer,
            color: color,
        })

        this._inputOnChange(answer);
        // this._getData();
        // this._scrollTop();
    }

    _onClose = ()=>{
        // this.setState({
        //     borderColor :"#ddd",
        // })
    }

    _showPopupAnswer() {
        // this.setState({
        //     borderColor :"#108ee9",
        //
        // })
        // console.log(this.essayDom);
        let value = this.state.answer;
        if(placehoder === value){
            value = "";
        }
        Popup.show(
            <PubAnswer answer={value}
                       questionName={this.state.question.name}
                       onClose={()=> Popup.hide()}
                       onChange={this._pubAnswer} />,
            {animationType: 'slide-up', maskClosable: true, zIndex: 1001, style: {zIndex: 1001}, onMaskClose:this._onClose}
        );
    }




    // 单选框change事件
    _radioOnChange(value){
        this.setState({
            radioSelectedValue:value,
            tag: Constants.TAG_FINISH,
        });
        let answers =[];
        let answer = {
            questionnaireId: this.state.question.questionnaireId,
            questionId: this.state.question.id,
            optionId: value,
            answer: null,
        };
        answers.push(answer);
        let reply = {
            questionnaireId: this.state.question.questionnaireId,
            questionId: this.state.question.id,
            answers: answers,
        };
        this.props.changeAnswer(reply);
    };

    /**
     * 复选框change事件
     * @param value
     * @param e
     * @private
     */
    _ckOnChange(value, e){
        // console.log(e.target.checked);
        let maxChoice = this.maxChoice;
        let minChoice = this.minChoice;
        let selectedCount = this.multiSelected.length;
        let tag = Constants.TAG_PENDING;
        // 记录选中状态的答案
        if(e.target.checked){
            if(this.multiSelected.length < maxChoice){
                this.multiSelected.push(value);
                selectedCount = this.multiSelected.length;
            } else {
                Toast.fail('最多选' + maxChoice + '项', 1.5);
                selectedCount = this.multiSelected.length + 1;
            }

        } else { // 删除未选中状态的答案
            this.multiSelected = this.multiSelected.filter(item=> item !== value);
            selectedCount = this.multiSelected.length;
        }

        let answers = [];
        if(minChoice<= this.multiSelected.length && this.multiSelected.length <= maxChoice) {
            this.multiSelected.forEach(item => {
                let answer = {
                    questionnaireId: this.state.question.questionnaireId,
                    questionId: this.state.question.id,
                    optionId: item,
                    answer: null,
                };
                answers.push(answer);
            })
            tag = Constants.TAG_FINISH;
        }
        this.onChangVal = value;
        this.setState({
            ckSelectedCount: selectedCount,
            tag:tag,
        });

        let reply = {
            questionnaireId: this.state.question.questionnaireId,
            questionId : this.state.question.id,
            answers: answers,
        };
        this.props.changeAnswer(reply);

    }

    /**
     * 问答change事件
     * @param value
     * @param e
     * @private
     */
    _inputOnChange(value){
        let tag = Constants.TAG_PENDING;
        let answers =[];
        let answer = {
            questionnaireId: this.state.question.questionnaireId,
            questionId: this.state.question.id,
            optionId: null,
            answer: value,
        };
        answers.push(answer);
        let reply = {
            questionnaireId: this.state.question.questionnaireId,
            questionId: this.state.question.id,
            answers: answers,
        };
        if(value !== ""){
            tag = Constants.TAG_FINISH;
        }
        this.setState({
            tag:tag,
        });
        this.props.changeAnswer(reply);
    }


    /**
     * 题目标题
     * @param title
     * @param type
     * @returns {string}
     * @private
     */
    _renderHeader(title, type, minChoice=1, maxChoice=1, totalOpt=0){
        if(Constants.typeRadio === type){
            return this.index + ". " + title;
        } else if (Constants.typeCheckbox === type) {
            let text = "";

            if(minChoice >= 1 && minChoice !== maxChoice && totalOpt >= maxChoice){
                text = "选" + minChoice + "~" + maxChoice + "项";
            } else if (minChoice >= 1 && minChoice === maxChoice && totalOpt >= maxChoice){
                text = "选" + minChoice + "项";
            } else {
                console.log("minChoice:" + minChoice, "maxChoice:" + maxChoice, "totalOpt:" + totalOpt);
            }

            if(text === ""){
                return this.index + ". " + title;
            } else {
                return this.index + ". " + title + "(" + text + ")";
            }
        } else {
            return this.index + ". " + title;
        }

    }
}

/**
 * 选项组件(多选文字型)
 */
class CheckBoxTxtOpt extends Component {

    constructor(props){
        super(props);
        this.state = {
            ckDoCheck:false,
        }
    }

    render(){

        // checked 判断逻辑在 onChange事件后,所以totalSelectedCount 的值始终是最新的值，而onChange里拿到的totalSelectedCount不是最新的值
        let ckDoCheck = this.state.ckDoCheck;
        let maxChoice = this.props.maxChoice;
        let totalSelectedCount = this.props.totalSelectedCount;
        let onChangVal = this.props.onChangVal;
        let optVal = this.props.option.id;
        return(
            <Checkbox.CheckboxItem checked={shouldChecked(ckDoCheck, maxChoice, totalSelectedCount, onChangVal, optVal)}
                                   onChange={this._onChange.bind(this, optVal)}
            >
                <span style={{wordBreak:'normal',display:'block',whiteSpace:'pre-wrap',overflow:'hidden',}}>{this.props.option.name}</span>
            </Checkbox.CheckboxItem>
        )
    }

    _onChange(value ,e){
        let maxChoice = this.props.maxChoice;
        let totalSelectedCount = this.props.totalSelectedCount;
        if(e.target.checked){
            // checked 判断逻辑在 onChange事件后,所以totalSelectedCount 的值始终是最新的值，而onChange里拿到的totalSelectedCount不是最新的值,所以这里要+1
            this.setState({
                ckDoCheck: shouldChecked(e.target.checked, maxChoice, totalSelectedCount+1, value, value),
            });
        } else {
            this.setState({
                ckDoCheck: false,
            });
        }

        // 调用父组件onchange事件
        this.props.onChg(value,e);
    }
}

/**
 * 选项组件(多选图片型)
 */
class CheckBoxImgOpt extends Component {

    constructor(props){
        super(props);
        this.state = {
            ckDoCheck:false,
        }
    }

    render() {
        // checked 判断逻辑在 onChange事件后,所以totalSelectedCount 的值始终是最新的值，而onChange里拿到的totalSelectedCount不是最新的值
        let ckDoCheck = this.state.ckDoCheck;
        let maxChoice = this.props.maxChoice;
        let totalSelectedCount = this.props.totalSelectedCount;
        let onChangVal = this.props.onChangVal;
        let optVal = this.props.option.id;

        return (
            <Checkbox.CheckboxItem checked={shouldChecked(ckDoCheck, maxChoice, totalSelectedCount, onChangVal, optVal)}
                                   onChange={this._onChange.bind(this, this.props.option.id)}
            >
                <img alt="图片选项" src={_chgImgUrl(this.props.option.imgUrl)} style={{width:'99%',height:'auto',border:'1px solid #999'}}/>
                <div style={{}}>
                    <span style={{wordBreak:'normal',display:'block',whiteSpace:'pre-wrap',overflow:'hidden'}}>{this.props.option.imgDesc}</span>
                </div>
            </Checkbox.CheckboxItem>
        )
    }

    _onChange(value ,e){
        let maxChoice = this.props.maxChoice;
        let totalSelectedCount = this.props.totalSelectedCount;
        if(e.target.checked){
            this.setState({
                ckDoCheck: shouldChecked(e.target.checked, maxChoice, totalSelectedCount+1, value, value),
            });
        } else {
            this.setState({
                ckDoCheck: false,
            });
        }

        // 调用父组件onchange事件
        this.props.onChg(value,e);
    }
}


/**
 * 问答题弹窗组件
 */
class PubAnswer extends Component {

    constructor(props){
        super(props);
        this.state = {
            answer:this.props.answer,
        }
    }

    _onFocus() {
        this.bfscrolltop = document.body.scrollTop;//获取软键盘唤起前浏览器滚动部分的高度
        this.interval = setInterval(function(){//设置一个计时器，时间设置与软键盘弹出所需时间相近
            document.body.scrollTop = document.body.scrollHeight;//获取焦点后将浏览器内所有内容高度赋给浏览器滚动部分高度
        },300);
    }

    _onBlur() {
        this.interval && clearInterval(this.interval);//清除计时器
        // document.body.scrollTop = this.bfscrolltop;//将软键盘唤起前的浏览器滚动部分高度重新赋给改变后的高度
    }

    _submit() {
       // this._onBlur();
        if (this.state.answer === '') {
            Toast.info('请输入观点/答案', 2);
            return;
        }

        if (!this.isIOS()) {
            this.timeout = setTimeout(() => {
                document.activeElement.blur();
                this.props.onChange(this.state.answer);// 提交答题
            }, 300)
        } else {
            document.activeElement.blur();
            this.props.onChange(this.state.answer);// 提交答题
        }
        // window.alert("submit & blur event");
    }

    // _clear(){
    //     this.setState({
    //         answer:'',
    //     })
    //     // this.props.onChange('');// 提交答题
    // }

    isIOS() {
        return !!window.navigator.appVersion.match(/(iphone|ipad|ipod)/gi);
    }

    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
        this.interval && clearInterval(this.interval);
    }


    render(){
        return (
            <div style={{padding: '0.2rem'}}>
                <TextareaItem
                    ref={c => this.textArea = c}
                    onFocus={this._onFocus.bind(this)}
                    onBlur={this._onBlur.bind(this)}
                    value={this.state.answer}
                    onChange={val => this.setState({answer: val})}
                    style={{border: '1px solid gainsboro', fontSize: '0.2rem', lineHeight: 1, paddingBottom:'0.2rem'}}
                    rows={4}
                    count={255}
                    placeholder={this.props.questionName}
                />
                <div style={{marginTop: '0.2rem', width: '100%'}}>
                    {/*<Button size="small" type="default" style={{width: '1.5rem',display:'inline-block'}}*/}
                            {/*onClick={this._clear.bind(this)}>清除</Button>*/}
                    <Button size="small" type="primary" style={{width: '1.5rem', float: 'right',display:'inline-block'}}
                            onClick={this._submit.bind(this)}>发表</Button>
                    <div style={{clear: 'both'}}></div>
                </div>
            </div>
        )
    }
}