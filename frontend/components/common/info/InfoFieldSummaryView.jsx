import s from "@/styles/pages/Info.module.css";
import Badge from "@/components/common/Badge";
import {LocationOnOutlined, PhoneOutlined} from "@mui/icons-material";
import React from "react";


export default function InfoFieldSummaryView({data}){

    const title = () => {
        return  <div className={s.hero_name}>
            {data.title || "—"}
        </div>
    }

    const status = () => {
        if(data.status) {
            return <Badge text={data.status} accent />
        }
    }

    const number = () => {
        if(data.number) {
            return <span className={s.hero_ref}>N°: {data.number}</span>
        }
    }

    const avatar = () => {
        if(data.avatar) {
            return <div className={s.hero_avatar}>{data.avatar.initials || "?"}</div>
        }
    }

    const contacts = () => {
        if(data.contacts){
            return <div className={s.hero_stats}>
                {data.contacts.mobile && (
                    <span className={s.stat_chip}>
                                        <PhoneOutlined style={{ fontSize: 12 }} />
                        {data.contacts.mobile}
                    </span>
                )}
                {data.contacts.ville && (
                    <span className={s.stat_chip}>
                        <LocationOnOutlined style={{ fontSize: 12 }} />
                        {data.contacts.ville}
                    </span>
                )}
            </div>
        }
    }

    return <>
        <div className={s.hero_card}>
            <div className={s.hero_left}>
                {title()}
                <div className={s.hero_badges}>
                    {status()}
                    {number()}
                </div>
                {contacts()}
            </div>
            {avatar()}
        </div>
    </>
}