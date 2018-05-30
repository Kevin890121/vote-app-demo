import React, {Component} from 'react';
import {SearchBar,} from 'antd-mobile';

// import '../css/Common.css';
// import * as Constants from './config/Constants';



/**
 * Created by yangyi on 2017/6/28.
 */
export default class VoteSearch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: "",
            visible: false,
            selected: '',
        };
    }

    render() {

        return (

            <div>
                    <div style={{width:'100%'}}>
                        <SearchBar
                            value={this.state.value}
                            placeholder="搜索"
                            onSubmit={value => {
                                document.activeElement.blur();
                                this.props.doSearch(value);
                            }}
                            onClear={value => {
                                document.activeElement.blur();
                                this.props.doSearch();
                            }}
                            onCancel={() => {
                                this.props.doSearch();
                                document.activeElement.blur();
                                this.setState({
                                    value: "",
                                });
                            }}
                            onChange={value => this._onChange(value)}
                        />
                    </div>
            </div>

        );
    }

    _onChange(value) {
        this.setState({
            value: value,
        })
    }


}