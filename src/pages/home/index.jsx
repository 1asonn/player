import useToggle from "../../utils/hooks/useToggle"
const HomePage = () => {
    const [state,{toggle}] = useToggle(true)

    const handleToggle = () => {
        toggle()
    }
    return (
        <>
            <button onClick={handleToggle}>Toggle</button>
            <span>{state.toString()}</span>
        </>
    )
}


export default HomePage