/**
 * 2017/7/10.
 */
import React, {Component} from "react";
import { ListView, RefreshControl, Icon, Toast, Progress} from 'antd-mobile';

// 引入 ECharts 主模块
// import echarts from 'echarts/lib/echarts';
// 引入饼图
// import 'echarts/lib/chart/pie';
// 引入提示框
// import 'echarts/lib/component/tooltip';
// 引入标题组件
// import 'echarts/lib/component/title';

import HttpUtil from './utils/HttpUtil';
import DateUtils from './utils/DateUtils';
import * as AppUrl from './config/AppUrl';
import * as Constants from './config/Constants';
import EssayList from './EssayList';
import QuestionHeader from "./QuestionHeader";
import '../css/ResultBody.css';

/**
 * 题目标题
 * @param title
 * @param type
 * @returns {string}
 * @private
 */
function _renderHeader(index, title, type){
    // if(Constants.typeRadio === type){
    //     return index + ". " + title + "(单选)";
    // } else if (Constants.typeCheckbox === type){
    //     return index + ". " + title + "(多选)";
    // } else {
    //     return index + ". " + title + "(问答)";
    // }
    return index + ". " + title;
}

/**
 * 根据选项信息判断是否该用饼图展示
 * @param optionResultList
 * @private
 */
function _checkCanUsePie(optionResultList){
    let result = true;
    // 选项超过8个
    if(optionResultList && optionResultList.length >= 8){
        result = false;
    }

    // 选项描述字数超过10
    if(optionResultList && optionResultList.length > 0){

        for(let i in optionResultList){
            if(optionResultList[i].name !== null && optionResultList[i].name.length >16){
                result = false;
                break;
            }
        }
    }

    return result;
}

function _countPercent(count, totalCount){
    let percent = 0;
    if(totalCount !== 0 && !isNaN(totalCount)){
        percent = (count * 100/ totalCount);
    }
    return percent === 100?percent:percent.toFixed(2);
}


export default class ResultBody extends Component {

    constructor(props){
        super(props);
        this.pageNo = 1;
        this.pageSize = 2;
        this.questionId="";
        this.questionName = "";
        this.questionnaireInfo = this.props.questionnaireInfo;
        this.rData = [];// init empty row data
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            dataSource: dataSource.cloneWithRows({}),
            isLoading: true,
            refreshing: false,
            hasMore: true,
            showEssay: false,
        };
    }

    componentWillMount() {
        // load data
        this._getData();
    }

    _getData(pageNo = 1){
        if(pageNo === 1){
            this.rData = [];
        }

        let condition = {
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            questionnaireId: this.props.questionnaireId,
        };

        HttpUtil.get(AppUrl.URL_QUESTIONNAIRE_RESULT, condition).then((json={})=>{
            let list = json.bizVO || [];
            // console.log(json, list);
            this.rData = this.rData.concat(list);// concat all rows
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false,
                refreshing: false,
                hasMore: !(list.length === 0 || list.length < this.pageSize),
            });
            this.loaded = true;

        }).catch(err => Toast.info(err.message, 2));
    }

    onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if ( !this.state.hasMore) {
            return;
        }
        // console.log('reach end', event);
        this.setState({ isLoading: true });
        if(this.loaded){
            this.loaded = false;
            this._getData(++this.pageNo);
        }
    }

    onRefresh = () => {
        // console.log('onRefresh');
        if (!this.manuallyRefresh) {
            this.setState({ refreshing: true });
        } else {
            this.manuallyRefresh = false;
        }
        this.pageNo = 1;
        this._getData();
    };

    render() {
        const separator = (sectionID, rowID) => (
            <div key={`${sectionID}-${rowID}`}
                 style={{
                     backgroundColor: '#eef1f5',
                     height: '0.24rem',
                 }}
            />
        );

        const row = (rowData, sectionID, rowID) => {
            let index = Number(rowID) + 1;

            if(rowData.type === Constants.typeEssay){ // 问答题
                // console.log(rowData);
                // console.log(rowData.essayResultList);
                return (
                    <div key={rowID} className="row">
                        <EssayResult data={rowData} index={index} showEssayList={this.showEssayList}/>
                    </div>
                );
            } else { // 单选及多选
                if(rowData.optionUseImg === Constants._true){ // 图片型选项
                    return (
                        <div key={rowID} className="row" >
                            <OptionImgResult data={rowData} index={index}/>
                        </div>
                    );

                } else { // 文字型选项
                    // 如果选项文字过长则不采用饼图展示，效果不佳
                    // 如果选项数过多不采用饼图展示，效果不佳
                    // if(_checkCanUsePie(rowData.optionResultList)){
                    //     return (
                    //         <div key={rowID} className="row"  >
                    //             <OptionPieResult data={rowData} index={index}/>
                    //         </div>
                    //     );
                    // } else {
                        return (
                            <div key={rowID} className="row"  >
                                <OptionTextResult data={rowData} index={index}/>
                            </div>
                        );

                    // }
                }

            }
        };

        return (
            <div>
                <ListView ref="lv"
                          dataSource={this.state.dataSource}
                          renderFooter={() => (<div style={{ padding: 20, textAlign: 'center' }}>
                              {this.state.isLoading ? '加载中...' : '加载完成'}
                          </div>)}
                          renderRow={row}
                          renderSeparator={separator}
                          className="am-list"
                          pageSize={2}
                          scrollRenderAheadDistance={500}
                          scrollEventThrottle={20}
                          style={{
                              height: document.documentElement.clientHeight-45,
                              overflow: 'auto',
                          }}
                          onEndReached={this.onEndReached}
                          onEndReachedThreshold={10}
                          refreshControl={<RefreshControl
                              refreshing={this.state.refreshing}
                              onRefresh={this.onRefresh}
                              icon={[
                                  <div key="0" className="am-refresh-control-pull">
                                      <span>下拉可以刷新</span>
                                  </div>,
                                  <div key="1" className="am-refresh-control-release">
                                      <span>松开立即刷新</span>
                                  </div>,
                              ]}
                              loading={ <Icon type="loading" />}
                          />}
                />
                {this._renderEssayList()}
            </div>
        );
    }

    showEssayList=(qId, qName)=>{
        this.setState({showEssay:true});
        this.questionId = qId;
        this.questionName = qName;
    }

    _renderEssayList(){
        if(this.state.showEssay){
            return (
                <EssayList onclose={()=>this.setState({showEssay:false})} questionId={this.questionId} title={this.questionName}/>)
        } else {
            return null;
        }
    }
}

/**
 * 饼图结果组件(文字型选项)
 */
// class OptionPieResult extends Component {
//
//     render(){
//         let domId = 'chartId' + this.props.data.id;
//         return (
//
//             <div style={{ width :'100%'}}>
//                 <List>
//                     <QuestionHeader title={_renderHeader(this.props.index, this.props.data.name, this.props.data.type)}/>
//                     <div id={domId} style={{height:320, width :'100%'}}></div>
//                 </List>
//             </div>
//         )
//     }
//
//     componentDidMount() {
//         let domId = 'chartId' + this.props.data.id;
//         // 基于准备好的dom，初始化echarts实例
//         let myChart = echarts.init(document.getElementById(domId));
//         // 绘制图表
//         let data = [];
//         if(this.props.data.optionResultList && this.props.data.optionResultList.length >0){
//             this.props.data.optionResultList.forEach((item)=>{
//                 data.push({value:item.count, name:item.name});
//             });
//         }
//
//         let option = {
//             tooltip: {
//                 trigger: 'item',
//                 formatter: (a)=>{
//                     let formatter = "";
//                     if(a.name.length > 8){
//                         formatter = a.name.substr(0,8)+"<br/>"+a.name.slice(8)+"<br/>"+"已选择:"+a.value+"</br>占比:"+a.percent+"%";
//                     } else {
//                         formatter = a.name+"<br/>"+"已选择:"+a.value+"</br>占比:"+a.percent+"%";
//                     }
//
//                     return formatter;
//                     // return "{a} <br/>{b} : {c} ({d}%)";
//                 }
//                 // formatter: "{a} <br/>{b} : {c} ({d}%)"
//             },
//
//             series : [
//                 {
//                     name: '占比',
//                     type: 'pie',
//                     radius : '55%',
//                     center: ['50%', '50%'],
//                     data: data.sort(function(a,b){return a.value - b.value;})
//                 }
//             ]
//         };
//
//         myChart.setOption(option);
//     }
//
// }


/**
 * 选择题结果组件(文字型选项)
 */
class OptionTextResult extends Component {

    render(){
        return (

            <div>
                {/*<List>*/}
                    <QuestionHeader title={_renderHeader(this.props.index, this.props.data.name, this.props.data.type)}
                                    type={this.props.data.type}
                    />

                    {
                        this.props.data.optionResultList && this.props.data.optionResultList.length > 0 ? this.props.data.optionResultList.map((option) =>
                            (
                                <div key={option.id} style={{padding:'0.3rem',}}>
                                    <span style={{wordBreak:'normal',display:'block',whiteSpace:'pre-wrap',overflow:'hidden',}}>{option.name}</span>
                                    <div className="progress-container">
                                        <div className="static-info" style={{marginTop:'0rem',}}>
                                            <div className="progress"><Progress percent={_countPercent(option.count, this.props.data.count) || 0} position="normal" /></div>
                                            <div className="percent" aria-hidden="true">{_countPercent(option.count, this.props.data.count) + "%"}</div>
                                        </div>
                                    </div>
                                    <div className="participate-box">
                                        <div className="participate-img">
                                            <img style={{width:'0.3rem',paddingRight:'0.1rem'}} alt="icon"
                                                 src={require("../img/participant.png")}/>
                                        </div>
                                        <div className="participate-text" style={{fontSize:'0.26rem',color:'#9f9f9f',}}>
                                            <span style={{color:'#fe684a',fontSize:'0.28rem'}}>{option.count}</span>位选择
                                        </div>
                                    </div>
                                </div>
                            )
                        ):(
                            <div style={{width:'100%',height:'3rem',textAlign:'center'}}><div style={{paddingTop:'1.3rem',color:'#888'}}>暂无数据</div></div>
                        )
                    }
                {/*</List>*/}
            </div>
        )
    }


}



/**
 * 选择题结果组件(图片型选项)
 */
class OptionImgResult extends Component {

    render(){
        return (

            <div>
                {/*<List>*/}
                    <QuestionHeader title={_renderHeader(this.props.index, this.props.data.name, this.props.data.type)}
                                    type={this.props.data.type}/>
                    {
                        this.props.data.optionResultList.map((option) =>
                            (
                                <div key={option.id} style={{padding:'0.3rem',color:'#888'}}>
                                    <img alt="图片选项" src={this._chgImgUrl(option.imgUrl)} style={{width:'100%',height:'auto',border:'1px solid #999'}}/>
                                    <div style={{color:'#000'}}>
                                        <span style={{wordBreak:'normal',display:'block',whiteSpace:'pre-wrap',overflow:'hidden'}}>{option.imgDesc}</span>
                                    </div>
                                    <div className="progress-container">
                                        <div className="static-info" style={{marginTop:'0rem',}}>
                                            <div className="progress"><Progress percent={_countPercent(option.count, this.props.data.count) || 0} position="normal" /></div>
                                            <div className="percent" aria-hidden="true">{_countPercent(option.count, this.props.data.count) + "%"}</div>
                                        </div>
                                    </div>
                                    <div className="participate-box">
                                        <div className="participate-img">
                                            <img style={{width:'0.3rem',paddingRight:'0.1rem'}} alt="icon"
                                                 src={require("../img/participant.png")}/>
                                        </div>
                                        <div className="participate-text" style={{fontSize:'0.26rem',color:'#9f9f9f',}}>
                                            <span style={{color:'#fe684a',fontSize:'0.28rem'}}>{option.count}</span>位选择
                                        </div>
                                    </div>
                                </div>
                            )
                        )
                    }
                {/*</List>*/}
            </div>
        )
    }

    _chgImgUrl(imgUrl){
        if(imgUrl){
            imgUrl = AppUrl.SERVER_DOMAIN + imgUrl ;
        }
        return imgUrl;
    }

}


/**
 * 问答题结果组件
 */
class EssayResult extends Component {

    render(){
        return (

            <div>
                    <QuestionHeader title={_renderHeader(this.props.index, this.props.data.name, this.props.data.type)}
                                    type={this.props.data.type}
                    />
                    {
                        this.props.data.essayResultList && this.props.data.essayResultList.length > 0 ? this.props.data.essayResultList.map(item =>(
                            <div key={item.id} className="essay-item-box" style={{padding:'0.3rem 0rem',margin:'0rem 0.3rem',color:'#888',}}>
                                <div className="essay-item-left">
                                    <img style={{width: '0.6rem', height: '0.6rem',borderRadius:'0.6rem',padding:'0.02rem',border:'1px solid #ddd',}} src={item.user.photo || require("../img/default_user.png")} alt="icon" />
                                </div>
                                <div className="essay-item-content">
                                    <div style={{fontSize:'0.3rem', color:'#308ee8',}}>{item.user.name || '匿名'}</div>
                                    <div style={{fontSize:'0.24rem', color:'grey',marginLeft:'0.02rem',padding:'0.05rem 0rem 0rem 0rem'}}>{DateUtils.format(item.createDate, 'yyyy-MM-dd hh:mm')}</div>
                                    <div style={{fontSize:'0.3rem', wordBreak:'break-all',padding:'0.05rem 0rem',lineHeight:'0.4rem',color:'#000'}}>
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        )):(
                            <div style={{width:'100%',height:'3rem',textAlign:'center'}}><div style={{paddingTop:'1.3rem',color:'#888'}}>暂无数据</div></div>
                        )
                    }
                    {
                        this.props.data.essayResultList && this.props.data.count > this.props.data.essayResultList.length ? (
                            <div style={{textAlign:'center', padding:'0.3rem'}} onClick={()=>this.props.showEssayList(this.props.data.id, _renderHeader(this.props.index, this.props.data.name, this.props.data.type))}>显示更多...</div>
                        ) : null
                    }

            </div>
        )
    }

}

