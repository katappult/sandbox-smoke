export default function Spacer({
                                   height = 10, small = false,
                                    large = false,
                                   medium = false
                               }) {

    if (small) return <div style={{minHeight: 10, height: 10}}></div>

    if (medium) return <div style={{minHeight: 20, height: 20}}></div>

    if (large) return <div style={{minHeight: 30, height: 30}}></div>

    return <div style={{minHeight: height, height: height}}></div>
}