import React from 'react';
import { Alert } from '@patternfly/react-core';
import cockpit from 'cockpit';

export const WifiInfo = (props) => {
    const [state, setState] = React.useState([]);
    const [mssg, setMssg] = React.useState(props.msg);
    // wlp0s20f3 changed to wlan1
    React.useEffect(() => {
        const keys = ["Active Connection", "State", "IP Address"];
        const loadState = async () => {
            const data = await cockpit.spawn(["nmcli", "-t", "-e", "no", "-g", "general.connection,general.state,ip4.address", "device", "show", "wlan1"], { latency:"10000" });
            const arr = data.split("\n");
            const json = arr.map((item, index) => {
                return {
                    key: keys[index],
                    value: item
                };
            });
            setState(json);
        };
        loadState()
                .catch(err => {
                    console.log(err);
                });
        setMssg(props.msg);
    }, [props.msg]);

    return (
        <Alert
        variant="info"
        title={ state.map((item) => {
            return (
                cockpit.format("$0: \t $1\n $2", [item.key, item.value])

            );
        })}
        >
            <p>{mssg}</p>
        </Alert>
    );
};
