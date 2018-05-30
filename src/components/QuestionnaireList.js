/**
 * Created by yangyi on 2017/8/28.
 */
import React, { Component } from 'react';
import { ListView, RefreshControl, Icon, Toast} from 'antd-mobile';

import '../css/Common.css';
import VoteSearch from "./VoteSearch";
import DetailPage from "./DetailPage";
import HttpUtil from './utils/HttpUtil';
import DateUtils from './utils/DateUtils';
import * as Constants from './config/Constants';

let pageNo = 1;
let pageSize = 10;

export default class QuestionnaireList extends Component {

    constructor(props) {
        super(props);
        this.requestUrl = this.props.url;
        this.rData = [];// init empty row data
        this.keywords = "";
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.state = {
            dataSource: dataSource.cloneWithRows({}),
            isLoading: true,
            refreshing: false,
            hasMore: true,
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
            pageNo:pageNo,
            pageSize:10,
            title:this.keywords,
        };
        Toast.loading("加载中...", 0);
        HttpUtil.get(this.requestUrl, condition).then((json={})=>{
            Toast.hide();
            let list = json.bizVO || [];
            // console.log(json, list);
            this.rData = this.rData.concat(list);// concat all rows
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false,
                refreshing:false,
                hasMore: !(list.length === 0 || list.length < pageSize),
            });
            this.loaded = true;

        }).catch(err => {
            Toast.hide();
            Toast.info(err.message, 2);
        });
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
            this._getData(++pageNo);
        }
    }

    onRefresh = () => {
        // console.log('onRefresh');
        if (!this.manuallyRefresh) {
            this.setState({ refreshing: true });
        } else {
            this.manuallyRefresh = false;
        }
        pageNo = 1;
        this._getData();
    };

    render() {
        const separator = (sectionID, rowID) => (
            <div key={`${sectionID}-${rowID}`}
                 style={{
                     margin:'0rem 0.2rem 0rem 0.2rem',
                     borderTop: '1px solid #ECECED',
                 }}
            />
        );

        const row = (rowData, sectionID, rowID) => {

            let color = rowData.status === Constants.QUESTIONNAIRE_STATUS_START ? '#ffffff' : '#999999';
            let bgColor = rowData.status === Constants.QUESTIONNAIRE_STATUS_START ? '#f7a90e':'#f2f2f2';

            return (
                <div key={rowID} className="row"
                     onClick={() => {
                         document.activeElement.blur();// 去除搜索框中的焦点
                         this.setState({showDetail: true, selectedId: rowData.id});
                     }}>

                    <div className="row-box">
                        <div className="row-left" style={{}}>
                            <img style={{width: '0.7rem', height: '0.7rem',borderRadius:'0.7rem',padding:'0.03rem',border:'1px solid #ddd',}} alt="icon"
                                 src={rowData.creator.photo || require("../img/default_user.png")}/>
                        </div>

                        <div className="row-body">
                            <div className="content" style={{ fontSize: '0.34rem',marginTop:'0.08rem'}}>
                                <span >{rowData.title}</span>
                            </div>

                            <div className="content" style={{fontSize: '0.26rem',color: '#888',paddingTop:'0.05rem'}}>
                                <span >{rowData.description}</span>
                            </div>
                        </div>

                        <div className="row-right">
                            <div className="content" style={{marginTop:'0.08rem'}}>
                                <span  style={{
                                    color: '#888',
                                    fontSize: '0.24rem'
                                }}>{DateUtils.format(rowData.deadline, 'yyyy/MM/dd')}</span>
                            </div>
                            <div className="content" style={{}}>
                                <span  style={{
                                    padding: '0.01rem 0.24rem',
                                    width: '100%',
                                    fontSize: '0.26rem',
                                    color: color,
                                    borderColor: bgColor,
                                    backgroundColor: bgColor,
                                    border: '1px solid',
                                    borderRadius:'0.08rem',
                                }}>{Constants.status.getDesc(rowData.status)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div>
                <VoteSearch doSearch={this._search}/>
                <ListView ref="lv"
                          dataSource={this.state.dataSource}
                          renderFooter={() => (<div style={{ padding: 20, textAlign: 'center' }}>
                              {this.state.isLoading ? '加载中...' : '加载完成'}
                          </div>)}
                          renderRow={row}
                          renderSeparator={separator}
                          className="am-list"
                          pageSize={3}
                          scrollRenderAheadDistance={500}
                          scrollEventThrottle={20}
                          style={{
                              height: document.documentElement.clientHeight-44,
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

                {this._renderDetail()}
            </div>
        );
    }

    //详情页面
    _renderDetail() {
        if (!this.state.showDetail) {
            return null;
        }
        return (
            <DetailPage back={()=>this.setState({showDetail: false})} id={this.state.selectedId}/>
        )
    }

    /**
     * 按照keywords查询问卷
     * @param keywords
     * @private
     */
    _search = (keywords="")=>{
        this.keywords=keywords;
        this._getData();
    }
}