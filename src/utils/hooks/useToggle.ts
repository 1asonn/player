import { useState, useMemo } from "react";

export interface Actions<T>{
    toggle: () => void;
    set: (value: T) => void;
    // reset: () => void;
    // setLeft: () => void;
    // setRight: () => void;
}

const useToggle = <D,R>(defaultValue: D = false as unknown as D, reverseValue?: R) : [D | R,Actions<D | R>]=> {
    const [state, setState] = useState<D | R>(defaultValue)
    const reverseValueInit = reverseValue === undefined ? !defaultValue as D : reverseValue as R
    const toggle = () => setState((s) => (s === defaultValue ? reverseValueInit : defaultValue))
    const set = (s: D | R) => setState(s)
    return [state,{toggle,set}]
}

export default useToggle