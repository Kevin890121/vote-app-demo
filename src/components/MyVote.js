/**
 * Created by Administrator on 2017/4/14.
 */

import React, { Component } from 'react';

import '../css/Common.css';
import * as AppUrl from './config/AppUrl';
import QuestionnaireList from "./QuestionnaireList";

// 我发起的问卷
export default class MyVote extends Component {

    render() {
        return(
            <QuestionnaireList url={AppUrl.URL_MY_VOTE_LIST}/>
        )
    }
}