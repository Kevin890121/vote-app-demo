/**
 * Created by Administrator on 2017/4/28.
 */
// const env = 'local';
const env = 'test';
// const env = 'prod';

var server_host = 'http://127.0.0.1:8080/projectName';
var server_domain = 'http://127.0.0.1:8080';
if(env === 'local'){
    server_host = 'local_host';
    server_domain = 'local_domain';
}else if (env === 'test') {
    server_host = 'http://testaddr:8080/projectName';
    server_domain = 'http://testaddr:8080';
} else if (env === 'prod') {
    server_host = 'http://productEnv:8080/projectName';
    server_domain = 'http://productEnv:8080';
}

export const CORS = true;
export const CorpId = "";
export const SERVER_DOMAIN = server_domain;
export const SERVER_HOST = server_host;
/**
 * 获取access_token
 * @type {string}
 */
export const URL_GET_ACCESS_TOKE = server_host + "/web/app/jsdk/getAccessToken";

/**
 * 获取jsapi_ticket
 * @type {string}
 */
export const URL_GET_JSAPI_TICKET = server_host + "/web/app/jsdk/getJsApiTicket";

/**
 * 获取数据字典
 * @type {string}
 */
export const URL_DICT_LIST = server_host + "/web/utils/getDictList";


/**
 * 获取待投票列表
 * @type {string}
 */
export const URL_PENDING_LIST = server_host + "/wx/vote/questionnaire/pendingList";

/**
 * 获取待投票列表
 * @type {string}
 */
export const URL_VOTED_LIST = server_host + "/wx/vote/questionnaire/votedList";

/**
 * 获取待投票列表
 * @type {string}
 */
export const URL_MY_VOTE_LIST = server_host + "/wx/vote/questionnaire/myVoteList";

/**
 * 获取问卷详情
 * @type {string}
 */
export const URL_QUESTIONNAIRE_DETAIL = server_host + "/wx/vote/questionnaire/detail";


/**
 * 修改截止日期
 * @type {string}
 */
export const URL_UPDATE_DEADLINE = server_host + "/wx/vote/questionnaire/updateDeadline";

/**
 * 提醒未参与人
 * @type {string}
 */
export const URL_QUESTIONNAIRE_NOTIFY = server_host + "/wx/vote/questionnaire/notify";

/**
 * 关闭问卷
 * @type {string}
 */
export const URL_QUESTIONNAIRE_CLOSE = server_host + "/wx/vote/questionnaire/close";

/**
 * 查询问卷题目总数
 * @type {string}
 */
export const URL_QUESTION_COUNT = server_host + "/wx/vote/questionnaire/questionCount";

/**
 * 查询题目列表
 * @type {string}
 */
export const URL_QUESTION_LIST = server_host + "/wx/vote/question/list";

/**
 * 保存问卷答题/投票
 * @type {string}
 */
export const URL_QUESTIONNAIRE_REPLY = server_host + "/wx/vote/reply/save";

/**
 * 查询问卷答题/投票列表
 * @type {string}
 */
export const URL_QUESTIONNAIRE_RESULT = server_host + "/wx/vote/result/list";

/**
 * 查询问答题答题列表
 * @type {string}
 */
export const URL_ESSAY_LIST = server_host + "/wx/vote/result/essayList";