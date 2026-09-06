import BackOfficeStyle from "@/styles/pages/BackOfficeStyle.module.css";
import { toThumbFullURL } from "@/utils";
import React from "react";

export default function AdminUserProfileCircle({nickName, profilePictureIsEmpty, profilePictureUrl}) {

    const getProfilePicture = () => {
        if (profilePictureIsEmpty) {
            return nickName.charAt(0).toUpperCase()
        }

        const charAtZero = nickName.charAt(0).toUpperCase();
        return <img src={toThumbFullURL(profilePictureUrl, 150)} style={{width: '100%'}} alt={charAtZero}/>
    }

    return <div className={BackOfficeStyle.account_user_wrapper}>
        <div className={BackOfficeStyle.account_user}>
            {getProfilePicture()}
        </div>
        {nickName}
    </div>
}