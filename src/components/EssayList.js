/**
 * 2017/7/13.
 */
import React, { Component } from 'react';
import { ListView, RefreshControl, Icon, Toast, NavBar} from 'antd-mobile';
import HttpUtil from './utils/HttpUtil';
import * as AppUrl from './config/AppUrl';
import DateUtils from './utils/DateUtils';
import '../css/Common.css';

export default class EssayList extends Component {

    constructor(props) {
        super(props);
        this.rData = [];// init empty row data
        this.pageNo = 1;
        this.pageSize = 10;
        this.questionId = this.props.questionId;
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
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            questionId: this.props.questionId,
        };
        Toast.loading("加载中...", 0);
        HttpUtil.get(AppUrl.URL_ESSAY_LIST, condition).then((json={})=>{
            Toast.hide();
            let list = json.bizVO || [];
            // console.log(json, list);
            this.rData = this.rData.concat(list);// concat all rows
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false,
                refreshing:false,
                hasMore: !(list.length === 0 || list.length < this.pageSize),
            });
            this.loaded = true;

        }).catch(err => {
            Toast.hide();
            Toast.info(err.message, 2)
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
                     // borderTop: '1px solid #ECECED',
                 }}
            />
        );
        const row = (rowData, sectionID, rowID) => {
            return (
                <div key={rowID} className="row">
                    <div key={rowData.id} className="essay-item-box" style={{padding:'0.3rem 0rem',margin:'0rem 0.3rem',color:'#888',borderBottom:'1px solid #ddd',}}>
                        <div className="essay-item-left">
                            <img style={{width: '0.6rem', height: '0.6rem',borderRadius:'0.6rem',padding:'0.02rem',border:'1px solid #ddd',}} src={rowData.user.photo || require("../img/default_user.png")} alt="icon" />
                        </div>
                        <div className="essay-item-content">
                            <div style={{fontSize:'0.3rem', color:'#308ee8',}}>{rowData.user.name || '匿名'}</div>
                            <div style={{fontSize:'0.24rem', color:'grey',marginLeft:'0.04rem',padding:'0.05rem 0rem 0rem 0rem'}}>{DateUtils.format(rowData.createDate, 'yyyy-MM-dd hh:mm')}</div>
                            <div style={{fontSize:'0.3rem', wordBreak:'break-all',padding:'0.05rem 0rem',lineHeight:'0.4rem',color:'#000'}}>
                                {rowData.answer}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };
        return (
            <div className="detail-main">
                <NavBar leftContent="返回"
                        mode="dark"
                        onLeftClick={() => this.props.onclose()}
                >问答详情</NavBar>
                <ListView ref="lv"
                          dataSource={this.state.dataSource}
                          renderFooter={() => (<div style={{ padding: 20, textAlign: 'center' }}>
                              {this.state.isLoading ? '加载中...' : '加载完成'}
                          </div>)}
                          renderRow={row}
                          renderSeparator={separator}
                          className="am-list"
                          pageSize={10}
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
            </div>
        );
    }
}