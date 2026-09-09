import React from "react";
import { Form, Input } from "antd";
import style from "@/styles/components/inputImage.module.css";
import { useTranslation } from "react-i18next";

export default function InputStyle({
                                       inputName,
                                       title,
                                       placeHolder,
                                       readOnly,
                                       type,
                                       onChange,
                                       required,
                                       maxLength,
                                   }) {
    const { t } = useTranslation();

    if(type === "number") {
        return (
            <div className={style.dropdown}>
                <Form.Item
                    name={inputName}
                    className={"ant_form_item_100vh"}
                    placeholder={placeHolder}
                    rules={[
                        {
                            required: required,
                            message: t("common.field_required"),
                        },
                    ]}
                    style={{ width: "100%", margin: 0 }}
                >
                    <Input
                        type={type}
                        readOnly={readOnly}
                        className={style.form__input}
                        placeholder={placeHolder}
                    />
                </Form.Item>
                <label htmlFor={inputName} className={style.form__label}>
                    {title}
                </label>
            </div>
        );
    }

    if(onChange) {
        return <div className={style.dropdown}>
            <Form.Item
                name={inputName}
                className={"ant_form_item_100vh"}
                placeholder={placeHolder}
                rules={[
                    {
                        required: required,
                        max: maxLength > 0 ? maxLength : null,
                        message: "This field is required",
                    },
                ]}
                style={{width: "100%", margin: 0}}
            >
                <Input
                    type={type}
                    onChange={onChange}
                    readOnly={readOnly}
                    className={style.form__input}
                    placeholder={placeHolder}
                />
            </Form.Item>
            <label htmlFor={inputName} className={style.form__label}>
                {title}
            </label>
        </div>
    }

    return (
        <div className={style.dropdown}>
            <Form.Item
                name={inputName}
                className={"ant_form_item_100vh"}
                placeholder={placeHolder}
                rules={[
                    {
                        required: required,
                        max: maxLength > 0 ? maxLength : null,
                        message: "This field is required",
                    },
                ]}
                style={{width: "100%", margin: 0}}
            >
                <Input
                    type={type}
                    readOnly={readOnly}
                    className={style.form__input}
                    placeholder={placeHolder}
                />
            </Form.Item>
            <label htmlFor={inputName} className={style.form__label}>
                {title}
            </label>
        </div>
    );
}
