import React, {useEffect, useState} from "react";
import {balise as balise_style} from "./badgeStyle";

const STATUS_COLORS = {
    "En attente": {bg: "rgba(247,144,9,0.14)", color: "#f79009", border: "rgba(247,144,9,0.35)", dot: "#f79009"},
    "En cours": {bg: "rgba(21,112,239,0.13)", color: "#4b8ef1", border: "rgba(21,112,239,0.35)", dot: "#4b8ef1"},
    "Terminé": {bg: "rgba(18,183,106,0.13)", color: "#12b76a", border: "rgba(18,183,106,0.35)", dot: "#12b76a"},
    "Annulé": {bg: "rgba(240,68,56,0.13)", color: "#f04438", border: "rgba(240,68,56,0.35)", dot: "#f04438"},
    "Rejeté": {bg: "rgba(239,104,32,0.13)", color: "#ef6820", border: "rgba(239,104,32,0.35)", dot: "#ef6820"},
    "Validé": {bg: "rgba(18,183,106,0.13)", color: "#12b76a", border: "rgba(18,183,106,0.35)", dot: "#12b76a"},
    "Brouillon": {bg: "rgba(152,162,179,0.14)", color: "#98a2b3", border: "rgba(152,162,179,0.35)", dot: "#98a2b3"},
};

const DOT_STYLE = {
    width: 6,
    height: 6,
    borderRadius: "50%",
    flexShrink: 0,
    display: "inline-block",
};

export default function Badge(props) {

    const [style, setStyle] = useState();
    const {bagdeNumber} = props;

    useEffect(() => {
        if (props.danger) {
            setStyle(balise_style.danger);
        } else if (props.blue) {
            setStyle(balise_style.blue);
        } else if (props.warning) {
            setStyle(balise_style.warning);
        } else if (props.success) {
            setStyle(balise_style.success);
        } else if (props.border) {
            setStyle(balise_style.border);
        } else if (props.active) {
            setStyle(balise_style.active);
        } else if (props.red) {
            setStyle(balise_style.red);
        } else if (props.white) {
            setStyle(balise_style.white);
        } else if (props.grey) {
            setStyle(balise_style.grey);
        } else if (props.dark) {
            setStyle(balise_style.dark);
        } else if (props.accent) {
            setStyle(balise_style.accent);
        } else if (props.normal) {
            setStyle(balise_style.normal);
        } else if (props.current) {
            setStyle(balise_style.current);
        } else if (props.froly) {
            setStyle(balise_style.froly);
        } else if (props.cornflower_Blue) {
            setStyle(balise_style.cornflower_Blue);
        } else if (props.medium_Purple) {
            setStyle(balise_style.medium_Purple);
        } else {
            setStyle(balise_style.simple);
        }
    }, [props.danger, props.warning, props.accent, props.success, props.active, props.border,
        props.dark, props.blue, props.grey, props.white, props.normal, props.current, props.froly,
        props.cornflower_Blue, props.medium_Purple, props.red])

    // ── Status semantic badge ──
    if (props.status) {
        const sc = STATUS_COLORS[props.text];
        const bg = sc?.bg ?? "#f2f4f7";
        const color = sc?.color ?? "#344054";
        const border = sc?.border ?? "#d0d5dd";
        const dot = sc?.dot ?? "#98a2b3";

        return (
            <div
                onClick={props.onClick}
                className="badge-each"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    background: bg,
                    color,
                    border: `1px solid ${border}`,
                    whiteSpace: "nowrap",
                    cursor: props.onClick ? "pointer" : "default",
                    ...props.style,
                }}
            >
                <span style={{...DOT_STYLE, background: dot}}/>
                {props.text}
                {bagdeNumber && <span style={balise_style.badge}>{bagdeNumber}</span>}
            </div>
        );
    }

    // ── Default badge ──
    return (
        <div onClick={props.onClick} style={{...style, ...props.style}} className="badge-each">
            {props.icon ? <img width={16} height={16} src={props.icon} alt=""/> : <></>}
            <span>{props.number}</span>
            {props.text}
            {bagdeNumber && <span style={balise_style.badge}>{bagdeNumber}</span>}
        </div>
    );
}
