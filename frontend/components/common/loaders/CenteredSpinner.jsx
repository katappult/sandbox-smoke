import React from "react";

export default function CenteredSpinner({small, extraStyle ={} }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",      // occupe tout l'espace vertical disponible
                width: "100%",       // occupe tout l'espace horizontal disponible
                minHeight: small ? 40 : 200,   // optionnel, pour donner un minimum de hauteur
                ...extraStyle
            }}
        >
           <img src={"/img/loading.gif"} width={!small ? 80 : 20}/>
        </div>
    );
}
