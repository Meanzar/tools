export function handleInput(
    input: string, 
    setInput: React.Dispatch<React.SetStateAction<string>>
) {
    setInput(input)
}

export function handleArrayInput(

    input: string[], 

    setInput: React.Dispatch<React.SetStateAction<string[]>>

) {

    setInput(input)

}