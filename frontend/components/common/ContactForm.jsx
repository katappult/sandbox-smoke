import React from "react";
import style from "@/styles/pages/BackOfficeStyle.module.css";
import InputStyle from "@/components/common/InputStyle";

export default function ContactForm(props) {

    return <div className={style.billing_address_order}>

            <div className={style.adress_input}>
                <InputStyle title={'Raison Sociale'} inputName={'address1'}
                            maxLength={155}
                            required={true}/>
            </div>

            <div className={style.adress_input}>
                <InputStyle title={"Address"} inputName={'address2'}
                            maxLength={155}
                            required={true}/>
            </div>

            <div className={style.inputs_row_col3}>
                <InputStyle title={"City"} inputName={'city'}
                            maxLength={100}
                            required={true}/>
                <InputStyle title={"Postal Code"} inputName={'postalCode'}
                            maxLength={5}
                            required={true}/>
                <InputStyle title={"Country"} inputName={'country'}
                            maxLength={100}
                            required={true}/>
            </div>

            <div className={style.inputs_row_col2}>
                <div className={style.adress_input}>
                    <InputStyle title={"Email"} inputName={"contactEmail"}
                                maxLength={100}
                                email
                                required={true}/>
                </div>
                <div className={style.adress_input}>
                    <InputStyle title={"Phone"} inputName={"contactPhoneNumber"}
                                maxLength={15}
                                required={true}/>
                </div>
            </div>
        </div>

}
