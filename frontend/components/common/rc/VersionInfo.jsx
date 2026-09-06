import {LockOpenOutlined, LockOutlined} from "@mui/icons-material";

export default function VersionInfo({iterated}){

    const workingCopyIcon = () => {
        const workingCopy = iterated.workingCopy;
        if(workingCopy){
            return <LockOpenOutlined style={VersionOpenLockedStyle}/>
        }

        return <LockOutlined style={VersionLockedStyle}/>
    }

    if(!iterated) return <></>
    return <div style={LockedWrapperStyle}>
        {iterated.version}
        {"."}
        {iterated.iteration}
        {workingCopyIcon()}
    </div>
}

const LockedWrapperStyle = {
    display: "flex",
    justifyContent:"center",
    alignItems: "center",
    gap:5
}

const VersionLockedStyle = {
    fontSize:18,
    color:'#333'
}

const VersionOpenLockedStyle = {
    fontSize:18,
    color:'orange'
}