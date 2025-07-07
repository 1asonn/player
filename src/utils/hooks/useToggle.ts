import { useState, useMemo } from "react";

export interface Actions<T>{
    toggle: () => void;
    // set: (value: T) => void;
    // reset: () => void;
    // setLeft: () => void;
    // setRight: () => void;
}

const useToggle = <D,R>(defaultValue: D = false as unknown as D, reverseValue?: R) : [D | R,Actions<D | R>]=> {
    const [state, setState] = useState<D | R>(defaultValue)
    console.log("defaultValue",defaultValue)
    const reverseValueInit = reverseValue === undefined ? !defaultValue as D : reverseValue as R
    console.log("reverseValueInit",reverseValueInit)
    const toggle = () => setState((s) => (s === defaultValue ? reverseValueInit : defaultValue))
    return [state,{toggle}]
}

export default useToggle