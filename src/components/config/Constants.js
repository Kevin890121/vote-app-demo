/**
 *  2017/5/3.
 */
export const props = {

    /**
     * 是否企业号用户
     */
    getIsUser() {
        try {
            return window.getIsUser();
        } catch (e) {
            return null;
        }
    },

    /**
     * 是否可查看问卷详情
     * @returns {*}
     */
    getCanRead(){
        try {
            return window.getCanRead();
        } catch (e) {
            return null;
        }
    },

    /**
     * 问卷编号
     * @returns {*}
     */
    getId(){
        try {
            return window.getId();
        } catch (e) {
            return null;
        }
    },
}

export const typeRadio = '1';// 单选

export const typeCheckbox = '2';// 多选

export const typeEssay = '3';// 问答

export const _false = '0';// 否

export const _true = '1';// 是

/**
 * 问卷已关闭
 * @type {string}
 */
export const QUESTIONNAIRE_STATUS_ClOSED = "9";

/**
 * 问卷进行中
 * @type {string}
 */
export const QUESTIONNAIRE_STATUS_START = "7";

/**
 * 问卷已结束
 * @type {string}
 */
export const QUESTIONNAIRE_STATUS_FINISHED = "8";

/**
 * 可见
 * @type {string}
 */
export const VISIBLE = "1";

/**
 * 匿名
 * @type {string}
 */
export const ANONYMOUS = "1";

/**
 * 获取状态描述
 * @type {{getDesc: ((statusValue))}}
 */
export const status = {
    getDesc(statusValue){
        if(QUESTIONNAIRE_STATUS_START === statusValue){
            return "进行中";
        } else if (QUESTIONNAIRE_STATUS_ClOSED === statusValue){
            return "已关闭";
        } else if (QUESTIONNAIRE_STATUS_FINISHED === statusValue){
            return "已结束";
        }
    },
};

export const TAG_PENDING = "未答";

export const TAG_FINISH = "已答";