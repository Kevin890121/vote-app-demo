/**
 * Created by Administrator on 2017/4/14.
 */

import React, { Component } from 'react';
import * as AppUrl from './config/AppUrl';
import QuestionnaireList from "./QuestionnaireList";

// 已参与问卷
export default class Voted extends Component {
    render() {
        return(
            <QuestionnaireList url={AppUrl.URL_VOTED_LIST}/>
        )
    }
}