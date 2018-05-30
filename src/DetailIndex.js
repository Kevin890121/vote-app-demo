/**
 * 2017/7/17.
 */
import React, {Component} from "react";
import * as Constants from './components/config/Constants';
import DetailBody from './components/DetailBody';


export default class DetailIndex extends Component {

    render() {
        if (Constants.props.getCanRead() === 'true') {
            return (
                <div>
                    <DetailBody id={Constants.props.getId()} fromPush="true"/>
                </div>

            )
        } else {
            return (
                <div >
                    <div style={{fontSize:'0.35rem',color:'#888',position: 'absolute', top: '50%',left:'50%',marginLeft:-70, marginTop: -10,}}>您无权查看该页面</div>
                </div>
            )
        }
    }
}