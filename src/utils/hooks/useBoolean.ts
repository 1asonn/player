import useToggle from './useToggle'
import { useMemo } from 'react'

const useBoolean = () => {
    const [state,{toggle,set}] = useToggle(true,false)
    console.log("useBoolean is calling!")

    // 只在组件首次渲染时执行，避免后续被调用组件重新渲染导致的重复执行
    const actions = useMemo(() => {
        console.log("useMemo is calling!")
        const setTrue = () => set(true)
        const setFalse = () => set(false)
        return {toggle,setTrue,setFalse}
    },[])
    return [state,actions]
}

export default useBoolean
