import ds from "@/styles/components/Drawer2.module.css";
import {Carousel} from "antd";
import {toThumbFullURL} from "@/utils";
import React from "react";


export default function DrawerImagesView({allIllustrations = []}){

    return <>
        {allIllustrations?.length > 0 && (
            <div className={ds.carousel_wrap}>
                <Carousel arrows infinite={false}>
                    {allIllustrations.map((img, i) => (
                        <div key={i} className={ds.carousel_slide}>
                            <img src={toThumbFullURL(img)} alt={`img-${i}`} className={ds.carousel_img} />
                        </div>
                    ))}
                </Carousel>
            </div>
        )}
    </>
}