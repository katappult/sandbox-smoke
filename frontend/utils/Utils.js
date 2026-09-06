import moment from "moment";
import {serviceConfig} from "@/services/utils/service.config";
import {Checkbox, Form, Input, notification} from "antd";
import FormStyle from "@/styles/pages/Form.module.css";
import React from "react";
import dayjs from "dayjs";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

const REQUIRED = "Required";

export function responseSuccess(response) {
    return response && response.data && response.data.status === "SUCCESS";
}

// Check if value is not empty, return a null default value if empty
export const checkValueIfEmpty = (value = "", defaultValue = null) => {
    return value != null &&
    (typeof value !== "string" || value.trim() !== "") &&
    value.length !== 0
        ? value
        : defaultValue;
};

export const getDateFrom = (dateString) => {
    if (!dateString) return null;
    return moment(dateString);
};
export const isObjectEmpty = (obj) => {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};

export function getDateForInputDate(rawDate) {
    if (!rawDate) return null;
    return moment(rawDate).format("YYYY-MM-DD");
}

export function responseListSuccess(response) {
    return response && response.data && response.data.status === "SUCCESS" && response.data.dataList;
}

export function dateFromTimeStamp (timeStamp) {
    try{
        const date = new Date(timeStamp);
        return date;
    }catch (error){
        return "error";
    }
}

export function convertOldDate(dateTime){
    if(!dateTime) return "Invalid date";
    const dateObject = moment(dateTime, 'YYYY-MM-DD HH:mm:ss').toDate();
    return dateObject;
}

export function convertDate (dateTimeString) {
    if(!dateTimeString) return "Invalid date";
    const dateObject = moment(dateTimeString).toDate();
    return dateObject;
};

export function convertDateTimeToDate (dateTimeString) {
    const dateObject = convertDate(dateTimeString);
    if (isNaN(dateObject.getTime())) {
        return "Invalid Date";
    }

    return dateObject.toLocaleDateString();
};

export function convertDateTimeToDateWidthHours_and_Minute (dateTimeString) {
    if(!dateTimeString) return "";
    const dateObject = convertDate(dateTimeString);
    if (isNaN(dateObject.getTime())) {
        return "Invalid Date";
    }

    return moment(dateObject).format('DD/MM/YYYY HH:mm');
};

export function convertDateFromServerToStringDate(dateTimeString) {
    if(!dateTimeString) return "";
    const dateObject = convertDate(dateTimeString);
    if (isNaN(dateObject.getTime())) {
        return "Invalid Date";
    }

    return moment(dateObject).format('DD/MM/YYYY');
};

export function formatDate (dateObject, format) {
    return moment(dateObject).format(format);
};

export function getSortDefinitionOfTable(sort, columns){
    if(Array.isArray(sort)){
        return getSortDefinitionOfItems(sort, columns);
    }
    return getSortDefinitionOfItem(sort, columns);
}

export function getSortDefinitionOfItems(items, columns){
    let sort = "";
    if(items && items.length > 0){
        items.map(item => {
            const def = getSortDefinitionOfItem(item, columns);
            if(def){
                sort = sort + def + ",";
            }
        })
    }

    return sort;
}

export function getSortDefinitionOfItem(item){
    if(!item?.field) return "";

    const order =  item.order;
    const column = item.column.sorter?.column;
    if(order === "ascend") return "%2B" + column || "persistenceInfo.createDate" ;
    if(order === "descend") return "%2D" +  column || "persistenceInfo.createDate";
    return "";
}


export function convertToLiveDate (dateTimeString) {
    if(!dateTimeString) return "Invalid date";
    const dateObject = convertDate(dateTimeString);
    if (isNaN(dateObject.getTime())) {
        return "Invalid Date";
    }

    return moment(dateObject).format('DD MMM - HH:mm');
};

export function readParamValue(param){
    if(!param) return param;
    return param.replaceAll("_et_", "&");
}

export function encodeParamValue(param){
    return param.replaceAll("&", "_et_");
}

export function formateDateWithoutSpace (date) {
    return moment(date).format("YYYY-MM-DDTHH:mm:ss.SSSZZ");
};

export function convertDateShort (dateTimeString) {
    if(!dateTimeString) return "-";
    return moment(dateTimeString).format('DD/MM/YYYY');
};

export function toThumbFullURL (thumbURL, width) {
    if(!thumbURL) return "/";

    let finalURL = thumbURL;
    if(!thumbURL.startsWith("/")) {
        finalURL = "/" + thumbURL;
    }

    let resolvedURL = `${serviceConfig.API_ROOT}${finalURL}`;
    if (width && finalURL.includes("/core/api/pub/medias/")) {
        const separator = resolvedURL.includes("?") ? "&" : "?";
        resolvedURL = `${resolvedURL}${separator}w=${width}`;
    }
    return resolvedURL;
}


export function isTrue(value){
    if(!value) return false;
    if(value === true) return value;
    return value?.toLowerCase() === 'true' ;
}

export function getThumbnailPath(thumbedServiceResponse, index){
    if(thumbedServiceResponse && thumbedServiceResponse.attributes){
        const folder = thumbedServiceResponse.attributes.folder;
        const illustration = thumbedServiceResponse.attributes.illustration_path_1;
        return toThumbFullURL(`/${folder}/${illustration}`);
    }

    return "/#";
}

export function notificationSuccessUpdate(message){
    notification.success({
        message: message ?  message : "Element successfully updated",
        placement: 'bottomLeft',
        className: 'notification-success-bottom-left',
        duration:2.5
    })
}

export function notificationSuccessAdded(message){
    notification.success({
        message: message ?  message : "New Element added",
        placement: 'bottomLeft',
        className: 'notification-success-bottom-left',
        duration:2.5
    })
}

export function notificationSuccessAdd(message){
    notification.success({
        message: message ?  message : "Element successfully added",
        placement: 'bottomLeft',
        className: 'notification-success-bottom-left',
        duration:2.5
    })
}

export function notificationError(message){
    notification.error({
        message: message ? message : "Error processing the element",
        placement: 'bottomLeft',
        className: 'notification-error-bottom-left',
        duration:2.5
    })
}

export function notificationErrorDeleting(message){
    notification.error({
        message: message ? message : "Error deleting the item",
        placement: 'bottomLeft',
        className: 'notification-error-bottom-left',
        duration:2.5
    })
}

export function notificationSuccessDeleting(message){
    notification.success({
        message: message ? message : "Element successfully deleted",
        placement: 'bottomLeft',
        className: 'notification-success-bottom-left',
        duration:2.5
    })
}

export const getDateStringFrom =  (date) => {
    return dayjs(date).format("YYYY-MM-DDThh:mm:ss.SSSZZ")
}

export const renderFormItem = (name, label, required = true, type = "text", placeholder) => {
    if(type === "textarea") {
        return  <Form.Item name={name} label={label}>
            <Input.TextArea
                className={"form_input"}
                rows={4}
                placeholder={placeholder || "Ajouter vos descriptions ou commentaires…"}
            />
        </Form.Item>
    }

    return  <Form.Item name={name} label={label} rules={[{ required: required, message: REQUIRED }]}>
        <Input className={"form_input"} type={type} placeholder={placeholder || label} />
    </Form.Item>
};

export  const renderCheckBoxFormItem = (name, label, required = true, type = "text", placeholder = "") => (
    <Form.Item name={name} valuePropName="checked">
        <label className={FormStyle.checkbox_row}>
            <Checkbox />
            <div className={FormStyle.checkbox_info}>
                <span className={FormStyle.checkbox_label}>{label}</span>
                <span className={FormStyle.checkbox_desc}>Cochez cette case pour marquer l'élément</span>
            </div>
        </label>
    </Form.Item>
);

export function paginationItemRender(_, type, originalElement) {
    if (type === "prev") {
        return <ArrowBackOutlinedIcon style={{ fontSize: "1.25rem" }} />;
    }
    if (type === "next") {
        return <ArrowForwardOutlinedIcon style={{ fontSize: "1.25rem" }} />;
    }
    return originalElement;
}


export function batchImportForm(jobType) {
    let form = {};
    form['separator.char'] = '|';
    form['input.file.path'] = '';
    form['job.name'] = "standardBatchImport";
    form['job.type'] = jobType;
    form['domain'] = "/Application";
    form['container'] = "/Application";
    form['attach.discarded.file'] = false;
    form['attach.log.file'] = false;
    form['email.success.template.name'] = 'DEFAULT_LOADER_EMAIL_SUCCESS_TEMPLATE';
    form['email.error.template.name'] = 'DEFAULT_LOADER_EMAIL_ERROR_TEMPLATE';
    form['log.file.extension'] = '.log';
    form['comment.char'] = '#';
    form['notify.on.error'] = 'false';
    form['notify.on.success'] = 'false';
    form['mail.on.success'] = false;
    form['mail.on.error'] = false;

    return form;
}

export function batchExportForm(jobType, exportedFileName, scriptPath) {
    let form = {};
    form['separator.char'] = '|';
    form['input.file.path'] = '';
    form['job.name'] = "standardBatchExport";
    form['job.type'] = jobType;
    form['domain'] = "/Application";
    form['container'] = "/Application";
    form['attach.discarded.file'] = false;
    form['attach.log.file'] = false;
    form['email.success.template.name'] = 'DEFAULT_LOADER_EMAIL_SUCCESS_TEMPLATE';
    form['email.error.template.name'] = 'DEFAULT_LOADER_EMAIL_ERROR_TEMPLATE';
    form['log.file.extension'] = '.log';
    form['comment.char'] = '#';
    form['notify.on.error'] = 'false';
    form['notify.on.success'] = 'false';
    form['mail.on.success'] = false;
    form['mail.on.error'] = false;
    form["output.file.name"] = exportedFileName;
    form["export.command"] = "EXPORT_FOR_UPDATE";
    form["sql.script.content"] = scriptPath;

    return form;
}
