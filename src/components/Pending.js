/**
 * Created by Administrator on 2017/4/14.
 */

import React, {Component} from 'react';
import '../css/Common.css';
import * as AppUrl from './config/AppUrl';
import QuestionnaireList from "./QuestionnaireList";

// 待参与列表
export default class Pending extends Component {

    render() {
        return(
            <QuestionnaireList url={AppUrl.URL_PENDING_LIST}/>
        )
    }
}




